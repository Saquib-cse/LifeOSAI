import express from 'express';
import { getJournalEntries, createJournalEntry, getJournalReflection } from '../controllers/journal.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getJournalEntries);
router.post('/', createJournalEntry);
router.get('/reflection', getJournalReflection);

export default router;
