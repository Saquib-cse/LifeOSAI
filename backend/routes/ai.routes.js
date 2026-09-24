import express from 'express';
import { handleAIChat, handlePlanDay, handleAIInsights } from '../controllers/ai.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/chat', handleAIChat);
router.post('/plan-day', handlePlanDay);
router.post('/insights', handleAIInsights);

export default router;
