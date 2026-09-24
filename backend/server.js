import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { storage, getStorageMode } from './services/storage.service.js';

import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import goalRoutes from './routes/goal.routes.js';
import habitRoutes from './routes/habit.routes.js';
import focusRoutes from './routes/focus.routes.js';
import calendarRoutes from './routes/calendar.routes.js';
import journalRoutes from './routes/journal.routes.js';
import aiRoutes from './routes/ai.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/focus', focusRoutes);
app.use('/api/events', calendarRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/ai', aiRoutes);

// Demo Data Reset Endpoint
app.post('/api/demo/reset', async (req, res) => {
  try {
    await storage.resetDemoData();
    res.json({ success: true, message: 'Demo data reset successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reset demo data.' });
  }
});

// System Status & Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'LifeOS AI Backend',
    storageMode: getStorageMode(),
    openRouterConfigured: !!(process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.trim() !== ''),
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err);
  res.status(500).json({ success: false, message: 'An unexpected server error occurred.' });
});

// Start Server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`================================================`);
    console.log(`🚀 LifeOS AI Backend running on http://localhost:${PORT}`);
    console.log(`⚡ Storage Mode: ${getStorageMode()}`);
    console.log(`================================================`);
  });
}

startServer();
