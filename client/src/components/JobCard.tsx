import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Job } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/client';
import {
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  Bookmark,
  Building,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { getSpecificJobApplyUrl } from '../utils/jobRedirect';

interface JobCardProps {
  job: Job;
  isSavedInitial?: boolean;
  onApplyClick?: (job: Job) => void;
  onSaveToggle?: (jobId: string, isSaved: boolean) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSavedInitial = false,
  onApplyClick,
  onSaveToggle,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [saving, setSaving] = useState(false);

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      error('Please sign in to save jobs');
      navigate('/login');
      return;
    }

    try {
      setSaving(true);
      const res = await api.post(`/jobs/${job._id}/save`);
      if (res.data.success) {
        setIsSaved(res.data.isSaved);
        success(res.data.message);
        if (onSaveToggle) onSaveToggle(job._id, res.data.isSaved);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to bookmark job');
    } finally {
      setSaving(false);
    }
  };

  const timeAgo = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  const getWorkModeBadge = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case 'remote':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'hybrid':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  // Resolve Real Company Logo
  const getCompanyLogo = () => {
    if (job.companyLogo && !job.companyLogo.includes('dicebear')) return job.companyLogo;
    if (job.company?.logo && !job.company.logo.includes('dicebear')) return job.company.logo;

    const lowerName = (job.companyName || '').toLowerCase();
    if (lowerName.includes('google')) return '/logos/google.svg';
    if (lowerName.includes('tcs') || lowerName.includes('tata consultancy')) return '/logos/tcs.svg';
    if (lowerName.includes('infosys')) return '/logos/infosys.svg';
    if (lowerName.includes('wipro')) return '/logos/wipro.svg';
    if (lowerName.includes('swiggy')) return '/logos/swiggy.svg';
    if (lowerName.includes('zomato') || lowerName.includes('blinkit')) return '/logos/zomato.svg';
    if (lowerName.includes('flipkart')) return '/logos/flipkart.svg';
    if (lowerName.includes('phonepe')) return '/logos/phonepe.svg';
    if (lowerName.includes('razorpay')) return '/logos/razorpay.svg';
    if (lowerName.includes('cred')) return '/logos/cred.svg';
    if (lowerName.includes('jio') || lowerName.includes('reliance')) return '/logos/jio.svg';
    if (lowerName.includes('amazon')) return '/logos/amazon.svg';
    if (lowerName.includes('microsoft')) return '/logos/microsoft.svg';
    if (lowerName.includes('meta') || lowerName.includes('facebook')) return '/logos/meta.svg';
    if (lowerName.includes('apple')) return '/logos/apple.svg';
    if (lowerName.includes('netflix')) return '/logos/netflix.svg';
    if (lowerName.includes('uber')) return '/logos/uber.svg';
    if (lowerName.includes('stripe')) return '/logos/stripe.svg';
    if (lowerName.includes('nvidia')) return '/logos/nvidia.svg';
    if (lowerName.includes('hcl')) return '/logos/hcl.svg';
    if (lowerName.includes('cognizant')) return '/logos/cognizant.svg';
    if (lowerName.includes('zoho')) return '/logos/zoho.svg';
    if (lowerName.includes('freshworks')) return '/logos/freshworks.svg';
    if (lowerName.includes('paytm')) return '/logos/paytm.svg';
    if (lowerName.includes('zepto')) return '/logos/zepto.svg';
    if (lowerName.includes('zerodha')) return '/logos/zerodha.svg';
    if (lowerName.includes('groww')) return '/logos/groww.svg';
    if (lowerName.includes('meesho')) return '/logos/meesho.svg';
    if (lowerName.includes('hdfc')) return '/logos/hdfc.svg';
    if (lowerName.includes('icici')) return '/logos/icici.svg';
    if (lowerName.includes('walmart')) return '/logos/walmart.svg';
    if (lowerName.includes('tech mahindra')) return '/logos/techmahindra.svg';

    return (
      job.companyLogo ||
      job.company?.logo ||
      `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(job.companyName)}`
    );
  };

  const handleApplyClick = () => {
    if (onApplyClick) {
      onApplyClick(job);
    } else {
      navigate(`/jobs/${job._id}`);
    }
  };

  const specificApplyUrl = getSpecificJobApplyUrl(job);

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/90 hover:border-indigo-500 p-5 sm:p-6 shadow-sm hover:shadow-2xl transition-all duration-300 relative flex flex-col justify-between">
      {/* Top Header */}
      <div>
        {/* Top Badges Bar: Easy Apply & Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2 flex-wrap">
            {/* EASY APPLY BADGE */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
              <span>Easy Apply</span>
            </span>

            {job.careerUrl && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
                <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                <span>Verified Career Portal</span>
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleSaveToggle}
            disabled={saving}
            className={`p-2 rounded-xl border transition shrink-0 ${
              isSaved
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                : 'bg-white border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200'
            }`}
            title={isSaved ? 'Saved' : 'Save job'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600' : ''}`} />
          </button>
        </div>

        {/* Company & Title Block */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="w-13 h-13 rounded-2xl bg-white border border-slate-100 p-2 shadow-xs shrink-0 flex items-center justify-center">
            <img
              src={getCompanyLogo()}
              alt={job.companyName}
              className="w-9 h-9 object-contain rounded"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                to={job.company?._id ? `/companies/${job.company._id}` : `/companies`}
                className="text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 transition flex items-center gap-1 truncate"
              >
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{job.companyName}</span>
              </Link>

              {job.company?.verified && (
                <span title="Verified Employer" className="text-blue-500">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                </span>
              )}
            </div>

            <Link
              to={`/jobs/${job._id}`}
              className="mt-1 text-base sm:text-lg font-black text-slate-900 group-hover:text-indigo-600 transition line-clamp-1 block leading-snug"
            >
              {job.title}
            </Link>
          </div>
        </div>

        {/* Highlights Row: Experience, Salary & City */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2.5 px-3 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-slate-600 truncate">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{job.minExperience}-{job.maxExperience} Yrs Exp</span>
          </div>

          <div className="flex items-center gap-1.5 font-black text-emerald-700 truncate">
            <IndianRupee className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
            <span className="truncate">{job.salaryRange || 'Competitive CTC'}</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium text-slate-600 col-span-2 sm:col-span-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
        </div>

        {/* Short Description */}
        <p className="mt-3 text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills Chips */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {job.skills?.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700"
            >
              {skill}
            </span>
          ))}
          {job.skills && job.skills.length > 4 && (
            <span className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-slate-50 text-slate-500">
              +{job.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Bottom Footer & PROMINENT APPLY BUTTONS */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        {/* Work Mode & Time */}
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getWorkModeBadge(
              job.workMode
            )}`}
          >
            {job.workMode}
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1 text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5" />
            {timeAgo(job.createdAt)}
          </span>
        </div>

        {/* PROMINENT ACTION BUTTONS */}
        <div className="flex items-center gap-2 ml-auto w-full sm:w-auto justify-end">
          {/* PRIMARY SPECIFIC JOB REDIRECT BUTTON - REDIRECTS TO THAT COMPANY'S SPECIFIC JOB */}
          <a
            href={specificApplyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
            title={`Redirect directly to ${job.companyName} official page for "${job.title}"`}
          >
            <span>Apply to Job</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* SECONDARY 1-CLICK EASY APPLY BUTTON */}
          <button
            onClick={handleApplyClick}
            className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs border border-emerald-200 transition"
            title="1-Click Easy Apply with your saved profile & resume"
          >
            <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
            <span>Easy Apply</span>
          </button>

          <Link
            to={`/jobs/${job._id}`}
            className="px-2.5 py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};
