// apps/server/src/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    posterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    taskerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    mpesaCheckoutRequestId: { type: String },
    mpesaReceiptNumber: { type: String },
    status: {
      type: String,
      enum: ['PENDING', 'HELD', 'RELEASED', 'REFUNDED'],
      default: 'PENDING'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);