import { storage } from '../services/storage.service.js';

export async function getFocusSessions(req, res) {
  try {
    const sessions = await storage.getFocusSessions(req.userId);
    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch focus sessions.' });
  }
}

export async function createFocusSession(req, res) {
  try {
    const { taskTitle, durationMinutes } = req.body;
    const session = await storage.createFocusSession({
      userId: req.userId,
      taskTitle: taskTitle || 'General Focus',
      durationMinutes: typeof durationMinutes === 'number' ? durationMinutes : 25,
      completedAt: new Date()
    });

    res.status(201).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to log focus session.' });
  }
}
