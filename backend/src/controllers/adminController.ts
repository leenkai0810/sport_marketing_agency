import { Response } from 'express';
import { VideoStatus } from '@prisma/client';
import prisma from '../config/client';
import { AuthRequest } from '../middleware/auth';

// Helper to check admin role
const isAdmin = (req: AuthRequest) => {
    return req.user?.role === 'ADMIN';
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ message: (req as any).t('admin.unauthorized') });
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                subscriptionStatus: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: req.t('auth.internal_error') });
    }
};

export const getAllVideos = async (req: AuthRequest, res: Response) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ message: (req as any).t('admin.unauthorized') });
        }

        const videos = await prisma.video.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(videos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: req.t('auth.internal_error') });
    }
};

export const updateVideoStatus = async (req: AuthRequest, res: Response) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ message: (req as any).t('admin.unauthorized') });
        }

        const { id } = req.params as { id: string };
        const { status } = req.body;

        if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ message: req.t('admin.invalid_status', 'Invalid status') });
        }

        const video = await prisma.video.update({
            where: { id },
            data: { status: status as VideoStatus },
        });

        res.json(video);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: req.t('auth.internal_error') });
    }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ message: (req as any).t('admin.unauthorized') });
        }

        const { id } = req.params as { id: string };

        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                videos: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!user) {
            return res.status(404).json({ message: req.t('video.user_not_found', 'User not found') });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: req.t('auth.internal_error') });
    }
};
