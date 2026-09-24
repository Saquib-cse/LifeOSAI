import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Goal from '../models/Goal.js';
import Habit from '../models/Habit.js';
import FocusSession from '../models/FocusSession.js';
import CalendarEvent from '../models/CalendarEvent.js';
import JournalEntry from '../models/JournalEntry.js';

let isMongoConnected = false;

export function setMongoConnected(connected) {
  isMongoConnected = connected;
  console.log(`[StorageService] Mode: ${isMongoConnected ? 'MongoDB Database' : 'In-Memory Store (Demo Fallback)'}`);
}

export function getStorageMode() {
  return isMongoConnected ? 'mongodb' : 'memory';
}

// In-Memory Database store initialized with realistic demo data
const memoryDb = {
  users: [],
  tasks: [],
  goals: [],
  habits: [],
  focusSessions: [],
  calendarEvents: [],
  journalEntries: []
};

// Seed initial memory data
async function initSeedData() {
  const hashedPassword = await bcrypt.hash('demopass123', 10);
  const demoUser = {
    _id: 'demo-user-123',
    id: 'demo-user-123',
    name: 'Mohammed',
    email: 'demo@lifeos.ai',
    password: hashedPassword,
    createdAt: new Date()
  };
  memoryDb.users.push(demoUser);

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  memoryDb.tasks = [
    {
      _id: 'task-1',
      id: 'task-1',
      userId: 'demo-user-123',
      title: 'Complete DSA Assignment',
      description: 'Implement Graph Traversals and Dijkstra algorithm in C++',
      priority: 'High',
      category: 'Study',
      dueDate: new Date(now.getTime() + 86400000),
      completed: false,
      createdAt: new Date(now.getTime() - 86400000 * 2)
    },
    {
      _id: 'task-2',
      id: 'task-2',
      userId: 'demo-user-123',
      title: 'Build LifeOS AI Mini Project',
      description: 'Finish Express backend endpoints and React dashboard UI',
      priority: 'High',
      category: 'Work',
      dueDate: new Date(now.getTime() + 86400000 * 2),
      completed: false,
      createdAt: new Date(now.getTime() - 86400000)
    },
    {
      _id: 'task-3',
      id: 'task-3',
      userId: 'demo-user-123',
      title: 'Study Operating Systems',
      description: 'Review Deadlock Prevention and Process Scheduling Algorithms',
      priority: 'Medium',
      category: 'Study',
      dueDate: new Date(now.getTime() + 86400000 * 3),
      completed: false,
      createdAt: new Date()
    },
    {
      _id: 'task-4',
      id: 'task-4',
      userId: 'demo-user-123',
      title: 'Read 20 pages of Atomic Habits',
      description: 'Focus on habit stacking and environment design chapter',
      priority: 'Low',
      category: 'Personal',
      dueDate: new Date(),
      completed: true,
      createdAt: new Date(now.getTime() - 86400000 * 3)
    },
    {
      _id: 'task-5',
      id: 'task-5',
      userId: 'demo-user-123',
      title: 'Morning 30-min Jogging',
      description: 'Cardio session at local park',
      priority: 'High',
      category: 'Health',
      dueDate: new Date(),
      completed: true,
      createdAt: new Date()
    }
  ];

  memoryDb.goals = [
    {
      _id: 'goal-1',
      id: 'goal-1',
      userId: 'demo-user-123',
      title: 'Complete College Mini Project',
      description: 'Deliver polished LifeOS AI full-stack application for review',
      category: 'Academic',
      targetDate: new Date(now.getTime() + 86400000 * 7),
      progress: 85,
      createdAt: new Date(now.getTime() - 86400000 * 10)
    },
    {
      _id: 'goal-2',
      id: 'goal-2',
      userId: 'demo-user-123',
      title: 'Master Data Structures & Algorithms',
      description: 'Solve 100 LeetCode problems across Arrays, Trees, and DP',
      category: 'Skill',
      targetDate: new Date(now.getTime() + 86400000 * 30),
      progress: 60,
      createdAt: new Date(now.getTime() - 86400000 * 20)
    },
    {
      _id: 'goal-3',
      id: 'goal-3',
      userId: 'demo-user-123',
      title: 'Build Professional Portfolio',
      description: 'Design responsive website showcasing full-stack projects',
      category: 'Career',
      targetDate: new Date(now.getTime() + 86400000 * 45),
      progress: 45,
      createdAt: new Date(now.getTime() - 86400000 * 15)
    }
  ];

  const daysArr = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getTime() - i * 86400000);
    daysArr.push(d.toISOString().split('T')[0]);
  }

  memoryDb.habits = [
    {
      _id: 'habit-1',
      id: 'habit-1',
      userId: 'demo-user-123',
      title: 'Coding Practice (1 Hour)',
      category: 'Study',
      streak: 12,
      history: [daysArr[0], daysArr[1], daysArr[2], daysArr[3], daysArr[4]],
      createdAt: new Date(now.getTime() - 86400000 * 14)
    },
    {
      _id: 'habit-2',
      id: 'habit-2',
      userId: 'demo-user-123',
      title: 'Daily Exercise & Workout',
      category: 'Health',
      streak: 5,
      history: [daysArr[0], daysArr[1], daysArr[2]],
      createdAt: new Date(now.getTime() - 86400000 * 10)
    },
    {
      _id: 'habit-3',
      id: 'habit-3',
      userId: 'demo-user-123',
      title: 'Read 20 Pages',
      category: 'Personal',
      streak: 8,
      history: [daysArr[0], daysArr[1], daysArr[3], daysArr[4]],
      createdAt: new Date(now.getTime() - 86400000 * 12)
    },
    {
      _id: 'habit-4',
      id: 'habit-4',
      userId: 'demo-user-123',
      title: 'Drink 3L Water',
      category: 'Health',
      streak: 15,
      history: [daysArr[0], daysArr[1], daysArr[2], daysArr[3], daysArr[4], daysArr[5]],
      createdAt: new Date(now.getTime() - 86400000 * 20)
    }
  ];

  memoryDb.focusSessions = [
    {
      _id: 'fs-1',
      id: 'fs-1',
      userId: 'demo-user-123',
      taskTitle: 'Complete DSA Assignment',
      durationMinutes: 25,
      completedAt: new Date(now.getTime() - 3600000 * 4)
    },
    {
      _id: 'fs-2',
      id: 'fs-2',
      userId: 'demo-user-123',
      taskTitle: 'Complete DSA Assignment',
      durationMinutes: 25,
      completedAt: new Date(now.getTime() - 3600000 * 3)
    },
    {
      _id: 'fs-3',
      id: 'fs-3',
      userId: 'demo-user-123',
      taskTitle: 'Build LifeOS AI Mini Project',
      durationMinutes: 25,
      completedAt: new Date(now.getTime() - 3600000 * 2)
    },
    {
      _id: 'fs-4',
      id: 'fs-4',
      userId: 'demo-user-123',
      taskTitle: 'Build LifeOS AI Mini Project',
      durationMinutes: 25,
      completedAt: new Date(now.getTime() - 3600000)
    },
    {
      _id: 'fs-5',
      id: 'fs-5',
      userId: 'demo-user-123',
      taskTitle: 'Study Operating Systems',
      durationMinutes: 35,
      completedAt: new Date()
    }
  ];

  memoryDb.calendarEvents = [
    {
      _id: 'evt-1',
      id: 'evt-1',
      userId: 'demo-user-123',
      title: 'OS Lecture & Lab Session',
      date: todayStr,
      startTime: '10:00',
      endTime: '12:00',
      category: 'Study'
    },
    {
      _id: 'evt-2',
      id: 'evt-2',
      userId: 'demo-user-123',
      title: 'LifeOS AI Demo Sync',
      date: todayStr,
      startTime: '14:00',
      endTime: '15:30',
      category: 'Work'
    },
    {
      _id: 'evt-3',
      id: 'evt-3',
      userId: 'demo-user-123',
      title: 'DSA Peer Study Group',
      date: new Date(now.getTime() + 86400000).toISOString().split('T')[0],
      startTime: '16:00',
      endTime: '17:30',
      category: 'Study'
    }
  ];

  memoryDb.journalEntries = [
    {
      _id: 'j-1',
      id: 'j-1',
      userId: 'demo-user-123',
      content: 'Had a productive morning working on the LifeOS AI backend algorithms. Maintained great focus during 3 pomodoro blocks.',
      mood: 'Great',
      date: todayStr,
      createdAt: new Date()
    },
    {
      _id: 'j-2',
      id: 'j-2',
      userId: 'demo-user-123',
      content: 'Reviewed OS deadlock handling. Need to spend more time practicing C++ pointers before the weekend.',
      mood: 'Good',
      date: daysArr[1],
      createdAt: new Date(now.getTime() - 86400000)
    }
  ];
}

