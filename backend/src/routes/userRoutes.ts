import express from 'express';
import { acceptContract, getContractStatus, getMe } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/accept-contract', authenticateToken, acceptContract);
router.get('/contract-status', authenticateToken, getContractStatus);
router.get('/me', authenticateToken, getMe);

export default router;
