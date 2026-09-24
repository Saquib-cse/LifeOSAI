const BASE_URL = 'http://localhost:5000/api';

function getHeaders() {
  const token = localStorage.getItem('lifeos_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'API request failed.');
    }
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  demoLogin: () => request('/auth/demo', { method: 'POST' }),
  getMe: () => request('/auth/me'),

  // Tasks
  getTasks: () => request('/tasks'),
  createTask: (task) => request('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  updateTask: (id, updates) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),

  // Goals
  getGoals: () => request('/goals'),
  createGoal: (goal) => request('/goals', { method: 'POST', body: JSON.stringify(goal) }),
  updateGoal: (id, updates) => request(`/goals/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteGoal: (id) => request(`/goals/${id}`, { method: 'DELETE' }),

  // Habits
  getHabits: () => request('/habits'),
  createHabit: (habit) => request('/habits', { method: 'POST', body: JSON.stringify(habit) }),
  updateHabit: (id, updates) => request(`/habits/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  toggleHabit: (id, date) => request(`/habits/${id}/toggle`, { method: 'POST', body: JSON.stringify({ date }) }),
  deleteHabit: (id) => request(`/habits/${id}`, { method: 'DELETE' }),

  // Focus
  getFocusSessions: () => request('/focus'),
  createFocusSession: (session) => request('/focus', { method: 'POST', body: JSON.stringify(session) }),

  // Calendar
  getEvents: () => request('/events'),
  createEvent: (event) => request('/events', { method: 'POST', body: JSON.stringify(event) }),
  updateEvent: (id, updates) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteEvent: (id) => request(`/events/${id}`, { method: 'DELETE' }),

  // Journal
  getJournalEntries: () => request('/journal'),
  createJournalEntry: (entry) => request('/journal', { method: 'POST', body: JSON.stringify(entry) }),
  getJournalReflection: () => request('/journal/reflection'),

  // AI
  aiChat: (message) => request('/ai/chat', { method: 'POST', body: JSON.stringify({ message }) }),
  aiPlanDay: () => request('/ai/plan-day', { method: 'POST' }),
  aiInsights: () => request('/ai/insights', { method: 'POST' }),

  // Demo Reset
  resetDemoData: () => request('/demo/reset', { method: 'POST' })
};
