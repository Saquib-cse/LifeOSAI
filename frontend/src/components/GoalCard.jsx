import React from 'react';
import { Target, Calendar, Edit3, Trash2 } from 'lucide-react';

export function GoalCard({ goal, onUpdateProgress, onEdit, onDelete }) {
  const formatTargetDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="glass-panel glass-panel-hover p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            {goal.category || 'General'}
          </span>
          <div className="flex items-center gap-1">
            {onEdit && (
              <button onClick={() => onEdit(goal)} className="p-1 text-slate-400 hover:text-cyan-300">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(goal)} className="p-1 text-slate-400 hover:text-rose-400">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <h3 className="text-base font-bold text-white tracking-wide">{goal.title}</h3>
        {goal.description && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{goal.description}</p>
        )}
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-400">Progress</span>
          <span className="text-cyan-400 font-bold">{goal.progress}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm shadow-cyan-400/50"
            style={{ width: `${Math.min(100, Math.max(0, goal.progress))}%` }}
          />
        </div>

        <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
          {goal.targetDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>Target: {formatTargetDate(goal.targetDate)}</span>
            </div>
          )}
          {onUpdateProgress && (
            <button
              onClick={() => onUpdateProgress(goal)}
              className="ml-auto text-xs text-cyan-400 font-semibold hover:underline"
            >
              Update Progress
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
