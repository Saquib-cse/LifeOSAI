import React, { useState, useEffect } from 'react';
import { Flame, Plus, Check, Award, TrendingUp } from 'lucide-react';
import { HabitCard } from '../components/HabitCard';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { api } from '../services/api.service';

export function HabitsPage() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  // Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Health');

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const res = await api.getHabits();
      setHabits(res.habits || []);
    } catch (error) {
      console.error('Failed to fetch habits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingHabit(null);
    setTitle('');
    setCategory('Health');
    setIsModalOpen(true);
  };

  const handleSaveHabit = async (e) => {
    e.preventDefault();
    try {
      if (editingHabit) {
        const res = await api.updateHabit(editingHabit._id || editingHabit.id, { title, category });
        setHabits(prev => prev.map(h => (h._id === editingHabit._id || h.id === editingHabit.id) ? res.habit : h));
      } else {
        const res = await api.createHabit({ title, category });
        setHabits(prev => [res.habit, ...prev]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save habit:', error);
    }
  };

  const handleToggleHabit = async (habit) => {
    try {
      const res = await api.toggleHabit(habit._id || habit.id);
      setHabits(prev => prev.map(h => (h._id === habit._id || h.id === habit.id) ? res.habit : h));
    } catch (error) {
      console.error('Failed to toggle habit:', error);
    }
  };

  const handleDeleteHabit = async (habit) => {
    try {
      await api.deleteHabit(habit._id || habit.id);
      setHabits(prev => prev.filter(h => (h._id !== habit._id && h.id !== habit.id)));
    } catch (error) {
      console.error('Failed to delete habit:', error);
    }
  };

  // Calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const doneToday = habits.filter(h => (h.history || []).includes(todayStr)).length;
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak || 0)) : 0;
  const avgCompletion = habits.length > 0 ? Math.round((doneToday / habits.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <span>Habit Tracker</span>
          </h2>
          <p className="text-xs text-slate-400">Build long-term consistency with daily visual streak tracking</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 text-white font-bold text-xs shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Habit Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-2xl flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Longest Streak</span>
            <div className="text-xl font-bold text-white">{maxStreak} Days</div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Done Today</span>
            <div className="text-xl font-bold text-white">{doneToday} of {habits.length}</div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Daily Completion</span>
            <div className="text-xl font-bold text-white">{avgCompletion}%</div>
          </div>
        </div>
      </div>

      {/* Habits Grid */}
      {loading ? (
        <LoadingState message="Loading habit logs..." />
      ) : habits.length === 0 ? (
        <EmptyState
          title="No active habits defined"
          description="Start tracking daily routines like coding, reading, or exercise."
          actionLabel="Create First Habit"
          onAction={handleOpenCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {habits.map(habit => (
            <HabitCard
              key={habit._id || habit.id}
              habit={habit}
              onToggle={handleToggleHabit}
              onEdit={(h) => {
                setEditingHabit(h);
                setTitle(h.title);
                setCategory(h.category);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteHabit}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Habit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingHabit ? 'Edit Habit' : 'Create New Habit'}
      >
        <form onSubmit={handleSaveHabit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Habit Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Study 1 Hour or Drink 3L Water"
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="glass-input w-full px-3 py-2 rounded-xl text-xs font-medium bg-slate-900"
            >
              <option value="Study">Study</option>
              <option value="Health">Health</option>
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-xs shadow-md"
            >
              {editingHabit ? 'Save Habit' : 'Create Habit'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
