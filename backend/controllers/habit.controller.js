import { storage } from '../services/storage.service.js';

export async function getHabits(req, res) {
  try {
    const habits = await storage.getHabits(req.userId);
    res.json({ success: true, habits });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch habits.' });
  }
}

export async function createHabit(req, res) {
  try {
    const { title, category } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Habit title is required.' });
    }

    const habit = await storage.createHabit({
      userId: req.userId,
      title,
      category: category || 'Personal',
      streak: 0,
      history: []
    });

    res.status(201).json({ success: true, habit });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create habit.' });
  }
}

export async function updateHabit(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const habit = await storage.updateHabit(id, req.userId, updates);
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found or unauthorized.' });
    }

    res.json({ success: true, habit });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update habit.' });
  }
}

export async function toggleHabitCompletion(req, res) {
  try {
    const { id } = req.params;
    const { date } = req.body; // YYYY-MM-DD
    const targetDate = date || new Date().toISOString().split('T')[0];

    const habits = await storage.getHabits(req.userId);
    const habit = habits.find(h => (h._id === id || h.id === id));

    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found.' });
    }

    let history = [...(habit.history || [])];
    const exists = history.includes(targetDate);

    if (exists) {
      history = history.filter(d => d !== targetDate);
    } else {
      history.push(targetDate);
    }

    // Calculate streak
    const streak = history.length;

    const updated = await storage.updateHabit(id, req.userId, { history, streak });
    res.json({ success: true, habit: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle habit status.' });
  }
}

export async function deleteHabit(req, res) {
  try {
    const { id } = req.params;
    const deleted = await storage.deleteHabit(id, req.userId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Habit not found or unauthorized.' });
    }
    res.json({ success: true, message: 'Habit deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete habit.' });
  }
}
