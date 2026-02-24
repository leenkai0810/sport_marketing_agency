import { Response } from 'express';
import prisma from '../config/client';
import { AuthRequest } from '../middleware/auth';

// Get all PENDING videos (the queue for editors to pick up)
export const getVideoQueue = async (req: AuthRequest, res: Response) => {
    try {
        const videos = await prisma.video.findMany({
            where: { status: 'PENDING' },
            include: {
                user: {
                    select: { name: true, email: true, sport: true, instagram: true, tiktok: true },
                },
            },
            orderBy: { createdAt: 'asc' }, // oldest first
        });
        res.json(videos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: req.t('auth.internal_error') });
    }
};

// Get videos assigned to the logged-in editor
export const getMyAssignedVideos = async (req: AuthRequest, res: Response) => {
    try {
        const editorId = req.user?.userId;
        if (!editorId) return res.status(401).json({ message: 'Unauthorized' });

        const videos = await prisma.video.findMany({
            where: { editorId },
            include: {
                user: {
                    select: { name: true, email: true, sport: true, instagram: true, tiktok: true },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });
        res.json(videos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: req.t('auth.internal_error') });
    }
};

// Editor claims a video from the queue
export const assignToSelf = async (req: AuthRequest, res: Response) => {
    try {
        const editorId = req.user?.userId;
        const { id } = req.params as { id: string };
        if (!editorId) return res.status(401).json({ message: 'Unauthorized' });

        const video = await prisma.video.findUnique({ where: { id } });
        if (!video) return res.status(404).json({ message: 'Video not found' });
        if (video.status !== 'PENDING') {
            return res.status(400).json({ message: 'Video is no longer in the queue' });
        }

        const updated = await prisma.video.update({
            where: { id },
            data: { editorId, status: 'EDITING' },
        });

        res.json({ message: 'Video assigned to you', video: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: req.t('auth.internal_error') });
    }
};

// Editor uploads the edited version of a video
export const uploadEditedVideo = async (req: AuthRequest, res: Response) => {
    try {
        const editorId = req.user?.userId;
        const { id } = req.params as { id: string };
        if (!editorId) return res.status(401).json({ message: 'Unauthorized' });

        const file = (req as any).file;
        if (!file) return res.status(400).json({ message: 'No file uploaded' });

        const video = await prisma.video.findUnique({ where: { id } });
        if (!video) return res.status(404).json({ message: 'Video not found' });
        if (video.editorId !== editorId && req.user?.role !== 'ADMIN') {
            return res.status(403).json({ message: 'This video is not assigned to you' });
        }

        const updated = await prisma.video.update({
            where: { id },
            data: { editedUrl: file.filename },
        });

        res.json({ message: 'Edited video uploaded', video: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: req.t('auth.internal_error') });
    }
};

// Editor marks video as ready for publishing
export const markReady = async (req: AuthRequest, res: Response) => {
    try {
        const editorId = req.user?.userId;
        const { id } = req.params as { id: string };
        if (!editorId) return res.status(401).json({ message: 'Unauthorized' });

        const video = await prisma.video.findUnique({ where: { id } });
        if (!video) return res.status(404).json({ message: 'Video not found' });
        if (video.editorId !== editorId && req.user?.role !== 'ADMIN') {
            return res.status(403).json({ message: 'This video is not assigned to you' });
        }
        if (video.status !== 'EDITING') {
            return res.status(400).json({ message: 'Video must be in EDITING status to mark as ready' });
        }

        const updated = await prisma.video.update({
            where: { id },
            data: { status: 'READY' },
        });

        res.json({ message: 'Video marked as ready', video: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: req.t('auth.internal_error') });
    }
};

// Editor adds notes to a video
export const addNotes = async (req: AuthRequest, res: Response) => {
    try {
        const editorId = req.user?.userId;
        const { id } = req.params as { id: string };
        const { notes } = req.body;
        if (!editorId) return res.status(401).json({ message: 'Unauthorized' });

        const video = await prisma.video.findUnique({ where: { id } });
        if (!video) return res.status(404).json({ message: 'Video not found' });
        if (video.editorId !== editorId && req.user?.role !== 'ADMIN') {
            return res.status(403).json({ message: 'This video is not assigned to you' });
        }

        const updated = await prisma.video.update({
            where: { id },
            data: { editorNotes: notes },
        });

        res.json({ message: 'Notes updated', video: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: req.t('auth.internal_error') });
    }
};
