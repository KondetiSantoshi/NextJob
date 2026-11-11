'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../api/client';
import { useToast } from '../context/ToastContext';
import { NotificationItem } from '../types';
import {
  Bell,
  CheckCircle2,
  Calendar,
  Users,
  ThumbsUp,
  FileText,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { success, error } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const res = await api.put('/notifications/all/read');
      if (res.data.success) {
        success('All notifications marked as read');
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      error('Failed to mark read');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'interview_scheduled':
        return <Calendar className="w-5 h-5 text-emerald-600" />;
      case 'application_status':
        return <FileText className="w-5 h-5 text-indigo-600" />;
      case 'connection_request':
        return <Users className="w-5 h-5 text-purple-600" />;
      case 'post_like':
        return <ThumbsUp className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Notifications</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Stay updated on interviews, application milestones, and connections
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-sm">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">You're all caught up!</h3>
            <p className="text-xs text-slate-500 mt-1">No new notifications at this moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <Link
                key={n._id}
                href={n.link || '#'}
                className={`p-4 rounded-2xl border transition flex items-start gap-4 block ${
                  !n.read
                    ? 'bg-indigo-50/40 border-indigo-200 hover:border-indigo-300'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{n.title}</h4>
                    <span className="text-[10px] text-slate-400">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
