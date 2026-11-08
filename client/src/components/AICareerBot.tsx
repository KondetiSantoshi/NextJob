import React, { useState, useRef, useEffect } from 'react';
import api from '../api/client';
import { Job } from '../types';
import { ApplyModal } from './ApplyModal';
import { getSpecificJobApplyUrl } from '../utils/jobRedirect';
import {
  Bot,
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  Trash2,
  Briefcase,
  Building,
  IndianRupee,
  MapPin,
  Zap,
  ExternalLink,
  ChevronRight,
  RotateCw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  jobs?: Job[];
  timestamp: string;
}

const QUICK_PROMPTS = [
  '⚡ Find Easy Apply jobs for SDE',
  '🏢 Openings at TCS & Infosys',
  '💰 Show jobs paying ₹30L+ CTC',
  '🎯 Amazon SDE interview questions',
  '📄 How can I optimize my resume for Google?',
];

export const AICareerBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Hello! I am **NexAI**, your personal Career & Job Copilot on NexJob.

I can help you:
- ⚡ **Find & Easy Apply to Jobs:** Ask for React, Python, Remote, or Fresher roles.
- 🏢 **Explore Career Portals:** Instant openings from TCS, Infosys, Swiggy, Flipkart, or Google India.
- 🎯 **Interview Preparation:** Technical questions, system design, and HR tips.
- 💰 **Salary Insights:** Learn authentic Indian CTC benchmarks.

*What would you like to search or prepare for today?*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        message: textToSend.trim(),
      });

      if (res.data.success) {
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: res.data.reply,
          jobs: res.data.jobs || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: 'Sorry, I encountered an issue connecting to the career database. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: 'Chat cleared! How else can I assist your job search or career growth today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* FLOATING BOT LAUNCHER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 p-3 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-2xl shadow-indigo-600/40 hover:scale-105 transition-all duration-300"
          title="Open NexAI Career Copilot"
        >
          <div className="relative">
            <span className="w-3 h-3 rounded-full bg-emerald-400 absolute -top-1 -right-1 border-2 border-indigo-700 animate-ping"></span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-black tracking-wide leading-tight flex items-center gap-1.5">
              <span>NexAI Copilot</span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-white/20 text-white">
                AI
              </span>
            </span>
            <span className="text-[10px] text-indigo-200 font-medium">Job Search & Interview Bot</span>
          </div>
        </button>
      )}

      {/* CHAT WINDOW DIALOG */}
      {isOpen && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] h-[580px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-extrabold text-white">NexAI Career Copilot</h3>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    Smart AI
                  </span>
                </div>
                <p className="text-[11px] text-indigo-200 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Online • Ready to find jobs & prep interviews</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition"
                title="Clear conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="p-4 overflow-y-auto space-y-4 flex-1 bg-slate-50/60 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200/90 text-slate-800 shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* EMBEDDED RECOMMENDED JOBS WITH DIRECT EASY APPLY */}
                  {msg.jobs && msg.jobs.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-100">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        ⚡ Recommended Job Openings:
                      </p>
                      {msg.jobs.map((job) => (
                        <div
                          key={job._id}
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-400 transition flex flex-col gap-1.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h5 className="font-extrabold text-slate-900 truncate">{job.title}</h5>
                              <p className="text-[11px] text-slate-600 font-semibold flex items-center gap-1 mt-0.5">
                                <Building className="w-3 h-3 text-slate-400" />
                                <span className="truncate">{job.companyName}</span>
                              </p>
                            </div>
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                              {job.salaryRange || 'Competitive CTC'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-200/70 text-[11px]">
                            <span className="text-slate-500 truncate flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {job.location}
                            </span>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <a
                                href={getSpecificJobApplyUrl(job)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-xs transition"
                                title={`Apply on ${job.companyName} official site`}
                              >
                                <span>Apply ↗</span>
                              </a>
                              <button
                                onClick={() => setSelectedJobForApply(job)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-[11px] flex items-center gap-1 transition"
                              >
                                <Zap className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                                <span>Easy</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <span
                    className={`block text-[10px] mt-1.5 font-medium ${
                      msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs flex items-center gap-1.5 text-slate-500">
                  <RotateCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  <span>Thinking & scanning active career portals...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-slate-100/90 border-t border-slate-200 overflow-x-auto flex items-center gap-1.5 shrink-0 no-scrollbar">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 whitespace-nowrap transition shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Ask NexAI anything about jobs, salaries, interviews..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-xs font-semibold text-slate-900 placeholder-slate-400"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition shadow-sm"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Easy Apply Modal inside Chat */}
      {selectedJobForApply && (
        <ApplyModal
          job={selectedJobForApply}
          isOpen={Boolean(selectedJobForApply)}
          onClose={() => setSelectedJobForApply(null)}
          onSuccess={() => {
            setSelectedJobForApply(null);
          }}
        />
      )}
    </>
  );
};
