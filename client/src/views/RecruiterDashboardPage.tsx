'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/client';
import { Job, Application, Company } from '../types';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  PlusCircle,
  FileText,
  Search,
  ExternalLink,
  Video,
  Eye,
  Trash2,
  Edit3,
  X,
  MessageSquare,
  Building2,
  Phone,
  Mail,
  MapPin,
  SlidersHorizontal,
} from 'lucide-react';

export const RecruiterDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<'jobs' | 'applicants'>('jobs');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state for applicants
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedJobFilter, setSelectedJobFilter] = useState(searchParams?.get('jobId') || 'All');

  // Schedule Interview Modal State
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedAppForSchedule, setSelectedAppForSchedule] = useState<Application | null>(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewMode, setInterviewMode] = useState('Google Meet');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/xyz-demo-abc');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [isSubmittingSchedule, setIsSubmittingSchedule] = useState(false);

  const fetchRecruiterData = async () => {
    try {
      setLoading(true);
      const [jobsRes, appsRes] = await Promise.all([
        api.get('/jobs/recruiter/my-jobs'),
        api.get('/applications/recruiter/applicants'),
      ]);

      if (jobsRes.data.success) setJobs(jobsRes.data.jobs);
      if (appsRes.data.success) setApplicants(appsRes.data.applicants);
    } catch (err) {
      console.error('Failed to load recruiter data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterData();
    if (searchParams?.get('tab') === 'applicants') {
      setActiveTab('applicants');
    }
  }, [searchParams]);

  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      const res = await api.put(`/applications/${appId}/status`, { status: newStatus });
      if (res.data.success) {
        success(`Candidate status updated to ${newStatus}`);
        setApplicants((prev) =>
          prev.map((a) => (a._id === appId ? { ...a, status: newStatus as any } : a))
        );
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleOpenScheduleModal = (app: Application) => {
    setSelectedAppForSchedule(app);
    setInterviewDate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setInterviewTime('11:00 AM IST');
    setScheduleModalOpen(true);
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForSchedule) return;

    try {
      setIsSubmittingSchedule(true);
      const res = await api.post(
        `/applications/${selectedAppForSchedule._id}/schedule-interview`,
        {
          date: interviewDate,
          time: interviewTime,
          mode: interviewMode,
          link: meetingLink,
          notes: interviewNotes,
        }
      );

      if (res.data.success) {
        success('Interview successfully scheduled! Candidate has been alerted.');
        setScheduleModalOpen(false);
        fetchRecruiterData();
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to schedule interview');
    } finally {
      setIsSubmittingSchedule(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      const res = await api.delete(`/jobs/${jobId}`);
      if (res.data.success) {
        success('Job deleted successfully');
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
      }
    } catch (err) {
      error('Failed to delete job');
    }
  };

  const company = user?.company as Company;
  const filteredApplicants = applicants.filter((app) => {
    if (statusFilter !== 'All' && app.status !== statusFilter) return false;
    if (selectedJobFilter !== 'All' && app.job?._id !== selectedJobFilter) return false;
    return true;
  });

  const shortlistedCount = applicants.filter(
    (a) => a.status === 'Shortlisted' || a.status === 'Interview Scheduled' || a.status === 'Selected'
  ).length;

  const interviewsCount = applicants.filter((a) => a.status === 'Interview Scheduled').length;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Company Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={
                  company?.logo ||
                  user?.avatar ||
                  `https://api.dicebear.com/7.x/identicon/svg?seed=Recruiter`
                }
                alt="Company"
                className="w-16 h-16 rounded-2xl object-cover bg-white p-1 border-2 border-white/20 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {company?.name || 'Recruiter Talent Hub'}
                  </h1>
                  {company?.verified && (
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                  )}
                </div>
                <p className="text-xs sm:text-sm text-indigo-200 mt-1">
                  Logged in as <strong>{user?.name}</strong> • Talent Partner
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/post-job"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
              >
                <PlusCircle className="w-4 h-4" />
                Post New Job
              </Link>
              {company?._id && (
                <Link
                  href={`/companies/${company._id}`}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/10 transition"
                >
                  View Company Profile
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 4 KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Active Job Posts
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-3">{jobs.length}</p>
            <span className="mt-2 text-xs text-slate-400 block font-medium">Currently receiving applicants</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Applicants
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-3">{applicants.length}</p>
            <span className="mt-2 text-xs text-slate-400 block font-medium">Resumes submitted</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Shortlisted
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-3">{shortlistedCount}</p>
            <span className="mt-2 text-xs text-slate-400 block font-medium">High potential matches</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Interviews Scheduled
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-3">{interviewsCount}</p>
            <span className="mt-2 text-xs text-slate-400 block font-medium">Video/Meet calls set</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-sm flex items-center gap-2 max-w-md">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'jobs'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Posted Jobs ({jobs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('applicants')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'applicants'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Applicants ({applicants.length})</span>
          </button>
        </div>

        {/* TAB 1: POSTED JOBS TABLE */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Your Job Postings</h3>
                <p className="text-xs text-slate-500 mt-0.5">Manage live listings and applicant counts</p>
              </div>
              <Link
                href="/post-job"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1.5 transition"
              >
                <PlusCircle className="w-4 h-4" />
                Post New Job
              </Link>
            </div>

            {jobs.length === 0 ? (
              <div className="text-center py-16">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-800">No job postings created yet</p>
                <Link
                  href="/post-job"
                  className="mt-4 inline-block px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600"
                >
                  Create Your First Job Posting
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Job Title & Category</th>
                      <th className="px-6 py-4">Work Mode</th>
                      <th className="px-6 py-4">Applicants</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jobs.map((job) => (
                      <tr key={job._id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4">
                          <Link
                            href={`/jobs/${job._id}`}
                            className="font-bold text-slate-900 hover:text-indigo-600 transition"
                          >
                            {job.title}
                          </Link>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {job.category} • {job.location}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                            {job.workMode}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedJobFilter(job._id);
                              setActiveTab('applicants');
                            }}
                            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                          >
                            <Users className="w-3.5 h-3.5" />
                            {job.applicantsCount || 0} Candidates
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              job.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {job.status === 'active' ? 'Active / Open' : 'Closed'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/jobs/${job._id}`}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition"
                              title="Preview Job"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteJob(job._id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                              title="Delete Job"
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
            )}
          </div>
        )}

        {/* TAB 2: APPLICANTS MANAGEMENT */}
        {activeTab === 'applicants' && (
          <div className="space-y-6">
            {/* Filter bar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 font-semibold">Filter by Job:</span>
                  <select
                    value={selectedJobFilter}
                    onChange={(e) => setSelectedJobFilter(e.target.value)}
                    className="p-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    <option value="All">All Jobs ({jobs.length})</option>
                    {jobs.map((j) => (
                      <option key={j._id} value={j._id}>
                        {j.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 font-semibold">Filter by Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="p-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Applied">Applied</option>
                    <option value="Viewed">Viewed</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="text-xs font-bold text-slate-600">
                Showing {filteredApplicants.length} Candidates
              </div>
            </div>

            {/* Candidate Cards Grid */}
            {filteredApplicants.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-sm">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-base font-bold text-slate-800">No applicants matching criteria</p>
                <p className="text-xs text-slate-500 mt-1">
                  Try clearing your filters or promoting your open job listings.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplicants.map((app) => (
                  <div
                    key={app._id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:border-indigo-300 transition"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-slate-100">
                      {/* Candidate Avatar & Bio */}
                      <div className="flex items-start gap-4">
                        <img
                          src={
                            app.applicant?.avatar ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                              app.applicant?.name || 'Applicant'
                            )}`
                          }
                          alt={app.applicant?.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-slate-900">
                              {app.applicant?.name}
                            </h4>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs font-semibold text-indigo-600">
                              Applied for: {app.job?.title}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                            {app.applicant?.headline || 'Active Software Professional'}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                            {app.applicant?.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                {app.applicant.email}
                              </span>
                            )}
                            {app.applicant?.mobile && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                {app.applicant.mobile}
                              </span>
                            )}
                            {app.applicant?.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                {app.applicant.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status Dropdown & Actions */}
                      <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500">Stage:</span>
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                            className="p-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                          >
                            <option value="Applied">Applied</option>
                            <option value="Viewed">Viewed</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Interview Scheduled">Interview Scheduled</option>
                            <option value="Selected">Selected</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>

                        <button
                          onClick={() => handleOpenScheduleModal(app)}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1.5 shadow-sm transition"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          Schedule Interview
                        </button>

                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5 transition"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          View Resume
                        </a>
                      </div>
                    </div>

                    {/* Cover note or pitch */}
                    {app.coverNote && (
                      <div className="mt-3 text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                        "{app.coverNote}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* SCHEDULE INTERVIEW MODAL */}
      {scheduleModalOpen && selectedAppForSchedule && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setScheduleModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 mb-2">
                Interview Coordinator
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Schedule Interview with {selectedAppForSchedule.applicant?.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Role: {selectedAppForSchedule.job?.title}
              </p>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Time (with Timezone) *
                  </label>
                  <input
                    type="text"
                    required
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    placeholder="e.g. 2:00 PM IST"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Interview Mode
                </label>
                <select
                  value={interviewMode}
                  onChange={(e) => setInterviewMode(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Google Meet">Google Meet</option>
                  <option value="Zoom">Zoom</option>
                  <option value="In-Person">In-Person</option>
                  <option value="Telephonic">Telephonic</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Meeting Link or Location *
                </label>
                <input
                  type="text"
                  required
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Preparation Notes / Round Focus
                </label>
                <textarea
                  rows={2}
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  placeholder="e.g. Technical system design round focusing on APIs and database scale."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSchedule}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 disabled:opacity-50"
                >
                  {isSubmittingSchedule ? 'Scheduling...' : 'Confirm Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
