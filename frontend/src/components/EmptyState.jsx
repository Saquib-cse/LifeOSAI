import React from 'react';
import { Inbox } from 'lucide-react';

export function EmptyState({ title = 'No items found', description = 'Get started by creating your first entry.', actionLabel, onAction }) {
  return (
    <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
        <Inbox className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-white">{title}</h4>
      <p className="text-xs text-slate-400 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-medium text-xs shadow-md hover:scale-[1.02] transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
