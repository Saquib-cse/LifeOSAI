import { storage } from '../services/storage.service.js';

export async function getTasks(req, res) {
  try {
    const tasks = await storage.getTasks(req.userId);
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch tasks.' });
  }
}

export async function createTask(req, res) {
  try {
    const { title, description, priority, category, dueDate } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Task title is required.' });
    }

    const task = await storage.createTask({
      userId: req.userId,
      title,
      description: description || '',
      priority: priority || 'Medium',
      category: category || 'Personal',
      dueDate: dueDate ? new Date(dueDate) : null,
      completed: false
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create task.' });
  }
}

export async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.dueDate) {
      updates.dueDate = new Date(updates.dueDate);
    }

    const updatedTask = await storage.updateTask(id, req.userId, updates);
    if (!updatedTask) {
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized.' });
    }

    res.json({ success: true, task: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update task.' });
  }
}

export async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    const deleted = await storage.deleteTask(id, req.userId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized.' });
    }
    res.json({ success: true, message: 'Task deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete task.' });
  }
}
