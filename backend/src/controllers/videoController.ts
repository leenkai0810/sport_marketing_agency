import { Response } from 'express';
import prisma from '../config/client';
import { AuthRequest } from '../middleware/auth';

// Weekly upload limits per plan
const WEEKLY_UPLOAD_LIMITS: Record<string, number> = {
  starter: 1,
  pro: 3,
  elite: 6,
};

function getStartOfWeek(): Date {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon, ...
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export const uploadVideo = async (req: AuthRequest, res: Response) => {
  try {
    const { caption, platform, url } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: (req as any).t('video.unauthorized') });
    }

    // Get video URL: from Multer file upload or from URL in body (backward compat)
    const file = (req as any).file;
    const videoUrl = file ? file.filename : url;

    if (!videoUrl) {
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

    // Enforce weekly upload limit (Admins bypass)
    if (user.role !== 'ADMIN') {
      const plan = (user as any).plan || 'starter';
      const weeklyLimit = WEEKLY_UPLOAD_LIMITS[plan] || WEEKLY_UPLOAD_LIMITS.starter;
      const startOfWeek = getStartOfWeek();

      const uploadsThisWeek = await prisma.video.count({
        where: {
          userId,
          createdAt: { gte: startOfWeek },
        },
      });

      if (uploadsThisWeek >= weeklyLimit) {
        return res.status(429).json({
          message: (req as any).t('video.weekly_limit_reached') || `Weekly upload limit reached (${weeklyLimit} per week for ${plan} plan). Try again next week or upgrade your plan.`,
          limit: weeklyLimit,
          used: uploadsThisWeek,
          plan,
        });
      }
    }

    const video = await prisma.video.create({
      data: {
        caption,
        platform,
        url: videoUrl,
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
