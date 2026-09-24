import { storage } from '../services/storage.service.js';

export async function getGoals(req, res) {
  try {
    const goals = await storage.getGoals(req.userId);
    res.json({ success: true, goals });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch goals.' });
  }
}

export async function createGoal(req, res) {
  try {
    const { title, description, category, targetDate, progress } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Goal title is required.' });
    }

    const goal = await storage.createGoal({
      userId: req.userId,
      title,
      description: description || '',
      category: category || 'General',
      targetDate: targetDate ? new Date(targetDate) : null,
      progress: typeof progress === 'number' ? progress : 0
    });

    res.status(201).json({ success: true, goal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create goal.' });
  }
}

export async function updateGoal(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.targetDate) {
      updates.targetDate = new Date(updates.targetDate);
    }

    const updatedGoal = await storage.updateGoal(id, req.userId, updates);
    if (!updatedGoal) {
      return res.status(404).json({ success: false, message: 'Goal not found or unauthorized.' });
    }

    res.json({ success: true, goal: updatedGoal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update goal.' });
  }
}

export async function deleteGoal(req, res) {
  try {
    const { id } = req.params;
    const deleted = await storage.deleteGoal(id, req.userId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Goal not found or unauthorized.' });
    }
    res.json({ success: true, message: 'Goal deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete goal.' });
  }
}
