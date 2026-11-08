import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Company, Job } from '../types';
import { JobCard } from './JobCard';
import { ApplyModal } from './ApplyModal';
import { useToast } from '../context/ToastContext';
import {
  X,
  Building,
  Globe,
  ExternalLink,
  Briefcase,
  CheckCircle2,
  MapPin,
  Users,
  Star,
  Sparkles,
} from 'lucide-react';

interface CompanyJobsModalProps {
  companyName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyJobsModal: React.FC<CompanyJobsModalProps> = ({
  companyName,
  isOpen,
  onClose,
}) => {
  const { error } = useToast();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);

  useEffect(() => {
    if (isOpen && companyName) {
      const fetchCompanyJobs = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/companies/career-search?q=${encodeURIComponent(companyName)}`);
          if (res.data.success) {
            setCompany(res.data.company);
            setJobs(res.data.jobs || []);
          }
        } catch (err: any) {
          console.error('Failed to load company career jobs', err);
          error(err.response?.data?.message || 'Failed to fetch company jobs');
        } finally {
          setLoading(false);
        }
      };

      fetchCompanyJobs();
    }
  }, [isOpen, companyName]);

  if (!isOpen) return null;

  const companyLogo =
    company?.logo ||
    `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(companyName)}`;

  const careerPortal = company?.careerPageUrl || company?.website;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white p-2 border border-white/20 shadow-md shrink-0 flex items-center justify-center">
              <img
                src={companyLogo}
                alt={companyName}
                className="w-10 h-10 object-contain rounded"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-black text-white">{company?.name || companyName}</h3>
                {company?.verified && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-400/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Verified Indian Employer
                  </span>
                )}
              </div>
              <p className="text-xs text-indigo-200 mt-1 flex items-center gap-2">
                <span>{company?.industry || 'Technology & Digital Services'}</span>
                <span>•</span>
                <span>HQ: {company?.headquarters || company?.location || 'India'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verified Career Portal Bar */}
        {careerPortal && (
          <div className="px-6 py-3.5 bg-amber-50 border-b border-amber-200/80 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center gap-2 text-amber-900 font-semibold">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Official Live Career Page:</span>
              <span className="font-mono font-bold text-amber-950 truncate max-w-xs">{careerPortal}</span>
            </div>
            <a
              href={careerPortal}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition shadow-xs"
            >
              <span>Visit Official Careers</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Scrollable Jobs Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              Available Openings ({jobs.length})
            </h4>
            <span className="text-xs text-slate-500">
              Direct application on official career portal or quick apply
            </span>
          </div>

          {loading ? (
            <div className="space-y-4 py-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 rounded-2xl bg-slate-100 animate-pulse"></div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="py-12 text-center">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h5 className="text-base font-bold text-slate-700">No active postings found right now</h5>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Check {company?.name}'s official career website directly for fresh walk-ins and active requisitions.
              </p>
              {careerPortal && (
                <a
                  href={careerPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  <span>Go to {company?.name} Careers</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onApplyClick={(j) => setSelectedJobForApply(j)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Official Company Portal Sync</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold"
          >
            Close
          </button>
        </div>
      </div>

      {/* Quick Apply Modal */}
      {selectedJobForApply && (
        <ApplyModal
          job={selectedJobForApply}
          isOpen={Boolean(selectedJobForApply)}
          onClose={() => setSelectedJobForApply(null)}
          onSuccess={() => {
            setSelectedJobForApply(null);
          }}
        />
      )}
    </div>
  );
};
