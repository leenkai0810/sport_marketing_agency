import express from 'express';
import { getAllUsers, getAllVideos, updateVideoStatus, getUserById, assignEditor, updateUserRole, getEditors } from '../controllers/adminController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/users', authenticateToken, getAllUsers);
router.get('/users/:id', authenticateToken, getUserById);
router.get('/videos', authenticateToken, getAllVideos);
router.get('/editors', authenticateToken, getEditors);
router.put('/videos/:id/status', authenticateToken, updateVideoStatus);
router.put('/videos/:id/assign', authenticateToken, assignEditor);
router.put('/users/:id/role', authenticateToken, updateUserRole);

export default router;
