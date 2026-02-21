import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/client';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name, phone, sport, instagram, tiktok } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: (req as any).t('auth.required') });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: (req as any).t('auth.invalid_credentials') });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: (req as any).t('auth.user_exists') });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone: phone || null,
                sport: sport || null,
                instagram: instagram || null,
                tiktok: tiktok || null,
            },
        });

        res.status(201).json({ message: (req as any).t('auth.registered'), userId: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: (req as any).t('auth.internal_error') });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(400).json({ message: (req as any).t('auth.invalid_credentials') });
        }

        // Google-only accounts have no password
        if (!user.password) {
            return res.status(400).json({ message: (req as any).t('auth.invalid_credentials') });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: (req as any).t('auth.invalid_credentials') });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('CRITICAL: JWT_SECRET environment variable is not set.');
            return res.status(500).json({ message: (req as any).t('auth.internal_error') });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            secret,
            { expiresIn: '7d' }
        );

        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: (req as any).t('auth.internal_error') });
    }
};

// Google Sign-In — verifies Firebase ID token, creates or logs in user
export const googleAuth = async (req: Request, res: Response) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ message: (req as any).t('auth.no_id_token') });
        }

        // Dynamically import firebase-admin to avoid issues if not configured
        let firebaseAdmin: any;
        try {
            firebaseAdmin = await import('firebase-admin');
        } catch {
            return res.status(500).json({ message: (req as any).t('auth.firebase_unavailable') });
        }

        // Initialize app if not already done
        if (!firebaseAdmin.apps.length) {
            const projectId = process.env.FIREBASE_PROJECT_ID;
            const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
            const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

            if (!projectId || !clientEmail || !privateKey) {
                return res.status(500).json({ message: (req as any).t('auth.firebase_not_configured') });
            }

            firebaseAdmin.initializeApp({
                credential: firebaseAdmin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
            });
        }

        // Verify the token
        const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
        const { email, name, uid } = decoded;

        if (!email) {
            return res.status(400).json({ message: (req as any).t('auth.no_google_email') });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ message: (req as any).t('auth.internal_error') });
        }

        // Find or create user
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // New Google user — create with empty password (Google-only account)
            user = await prisma.user.create({
                data: {
                    email,
                    password: '',        // Google users don't have a password
                    name: name || email.split('@')[0],
                },
            });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            secret,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
        });
    } catch (error: any) {
        console.error('Google auth error:', error);
        res.status(401).json({ message: (req as any).t('auth.invalid_google_token') });
    }
};

// Step 1: After client-side OTP verification, issue a short-lived reset token
export const requestResetToken = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: (req as any).t('auth.email_required') });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ message: (req as any).t('auth.internal_error') });
        }

        // SECURITY: Always return success — never reveal if account exists
        const user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            // Issue a reset-only token (short-lived, 15 min)
            const resetToken = jwt.sign(
                { userId: user.id, email: user.email, purpose: 'password_reset' },
                secret,
                { expiresIn: '15m' }
            );
            return res.json({ resetToken });
        }

        // Fake token for non-existent emails — prevents email enumeration
        const fakeToken = jwt.sign(
            { userId: 'none', email, purpose: 'password_reset' },
            secret,
            { expiresIn: '15m' }
        );
        return res.json({ resetToken: fakeToken });
    } catch (error) {
        console.error('Request reset token error:', error);
        res.status(500).json({ message: (req as any).t('auth.internal_error') });
    }
};

// Step 2: Reset password — requires the signed reset token from Step 1
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { resetToken, newPassword } = req.body;

        if (!resetToken || !newPassword) {
            return res.status(400).json({ message: (req as any).t('auth.reset_token_required') });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: (req as any).t('auth.password_min_length') });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ message: (req as any).t('auth.internal_error') });
        }

        // Verify the reset token
        let decoded: any;
        try {
            decoded = jwt.verify(resetToken, secret);
        } catch {
            return res.status(401).json({ message: (req as any).t('auth.invalid_reset_token') });
        }

        if (decoded.purpose !== 'password_reset') {
            return res.status(401).json({ message: (req as any).t('auth.invalid_token') });
        }

        // Check user actually exists
        const user = await prisma.user.findUnique({ where: { email: decoded.email } });
        if (!user) {
            return res.status(400).json({ message: (req as any).t('auth.reset_unable') });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { email: decoded.email },
            data: { password: hashedPassword },
        });

        res.json({ message: (req as any).t('auth.reset_success') });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: (req as any).t('auth.internal_error') });
    }
};
