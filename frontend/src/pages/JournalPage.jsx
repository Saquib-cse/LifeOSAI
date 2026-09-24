import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Smile, Meh, Frown, Heart, Plus } from 'lucide-react';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { api } from '../services/api.service';

export function JournalPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form & Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('Great');

  // AI Reflection Modal & State
  const [reflection, setReflection] = useState(null);
  const [reflectionLoading, setReflectionLoading] = useState(false);
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);

  const moodIcons = {
    Great: { icon: Smile, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    Good: { icon: Heart, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    Okay: { icon: Meh, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    Low: { icon: Frown, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' }
  };

  const fetchJournal = async () => {
    try {
      setLoading(true);
      const res = await api.getJournalEntries();
      setEntries(res.entries || []);
    } catch (err) {
      console.error('Failed to fetch journal entries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournal();
  }, []);

  const handleCreateEntry = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createJournalEntry({ content, mood });
      setEntries(prev => [res.entry, ...prev]);
      setIsModalOpen(false);
      setContent('');
      setMood('Great');
    } catch (err) {
      console.error('Failed to save journal entry:', err);
    }
  };

  const handleFetchReflection = async () => {
    setReflectionLoading(true);
    setIsReflectionModalOpen(true);
    try {
      const res = await api.getJournalReflection();
      setReflection(res.reflection);
    } catch (err) {
      console.error('Failed to generate reflection:', err);
      setReflection("Unable to generate reflection at this moment.");
    } finally {
      setReflectionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span>Personal Journal & Mood</span>
          </h2>
          <p className="text-xs text-slate-400">Reflect on daily accomplishments, thoughts, and emotional energy</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFetchReflection}
            className="px-4 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-xs font-semibold text-indigo-300 shadow-md flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>AI Reflection</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 text-white font-bold text-xs shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Entry</span>
          </button>
        </div>
      </div>

      {/* Entries List */}
      {loading ? (
        <LoadingState message="Loading journal entries..." />
      ) : entries.length === 0 ? (
        <EmptyState
          title="No journal entries logged"
          description="Reflect on your day to gain AI self-awareness insights."
          actionLabel="Write First Entry"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          {entries.map(entry => {
            const moodConfig = moodIcons[entry.mood] || moodIcons.Good;
            const MoodIcon = moodConfig.icon;

            return (
              <div key={entry._id || entry.id} className="glass-panel p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${moodConfig.color}`}>
                      <MoodIcon className="w-4 h-4" />
                      <span>{entry.mood}</span>
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(entry.createdAt || Date.now()).toLocaleDateString('en-US', {
                        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {entry.content}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Write Entry Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Journal Entry"
      >
        <form onSubmit={handleCreateEntry} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">How are you feeling?</label>
            <div className="grid grid-cols-4 gap-2">
              {['Great', 'Good', 'Okay', 'Low'].map(m => {
                const conf = moodIcons[m];
                const Icon = conf.icon;
                const isSelected = mood === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className={`
                      p-3 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold transition-all
                      ${isSelected ? 'bg-indigo-600 text-white border-indigo-400 shadow-md' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{m}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Journal Entry *</label>
            <textarea
              rows={5}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What went well today? What challenges did you encounter?"
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-medium"
            />
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
              Save Entry
            </button>
          </div>
        </form>
      </Modal>

      {/* AI Reflection Summary Modal */}
      <Modal
        isOpen={isReflectionModalOpen}
        onClose={() => setIsReflectionModalOpen(false)}
        title="AI Supportive Emotional Reflection"
      >
        {reflectionLoading ? (
          <LoadingState message="Analyzing emotional momentum & key themes..." />
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-indigo-950/50 border border-indigo-500/30 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
              {reflection}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsReflectionModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
              >
                Close Reflection
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
