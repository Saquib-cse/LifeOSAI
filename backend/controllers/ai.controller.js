import { storage } from '../services/storage.service.js';
import { chatWithAI, generateDailyPlan, generateInsights } from '../services/ai.service.js';

export async function handleAIChat(req, res) {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message prompt is required.' });
    }

    const tasks = await storage.getTasks(req.userId);
    const goals = await storage.getGoals(req.userId);
    const habits = await storage.getHabits(req.userId);
    const focusSessions = await storage.getFocusSessions(req.userId);

    const todayStr = new Date().toISOString().split('T')[0];
    const focusTodayMins = focusSessions
      .filter(f => new Date(f.completedAt).toISOString().split('T')[0] === todayStr)
      .reduce((sum, f) => sum + (f.durationMinutes || 0), 0);

    const context = {
      tasks,
      goals,
      habits,
      focusHoursToday: (focusTodayMins / 60).toFixed(1)
    };

    const aiResult = await chatWithAI(message, context);
    res.json({ success: true, response: aiResult.response, source: aiResult.source });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ success: false, message: 'AI Assistant error.' });
  }
}

export async function handlePlanDay(req, res) {
  try {
    const tasks = await storage.getTasks(req.userId);
    const goals = await storage.getGoals(req.userId);
    const habits = await storage.getHabits(req.userId);

    const context = { tasks, goals, habits };
    const planResult = await generateDailyPlan(context);

    res.json({
      success: true,
      plan: planResult.plan || null,
      timeline: planResult.timeline || null,
      source: planResult.source
    });
  } catch (error) {
    console.error('Plan Day Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate daily plan.' });
  }
}

export async function handleAIInsights(req, res) {
  try {
    const tasks = await storage.getTasks(req.userId);
    const goals = await storage.getGoals(req.userId);
    const habits = await storage.getHabits(req.userId);
    const focusSessions = await storage.getFocusSessions(req.userId);

    const todayStr = new Date().toISOString().split('T')[0];
    const focusTodayMins = focusSessions
      .filter(f => new Date(f.completedAt).toISOString().split('T')[0] === todayStr)
      .reduce((sum, f) => sum + (f.durationMinutes || 0), 0);

    const context = {
      tasks,
      goals,
      habits,
      focusHoursToday: (focusTodayMins / 60).toFixed(1)
    };

    const result = await generateInsights(context);
    res.json({
      success: true,
      insights: result.insights,
      source: result.source
    });
  } catch (error) {
    console.error('AI Insights Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate AI insights.' });
  }
}
