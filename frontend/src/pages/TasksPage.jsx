import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, CheckSquare, Calendar, Tag, AlertCircle } from 'lucide-react';
import { TaskCard } from '../components/TaskCard';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { api } from '../services/api.service';

export function TasksPage({ openCreate, onCloseCreate }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(openCreate || false);
  const [editingTask, setEditingTask] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Study');
  const [dueDate, setDueDate] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.getTasks();
      setTasks(res.tasks || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (openCreate) {
      handleOpenCreateModal();
    }
  }, [openCreate]);

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setCategory('Study');
    setDueDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setTitle(task.title || '');
    setDescription(task.description || '');
    setPriority(task.priority || 'Medium');
    setCategory(task.category || 'Study');
    setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setIsModalOpen(true);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        const res = await api.updateTask(editingTask._id || editingTask.id, {
          title, description, priority, category, dueDate
        });
        setTasks(prev => prev.map(t => (t._id === editingTask._id || t.id === editingTask.id) ? res.task : t));
      } else {
        const res = await api.createTask({
          title, description, priority, category, dueDate
        });
        setTasks(prev => [res.task, ...prev]);
      }
      setIsModalOpen(false);
      if (onCloseCreate) onCloseCreate();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleToggleTask = async (task) => {
    try {
      const res = await api.updateTask(task._id || task.id, { completed: !task.completed });
      setTasks(prev => prev.map(t => (t._id === task._id || t.id === task.id) ? res.task : t));
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDeleteTask = async (task) => {
    try {
      await api.deleteTask(task._id || task.id);
      setTasks(prev => prev.filter(t => (t._id !== task._id && t.id !== task.id)));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  // Filtering
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                          (t.description && t.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchesStatus = statusFilter === 'All' || 
                          (statusFilter === 'Completed' && t.completed) || 
                          (statusFilter === 'Pending' && !t.completed);
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-cyan-400" />
            <span>Task Management</span>
          </h2>
          <p className="text-xs text-slate-400">Organize, prioritize, and check off your daily workload</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Controls Bar: Search & Filters */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="glass-input w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="glass-input px-3 py-2 rounded-xl text-xs font-medium bg-slate-900"
          >
            <option value="All">All Categories</option>
            <option value="Study">Study</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Health">Health</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="glass-input px-3 py-2 rounded-xl text-xs font-medium bg-slate-900"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass-input px-3 py-2 rounded-xl text-xs font-medium bg-slate-900"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <LoadingState message="Fetching tasks..." />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          title="No tasks match your criteria"
          description="Try adjusting filters or add a new task."
          actionLabel="Create Task"
          onAction={handleOpenCreateModal}
        />
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <TaskCard
              key={task._id || task.id}
              task={task}
              onToggleComplete={handleToggleTask}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (onCloseCreate) onCloseCreate();
        }}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        <form onSubmit={handleSaveTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Task Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete Operating Systems Notes"
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key instructions or links..."
              className="glass-input w-full px-3.5 py-2 rounded-xl text-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="glass-input w-full px-3 py-2 rounded-xl text-xs font-medium bg-slate-900"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="glass-input w-full px-3 py-2 rounded-xl text-xs font-medium bg-slate-900"
              >
                <option value="Study">Study</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
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
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-md"
            >
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
