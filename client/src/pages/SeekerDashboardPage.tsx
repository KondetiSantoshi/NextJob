import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Application, Job } from '../types';
import { JobCard } from '../components/JobCard';
import {
  FileText,
  Bookmark,
  Calendar,
  CheckCircle2,
  Clock,
  Video,
  ArrowRight,
  TrendingUp,
  User,
  ExternalLink,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export const SeekerDashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [appsRes, savedRes, jobsRes] = await Promise.all([
          api.get('/applications/my-applications'),
          api.get('/jobs/seeker/saved'),
          api.get('/jobs?limit=4'),
        ]);

        if (appsRes.data.success) setApplications(appsRes.data.applications);
        if (savedRes.data.success) setSavedJobs(appsRes.data.applications ? savedRes.data.jobs : []);
        if (jobsRes.data.success) setRecommendedJobs(jobsRes.data.jobs);
      } catch (err) {
        console.error('Failed to load seeker dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const shortlistedCount = applications.filter(
    (a) => a.status === 'Shortlisted' || a.status === 'Interview Scheduled' || a.status === 'Selected'
  ).length;

  const interviews = applications.filter((a) => a.status === 'Interview Scheduled');

  // Calculate profile completeness
  let completeness = 40;
  if (profile?.skills && profile.skills.length > 0) completeness += 20;
  if (profile?.experience && profile.experience.length > 0) completeness += 20;
  if (profile?.resumes && profile.resumes.length > 0) completeness += 20;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <img
                src={
                  user?.avatar ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                    user?.name || 'User'
                  )}`
                }
                alt={user?.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Welcome back, {user?.name}!
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-indigo-100/90 mt-1 line-clamp-1 max-w-xl">
                  {user?.headline || 'Explore latest openings and track your application milestones'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/jobs"
                className="px-5 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs sm:text-sm hover:bg-indigo-50 shadow-md transition"
              >
                Browse Jobs
              </Link>
              <Link
                to="/profile"
                className="px-5 py-2.5 rounded-xl bg-indigo-900/60 hover:bg-indigo-900 border border-white/20 text-white font-bold text-xs sm:text-sm transition"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Profile Completeness Bar */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-indigo-200">Profile Strength:</span>
              <span className="font-bold text-white">{completeness}%</span>
            </div>
            <div className="flex-1 max-w-md bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completeness}%` }}
              ></div>
            </div>
            <Link to="/profile" className="text-indigo-200 hover:text-white font-semibold underline">
              Complete details for 3x recruiter visibility →
            </Link>
          </div>
        </div>

        {/* Scheduled Interview Banner (if any) */}
        {interviews.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-1">
                    Upcoming Interview Scheduled
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {interviews[0].job?.title} at {interviews[0].job?.companyName}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Scheduled on <strong>{interviews[0].interviewDetails?.date}</strong> at{' '}
                    <strong>{interviews[0].interviewDetails?.time}</strong> via{' '}
                    {interviews[0].interviewDetails?.mode || 'Google Meet'}
                  </p>
                  {interviews[0].interviewDetails?.notes && (
                    <p className="text-xs text-slate-500 mt-1 italic">
                      Note: "{interviews[0].interviewDetails?.notes}"
                    </p>
                  )}
                </div>
              </div>

              {interviews[0].interviewDetails?.link && (
                <a
                  href={interviews[0].interviewDetails.link}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition shrink-0"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Meeting</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Applied Jobs
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-3">{applications.length}</p>
            <Link
              to="/applications"
              className="mt-2 text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              View all applications <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Shortlisted
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-3">{shortlistedCount}</p>
            <span className="mt-2 text-xs text-slate-400 block font-medium">Recruiter interest active</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Interviews
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-3">{interviews.length}</p>
            <span className="mt-2 text-xs text-slate-400 block font-medium">Upcoming scheduled</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Saved Jobs
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Bookmark className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-3">{savedJobs.length}</p>
            <Link
              to="/saved-jobs"
              className="mt-2 text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              View saved bookmarks <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Recent Applications Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Applications Status</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Track recruiter reviews and stages in real time
              </p>
            </div>
            <Link
              to="/applications"
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              See Detailed History <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No applications submitted yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Start applying to open jobs to track progress here.
              </p>
              <Link
                to="/jobs"
                className="mt-4 inline-block px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600"
              >
                Browse All Openings
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.slice(0, 4).map((app) => (
                <div
                  key={app._id}
                  className="p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={
                        app.job?.company?.logo ||
                        `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                          app.job?.companyName || 'Company'
                        )}`
                      }
                      alt={app.job?.companyName}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-50 p-1 border border-slate-200 shrink-0"
                    />
                    <div>
                      <Link
                        to={`/jobs/${app.job?._id}`}
                        className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition"
                      >
                        {app.job?.title}
                      </Link>
                      <p className="text-xs text-slate-500">
                        {app.job?.companyName} • {app.job?.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        app.status === 'Interview Scheduled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'Shortlisted'
                          ? 'bg-purple-100 text-purple-800'
                          : app.status === 'Viewed'
                          ? 'bg-blue-100 text-blue-800'
                          : app.status === 'Selected'
                          ? 'bg-green-100 text-green-800'
                          : app.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {app.status}
                    </span>

                    <Link
                      to="/applications"
                      className="text-xs font-semibold text-indigo-600 hover:underline shrink-0"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Jobs */}
        {recommendedJobs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Recommended Jobs For You</h2>
              <Link to="/jobs" className="text-xs font-bold text-indigo-600 hover:underline">
                View all recommendations →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedJobs.slice(0, 2).map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
