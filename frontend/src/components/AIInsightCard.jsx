import React from 'react';
import { Sparkles, TrendingUp, Lightbulb, CheckCircle2 } from 'lucide-react';

export function AIInsightCard({ title, text, type = 'tip', onAction }) {
  const typeIcons = {
    tip: Lightbulb,
    metric: TrendingUp,
    positive: CheckCircle2
  };

  const Icon = typeIcons[type] || Sparkles;

  return (
    <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-indigo-500 relative overflow-hidden bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-slate-900/40">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 border border-indigo-400/30 text-indigo-300 shrink-0">
          <Icon className="w-5 h-5 text-cyan-300" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gradient-cyan">AI Executive Insight</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          </div>
          {title && <h4 className="text-sm font-semibold text-white mt-1">{title}</h4>}
          <p className="text-xs text-slate-300 leading-relaxed mt-1 font-medium">{text}</p>
        </div>
      </div>
    </div>
  );
}
