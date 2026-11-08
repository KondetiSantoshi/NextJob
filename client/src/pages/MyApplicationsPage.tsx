import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Application } from '../types';
import {
  FileText,
  Building,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Video,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';

const STATUS_STAGES = ['Applied', 'Viewed', 'Shortlisted', 'Interview Scheduled', 'Selected'];

export const MyApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/applications/my-applications');
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filtered = applications.filter((app) => {
    if (selectedStatus === 'All') return true;
    return app.status === selectedStatus;
  });

  const getStageIndex = (status: string) => {
    if (status === 'Rejected') return -1;
    return STATUS_STAGES.indexOf(status);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-800 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white mb-2 inline-block">
            Candidate Pipeline
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">My Job Applications</h1>
          <p className="text-xs sm:text-sm text-indigo-100/90 mt-1">
            Track real-time hiring updates, review statuses, and interview schedules
          </p>
        </div>

        {/* Filter Pills */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-sm flex flex-wrap items-center gap-2">
          {['All', 'Applied', 'Viewed', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'].map(
            (st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  selectedStatus === st
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 bg-slate-200 animate-pulse rounded-3xl"></div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-sm">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No applications in this category</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Explore available opportunities and apply to kickstart your recruitment process.
            </p>
            <Link
              to="/jobs"
              className="mt-4 inline-block px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              Browse Open Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((app) => {
              const currentStage = getStageIndex(app.status);

              return (
                <div
                  key={app._id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6"
                >
                  {/* Top info row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          app.job?.company?.logo ||
                          `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                            app.job?.companyName || 'Company'
                          )}`
                        }
                        alt="Company"
                        className="w-14 h-14 rounded-2xl object-cover bg-slate-50 p-1 border border-slate-200 shadow-sm shrink-0"
                      />
                      <div>
                        <Link
                          to={`/jobs/${app.job?._id}`}
                          className="text-base sm:text-lg font-bold text-slate-900 hover:text-indigo-600 transition"
                        >
                          {app.job?.title}
                        </Link>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {app.job?.companyName} • {app.job?.location} • Applied on{' '}
                          {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
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

                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Submitted Resume</span>
                      </a>
                    </div>
                  </div>

                  {/* Visual Status Pipeline */}
                  {app.status !== 'Rejected' ? (
                    <div className="pt-2">
                      <div className="relative flex items-center justify-between">
                        {/* Connecting track */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
                        <div
                          className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 z-0 transition-all duration-500"
                          style={{
                            width: `${(Math.max(0, currentStage) / (STATUS_STAGES.length - 1)) * 100}%`,
                          }}
                        ></div>

                        {STATUS_STAGES.map((stage, idx) => {
                          const isCompleted = idx <= currentStage;
                          const isCurrent = idx === currentStage;

                          return (
                            <div
                              key={stage}
                              className="relative z-10 flex flex-col items-center group cursor-default"
                            >
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                                  isCompleted
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                    : 'bg-white border-2 border-slate-300 text-slate-400'
                                } ${isCurrent ? 'ring-4 ring-indigo-100 scale-110' : ''}`}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                  <span>{idx + 1}</span>
                                )}
                              </div>
                              <span
                                className={`text-[11px] font-semibold mt-2 hidden sm:block ${
                                  isCompleted ? 'text-indigo-600' : 'text-slate-400'
                                }`}
                              >
                                {stage}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-rose-50 text-rose-800 rounded-xl text-xs font-semibold">
                      This application was not selected by the recruiter at this time. Keep applying to other matching opportunities!
                    </div>
                  )}

                  {/* Scheduled Interview Details Card */}
                  {app.status === 'Interview Scheduled' && app.interviewDetails && (
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
                          <Video className="w-4 h-4 text-emerald-600" />
                          <span>Interview Details</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900">
                          {app.interviewDetails.date} at {app.interviewDetails.time} (
                          {app.interviewDetails.mode})
                        </p>
                        {app.interviewDetails.notes && (
                          <p className="text-xs text-slate-600 mt-1 italic">
                            "{app.interviewDetails.notes}"
                          </p>
                        )}
                      </div>

                      {app.interviewDetails.link && (
                        <a
                          href={app.interviewDetails.link}
                          target="_blank"
                          rel="noreferrer"
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 shrink-0 transition"
                        >
                          <Video className="w-4 h-4" />
                          <span>Join Meeting Link</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
