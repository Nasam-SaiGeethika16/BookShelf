const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../users/user.model');
const LoginEvent = require('../stats/LoginEvent.model');

// Setup nodemailer transporter (use your real credentials in .env)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your email password or app password
  },
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ username: email }); // username is email in your model
    if (!user) {
      // Always respond with success for security
      return res.json({ message: 'If this email exists, a reset link has been sent.' });
    }
    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 1000 * 60 * 60; // 1 hour
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();
    // Send email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    await transporter.sendMail({
      to: user.username,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset.</p><p>Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 1 hour.</p>`
    });
    res.json({ message: 'If this email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Error sending reset link.' });
  }
});

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ username: email });
    if (!user) {
      return res.json({ message: 'OTP sent to your email.' }); // Always respond the same for security
    }
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 1000 * 60 * 10; // 10 minutes
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    // Send OTP via email
    await transporter.sendMail({
      to: user.username,
      subject: 'Your Login OTP',
      html: `<p>Your OTP for login is: <b>${otp}</b></p><p>This OTP is valid for 10 minutes.</p>`
    });
    res.json({ message: 'OTP sent to your email.' });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ message: 'Error sending OTP.' });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ username: email, otp, otpExpiry: { $gt: Date.now() } });
    if (!user) {
      return res.json({ success: false, message: 'Invalid or expired OTP.' });
    }
    // Clear OTP fields
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    // Track login event
    await LoginEvent.create({ user: user._id });
    // TODO: Generate JWT or session here
    res.json({ success: true, message: 'Logged in with OTP!' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ success: false, message: 'Error verifying OTP.' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  try {
    const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) {
      return res.json({ success: false, message: 'Invalid or expired token.' });
    }
    user.password = password; // You may want to hash this if not already handled in pre-save
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();
    res.json({ success: true, message: 'Password reset successful!' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, message: 'Error resetting password.' });
  }
});

module.exports = router; 