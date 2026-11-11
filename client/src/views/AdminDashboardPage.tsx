'use client';

import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useToast } from '../context/ToastContext';
import { User, Company, Job } from '../types';
import {
  ShieldCheck,
  Users,
  Building2,
  Briefcase,
  FileText,
  CheckCircle2,
  XCircle,
  Trash2,
  Search,
  Filter,
  Activity,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { success, error } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'companies' | 'moderation'>('overview');
  const [loading, setLoading] = useState(true);

  // User search/filter
  const [userQuery, setUserQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, companiesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/companies'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data);
      if (usersRes.data.success) setUsers(usersRes.data.users);
      if (companiesRes.data.success) setCompanies(companiesRes.data.companies);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUserStatus = async (userId: string) => {
    try {
      const res = await api.put(`/admin/users/${userId}/toggle-status`);
      if (res.data.success) {
        success(res.data.message);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isActive: res.data.user.isActive } : u))
        );
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user permanently?')) return;
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      if (res.data.success) {
        success('User deleted');
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (err: any) {
      error('Failed to delete user');
    }
  };

  const handleToggleCompanyVerification = async (companyId: string) => {
    try {
      const res = await api.put(`/admin/companies/${companyId}/verify`);
      if (res.data.success) {
        success(res.data.message);
        setCompanies((prev) =>
          prev.map((c) => (c._id === companyId ? { ...c, verified: res.data.company.verified } : c))
        );
      }
    } catch (err) {
      error('Failed to update company verification');
    }
  };

  const filteredUsers = users.filter((u) => {
    if (userRoleFilter !== 'All' && u.role !== userRoleFilter) return false;
    if (
      userQuery &&
      !u.name.toLowerCase().includes(userQuery.toLowerCase()) &&
      !u.email.toLowerCase().includes(userQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Platform Admin Console
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live System
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-indigo-200 mt-1">
                  Global moderation, company verification, user governance & telemetry
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/10 text-xs text-indigo-200">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Database Status: Connected & Healthy</span>
            </div>
          </div>
        </div>

        {/* 6 Top Stats */}
        {stats?.stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Users
              </span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.stats.totalUsers}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Job Seekers
              </span>
              <p className="text-2xl font-extrabold text-indigo-600 mt-1">
                {stats.stats.totalJobSeekers}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Recruiters
              </span>
              <p className="text-2xl font-extrabold text-purple-600 mt-1">
                {stats.stats.totalRecruiters}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Companies
              </span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {stats.stats.totalCompanies}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Active Jobs
              </span>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">
                {stats.stats.activeJobs}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Applications
              </span>
              <p className="text-2xl font-extrabold text-amber-600 mt-1">
                {stats.stats.totalApplications}
              </p>
            </div>
          </div>
        )}

        {/* Tab Selection */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-sm flex items-center gap-2 max-w-xl">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'companies'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Companies ({companies.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW & BREAKDOWN */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Applications Breakdown */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">
                Application Pipeline Breakdown
              </h3>
              <div className="space-y-3">
                {stats?.applicationBreakdown?.map((item: any) => (
                  <div key={item._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <span className="text-xs font-bold text-slate-700">{item._id}</span>
                    <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      {item.count} Candidates
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Registrations */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">Recent User Registrations</h3>
              <div className="space-y-3">
                {stats?.recentUsers?.map((u: User) => (
                  <div key={u._id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{u.name}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Search user by name or email..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-semibold">Role:</span>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="p-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                >
                  <option value="All">All Roles</option>
                  <option value="job_seeker">Job Seeker</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Account Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`}
                            alt={u.name}
                            className="w-9 h-9 rounded-full object-cover shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{u.name}</p>
                            <p className="text-[11px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600">{u.location || 'Not set'}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            u.isActive !== false
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {u.isActive !== false ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleUserStatus(u._id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                              u.isActive !== false
                                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {u.isActive !== false ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: COMPANIES VERIFICATION */}
        {activeTab === 'companies' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Registered Companies & Trust Verification
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify legitimate employers and manage platform company profiles
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Industry</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Verification</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {companies.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              c.logo ||
                              `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                                c.name
                              )}`
                            }
                            alt={c.name}
                            className="w-10 h-10 rounded-xl object-cover bg-slate-50 p-1 border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{c.name}</p>
                            <p className="text-[11px] text-slate-400">{c.size}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600">{c.industry}</td>
                      <td className="px-6 py-4 text-xs text-slate-600">{c.location}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            c.verified
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {c.verified ? 'Verified Employer' : 'Pending Verification'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleToggleCompanyVerification(c._id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                            c.verified
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {c.verified ? 'Revoke Badge' : 'Grant Verified Badge'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
