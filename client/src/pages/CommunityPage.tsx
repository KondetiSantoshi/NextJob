import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/client';
import { CommunityTopic, CommunityAnswer } from '../types';
import {
  MessageSquare,
  ThumbsUp,
  Search,
  Plus,
  X,
  CheckCircle2,
  Tag,
  ArrowRight,
  TrendingUp,
  Filter,
  Eye,
  Users,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

const COMMUNITY_CATEGORIES = [
  'All',
  'Job Discussions',
  'Interview Experiences',
  'Career Advice',
  'Technical Discussions',
  'Fresher Job Updates',
  'Walk-in Interview Updates',
  'Government Job Updates',
  'Work-from-Home Opportunities',
];

export const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [topics, setTopics] = useState<CommunityTopic[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // New question modal
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Interview Experiences');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  const [isSubmittingTopic, setIsSubmittingTopic] = useState(false);

  // Thread detail modal
  const [selectedTopic, setSelectedTopic] = useState<CommunityTopic | null>(null);
  const [answers, setAnswers] = useState<CommunityAnswer[]>([]);
  const [answerContent, setAnswerContent] = useState('');
  const [isPostingAnswer, setIsPostingAnswer] = useState(false);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (searchQuery.trim()) params.append('q', searchQuery.trim());

      const res = await api.get(`/community/topics?${params.toString()}`);
      if (res.data.success) {
        setTopics(res.data.topics);
      }
    } catch (err) {
      console.error('Failed to load community topics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTopics();
  };

  const handleToggleUpvoteTopic = async (topicId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      error('Please sign in to upvote discussions');
      return;
    }

    try {
      const res = await api.post(`/community/topics/${topicId}/upvote`);
      if (res.data.success) {
        setTopics((prev) =>
          prev.map((t) =>
            t._id === topicId
              ? {
                  ...t,
                  isUpvoted: res.data.isUpvoted,
                  upvotes: res.data.isUpvoted
                    ? [...t.upvotes, user._id]
                    : t.upvotes.filter((id) => id !== user._id),
                }
              : t
          )
        );
      }
    } catch (err) {
      error('Failed to upvote topic');
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      error('Please log in to ask a question');
      return;
    }

    try {
      setIsSubmittingTopic(true);
      const res = await api.post('/community/topics', {
        title: newTitle,
        category: newCategory,
        content: newContent,
        tags: newTags,
      });

      if (res.data.success) {
        success('Question posted to community!');
        setTopics([res.data.topic, ...topics]);
        setQuestionModalOpen(false);
        setNewTitle('');
        setNewContent('');
        setNewTags('');
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to post topic');
    } finally {
      setIsSubmittingTopic(false);
    }
  };

  const openThread = async (topic: CommunityTopic) => {
    try {
      const res = await api.get(`/community/topics/${topic._id}`);
      if (res.data.success) {
        setSelectedTopic(res.data.topic);
        setAnswers(res.data.answers || []);
      }
    } catch (err) {
      error('Failed to load discussion answers');
    }
  };

  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      error('Please sign in to answer');
      return;
    }
    if (!selectedTopic || !answerContent.trim()) return;

    try {
      setIsPostingAnswer(true);
      const res = await api.post(`/community/topics/${selectedTopic._id}/answers`, {
        content: answerContent,
      });

      if (res.data.success) {
        success('Your answer has been published!');
        setAnswers([...answers, res.data.answer]);
        setAnswerContent('');
        fetchTopics();
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to post answer');
    } finally {
      setIsPostingAnswer(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white via-indigo-50/40 to-slate-50 border border-indigo-100 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-2xl relative z-10 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                CareerPulse Community
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                50,000+ Active Members
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                100% Peer Verified
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              India's Career & Interview Discussion Circles
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              Connect with fellow job seekers and working professionals across 1,000+ Indian companies. Share real interview loops, negotiate CTC, discuss walk-in drives, and get fast answers.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 pt-1">
              <span>🔥 <strong>12,400+</strong> Discussions</span>
              <span>•</span>
              <span>🏢 <strong>1,000+</strong> Company Circles</span>
              <span>•</span>
              <span>⚡ <strong>Average reply:</strong> 8 mins</span>
            </div>
          </div>

          <button
            onClick={() => setQuestionModalOpen(true)}
            className="relative z-10 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition shrink-0 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Start a Discussion / Ask</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl">
              <Search className="w-5 h-5 text-indigo-600 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics by keyword (e.g. Razorpay interview, counter-offer, remote)..."
                className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-2xl text-xs font-bold hover:bg-indigo-700 transition"
            >
              Search
            </button>
          </form>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {COMMUNITY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Topics List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-slate-200 animate-pulse rounded-3xl"></div>
            ))}
          </div>
        ) : topics.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-sm">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No discussions found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Be the first to start a conversation in this category!
            </p>
            <button
              onClick={() => setQuestionModalOpen(true)}
              className="mt-4 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              Ask First Question
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {topics.map((t) => (
              <div
                key={t._id}
                onClick={() => openThread(t)}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:border-indigo-300 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row sm:items-start justify-between gap-5"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700">
                      {t.category}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">
                      Posted by <strong>{t.author?.name}</strong> •{' '}
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 hover:text-indigo-600 transition">
                    {t.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {t.content}
                  </p>

                  {/* Tags */}
                  {t.tags && t.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {t.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Upvotes & Answers Badge */}
                <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0">
                  <button
                    onClick={(e) => handleToggleUpvoteTopic(t._id, e)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
                      t.isUpvoted
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                        : 'border-slate-200 text-slate-600 hover:border-indigo-300'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${t.isUpvoted ? 'fill-indigo-600' : ''}`} />
                    <span>{t.upvotes?.length || 0}</span>
                  </button>

                  <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{t.answersCount || 0} Answers</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ASK QUESTION MODAL */}
      {questionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setQuestionModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-2">Start a Community Discussion</h3>
            <p className="text-xs text-slate-500 mb-5">
              Ask about interview preparation, offer comparison, or career growth advice.
            </p>

            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {COMMUNITY_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Topic Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. How to prepare for machine coding round at Google?"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Discussion Content / Details *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Provide context, specific questions, or interview background..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. google, machinecoding, react"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setQuestionModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTopic}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSubmittingTopic ? 'Publishing...' : 'Publish Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* THREAD ANSWERS MODAL */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedTopic(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Topic Main Details */}
            <div className="border-b border-slate-100 pb-5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700">
                {selectedTopic.category}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-2">{selectedTopic.title}</h2>
              <p className="text-xs text-slate-500 mt-1">
                Asked by <strong>{selectedTopic.author?.name}</strong> •{' '}
                {new Date(selectedTopic.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-slate-700 mt-4 leading-relaxed whitespace-pre-line">
                {selectedTopic.content}
              </p>
            </div>

            {/* Answers Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900">
                Community Answers ({answers.length})
              </h4>

              {answers.length === 0 ? (
                <p className="text-xs text-slate-400 py-3">
                  No replies yet. Be the first to share your perspective!
                </p>
              ) : (
                <div className="space-y-3">
                  {answers.map((ans) => (
                    <div
                      key={ans._id}
                      className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-2 ${
                        ans.isAccepted
                          ? 'border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-300'
                          : 'border-slate-100 bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-slate-900">
                          <img
                            src={
                              ans.author?.avatar ||
                              `https://api.dicebear.com/7.x/initials/svg?seed=${ans.author?.name}`
                            }
                            alt="Author"
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span>{ans.author?.name}</span>
                          {ans.isAccepted && (
                            <span className="flex items-center gap-1 text-emerald-700 text-xs font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Best Answer
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(ans.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                        {ans.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Post Answer Box */}
            <form onSubmit={handlePostAnswer} className="space-y-3 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Your Answer / Reply
              </label>
              <textarea
                rows={3}
                required
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="Write a clear, constructive answer..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isPostingAnswer || !answerContent.trim()}
                  className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isPostingAnswer ? 'Submitting...' : 'Post Answer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
