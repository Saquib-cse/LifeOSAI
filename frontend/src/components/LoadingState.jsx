import React from 'react';

export function LoadingState({ message = 'Loading workspace data...' }) {
  return (
    <div className="py-16 flex flex-col items-center justify-center space-y-3">
      <div className="w-10 h-10 rounded-full border-4 border-indigo-500/20 border-t-cyan-400 animate-spin" />
      <span className="text-xs font-semibold text-slate-400 tracking-wide">{message}</span>
    </div>
  );
}
