import React from 'react';

export function StatCard({ title, value, subtext, icon: Icon, color = 'indigo' }) {
  const colorStyles = {
    indigo: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-400',
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
    emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
    rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/30 text-rose-400'
  };

  const currentStyle = colorStyles[color] || colorStyles.indigo;

  return (
    <div className="glass-panel glass-panel-hover p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
      {/* Background Decorative Glow */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${currentStyle} blur-2xl opacity-40`} />

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 ${currentStyle.split(' ').pop()}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-2xl lg:text-3xl font-bold text-white tracking-tight">{value}</div>
        {subtext && (
          <p className="text-xs text-slate-400 mt-1 font-medium flex items-center gap-1">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}
