
// Add this to your existing authController.ts or create a new userController.ts
// For simplicity, I'll append it to a new file since I can't easily append to authController without reading it first.
// Let's assume we put it in authController for now, but since I can't append, I'll create a userController.

import { Response } from 'express';
import prisma from '../config/client';
import { AuthRequest } from '../middleware/auth';

export const acceptContract = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                contractAccepted: true,
                contractAcceptedAt: new Date(),
            },
        });

        res.json({ message: 'Contract accepted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getContractStatus = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { contractAccepted: true, contractAcceptedAt: true }
        });

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                subscriptionStatus: true,
                contractAccepted: true,
            },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
