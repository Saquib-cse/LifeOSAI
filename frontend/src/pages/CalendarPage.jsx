import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Clock, Tag, Trash2 } from 'lucide-react';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { api } from '../services/api.service';

export function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [category, setCategory] = useState('Study');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.getEvents();
      setEvents(res.events || []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createEvent({ title, date, startTime, endTime, category });
      setEvents(prev => [...prev, res.event]);
      setIsModalOpen(false);
      setTitle('');
    } catch (err) {
      console.error('Failed to create event:', err);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await api.deleteEvent(id);
      setEvents(prev => prev.filter(e => (e._id !== id && e.id !== id)));
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  const categoryStyles = {
    Study: 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300',
    Work: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300',
    Personal: 'border-purple-500/50 bg-purple-500/10 text-purple-300',
    Health: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
    General: 'border-slate-500/50 bg-slate-500/10 text-slate-300'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-cyan-400" />
            <span>Calendar & Schedule</span>
          </h2>
          <p className="text-xs text-slate-400">Map out your time blocks, lectures, and project syncs</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 text-white font-bold text-xs shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>

      {/* Events Timeline List */}
      {loading ? (
        <LoadingState message="Loading schedule..." />
      ) : events.length === 0 ? (
        <EmptyState
          title="No upcoming events scheduled"
          description="Add your classes, meetings, or study blocks."
          actionLabel="Add Event"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {events.map(event => (
            <div
              key={event._id || event.id}
              className={`p-4 rounded-2xl border flex items-center justify-between gap-4 glass-panel glass-panel-hover ${categoryStyles[event.category] || categoryStyles.General}`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center shrink-0">
                  <span className="block text-[10px] font-bold uppercase text-slate-400">
                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="block text-sm font-bold text-white">
                    {new Date(event.date).getDate()}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{event.title}</h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-300">
                    <span className="flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {event.startTime} - {event.endTime}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900 border border-slate-800">
                      {event.category}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDeleteEvent(event._id || event.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule New Event"
      >
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Event Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Operating Systems Lecture & Lab"
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="glass-input w-full px-3 py-2 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Start Time</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="glass-input w-full px-3 py-2 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">End Time</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="glass-input w-full px-3 py-2 rounded-xl text-xs font-medium"
              />
            </div>
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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-md"
            >
              Save Event
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
