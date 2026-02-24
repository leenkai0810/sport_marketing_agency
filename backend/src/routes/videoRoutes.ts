import express from 'express';
import { uploadVideo, getUserVideos } from '../controllers/videoController';
import { upload } from '../config/storage';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/upload', authenticateToken, upload.single('video'), uploadVideo);
router.get('/my-videos', authenticateToken, getUserVideos);

export default router;
