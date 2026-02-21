import express from 'express';
import { createCheckoutSession, handleWebhook, verifySession } from '../controllers/subscriptionController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/create-checkout-session', authenticateToken, createCheckoutSession);
router.post('/verify-session', authenticateToken, verifySession);
// Webhook route - needed to be handled carefully regarding body parsing
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
