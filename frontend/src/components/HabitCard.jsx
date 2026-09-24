import React from 'react';
import { Flame, Check, Edit3, Trash2 } from 'lucide-react';

export function HabitCard({ habit, onToggle, onEdit, onDelete }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const history = habit.history || [];
  const isDoneToday = history.includes(todayStr);

  // Generate last 7 days YYYY-MM-DD
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'narrow' });
    last7Days.push({
      dateStr: dayStr,
      label: dayLabel,
      completed: history.includes(dayStr)
    });
  }

  return (
    <div className="glass-panel glass-panel-hover p-4 lg:p-5 rounded-2xl flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            {habit.category || 'Health'}
          </span>
          <h3 className="text-base font-bold text-white mt-1.5">{habit.title}</h3>
        </div>

        <div className="flex items-center gap-1">
          {onEdit && (
            <button onClick={() => onEdit(habit)} className="p-1 text-slate-400 hover:text-cyan-300">
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(habit)} className="p-1 text-slate-400 hover:text-rose-400">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        {/* Streak Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
          <span className="text-xs font-bold text-amber-300">{habit.streak || 0} Day Streak</span>
        </div>

        {/* Action Toggle Button */}
        <button
          onClick={() => onToggle(habit)}
          className={`
            px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md
            ${isDoneToday 
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/25' 
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'}
          `}
        >
          <Check className={`w-3.5 h-3.5 ${isDoneToday ? 'stroke-[3]' : ''}`} />
          <span>{isDoneToday ? 'Done Today' : 'Mark Done'}</span>
        </button>
      </div>

      {/* Past 7 Days Visual Grid */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between gap-1">
          {last7Days.map((day) => (
            <div key={day.dateStr} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-[10px] font-semibold text-slate-400">{day.label}</span>
              <div 
                title={day.dateStr}
                className={`
                  w-full h-7 rounded-md flex items-center justify-center transition-all border text-[10px] font-bold
                  ${day.completed 
                    ? 'bg-emerald-500/30 border-emerald-400/50 text-emerald-300 shadow-sm shadow-emerald-500/20' 
                    : 'bg-slate-900 border-slate-800 text-slate-600'}
                `}
              >
                {day.completed ? '✓' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
