# LifeOS AI — Intelligent Personal Operating System 🚀

> **College Mini Project**  
> An AI-powered personal productivity and life management dashboard designed for students and professionals to manage tasks, goals, habits, focus sessions, calendar events, and personal reflections with executive AI guidance.

---

## 🌟 Key Features

1. **Executive Intelligence Dashboard**: Dark glassmorphic interface with live progress metrics, priority tasks, habit streaks, focus time, and dynamic AI insights.
2. **AI Executive Assistant**: Context-aware ChatGPT-style interface that ingests current tasks, goals, habits, and focus hours to provide tailored schedule advice and study planning.
3. **AI Daily Planner ("Plan My Day")**: Generates structured hourly daily timelines based on user priorities and deadlines.
4. **Smart Task Management**: Complete CRUD with priority levels (High/Med/Low), categories (Study/Work/Personal/Health/Other), due dates, search, and filtering.
5. **Goal Tracking**: Visual progress cards with milestone percentages and deadline tracking.
6. **Habit Tracker**: GitHub-style activity log with streak counters and daily toggle logs.
7. **Pomodoro Focus Chamber**: 25m focus / 5m break timer linked to active tasks, logging focus session totals.
8. **Calendar & Schedule**: Manage upcoming lectures, standups, and study sessions.
9. **Personal Journal & Mood Log**: Reflect on daily momentum with AI-powered supportive emotional summaries.
10. **Performance Analytics**: Recharts data visualizations detailing task ratio, focus hours, and habit consistency.
11. **Zero-Setup Demo Mode**: Instantly explores the entire application with rich pre-populated demo data without requiring database or API key configuration out of the box!

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS (v4) with custom glassmorphism design system
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Visualizations**: Recharts

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB & Mongoose (with MongoDB Atlas support + automatic in-memory fallback store)
- **Authentication**: JWT & Bcrypt password hashing
- **AI Integration**: OpenRouter API (`llama-3.3-70b-instruct`) with deterministic local fallback engine

---

## 📁 Project Structure

```
/lifeos-ai
├── /frontend
│   ├── /src
│   │   ├── /components       # Reusable UI components (Sidebar, Header, TaskCard, GoalCard, etc.)
│   │   ├── /pages            # Page views (Dashboard, Tasks, Goals, Habits, Focus, Assistant, etc.)
│   │   ├── /services         # API client service (api.service.js)
│   │   ├── /hooks            # Custom hooks (useAuth.jsx)
│   │   ├── App.jsx           # Main routing & layout controller
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Tailwind & glassmorphism theme styling
│   ├── package.json
│   └── vite.config.js
│
├── /backend
│   ├── /controllers          # Express route logic (auth, tasks, goals, habits, AI, etc.)
│   ├── /routes               # REST API route definitions
│   ├── /models               # Mongoose data schemas (User, Task, Goal, Habit, etc.)
│   ├── /services             # Storage abstraction & OpenRouter AI services
│   ├── /middleware           # JWT Authentication middleware
│   ├── /config               # MongoDB connection setup
│   ├── server.js             # Express backend server entry point
│   └── .env.example          # Environment variable template
│
└── README.md
```

---

## 🔑 Environment Variables

Create a `.env` file inside `/backend`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/lifeos
JWT_SECRET=lifeos_super_secret_jwt_key_2026_demo
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free
```

*Note: If `MONGODB_URI` or `OPENROUTER_API_KEY` are not provided, LifeOS AI automatically runs in local demo fallback mode without crashing.*

---

## 🚀 How to Run Locally

### 1. Clone & Setup Backend
```bash
cd backend
npm install
npm run dev
```
Backend will start on `http://localhost:5000`.

### 2. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Frontend will start on `http://localhost:5173`.

---

## 🛡️ Demo Mode Instructions

For college project reviews or instant demonstration:
1. Open the web app on `http://localhost:5173`.
2. Click **"Explore Demo"** or **"Explore in Demo Mode"**.
3. The app instantly populates realistic demo tasks, goals, habits, focus sessions, and journal entries.
4. You can reset demo data at any time via the **"Reset Demo Data"** button in the sidebar footer.

---

## 🌐 Deployment Instructions

- **Backend**: Can be deployed to Render, Railway, or Vercel Serverless.
- **Frontend**: Can be built using `npm run build` inside `/frontend` and deployed to Vercel, Netlify, or GitHub Pages.

---

## 🔮 Future Enhancements
- Mobile PWA offline support
- Voice assistant integration for quick task capture
- Multi-calendar sync integrations

---
*Developed for College Mini Project Review 2026.*
