import { Response } from 'express';
import { VideoStatus, Role } from '@prisma/client';
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
                plan: true,
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
                    select: { name: true, email: true },
                },
                editor: {
                    select: { name: true, email: true },
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

        const validStatuses = ['PENDING', 'EDITING', 'READY', 'PUBLISHED', 'REJECTED'];
        if (!validStatuses.includes(status)) {
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

// Admin assigns an editor to a video
export const assignEditor = async (req: AuthRequest, res: Response) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ message: (req as any).t('admin.unauthorized') });
        }

        const { id } = req.params as { id: string };
        const { editorId } = req.body;

        // Verify the editor exists and has EDITOR role
        const editor = await prisma.user.findUnique({ where: { id: editorId } });
        if (!editor || editor.role !== 'EDITOR') {
            return res.status(400).json({ message: 'Invalid editor' });
        }

        const video = await prisma.video.update({
            where: { id },
            data: { editorId, status: 'EDITING' },
        });

        res.json({ message: 'Editor assigned', video });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: req.t('auth.internal_error') });
    }
};

// Admin updates a user's role
export const updateUserRole = async (req: AuthRequest, res: Response) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ message: (req as any).t('admin.unauthorized') });
        }

        const { id } = req.params as { id: string };
        const { role } = req.body;

        const validRoles = ['USER', 'EDITOR', 'ADMIN'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Prevent admin from changing their own role
        if (id === req.user?.userId) {
            return res.status(400).json({ message: 'Cannot change your own role' });
        }

        const user = await prisma.user.update({
            where: { id },
            data: { role: role as Role },
        });

        res.json({ message: `User role updated to ${role}`, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: req.t('auth.internal_error') });
    }
};

// Get all editors (for assignment dropdown)
export const getEditors = async (req: AuthRequest, res: Response) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ message: (req as any).t('admin.unauthorized') });
        }

        const editors = await prisma.user.findMany({
            where: { role: 'EDITOR' },
            select: { id: true, name: true, email: true, role: true },
        });

        res.json(editors);
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