initSeedData();

// Storage helper functions abstracts mongo vs memory
export const storage = {
  // USER
  findUserByEmail: async (email) => {
    if (isMongoConnected) {
      return await User.findOne({ email: email.toLowerCase() });
    }
    return memoryDb.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },
  findUserById: async (id) => {
    if (isMongoConnected) {
      return await User.findById(id).select('-password');
    }
    const u = memoryDb.users.find(u => u._id === id || u.id === id);
    if (!u) return null;
    const { password, ...rest } = u;
    return rest;
  },
  createUser: async (userData) => {
    if (isMongoConnected) {
      const u = new User(userData);
      await u.save();
      return u;
    }
    const newU = {
      _id: 'usr-' + Date.now(),
      id: 'usr-' + Date.now(),
      ...userData,
      createdAt: new Date()
    };
    memoryDb.users.push(newU);
    return newU;
  },

  // TASKS
  getTasks: async (userId) => {
    if (isMongoConnected) {
      return await Task.find({ userId }).sort({ createdAt: -1 });
    }
    return memoryDb.tasks.filter(t => t.userId === userId);
  },
  createTask: async (taskData) => {
    if (isMongoConnected) {
      const t = new Task(taskData);
      await t.save();
      return t;
    }
    const newT = {
      _id: 'task-' + Date.now(),
      id: 'task-' + Date.now(),
      ...taskData,
      createdAt: new Date()
    };
    memoryDb.tasks.unshift(newT);
    return newT;
  },
  updateTask: async (id, userId, updates) => {
    if (isMongoConnected) {
      return await Task.findOneAndUpdate({ _id: id, userId }, updates, { new: true });
    }
    const idx = memoryDb.tasks.findIndex(t => (t._id === id || t.id === id) && t.userId === userId);
    if (idx === -1) return null;
    memoryDb.tasks[idx] = { ...memoryDb.tasks[idx], ...updates };
    return memoryDb.tasks[idx];
  },
  deleteTask: async (id, userId) => {
    if (isMongoConnected) {
      return await Task.findOneAndDelete({ _id: id, userId });
    }
    const idx = memoryDb.tasks.findIndex(t => (t._id === id || t.id === id) && t.userId === userId);
    if (idx === -1) return false;
    memoryDb.tasks.splice(idx, 1);
    return true;
  },

  // GOALS
  getGoals: async (userId) => {
    if (isMongoConnected) {
      return await Goal.find({ userId }).sort({ createdAt: -1 });
    }
    return memoryDb.goals.filter(g => g.userId === userId);
  },
  createGoal: async (goalData) => {
    if (isMongoConnected) {
      const g = new Goal(goalData);
      await g.save();
      return g;
    }
    const newG = {
      _id: 'goal-' + Date.now(),
      id: 'goal-' + Date.now(),
      ...goalData,
      createdAt: new Date()
    };
    memoryDb.goals.unshift(newG);
    return newG;
  },
  updateGoal: async (id, userId, updates) => {
    if (isMongoConnected) {
      return await Goal.findOneAndUpdate({ _id: id, userId }, updates, { new: true });
    }
    const idx = memoryDb.goals.findIndex(g => (g._id === id || g.id === id) && g.userId === userId);
    if (idx === -1) return null;
    memoryDb.goals[idx] = { ...memoryDb.goals[idx], ...updates };
    return memoryDb.goals[idx];
  },
  deleteGoal: async (id, userId) => {
    if (isMongoConnected) {
      return await Goal.findOneAndDelete({ _id: id, userId });
    }
    const idx = memoryDb.goals.findIndex(g => (g._id === id || g.id === id) && g.userId === userId);
    if (idx === -1) return false;
    memoryDb.goals.splice(idx, 1);
    return true;
  },

  // HABITS
  getHabits: async (userId) => {
    if (isMongoConnected) {
      return await Habit.find({ userId }).sort({ createdAt: -1 });
    }
    return memoryDb.habits.filter(h => h.userId === userId);
  },
  createHabit: async (habitData) => {
    if (isMongoConnected) {
      const h = new Habit(habitData);
      await h.save();
      return h;
    }
    const newH = {
      _id: 'habit-' + Date.now(),
      id: 'habit-' + Date.now(),
      streak: 0,
      history: [],
      ...habitData,
      createdAt: new Date()
    };
    memoryDb.habits.unshift(newH);
    return newH;
  },
  updateHabit: async (id, userId, updates) => {
    if (isMongoConnected) {
      return await Habit.findOneAndUpdate({ _id: id, userId }, updates, { new: true });
    }
    const idx = memoryDb.habits.findIndex(h => (h._id === id || h.id === id) && h.userId === userId);
    if (idx === -1) return null;
    memoryDb.habits[idx] = { ...memoryDb.habits[idx], ...updates };
    return memoryDb.habits[idx];
  },
  deleteHabit: async (id, userId) => {
    if (isMongoConnected) {
      return await Habit.findOneAndDelete({ _id: id, userId });
    }
    const idx = memoryDb.habits.findIndex(h => (h._id === id || h.id === id) && h.userId === userId);
    if (idx === -1) return false;
    memoryDb.habits.splice(idx, 1);
    return true;
  },

  // FOCUS SESSIONS
  getFocusSessions: async (userId) => {
    if (isMongoConnected) {
      return await FocusSession.find({ userId }).sort({ completedAt: -1 });
    }
    return memoryDb.focusSessions.filter(f => f.userId === userId);
  },
  createFocusSession: async (sessionData) => {
    if (isMongoConnected) {
      const fs = new FocusSession(sessionData);
      await fs.save();
      return fs;
    }
    const newFS = {
      _id: 'fs-' + Date.now(),
      id: 'fs-' + Date.now(),
      ...sessionData,
      completedAt: new Date()
    };
    memoryDb.focusSessions.unshift(newFS);
    return newFS;
  },

  // CALENDAR EVENTS
  getEvents: async (userId) => {
    if (isMongoConnected) {
      return await CalendarEvent.find({ userId }).sort({ date: 1, startTime: 1 });
    }
    return memoryDb.calendarEvents.filter(e => e.userId === userId);
  },
  createEvent: async (eventData) => {
    if (isMongoConnected) {
      const evt = new CalendarEvent(eventData);
      await evt.save();
      return evt;
    }
    const newE = {
      _id: 'evt-' + Date.now(),
      id: 'evt-' + Date.now(),
      ...eventData,
      createdAt: new Date()
    };
    memoryDb.calendarEvents.push(newE);
    return newE;
  },
  updateEvent: async (id, userId, updates) => {
    if (isMongoConnected) {
      return await CalendarEvent.findOneAndUpdate({ _id: id, userId }, updates, { new: true });
    }
    const idx = memoryDb.calendarEvents.findIndex(e => (e._id === id || e.id === id) && e.userId === userId);
    if (idx === -1) return null;
    memoryDb.calendarEvents[idx] = { ...memoryDb.calendarEvents[idx], ...updates };
    return memoryDb.calendarEvents[idx];
  },
  deleteEvent: async (id, userId) => {
    if (isMongoConnected) {
      return await CalendarEvent.findOneAndDelete({ _id: id, userId });
    }
    const idx = memoryDb.calendarEvents.findIndex(e => (e._id === id || e.id === id) && e.userId === userId);
    if (idx === -1) return false;
    memoryDb.calendarEvents.splice(idx, 1);
    return true;
  },

  // JOURNAL ENTRIES
  getJournalEntries: async (userId) => {
    if (isMongoConnected) {
      return await JournalEntry.find({ userId }).sort({ createdAt: -1 });
    }
    return memoryDb.journalEntries.filter(j => j.userId === userId);
  },
  createJournalEntry: async (entryData) => {
    if (isMongoConnected) {
      const entry = new JournalEntry(entryData);
      await entry.save();
      return entry;
    }
    const newJ = {
      _id: 'j-' + Date.now(),
      id: 'j-' + Date.now(),
      ...entryData,
      createdAt: new Date()
    };
    memoryDb.journalEntries.unshift(newJ);
    return newJ;
  },

  // Reset Demo Data
  resetDemoData: async () => {
    memoryDb.users = [];
    memoryDb.tasks = [];
    memoryDb.goals = [];
    memoryDb.habits = [];
    memoryDb.focusSessions = [];
    memoryDb.calendarEvents = [];
    memoryDb.journalEntries = [];
    await initSeedData();
    return true;
  }
};
