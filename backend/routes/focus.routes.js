import express from 'express';
import { getFocusSessions, createFocusSession } from '../controllers/focus.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getFocusSessions);
router.post('/', createFocusSession);

export default router;
