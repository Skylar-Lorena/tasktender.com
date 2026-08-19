const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'tasktender_dev_secret_key_2026';

// Mock OTP store for development (I'll replace with SMS Gateway like Africa's Talking / Twilio in prod)
const otpStore = new Map();

// 1. Request OTP
router.post('/request-otp', async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  // Generate 4-digit code (Use fixed '1234' in dev for quick testing)
  const otp = process.env.NODE_ENV === 'production' ? Math.floor(1000 + Math.random() * 9000).toString() : '1234';
  otpStore.set(phoneNumber, otp);

  console.log(`[AUTH] OTP for ${phoneNumber} is: ${otp}`);
  return res.json({ success: true, message: 'OTP sent successfully', devNote: 'Use 1234 in dev mode' });
});

// 2. Verify OTP & Register/Login
router.post('/verify-otp', async (req, res) => {
  const { phoneNumber, otp, fullName } = req.body;

  const validOtp = otpStore.get(phoneNumber);
  if (!validOtp || validOtp !== otp) {
    return res.status(400).json({ error: 'Invalid or expired OTP code' });
  }

  // Clear OTP once used
  otpStore.delete(phoneNumber);

  // Find or create user
  let user = await User.findOne({ phoneNumber });
  if (!user) {
    if (!fullName) {
      return res.status(400).json({ error: 'Full name required for new account registration' });
    }
    user = await User.create({ phoneNumber, fullName });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, phoneNumber: user.phoneNumber, activeRole: user.activeRole },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  return res.json({
    success: true,
    token,
    user: {
      id: user._id,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
      activeRole: user.activeRole,
      isVerified: user.isVerified
    }
  });
});

module.exports = router;