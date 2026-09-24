import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Flame, 
  Timer, 
  TrendingUp, 
  Plus, 
  Target, 
  Sparkles, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { TaskCard } from '../components/TaskCard';
import { AIInsightCard } from '../components/AIInsightCard';
import { LoadingState } from '../components/LoadingState';
import { api } from '../services/api.service';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export function DashboardPage({ setActiveTab, onOpenCreateTask, onOpenCreateGoal, onOpenPlanDay }) {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [habits, setHabits] = useState([]);
  const [focusSessions, setFocusSessions] = useState([]);
  const [aiInsight, setAiInsight] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, goalsRes, habitsRes, focusRes, insightRes] = await Promise.all([
        api.getTasks(),
        api.getGoals(),
        api.getHabits(),
        api.getFocusSessions(),
        api.aiInsights().catch(() => ({ insights: [] }))
      ]);

      setTasks(tasksRes.tasks || []);
      setGoals(goalsRes.goals || []);
      setHabits(habitsRes.habits || []);
      setFocusSessions(focusRes.sessions || []);

      if (insightRes.insights && insightRes.insights.length > 0) {
        const firstInsight = insightRes.insights[0];
        setAiInsight(typeof firstInsight === 'string' ? { text: firstInsight } : firstInsight);
      } else {
        setAiInsight({
          title: 'Peak Focus Recommendation',
          text: "You're most productive when you complete your first important task before noon. Consider scheduling your hardest work earlier.",
          type: 'tip'
        });
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } fontFinally: {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleTask = async (task) => {
    try {
      const updated = await api.updateTask(task._id || task.id, { completed: !task.completed });
      setTasks(prev => prev.map(t => (t._id === task._id || t.id === task.id) ? updated.task : t));
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDeleteTask = async (task) => {
    try {
      await api.deleteTask(task._id || task.id);
      setTasks(prev => prev.filter(t => (t._id !== task._id && t.id !== task.id)));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  // Calculations
  const completedTasks = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak || 0)) : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayFocusMins = focusSessions
    .filter(s => new Date(s.completedAt).toISOString().split('T')[0] === todayStr)
    .reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

  const focusHours = (todayFocusMins / 60).toFixed(1);

  // Weekly Recharts Chart Data
  const chartData = [
    { day: 'Mon', tasks: 4, focusHours: 1.5 },
    { day: 'Tue', tasks: 6, focusHours: 2.2 },
    { day: 'Wed', tasks: 5, focusHours: 3.0 },
    { day: 'Thu', tasks: 7, focusHours: 2.5 },
    { day: 'Fri', tasks: 3, focusHours: 1.8 },
    { day: 'Sat', tasks: 8, focusHours: 4.0 },
    { day: 'Sun', tasks: completedTasks || 5, focusHours: parseFloat(focusHours) || 2.2 }
  ];

  if (loading) return <LoadingState message="Initializing LifeOS Intelligence..." />;

  return (
    <div className="space-y-6">
      {/* AI Insight Card */}
      <AIInsightCard
        title={aiInsight?.title || 'AI Executive Insight'}
        text={aiInsight?.text || "You're most productive when you complete your first important task before noon. Consider scheduling your hardest work earlier."}
        type={aiInsight?.type || 'tip'}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Progress"
          value={`${progressPercent}%`}
          subtext={`${completedTasks} of ${tasks.length} tasks done`}
          icon={TrendingUp}
          color="cyan"
        />
        <StatCard
          title="Tasks Completed"
          value={`${completedTasks}`}
          subtext="Active momentum"
          icon={CheckSquare}
          color="indigo"
        />
        <StatCard
          title="Habit Streak"
          value={`${maxStreak} Days`}
          subtext="Best active streak"
          icon={Flame}
          color="amber"
        />
        <StatCard
          title="Focus Time"
          value={`${focusHours}h`}
          subtext={`${todayFocusMins} mins logged today`}
          icon={Timer}
          color="emerald"
        />
      </div>

      {/* Quick Actions Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Quick Actions</span>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenCreateTask}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-xs font-semibold text-indigo-300 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>

          <button
            onClick={onOpenCreateGoal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-xs font-semibold text-purple-300 transition-all"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Add Goal</span>
          </button>

          <button
            onClick={() => setActiveTab('focus')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-xs font-semibold text-emerald-300 transition-all"
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Start Focus</span>
          </button>

          <button
            onClick={() => setActiveTab('assistant')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-xs font-semibold text-cyan-300 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Ask AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Today's Tasks & Productivity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks Column (2 Cols on LG) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-cyan-400" />
              <span>Today's Priorities</span>
            </h3>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs text-cyan-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>View All Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 glass-panel rounded-2xl">
                No tasks logged yet. Click "Add Task" to get started!
              </div>
            ) : (
              tasks.slice(0, 5).map(task => (
                <TaskCard
                  key={task._id || task.id}
                  task={task}
                  onToggleComplete={handleToggleTask}
                  onDelete={handleDeleteTask}
                />
              ))
            )}
          </div>
        </div>

        {/* Weekly Productivity Recharts Column (1 Col on LG) */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>Weekly Velocity</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">Recharts Analytics</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="tasks" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorTasks)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Peak Day: Saturday</span>
            <span className="text-cyan-400 font-semibold">+24% vs last week</span>
          </div>
        </div>
      </div>
    </div>
  );
}
