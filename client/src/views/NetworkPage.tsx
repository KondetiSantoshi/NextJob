'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/client';
import { Post, ConnectionItem } from '../types';
import {
  Users,
  Image,
  Send,
  ThumbsUp,
  MessageSquare,
  Share2,
  UserPlus,
  Check,
  X,
  Sparkles,
  TrendingUp,
  Building,
} from 'lucide-react';

export const NetworkPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [posts, setPosts] = useState<Post[]>([]);
  const [connections, setConnections] = useState<ConnectionItem[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<ConnectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New post state
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState('');
  const [postTags, setPostTags] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // Active comment box
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const fetchNetworkData = async () => {
    try {
      setLoading(true);
      const [feedRes, connRes, suggRes] = await Promise.all([
        api.get('/posts'),
        api.get('/connections'),
        api.get('/connections/suggestions'),
      ]);

      if (feedRes.data.success) setPosts(feedRes.data.posts);
      if (connRes.data.success) {
        setConnections(connRes.data.connections || []);
        setPendingRequests(connRes.data.pendingReceived || []);
      }
      if (suggRes.data.success) setSuggestions(suggRes.data.suggestions || []);
    } catch (err) {
      console.error('Failed to load network feed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) {
      error('Post content cannot be empty');
      return;
    }

    try {
      setIsPosting(true);
      const res = await api.post('/posts', {
        content: postContent,
        mediaUrl: postImage,
        tags: postTags,
      });

      if (res.data.success) {
        success('Post shared to your network!');
        setPosts([res.data.post, ...posts]);
        setPostContent('');
        setPostImage('');
        setPostTags('');
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to publish post');
    } finally {
      setIsPosting(false);
    }
  };

  const handleToggleLike = async (postId: string) => {
    try {
      const res = await api.post(`/posts/${postId}/like`);
      if (res.data.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId
              ? {
                  ...p,
                  isLiked: res.data.isLiked,
                  likes: res.data.isLiked
                    ? [...p.likes, user?._id || '']
                    : p.likes.filter((id) => id !== user?._id),
                }
              : p
          )
        );
      }
    } catch (err) {
      error('Failed to toggle like');
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!commentText.trim()) return;

    try {
      const res = await api.post(`/posts/${postId}/comments`, { content: commentText });
      if (res.data.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId
              ? {
                  ...p,
                  comments: [...(p.comments || []), res.data.comment],
                  commentsCount: (p.commentsCount || 0) + 1,
                }
              : p
          )
        );
        setCommentText('');
        success('Comment posted');
      }
    } catch (err) {
      error('Failed to add comment');
    }
  };

  const handleShare = async (postId: string) => {
    try {
      const res = await api.post(`/posts/${postId}/share`);
      if (res.data.success) {
        success('Post shared with your connections!');
        setPosts((prev) =>
          prev.map((p) => (p._id === postId ? { ...p, sharesCount: res.data.sharesCount } : p))
        );
      }
    } catch (err) {
      error('Failed to share post');
    }
  };

  const handleSendConnectionRequest = async (recipientId: string) => {
    try {
      const res = await api.post(`/connections/request/${recipientId}`);
      if (res.data.success) {
        success('Connection request sent!');
        setSuggestions((prev) => prev.filter((s) => s._id !== recipientId));
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to send request');
    }
  };

  const handleRespondRequest = async (connId: string, action: 'accept' | 'reject') => {
    try {
      const res = await api.put(`/connections/${connId}/respond`, { action });
      if (res.data.success) {
        success(res.data.message);
        setPendingRequests((prev) => prev.filter((r) => r._id !== connId));
        fetchNetworkData();
      }
    } catch (err) {
      error('Failed to process request');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: User Mini Profile */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden sticky top-24">
              <div className="h-20 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
              <div className="px-5 pb-5 text-center relative -mt-10">
                <img
                  src={
                    user?.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      user?.name || 'User'
                    )}`
                  }
                  alt={user?.name}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md mx-auto"
                />
                <h3 className="font-bold text-slate-900 text-base mt-2">{user?.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                  {user?.headline || 'Professional Member'}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Connections</span>
                  <span className="font-bold text-indigo-600">{connections.length}</span>
                </div>

                <div className="mt-4">
                  <Link
                    href="/profile"
                    className="w-full py-2 rounded-xl border border-slate-200 hover:border-indigo-400 text-xs font-bold text-slate-700 block transition"
                  >
                    View Full Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN: Create Post & Feed */}
          <div className="lg:col-span-6 space-y-6">
            {/* Create Post Box */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={
                    user?.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      user?.name || 'User'
                    )}`
                  }
                  alt={user?.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <input
                  type="text"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share an insight, achievement, or engineering update..."
                  className="flex-1 bg-slate-50 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {postContent && (
                <div className="space-y-2 pt-2 border-t border-slate-100 animate-in fade-in duration-150">
                  <input
                    type="url"
                    value={postImage}
                    onChange={(e) => setPostImage(e.target.value)}
                    placeholder="Attach image URL (optional)..."
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={postTags}
                    onChange={(e) => setPostTags(e.target.value)}
                    placeholder="Tags (comma-separated, e.g. webdev, react, hiring)..."
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <button
                    type="button"
                    onClick={() => {
                      if (!postImage) setPostImage('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80');
                      else setPostImage('');
                    }}
                    className="p-2 rounded-xl hover:bg-slate-50 text-indigo-600 font-semibold flex items-center gap-1 transition"
                  >
                    <Image className="w-4 h-4" />
                    <span>Media</span>
                  </button>
                </div>

                <button
                  onClick={handleCreatePost}
                  disabled={isPosting || !postContent.trim()}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isPosting ? 'Posting...' : 'Post'}</span>
                </button>
              </div>
            </div>

            {/* Feed Posts */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-3xl"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4"
                  >
                    {/* Post Author */}
                    <div className="flex items-center gap-3">
                      <Link href={`/profile/${post.author?._id}`}>
                        <img
                          src={
                            post.author?.avatar ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                              post.author?.name || 'User'
                            )}`
                          }
                          alt={post.author?.name}
                          className="w-12 h-12 rounded-full object-cover border border-slate-200"
                        />
                      </Link>
                      <div>
                        <Link
                          href={`/profile/${post.author?._id}`}
                          className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition"
                        >
                          {post.author?.name}
                        </Link>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {post.author?.headline}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </div>

                    {/* Post Image */}
                    {post.mediaUrl && (
                      <div className="rounded-2xl overflow-hidden border border-slate-100 max-h-96">
                        <img
                          src={post.mediaUrl}
                          alt="Post media"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Post Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {post.tags.map((tag, idx) => (
                          <span key={idx} className="text-xs font-semibold text-indigo-600">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Counters */}
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                      <span>{post.likes?.length || 0} Likes</span>
                      <div className="flex items-center gap-3">
                        <span>{post.comments?.length || post.commentsCount || 0} Comments</span>
                        <span>{post.sharesCount || 0} Shares</span>
                      </div>
                    </div>

                    {/* Action Bar: Like, Comment, Share */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs font-bold text-slate-600">
                      <button
                        onClick={() => handleToggleLike(post._id)}
                        className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition hover:bg-slate-50 ${
                          post.isLiked ? 'text-indigo-600 font-extrabold' : ''
                        }`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${post.isLiked ? 'fill-indigo-600' : ''}`} />
                        <span>Like</span>
                      </button>

                      <button
                        onClick={() =>
                          setActiveCommentPostId(
                            activeCommentPostId === post._id ? null : post._id
                          )
                        }
                        className="py-2 rounded-xl flex items-center justify-center gap-1.5 transition hover:bg-slate-50 text-slate-600"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Comment</span>
                      </button>

                      <button
                        onClick={() => handleShare(post._id)}
                        className="py-2 rounded-xl flex items-center justify-center gap-1.5 transition hover:bg-slate-50 text-slate-600"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>

                    {/* Comments Drawer / Section */}
                    {activeCommentPostId === post._id && (
                      <div className="pt-3 space-y-3 animate-in fade-in duration-150">
                        {/* New comment input */}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a reply..."
                            className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                          />
                          <button
                            onClick={() => handleAddComment(post._id)}
                            className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                          >
                            Reply
                          </button>
                        </div>

                        {/* Comments list */}
                        {post.comments?.map((c) => (
                          <div key={c._id} className="bg-slate-50 p-3 rounded-2xl text-xs space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{c.author?.name}</span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(c.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-slate-600">{c.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Connection Requests & People You May Know */}
          <div className="lg:col-span-3 space-y-6">
            {/* Pending Invitations */}
            {pendingRequests.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Pending Invitations ({pendingRequests.length})
                </h4>
                {pendingRequests.map((req) => (
                  <div key={req._id} className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={req.requester?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${req.requester?.name}`}
                        alt={req.requester?.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{req.requester?.name}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {req.requester?.headline}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleRespondRequest(req._id, 'accept')}
                        className="flex-1 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-indigo-700"
                      >
                        <Check className="w-3 h-3" /> Accept
                      </button>
                      <button
                        onClick={() => handleRespondRequest(req._id, 'reject')}
                        className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* People You May Know */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Suggested Professionals
              </h4>
              <div className="space-y-3">
                {suggestions.map((p) => (
                  <div key={p._id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={p.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${p.name}`}
                        alt={p.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/profile/${p._id}`}
                          className="text-xs font-bold text-slate-900 hover:text-indigo-600 truncate block"
                        >
                          {p.name}
                        </Link>
                        <p className="text-[11px] text-slate-400 truncate">{p.headline}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSendConnectionRequest(p._id)}
                      className="p-1.5 rounded-xl border border-slate-200 text-indigo-600 hover:bg-indigo-50 transition shrink-0"
                      title="Connect"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span>Trending Conversations</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="font-semibold hover:text-indigo-600 cursor-pointer">
                  #MicroFrontends in Production
                </li>
                <li className="font-semibold hover:text-indigo-600 cursor-pointer">
                  #FintechEngineering Hiring
                </li>
                <li className="font-semibold hover:text-indigo-600 cursor-pointer">
                  #GenerativeAI & RAG Systems
                </li>
                <li className="font-semibold hover:text-indigo-600 cursor-pointer">
                  #RemoteTechJobs 2026
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
