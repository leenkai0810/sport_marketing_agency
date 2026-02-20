import express from 'express';
import { getAllUsers, getAllVideos, updateVideoStatus } from '../controllers/adminController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/users', authenticateToken, getAllUsers);
router.get('/videos', authenticateToken, getAllVideos);
router.put('/videos/:id/status', authenticateToken, updateVideoStatus);

export default router;
