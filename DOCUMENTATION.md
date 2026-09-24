# COLLEGE MINI PROJECT SUBMISSION DOCUMENTATION

## Project Name: LifeOS AI — Intelligent Personal Operating System
**Academic Year:** 2026  
**Course:** Full-Stack Web Development Mini Project  
**Author:** Mohammed / Student Team  

---

## 📄 EXECUTIVE SUMMARY

**LifeOS AI** is an AI-powered personal productivity and executive life management dashboard designed to address the challenges of task management, goal tracking, habit formation, deep work focus sessions, and personal reflection. 

Unlike traditional passive productivity apps, **LifeOS AI** incorporates **Executive Context Intelligence**: it dynamically analyzes the user's pending workload, upcoming deadlines, habit consistency, and focus session logs to generate actionable daily schedules ("Plan My Day") and structured advice.

---

## 🛠️ TECHNICAL ARCHITECTURE & STACK

### 1. Frontend Technologies
- **Framework:** React.js 19 (scaffolded via Vite v8)
- **Styling & Theme:** Tailwind CSS v4 (Glassmorphism dark theme palette)
- **Animations:** Framer Motion
- **Iconography:** Lucide React
- **Data Visualizations:** Recharts (Area charts, Bar charts, Pie charts)
- **State & Auth:** React Context (`useAuth.jsx`) + LocalStorage persistence

### 2. Backend Technologies
- **Server Runtime:** Node.js + Express.js
- **Authentication:** JSON Web Tokens (JWT) + Bcrypt.js password hashing
- **Database:** MongoDB & Mongoose ORM
- **Graceful Storage Fallback:** In-memory repository with pre-seeded realistic demo data (runs out of the box without DB configuration)

### 3. Artificial Intelligence Engine
- **Provider:** OpenRouter API (`meta-llama/llama-3.3-70b-instruct:free`)
- **Fallback AI Engine:** Deterministic local context engine for zero-downtime offline presentation

---

## 📂 PROJECT STRUCTURE & FILE ORGANIZATION

```
lifeos-ai/
├── README.md                     # Quickstart guide & environment instructions
├── DOCUMENTATION.md              # Academic submission report
├── .gitignore                    # Version control rules
├── backend/                      # Node.js Express REST API Server
│   ├── config/
│   │   └── db.js                 # MongoDB connection handler
│   ├── controllers/              # REST Controller handlers (Auth, Task, Goal, Habit, Focus, AI, etc.)
│   ├── middleware/
│   │   └── auth.middleware.js    # JWT authorization validator
│   ├── models/                   # Mongoose Database Schemas (User, Task, Goal, Habit, etc.)
│   ├── routes/                   # Express router endpoints
│   ├── services/
│   │   ├── ai.service.js         # OpenRouter API & fallback logic
│   │   └── storage.service.js    # Mongo & In-Memory storage repository abstraction
│   ├── server.js                 # Backend server entry point
│   ├── package.json              # Backend dependencies
│   └── .env.example              # Sample environment configuration
└── frontend/                     # React Vite Single Page Application
    ├── src/
    │   ├── components/           # Reusable UI components (Sidebar, Header, TaskCard, GoalCard, Modal, etc.)
    │   ├── hooks/                # Auth state hook (useAuth.jsx)
    │   ├── pages/                # Page views (Dashboard, Tasks, Goals, Habits, Focus, Assistant, Analytics, etc.)
    │   ├── services/
    │   │   └── api.service.js    # Frontend HTTP API client wrapper
    │   ├── App.jsx               # Router & view layout controller
    │   ├── main.jsx              # React DOM entry point
    │   └── index.css             # Tailwind & Glassmorphism styles
    ├── package.json              # Frontend dependencies
    └── vite.config.js            # Vite build configuration
```

---

## 🗄️ DATABASE SCHEMA DEFINITIONS

