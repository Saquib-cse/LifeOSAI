import React from 'react';
import { Menu, Sparkles, User, ShieldAlert, Cpu } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function Header({ setMobileOpen, onOpenPlanDay }) {
  const { user, isDemoMode } = useAuth();

  // Dynamic greeting based on hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Formatted date string
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-4 flex items-center justify-between">
      {/* Left: Mobile Menu Toggle & Greeting */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(prev => !prev)}
          className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg lg:text-xl font-bold text-white flex items-center gap-2">
            {getGreeting()}, <span className="text-gradient-cyan">{user?.name || 'Mohammed'}</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium">{formattedDate}</p>
        </div>
      </div>

      {/* Right: AI Status Indicator & Quick Plan Day Button & Profile */}
      <div className="flex items-center gap-3">
        {/* AI Status Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/70 border border-slate-700/60 text-xs">
          <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-slate-300 font-medium">AI Engine:</span>
          <span className="text-cyan-400 font-semibold">Active</span>
        </div>

        {/* Demo Mode Badge */}
        {isDemoMode && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 font-medium">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Demo Mode</span>
          </div>
        )}

        {/* Plan My Day Action */}
        <button
          onClick={onOpenPlanDay}
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-medium text-xs shadow-md hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>Plan My Day</span>
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 shadow-md">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-bold text-xs text-white">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'MO'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
