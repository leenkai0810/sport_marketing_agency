import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, googleAuth, requestResetToken, resetPassword } from '../controllers/authController';
import { sendOtp, verifyOtp } from '../controllers/otpController';

const router = express.Router();

// Basic rate limiting for auth routes: max 20 requests per 15 minutes per IP
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/google', authLimiter, googleAuth);
router.post('/request-reset-token', authLimiter, requestResetToken);
router.post('/reset-password', authLimiter, resetPassword);
router.post('/send-otp', authLimiter, sendOtp);
router.post('/verify-otp', authLimiter, verifyOtp);

export default router;