1. **User Schema (`User.js`)**
   - `name`: String (Required)
   - `email`: String (Required, Unique)
   - `password`: String (Hashed via Bcrypt)
   - `createdAt`: Date

2. **Task Schema (`Task.js`)**
   - `userId`: String (Indexed)
   - `title`: String (Required)
   - `description`: String
   - `priority`: Enum ['High', 'Medium', 'Low']
   - `category`: Enum ['Study', 'Work', 'Personal', 'Health', 'Other']
   - `dueDate`: Date
   - `completed`: Boolean

3. **Goal Schema (`Goal.js`)**
   - `userId`: String (Indexed)
   - `title`: String (Required)
   - `description`: String
   - `category`: String
   - `targetDate`: Date
   - `progress`: Number (0 - 100)

4. **Habit Schema (`Habit.js`)**
   - `userId`: String (Indexed)
   - `title`: String (Required)
   - `category`: String
   - `streak`: Number
   - `history`: Array of Strings ('YYYY-MM-DD')

5. **Focus Session Schema (`FocusSession.js`)**
   - `userId`: String (Indexed)
   - `taskTitle`: String
   - `durationMinutes`: Number
   - `completedAt`: Date

6. **Calendar Event Schema (`CalendarEvent.js`)**
   - `userId`: String (Indexed)
   - `title`: String
   - `date`: String ('YYYY-MM-DD')
   - `startTime`: String ('HH:MM')
   - `endTime`: String ('HH:MM')
   - `category`: String

7. **Journal Entry Schema (`JournalEntry.js`)**
   - `userId`: String (Indexed)
   - `content`: String
   - `mood`: Enum ['Great', 'Good', 'Okay', 'Low']
   - `date`: String ('YYYY-MM-DD')

---

## ⚡ REST API ENDPOINTS

### Authentication
- `POST /api/auth/register` — Register new user account
- `POST /api/auth/login` — Sign in and obtain JWT
- `POST /api/auth/demo` — Instant Demo Mode sign-in token
- `GET /api/auth/me` — Fetch current user profile

### Tasks
- `GET /api/tasks` — Fetch user tasks
- `POST /api/tasks` — Create new task
- `PUT /api/tasks/:id` — Update task details / toggle complete
- `DELETE /api/tasks/:id` — Delete task

### Goals
- `GET /api/goals` — Fetch user goals
- `POST /api/goals` — Create new goal
- `PUT /api/goals/:id` — Update goal progress %
- `DELETE /api/goals/:id` — Delete goal

### Habits
- `GET /api/habits` — Fetch habits list
- `POST /api/habits` — Create new habit
- `POST /api/habits/:id/toggle` — Toggle completion date for habit
- `DELETE /api/habits/:id` — Delete habit

### Focus Sessions
- `GET /api/focus` — Fetch completed focus logs
- `POST /api/focus` — Log completed Pomodoro session

### Calendar
- `GET /api/events` — Fetch calendar schedule
- `POST /api/events` — Create calendar event
- `DELETE /api/events/:id` — Delete event

### Journal
- `GET /api/journal` — Fetch journal entries
- `POST /api/journal` — Create journal entry
- `GET /api/journal/reflection` — Generate AI supportive reflection summary

### AI Services
- `POST /api/ai/chat` — Context-aware AI Chat Assistant
- `POST /api/ai/plan-day` — Generate structured daily schedule timeline
- `POST /api/ai/insights` — Synthesize performance pattern insights

---

## 🚀 INSTRUCTIONS FOR REVIEWERS / EVALUATORS

### Option 1: Quick Demo Mode Review (Recommended)
1. Unzip the project submission folder.
2. Run backend:
   ```bash
   cd backend
   npm install
   npm start
   ```
3. Run frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. Open `http://localhost:5173` in your web browser.
5. Click **"Explore Demo"** on the home page. The application will instantly load pre-populated realistic demo data for immediate testing without requiring database installation or API keys!

---
*Created for College Mini Project Review 2026.*
