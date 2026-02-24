import { Request, Response } from 'express';
import crypto from 'crypto';
import { sendOtpEmail } from '../config/mailer';

// In-memory OTP store: email -> { hash, expiry, attempts }
const otpStore = new Map<string, { hash: string; expiry: number; attempts: number }>();

// Auto-cleanup expired OTPs every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [email, data] of otpStore) {
        if (now > data.expiry) otpStore.delete(email);
    }
}, 5 * 60 * 1000);

function hashOtp(otp: string): string {
    return crypto.createHash('sha256').update(otp + process.env.JWT_SECRET).digest('hex');
}

export const sendOtp = async (req: Request, res: Response) => {
    try {
        const { email, name } = req.body;

        if (!email) {
            return res.status(400).json({ message: (req as any).t?.('auth.email_required') || 'Email is required' });
        }

        // Rate limit: max 1 OTP per 60 seconds per email
        const existing = otpStore.get(email);
        if (existing && Date.now() < existing.expiry - 9 * 60 * 1000) {
            return res.status(429).json({ message: (req as any).t?.('auth.otp_rate_limit') || 'Please wait before requesting a new code' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store hashed OTP with 10-minute expiry
        otpStore.set(email, {
            hash: hashOtp(otp),
            expiry: Date.now() + 10 * 60 * 1000,
            attempts: 0,
        });

        // Send email
        await sendOtpEmail(email, name || email.split('@')[0], otp);

        res.json({ message: (req as any).t?.('auth.otp_sent') || 'Verification code sent' });
    } catch (error) {
        console.error('Failed to send OTP:', error);
        res.status(500).json({ message: (req as any).t?.('auth.otp_send_failed') || 'Failed to send verification code' });
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ verified: false, message: 'Email and OTP are required' });
        }

        const stored = otpStore.get(email);

        if (!stored) {
            return res.status(400).json({ verified: false, message: (req as any).t?.('auth.otp_expired') || 'No OTP found. Please request a new one.' });
        }

        // Check expiry
        if (Date.now() > stored.expiry) {
            otpStore.delete(email);
            return res.status(400).json({ verified: false, message: (req as any).t?.('auth.otp_expired') || 'OTP has expired. Please request a new one.' });
        }

        // Max 5 attempts
        if (stored.attempts >= 5) {
            otpStore.delete(email);
            return res.status(429).json({ verified: false, message: (req as any).t?.('auth.otp_max_attempts') || 'Too many attempts. Please request a new code.' });
        }

        // Verify
        stored.attempts++;
        if (hashOtp(otp) === stored.hash) {
            otpStore.delete(email);
            return res.json({ verified: true, message: (req as any).t?.('auth.otp_verified') || 'Email verified successfully' });
        }

        return res.status(400).json({ verified: false, message: (req as any).t?.('auth.otp_incorrect') || 'Incorrect code. Please try again.' });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ verified: false, message: (req as any).t?.('auth.internal_error') || 'Internal server error' });
    }
};
