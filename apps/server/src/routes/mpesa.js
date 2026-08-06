const express = require('express');
const Task = require('../models/Task');
const Transaction = require('../models/Transaction');

const router = express.Router();

// Helper to generate Safaricom OAuth Token
const getDarajaToken = async () => {
  const consumerKey = process.env.DARJA_CONSUMER_KEY || 'DEV_CONSUMER_KEY';
  const consumerSecret = process.env.DARAJA_CONSUMER_SECRET || 'DEV_CONSUMER_SECRET';
  
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  // In production, fetch from https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials
  // In dev sandbox, mock or fetch from sandbox endpoint
  return 'MOCK_DARAJA_ACCESS_TOKEN';
};

// 1. Initiate M-Pesa STK Push Payment (Task Poster)
router.post('/stkpush', async (req, res) => {
  try {
    const { taskId, posterId, taskerId, phoneNumber, amount } = req.body;

    if (!taskId || !posterId || !taskerId || !phoneNumber || !amount) {
      return res.status(400).json({ error: 'Missing payment parameters' });
    }

    // Format phone number to 254XXXXXXXXX
    let formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1);
    }

    // Create a pending escrow transaction
    const transaction = await Transaction.create({
      taskId,
      posterId,
      taskerId,
      amount,
      status: 'PENDING'
    });

    // Simulated Daraja STK Push Response (Replace with Safaricom HTTPS POST call in production)
    const checkoutRequestId = `ws_CO_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    transaction.mpesaCheckoutRequestId = checkoutRequestId;
    await transaction.save();

    console.log(`[MPESA] STK Push dispatched to ${formattedPhone} for KES ${amount}`);

    return res.json({
      success: true,
      message: 'STK Push sent to phone',
      checkoutRequestId,
      transactionId: transaction._id
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 2. M-Pesa Daraja Callback Endpoint (Safaricom Webhook)
router.post('/callback', async (req, res) => {
  try {
    const { Body } = req.body;

    if (!Body || !Body.stkCallback) {
      return res.status(400).json({ error: 'Invalid callback body' });
    }

    const { CheckoutRequestID, ResultCode, CallbackMetadata } = Body.stkCallback;

    const transaction = await Transaction.findOne({ mpesaCheckoutRequestId: CheckoutRequestID });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction record not found' });
    }

    if (ResultCode === 0) {
      // Payment Successful
      let mpesaReceiptNumber = 'UNKNOWN';
      if (CallbackMetadata && CallbackMetadata.Item) {
        const receiptItem = CallbackMetadata.Item.find(item => item.Name === 'MpesaReceiptNumber');
        if (receiptItem) mpesaReceiptNumber = receiptItem.Value;
      }

      transaction.status = 'HELD'; // Funds locked in escrow
      transaction.mpesaReceiptNumber = mpesaReceiptNumber;
      await transaction.save();

      // Update Task status to ESCROW_FUNDED
      await Task.findByIdAndUpdate(transaction.taskId, { status: 'ESCROW_FUNDED' });

      console.log(`[ESCROW] Payment received (${mpesaReceiptNumber}). Funds locked for Task: ${transaction.taskId}`);
    } else {
      // Payment Failed or Cancelled by User
      transaction.status = 'REFUNDED';
      await transaction.save();
    }

    return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 3. Release Escrow Payout (Poster confirms completion)
router.post('/release', async (req, res) => {
  try {
    const { taskId, posterId } = req.body;

    const transaction = await Transaction.findOne({ taskId, posterId, status: 'HELD' });
    if (!transaction) {
      return res.status(400).json({ error: 'No funded escrow transaction found for this task' });
    }

    // Update escrow transaction status
    transaction.status = 'RELEASED';
    await transaction.save();

    // Mark task as COMPLETED
    await Task.findByIdAndUpdate(taskId, { status: 'COMPLETED' });

    console.log(`[ESCROW] Payout released to Tasker: ${transaction.taskerId} for Task: ${taskId}`);

    return res.json({
      success: true,
      message: 'Payment released successfully to tasker',
      transaction
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;