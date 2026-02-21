import { Response } from 'express';
import prisma from '../config/client';
import { AuthRequest } from '../middleware/auth';

export const uploadVideo = async (req: AuthRequest, res: Response) => {
  try {
    const { caption, platform, url } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: (req as any).t('video.unauthorized') });
    }

    if (!url) {
      return res.status(400).json({ message: (req as any).t('video.no_url') });
    }

    // Check subscription status
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: (req as any).t('video.user_not_found') });
    }

    // Check if the user is a paying subscriber before allowing upload
    if (user.role !== 'ADMIN' && user.subscriptionStatus !== 'ACTIVE') {
      return res.status(403).json({ message: (req as any).t('video.subscription_required') });
    }

    const video = await prisma.video.create({
      data: {
        caption,
        platform,
        url, // Storing Cloud URL from Uploadcare
        userId,
        status: 'PENDING',
      },
    });

    res.status(201).json({ message: (req as any).t('video.upload_success'), video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: req.t('auth.internal_error') });
  }
};

export const getUserVideos = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: (req as any).t('video.unauthorized') });
    }

    const videos = await prisma.video.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: req.t('auth.internal_error') });
  }
};
