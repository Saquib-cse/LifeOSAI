import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Sparkles, Clock, Calendar, CheckCircle2, Zap, RefreshCw } from 'lucide-react';
import { api } from '../services/api.service';

export function DailyPlanModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [planData, setPlanData] = useState(null);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const data = await api.aiPlanDay();
      setPlanData(data);
    } catch (error) {
      console.error('Failed to generate daily plan:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPlan();
    }
  }, [isOpen]);

  const typeStyles = {
    'deep-work': 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300',
    'break': 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
    'routine': 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300',
    'task': 'border-purple-500/50 bg-purple-500/10 text-purple-300',
    'focus': 'border-amber-500/50 bg-amber-500/10 text-amber-300',
    'habit': 'border-rose-500/50 bg-rose-500/10 text-rose-300',
    'review': 'border-slate-500/50 bg-slate-500/10 text-slate-300'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Executive Daily Schedule">
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-cyan-400 animate-spin" />
          <p className="text-sm font-semibold text-gradient-cyan animate-pulse">
            Analyzing priorities, deadlines & focus sessions...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300 font-medium">Engine:</span>
              <span className="text-cyan-300 font-semibold">{planData?.source === 'openrouter' ? 'OpenRouter AI' : 'Deterministic Local Engine'}</span>
            </div>
            <button
              onClick={fetchPlan}
              className="flex items-center gap-1 text-cyan-400 font-semibold hover:underline"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Regenerate</span>
            </button>
          </div>

          {planData?.plan ? (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
              {planData.plan}
            </div>
          ) : planData?.timeline ? (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {planData.timeline.map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${typeStyles[item.type] || typeStyles.task}`}
                >
                  <div className="shrink-0 flex items-center gap-1 font-bold text-xs mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.time}</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-white">{item.title}</h5>
                    <p className="text-xs text-slate-300 mt-0.5">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">Could not generate schedule. Please try again.</p>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-medium text-xs shadow-md"
            >
              Got it, let's execute!
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
