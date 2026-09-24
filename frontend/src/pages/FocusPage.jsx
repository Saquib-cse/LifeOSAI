import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, CheckCircle, Volume2, Sparkles } from 'lucide-react';
import { api } from '../services/api.service';
import { LoadingState } from '../components/LoadingState';

export function FocusPage() {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskTitle, setSelectedTaskTitle] = useState('General Focus');
  const [focusSessions, setFocusSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mode: 'focus' (25m = 1500s) or 'break' (5m = 300s)
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const timerRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [tasksRes, focusRes] = await Promise.all([
          api.getTasks(),
          api.getFocusSessions()
        ]);
        setTasks(tasksRes.tasks || []);
        setFocusSessions(focusRes.sessions || []);

        const pending = (tasksRes.tasks || []).filter(t => !t.completed);
        if (pending.length > 0) {
          setSelectedTaskTitle(pending[0].title);
        }
      } catch (err) {
        console.error('Failed to load focus data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Timer Tick Hook
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, mode]);

  const handleTimerComplete = async () => {
    setIsRunning(false);
    clearInterval(timerRef.current);

    if (mode === 'focus') {
      const durationMins = 25;
      try {
        const res = await api.createFocusSession({
          taskTitle: selectedTaskTitle,
          durationMinutes: durationMins
        });
        setFocusSessions(prev => [res.session, ...prev]);
        setCompletedCount(prev => prev + 1);
      } catch (err) {
        console.error('Failed to log session:', err);
      }
      // Switch to break mode
      setMode('break');
      setTimeLeft(5 * 60);
    } else {
      // Switch back to focus mode
      setMode('focus');
      setTimeLeft(25 * 60);
    }
  };

  const handleStartPause = () => {
    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const handleSwitchMode = (newMode) => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  // Calculations
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayFocusMins = focusSessions
    .filter(s => new Date(s.completedAt).toISOString().split('T')[0] === todayStr)
    .reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

  const focusHoursStr = `${Math.floor(todayFocusMins / 60)}h ${todayFocusMins % 60}m`;

  const totalSecs = mode === 'focus' ? 25 * 60 : 5 * 60;
  const progressPercent = Math.round(((totalSecs - timeLeft) / totalSecs) * 100);

  if (loading) return <LoadingState message="Loading focus sessions..." />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Timer className="w-6 h-6 text-emerald-400" />
          <span>Pomodoro Focus Chamber</span>
        </h2>
        <p className="text-xs text-slate-400">Eliminate distractions & track high-intensity deep work blocks</p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => handleSwitchMode('focus')}
          className={`
            px-5 py-2 rounded-xl text-xs font-bold transition-all border
            ${mode === 'focus' 
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20' 
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'}
          `}
        >
          25m Focus Block
        </button>
        <button
          onClick={() => handleSwitchMode('break')}
          className={`
            px-5 py-2 rounded-xl text-xs font-bold transition-all border
            ${mode === 'break' 
              ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white border-cyan-400 shadow-lg shadow-cyan-500/20' 
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'}
          `}
        >
          5m Rest Break
        </button>
      </div>

      {/* Main Focus Clock Card */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center relative overflow-hidden flex flex-col items-center">
        {/* Glow Ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Task Selector Dropdown */}
        <div className="mb-6 w-full max-w-sm">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Target Task for Session
          </label>
          <select
            value={selectedTaskTitle}
            onChange={(e) => setSelectedTaskTitle(e.target.value)}
            className="glass-input w-full px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 text-center"
          >
            <option value="General Focus">General Focus / Study</option>
            {tasks.filter(t => !t.completed).map(t => (
              <option key={t._id || t.id} value={t.title}>
                {t.title} ({t.priority} Priority)
              </option>
            ))}
          </select>
        </div>

        {/* Giant Timer Display */}
        <div className="relative my-4">
          <div className="text-6xl sm:text-8xl font-black tracking-tight text-white font-mono drop-shadow-lg">
            {formatTime(timeLeft)}
          </div>
          <p className="text-xs font-semibold text-gradient-cyan mt-2">
            {isRunning ? `${mode === 'focus' ? 'Deep Work in Progress...' : 'Rest & Recharge...'}` : 'Paused / Ready'}
          </p>
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={handleStartPause}
            className={`
              w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all transform hover:scale-105 active:scale-95
              ${isRunning 
                ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/30' 
                : 'bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-emerald-500/30'}
            `}
          >
            {isRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1 fill-white" />}
          </button>

          <button
            onClick={handleReset}
            className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 flex items-center justify-center transition-all"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Stat Footer */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 w-full flex items-center justify-around text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Today's Focus</span>
            <span className="text-emerald-400 font-bold text-base">{focusHoursStr}</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-slate-400 block font-medium">Sessions Completed</span>
            <span className="text-cyan-400 font-bold text-base">{focusSessions.length} Blocks</span>
          </div>
        </div>
      </div>

      {/* Focus History Log */}
      <div className="glass-panel p-5 rounded-2xl space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Recent Focus Sessions</span>
        </h4>

        {focusSessions.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No completed sessions logged today yet.</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {focusSessions.slice(0, 5).map(session => (
              <div key={session._id || session.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{session.taskTitle}</span>
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="text-emerald-400 font-bold">{session.durationMinutes} mins</span>
                  <span>{new Date(session.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
