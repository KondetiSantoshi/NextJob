import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/client';
import {
  Settings,
  Lock,
  Bell,
  Shield,
  User,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [location, setLocation] = useState(user?.location || '');
  const [isUpdating, setIsUpdating] = useState(false);

  // Notification Preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [interviewReminders, setInterviewReminders] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      const res = await api.put('/auth/update-profile', { name, mobile, location });
      if (res.data.success) {
        success('Account preferences saved!');
        updateUser(res.data.user);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to update preferences');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Account Settings</h1>
              <p className="text-xs text-slate-500">Manage your profile, alerts, and security</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4">Personal Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Registered Email (Read Only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Notification Preferences</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 cursor-pointer hover:bg-slate-50">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Job Alert Recommendations</p>
                    <p className="text-[11px] text-slate-400">
                      Receive notifications when matching jobs in your skill area are posted
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 cursor-pointer hover:bg-slate-50">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Interview Schedule Alerts</p>
                    <p className="text-[11px] text-slate-400">
                      Receive immediate reminders for scheduled video and telephonic rounds
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={interviewReminders}
                    onChange={(e) => setInterviewReminders(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>

        {/* Security & Danger Zone */}
        <div className="bg-white rounded-3xl border border-rose-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-sm mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Danger Zone</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Deactivating your account will suspend your job applications, candidate visibility, and profile access.
          </p>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to deactivate your NexJob profile?')) {
                success('Deactivation request logged.');
              }
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition"
          >
            Deactivate Account
          </button>
        </div>
      </div>
    </div>
  );
};
