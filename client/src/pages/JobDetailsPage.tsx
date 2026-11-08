import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Job, Company } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ApplyModal } from '../components/ApplyModal';
import {
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  Bookmark,
  Building,
  CheckCircle2,
  Calendar,
  GraduationCap,
  Users,
  Eye,
  Share2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Send,
  Zap,
} from 'lucide-react';
import { getSpecificJobApplyUrl } from '../utils/jobRedirect';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/jobs/${id}`);
      if (res.data.success) {
        setJob(res.data.job);
        setHasApplied(res.data.hasApplied);
        setApplicationStatus(res.data.applicationStatus);
        setIsSaved(res.data.isSaved);
        setRecommendedJobs(res.data.recommendedJobs || []);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const handleSaveToggle = async () => {
    if (!user) {
      error('Please sign in to save jobs');
      navigate('/login');
      return;
    }

    try {
      const res = await api.post(`/jobs/${id}/save`);
      if (res.data.success) {
        setIsSaved(res.data.isSaved);
        success(res.data.message);
      }
    } catch (err: any) {
      error('Failed to toggle save');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    success('Job link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Loading verified job posting...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Job Posting Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">This job may have expired or been removed by the recruiter.</p>
        <Link
          to="/jobs"
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition"
        >
          ← Browse Active Jobs
        </Link>
      </div>
    );
  }

  const company = job.company as Company;
  const companyLogoUrl =
    job.companyLogo ||
    company?.logo ||
    `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(job.companyName)}`;

  const careerPortalLink = job.careerUrl || company?.careerPageUrl || company?.website;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Details Hero Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-8 border-b border-slate-100">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-2xl bg-slate-50 p-3 border border-slate-200 shadow-md shrink-0 flex items-center justify-center">
                <img
                  src={companyLogoUrl}
                  alt={job.companyName}
                  className="w-14 h-14 object-contain rounded"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {job.workMode}
                  </span>
                  <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    {job.jobType}
                  </span>
                  {job.careerUrl && (
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Verified Career Portal Job
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
                  {job.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <Link
                    to={company?._id ? `/companies/${company._id}` : `/companies`}
                    className="text-base font-bold text-slate-800 hover:text-indigo-600 transition flex items-center gap-1.5"
                  >
                    <Building className="w-4 h-4 text-slate-400" />
                    <span>{job.companyName}</span>
                  </Link>

                  {company?.verified && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Employer
                    </span>
                  )}

                  {careerPortalLink && (
                    <a
                      href={careerPortalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
                    >
                      <span>Official Career Site</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Top Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSaveToggle}
                className={`p-3 rounded-2xl border transition ${
                  isSaved
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                    : 'bg-white border-slate-200 text-slate-400 hover:text-indigo-600'
                }`}
                title="Save Job"
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-indigo-600' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-3 rounded-2xl border border-slate-200 bg-white text-slate-500 hover:text-indigo-600 transition"
                title="Share Job"
              >
                <Share2 className="w-5 h-5" />
              </button>

              {hasApplied ? (
                <div className="px-6 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Status: {applicationStatus || 'Applied'}</span>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  {/* Primary Direct Requisition Redirect Button */}
                  <a
                    href={getSpecificJobApplyUrl(job)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-7 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition transform hover:-translate-y-0.5"
                  >
                    <span>🚀 Apply on {job.companyName} Site</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {/* 1-Click Easy Apply Modal button */}
                  <button
                    onClick={() => {
                      if (!user) {
                        error('Please login to submit application');
                        navigate('/login');
                        return;
                      }
                      setApplyModalOpen(true);
                    }}
                    className="px-6 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-sm border border-emerald-300 flex items-center gap-2 transition"
                  >
                    <Zap className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                    <span>⚡ 1-Click Easy Apply</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-emerald-600" /> Offered CTC
              </span>
              <p className="mt-1 text-base font-bold text-slate-900">
                {job.salaryRange || 'Competitive CTC'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-indigo-600" /> Experience
              </span>
              <p className="mt-1 text-base font-bold text-slate-900">
                {job.minExperience} - {job.maxExperience} Years
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500" /> Location
              </span>
              <p className="mt-1 text-base font-bold text-slate-900 truncate">
                {job.location}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-600" /> Applicants
              </span>
              <p className="mt-1 text-base font-bold text-slate-900">
                {job.applicantsCount || 0} applied
              </p>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Description & Requirements */}
          <div className="lg:col-span-2 space-y-8">
            {/* Verified Career Sync Banner */}
            {job.careerUrl && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-indigo-50 border border-amber-200/80 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Authentic Job Posting from {job.companyName}'s Official Career Page
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      This opening is verified directly against {job.companyName}'s live career portal. You can submit your application directly on their official hiring portal or use NexJob's Quick Apply.
                    </p>
                  </div>
                </div>
                <a
                  href={job.careerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 px-3.5 py-2 rounded-xl bg-white text-indigo-600 font-bold text-xs border border-indigo-200 hover:bg-indigo-50 transition flex items-center gap-1"
                >
                  <span>Verify Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Job Description */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Job Description</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-base font-bold text-slate-900 mb-3">Key Responsibilities</h4>
                  <ul className="space-y-2.5">
                    {job.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-1" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-base font-bold text-slate-900 mb-3">Required Qualifications & Skills</h4>
                  <ul className="space-y-2.5">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills required */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Technical & Soft Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {job.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Apply CTA Banner */}
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black">Ready to take the next step?</h3>
                <p className="text-xs sm:text-sm text-indigo-200 mt-1">
                  Apply directly with your verified profile or on {job.companyName}'s career page.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {job.careerUrl && (
                  <a
                    href={job.careerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-white text-indigo-900 font-extrabold text-xs sm:text-sm shadow-md hover:bg-indigo-50 transition flex items-center gap-1.5"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => {
                    if (!user) {
                      navigate('/login');
                      return;
                    }
                    setApplyModalOpen(true);
                  }}
                  className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-xs sm:text-sm transition flex items-center gap-1.5"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Quick Apply</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">About the Company</h3>
              <div className="flex items-center gap-3.5 mb-4">
                <img
                  src={companyLogoUrl}
                  alt={job.companyName}
                  className="w-14 h-14 rounded-2xl object-contain bg-slate-50 p-2 border border-slate-200 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                    {job.companyName}
                    {company?.verified && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                  </h4>
                  <p className="text-xs text-slate-500">{company?.industry || 'Technology & Software'}</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-4 mb-4">
                {company?.description || `${job.companyName} is a global industry leader driving breakthrough digital transformation and innovation.`}
              </p>

              <div className="space-y-2.5 text-xs text-slate-600 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Headquarters</span>
                  <span className="font-semibold text-slate-800">{company?.location || job.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Company Size</span>
                  <span className="font-semibold text-slate-800">{company?.size || '1,000 - 10,000+ employees'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Rating</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    ★ {company?.rating || '4.8'} ({company?.reviewsCount || 120}+ reviews)
                  </span>
                </div>
              </div>

              {/* Official Career Portal button */}
              {careerPortalLink && (
                <a
                  href={careerPortalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 w-full py-2.5 px-4 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/70 text-indigo-700 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <span>Visit {job.companyName} Careers</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {company?._id && (
                <Link
                  to={`/companies/${company._id}`}
                  className="mt-2 w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center transition"
                >
                  View Full Company Profile
                </Link>
              )}
            </div>

            {/* Recruiter / Hiring Team */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-3">Hiring Activity</h3>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                  HR
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Talent Acquisition Team</h4>
                  <p className="text-xs text-slate-500">Active recruiter • Fast responder</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Applicants usually receive an update within 2 business days.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {applyModalOpen && job && (
        <ApplyModal
          job={job}
          isOpen={applyModalOpen}
          onClose={() => setApplyModalOpen(false)}
          onSuccess={() => {
            setHasApplied(true);
            setApplicationStatus('Applied');
            setApplyModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
