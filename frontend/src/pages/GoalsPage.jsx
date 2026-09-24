import React, { useState, useEffect } from 'react';
import { Target, Plus, Calendar, Edit3, Trash2, CheckCircle } from 'lucide-react';
import { GoalCard } from '../components/GoalCard';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { api } from '../services/api.service';

export function GoalsPage({ openCreate, onCloseCreate }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(openCreate || false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [progressModalGoal, setProgressModalGoal] = useState(null);
  const [newProgress, setNewProgress] = useState(0);

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Academic');
  const [targetDate, setTargetDate] = useState('');
  const [progress, setProgress] = useState(0);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await api.getGoals();
      setGoals(res.goals || []);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    if (openCreate) {
      handleOpenCreateModal();
    }
  }, [openCreate]);

  const handleOpenCreateModal = () => {
    setEditingGoal(null);
    setTitle('');
    setDescription('');
    setCategory('Academic');
    setTargetDate(new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]);
    setProgress(0);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (goal) => {
    setEditingGoal(goal);
    setTitle(goal.title || '');
    setDescription(goal.description || '');
    setCategory(goal.category || 'Academic');
    setTargetDate(goal.targetDate ? new Date(goal.targetDate).toISOString().split('T')[0] : '');
    setProgress(goal.progress || 0);
    setIsModalOpen(true);
  };

  const handleSaveGoal = async (e) => {
    e.preventDefault();
    try {
      if (editingGoal) {
        const res = await api.updateGoal(editingGoal._id || editingGoal.id, {
          title, description, category, targetDate, progress
        });
        setGoals(prev => prev.map(g => (g._id === editingGoal._id || g.id === editingGoal.id) ? res.goal : g));
      } else {
        const res = await api.createGoal({
          title, description, category, targetDate, progress
        });
        setGoals(prev => [res.goal, ...prev]);
      }
      setIsModalOpen(false);
      if (onCloseCreate) onCloseCreate();
    } catch (error) {
      console.error('Failed to save goal:', error);
    }
  };

  const handleOpenProgressModal = (goal) => {
    setProgressModalGoal(goal);
    setNewProgress(goal.progress || 0);
  };

  const handleSaveProgress = async () => {
    if (!progressModalGoal) return;
    try {
      const res = await api.updateGoal(progressModalGoal._id || progressModalGoal.id, {
        progress: Number(newProgress)
      });
      setGoals(prev => prev.map(g => (g._id === progressModalGoal._id || g.id === progressModalGoal.id) ? res.goal : g));
      setProgressModalGoal(null);
    } catch (error) {
      console.error('Failed to update goal progress:', error);
    }
  };

  const handleDeleteGoal = async (goal) => {
    try {
      await api.deleteGoal(goal._id || goal.id);
      setGoals(prev => prev.filter(g => (g._id !== goal._id && g.id !== goal.id)));
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            <span>Goal Tracker</span>
          </h2>
          <p className="text-xs text-slate-400">Track long-term academic, career, and skill milestones</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 text-white font-bold text-xs shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goal Cards Grid */}
      {loading ? (
        <LoadingState message="Loading goals..." />
      ) : goals.length === 0 ? (
        <EmptyState
          title="No active goals found"
          description="Define your top objectives to measure progress."
          actionLabel="Create First Goal"
          onAction={handleOpenCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map(goal => (
            <GoalCard
              key={goal._id || goal.id}
              goal={goal}
              onUpdateProgress={handleOpenProgressModal}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteGoal}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Goal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (onCloseCreate) onCloseCreate();
        }}
        title={editingGoal ? 'Edit Goal' : 'Create New Goal'}
      >
        <form onSubmit={handleSaveGoal} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Goal Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Learn Python & Machine Learning"
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key milestones or deliverables..."
              className="glass-input w-full px-3.5 py-2 rounded-xl text-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="glass-input w-full px-3 py-2 rounded-xl text-xs font-medium bg-slate-900"
              >
                <option value="Academic">Academic</option>
                <option value="Skill">Skill</option>
                <option value="Career">Career</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Target Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="glass-input w-full px-3 py-2 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Initial Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                className="glass-input w-full px-3 py-2 rounded-xl text-xs font-medium"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                if (onCloseCreate) onCloseCreate();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md"
            >
              {editingGoal ? 'Save Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Quick Progress Slider Modal */}
      <Modal
        isOpen={!!progressModalGoal}
        onClose={() => setProgressModalGoal(null)}
        title="Update Goal Progress"
      >
        {progressModalGoal && (
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-sm text-white">{progressModalGoal.title}</h4>
              <p className="text-xs text-slate-400">Drag slider to adjust completion percentage</p>
            </div>

            <div className="space-y-2 py-2">
              <div className="flex items-center justify-between font-bold text-sm">
                <span className="text-slate-400">Current Progress</span>
                <span className="text-cyan-400">{newProgress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={newProgress}
                onChange={(e) => setNewProgress(e.target.value)}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setProgressModalGoal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProgress}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-md"
              >
                Save Progress
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
