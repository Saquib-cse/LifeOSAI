import React from 'react';
import { Check, Calendar, Edit3, Trash2, Tag, AlertCircle } from 'lucide-react';

export function TaskCard({ task, onToggleComplete, onEdit, onDelete }) {
  const priorityColors = {
    High: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    Medium: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    Low: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
  };

  const categoryColors = {
    Study: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    Work: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    Personal: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    Health: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    Other: 'bg-slate-500/15 text-slate-300 border-slate-500/30'
  };

  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return 'Due Today';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const dueFormatted = formatDueDate(task.dueDate);

  return (
    <div className={`
      glass-panel glass-panel-hover p-4 rounded-xl flex items-center justify-between gap-4 transition-all
      ${task.completed ? 'opacity-60 bg-slate-900/40' : ''}
    `}>
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        {/* Custom Glowing Checkbox */}
        <button
          onClick={() => onToggleComplete(task)}
          className={`
            w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 border
            ${task.completed 
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30' 
              : 'border-slate-600 bg-slate-800/80 hover:border-cyan-400'}
          `}
        >
          {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
        </button>

        {/* Title, Description & Tags */}
        <div className="min-w-0 flex-1">
          <h4 className={`text-sm font-semibold text-white truncate ${task.completed ? 'line-through text-slate-400' : ''}`}>
            {task.title}
          </h4>
          {task.description && (
            <p className="text-xs text-slate-400 truncate mt-0.5">{task.description}</p>
          )}

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {/* Priority Badge */}
            <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${priorityColors[task.priority] || priorityColors.Medium}`}>
              {task.priority}
            </span>

            {/* Category Tag */}
            <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${categoryColors[task.category] || categoryColors.Other}`}>
              {task.category}
            </span>

            {/* Due Date */}
            {dueFormatted && (
              <span className={`flex items-center gap-1 text-[10px] font-medium ${dueFormatted === 'Due Today' ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}>
                <Calendar className="w-3 h-3" />
                {dueFormatted}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 shrink-0">
        {onEdit && (
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
            title="Edit Task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
