import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, User, Sparkles, RefreshCw, CornerDownLeft, ShieldCheck } from 'lucide-react';
import { api } from '../services/api.service';

export function AssistantPage() {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello Mohammed! I am LifeOS AI, your personal executive assistant. I have synchronized with your active tasks, goals, and habits. How can I help optimize your productivity today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "I have an assignment due tomorrow. Help me plan tonight.",
    "Which tasks should I prioritize right now?",
    "Create a study schedule for tonight.",
    "How am I doing this week?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const promptText = textToSend || input;
    if (!promptText.trim()) return;

    const userMsg = { sender: 'user', text: promptText };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.aiChat(promptText);
      const aiMsg = { sender: 'ai', text: res.response, source: res.source };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: "I experienced a temporary glitch, but here is my executive recommendation: Focus on your top pending assignment first before working on lower priority items."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col glass-panel rounded-3xl overflow-hidden border border-slate-800">
      {/* Header */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-pink-500 p-0.5 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <span>LifeOS Executive Intelligence</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[11px] text-slate-400">Context-Aware AI Assistant</p>
          </div>
        </div>

        <button
          onClick={() => setMessages([{ sender: 'ai', text: "Chat history cleared. How can I help you next?" }])}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
            )}

            <div className={`
              max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap shadow-md
              ${msg.sender === 'user' 
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-tr-none' 
                : 'glass-panel bg-slate-900/90 text-slate-200 border border-slate-700/80 rounded-tl-none'}
            `}>
              {msg.text}
              {msg.source && (
                <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Powered by {msg.source === 'openrouter' ? 'OpenRouter API' : 'Local Context Engine'}</span>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-indigo-600 p-0.5 shrink-0 flex items-center justify-center font-bold text-xs text-white">
                MO
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-4 h-4 text-cyan-400 animate-spin" />
              </div>
            </div>
            <div className="glass-panel p-4 rounded-2xl rounded-tl-none text-xs text-cyan-300 font-semibold animate-pulse">
              Synthesizing task context & schedule...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 bg-slate-900/40 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Suggested:</span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-[11px] font-medium text-slate-300 whitespace-nowrap border border-slate-700 transition-all shrink-0"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-slate-900/90 border-t border-slate-800/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask LifeOS AI anything about your schedule, goals, or tasks..."
            className="glass-input flex-1 px-4 py-3 rounded-2xl text-xs font-medium"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg disabled:opacity-50 transition-all flex items-center gap-1.5"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
