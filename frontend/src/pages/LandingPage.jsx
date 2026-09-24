import React from 'react';
import { Bot, Sparkles, CheckSquare, Target, Flame, Timer, BarChart3, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export function LandingPage({ onGetStarted, onExploreDemo }) {
  const features = [
    {
      icon: Sparkles,
      title: 'AI Life Assistant',
      desc: 'ChatGPT-style executive intelligence that contextually analyzes your workload, deadlines, and schedule.',
      color: 'from-cyan-500 to-indigo-500'
    },
    {
      icon: CheckSquare,
      title: 'Smart Task System',
      desc: 'Organize priorities, categories, and due dates with instant AI daily planner schedule generation.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Target,
      title: 'Goal Tracking',
      desc: 'Break ambitious targets into visual progress percentages and target deadline milestones.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Flame,
      title: 'Habit Streaks',
      desc: 'Build consistent routines with GitHub-style visual activity logs and streak counters.',
      color: 'from-amber-500 to-rose-500'
    },
    {
      icon: Timer,
      title: 'Focus Pomodoro',
      desc: 'Integrated timer linked to specific tasks to measure and track deep work productivity hours.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: BarChart3,
      title: 'Personal Analytics',
      desc: 'Data-driven Recharts visualizations with AI synthesized dynamic productivity patterns.',
      color: 'from-blue-500 to-cyan-500'
    }
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-white overflow-hidden relative">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/20 via-cyan-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-gradient-to-br from-pink-600/10 via-purple-600/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <span className="font-extrabold text-xl tracking-wider text-gradient">LIFEOS AI</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onExploreDemo}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all"
          >
            Explore Demo
          </button>
          <button
            onClick={onGetStarted}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-500/25 transition-all"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-semibold text-cyan-300 mb-6 shadow-inner">
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>AI-Powered Personal Operating System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Elevate Your Life with <br />
            <span className="text-gradient">LIFEOS AI</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Plan your day, manage your goals, build better habits, and use AI to understand how you work.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/30 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-sm hover:border-cyan-400/50 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Instant Demo Mode</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Designed for Peak Human Performance
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Everything you need for academic, career, and personal balance in one seamless OS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-panel glass-panel-hover p-6 rounded-2xl"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} p-0.5 mb-4 shadow-md`}>
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white">{feat.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500 relative z-10">
        <p>© 2026 LifeOS AI — College Mini Project Presentation. Built with React & Express.</p>
      </footer>
    </div>
  );
}
