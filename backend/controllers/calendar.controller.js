import { storage } from '../services/storage.service.js';

export async function getEvents(req, res) {
  try {
    const events = await storage.getEvents(req.userId);
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch calendar events.' });
  }
}

export async function createEvent(req, res) {
  try {
    const { title, date, startTime, endTime, category } = req.body;
    if (!title || !date || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Title, date, start time, and end time are required.' });
    }

    const event = await storage.createEvent({
      userId: req.userId,
      title,
      date,
      startTime,
      endTime,
      category: category || 'General'
    });

    res.status(201).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create calendar event.' });
  }
}

export async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const event = await storage.updateEvent(id, req.userId, updates);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found or unauthorized.' });
    }

    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update calendar event.' });
  }
}

export async function deleteEvent(req, res) {
  try {
    const { id } = req.params;
    const deleted = await storage.deleteEvent(id, req.userId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Event not found or unauthorized.' });
    }
    res.json({ success: true, message: 'Event deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete calendar event.' });
  }
}
