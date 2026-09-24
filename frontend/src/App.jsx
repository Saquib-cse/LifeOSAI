import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoadingState } from './components/LoadingState';
import { DailyPlanModal } from './components/DailyPlanModal';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { GoalsPage } from './pages/GoalsPage';
import { HabitsPage } from './pages/HabitsPage';
import { FocusPage } from './pages/FocusPage';
import { AssistantPage } from './pages/AssistantPage';
import { CalendarPage } from './pages/CalendarPage';
import { JournalPage } from './pages/JournalPage';
import { AnalyticsPage } from './pages/AnalyticsPage';

function AppContent() {
  const { isAuthenticated, loading, enterDemoMode } = useAuth();
  const [authView, setAuthView] = useState('landing'); // 'landing' | 'login' | 'register'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Quick Action Modal states
  const [isPlanDayOpen, setIsPlanDayOpen] = useState(false);
  const [openCreateTaskTrigger, setOpenCreateTaskTrigger] = useState(false);
  const [openCreateGoalTrigger, setOpenCreateGoalTrigger] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
        <LoadingState message="Connecting to LifeOS Executive Intelligence..." />
      </div>
    );
  }

  // Unauthenticated / Landing Flow
  if (!isAuthenticated) {
    if (authView === 'login') {
      return <LoginPage onSwitchRegister={() => setAuthView('register')} />;
    }
    if (authView === 'register') {
      return <RegisterPage onSwitchLogin={() => setAuthView('login')} />;
    }
    return (
      <LandingPage
        onGetStarted={() => setAuthView('register')}
        onExploreDemo={enterDemoMode}
      />
    );
  }

  // Authenticated Main Workspace Layout
  return (
    <div className="min-h-screen bg-[#080c14] text-white flex">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Header */}
        <Header
          setMobileOpen={setMobileOpen}
          onOpenPlanDay={() => setIsPlanDayOpen(true)}
        />

        {/* Page Views Container */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardPage
              setActiveTab={setActiveTab}
              onOpenCreateTask={() => {
                setActiveTab('tasks');
                setOpenCreateTaskTrigger(true);
              }}
              onOpenCreateGoal={() => {
                setActiveTab('goals');
                setOpenCreateGoalTrigger(true);
              }}
              onOpenPlanDay={() => setIsPlanDayOpen(true)}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksPage
              openCreate={openCreateTaskTrigger}
              onCloseCreate={() => setOpenCreateTaskTrigger(false)}
            />
          )}

          {activeTab === 'goals' && (
            <GoalsPage
              openCreate={openCreateGoalTrigger}
              onCloseCreate={() => setOpenCreateGoalTrigger(false)}
            />
          )}

          {activeTab === 'habits' && <HabitsPage />}
          {activeTab === 'focus' && <FocusPage />}
          {activeTab === 'assistant' && <AssistantPage />}
          {activeTab === 'calendar' && <CalendarPage />}
          {activeTab === 'journal' && <JournalPage />}
          {activeTab === 'analytics' && <AnalyticsPage />}
        </main>
      </div>

      {/* AI Daily Planner Modal */}
      <DailyPlanModal
        isOpen={isPlanDayOpen}
        onClose={() => setIsPlanDayOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
