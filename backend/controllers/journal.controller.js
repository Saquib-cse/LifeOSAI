import { storage } from '../services/storage.service.js';
import { generateJournalReflection } from '../services/ai.service.js';

export async function getJournalEntries(req, res) {
  try {
    const entries = await storage.getJournalEntries(req.userId);
    res.json({ success: true, entries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch journal entries.' });
  }
}

export async function createJournalEntry(req, res) {
  try {
    const { content, mood, date } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: 'Journal content is required.' });
    }

    const entry = await storage.createJournalEntry({
      userId: req.userId,
      content,
      mood: mood || 'Good',
      date: date || new Date().toISOString().split('T')[0]
    });

    res.status(201).json({ success: true, entry });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create journal entry.' });
  }
}

export async function getJournalReflection(req, res) {
  try {
    const entries = await storage.getJournalEntries(req.userId);
    const result = await generateJournalReflection(entries);
    res.json({ success: true, reflection: result.reflection, source: result.source });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate AI journal reflection.' });
  }
}
