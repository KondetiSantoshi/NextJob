const express = require('express');
const router = express.Router();
const {
  register,
  login,
  googleLogin,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile,
  sendOTP,
  verifyOTP,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.put('/update-profile', protect, updateProfile);

module.exports = router;
