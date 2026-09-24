import express from 'express';
import { getHabits, createHabit, updateHabit, toggleHabitCompletion, deleteHabit } from '../controllers/habit.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getHabits);
router.post('/', createHabit);
router.put('/:id', updateHabit);
router.post('/:id/toggle', toggleHabitCompletion);
router.delete('/:id', deleteHabit);

export default router;
