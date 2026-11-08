import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import { Job } from '../types';
import { JobCard } from '../components/JobCard';
import { ApplyModal } from '../components/ApplyModal';
import { CompanyJobsModal } from '../components/CompanyJobsModal';
import { useToast } from '../context/ToastContext';
import {
  Search,
  MapPin,
  Filter,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Sparkles,
  RotateCw,
  Building2,
  Building,
  Zap,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Software Development',
  'Web Development',
  'Java Developer',
  'Python Developer',
  'Data Analyst',
  'Data Science',
  'Artificial Intelligence',
  'Machine Learning',
  'Cloud Computing',
  'Cybersecurity',
  'Digital Marketing',
  'Human Resources',
  'Finance',
  'Sales',
  'Customer Support',
  'UI/UX Design',
  'Testing',
  'DevOps',
];

const WORK_MODES = ['All', 'Remote', 'Hybrid', 'On-site'];
const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'];
const EXP_LEVELS = ['All', 'Fresher', 'Entry Level', 'Mid Level', 'Senior Level', 'Lead / Director'];

export const JobSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { success, error } = useToast();

  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [workMode, setWorkMode] = useState(searchParams.get('workMode') || 'All');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || 'All');
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get('experienceLevel') || 'All');
  const [fresherOnly, setFresherOnly] = useState(searchParams.get('fresher') === 'true');
  const [careerOnly, setCareerOnly] = useState(searchParams.get('careerOnly') === 'true');
  const [easyApplyOnly, setEasyApplyOnly] = useState(searchParams.get('easyApply') === 'true');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(1);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);

  // Modal for Viewing Company Jobs
  const [companyModalName, setCompanyModalName] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (keyword.trim()) params.append('q', keyword.trim());
      if (location.trim()) params.append('location', location.trim());
      if (category !== 'All') params.append('category', category);
      if (workMode !== 'All') params.append('workMode', workMode);
      if (jobType !== 'All') params.append('jobType', jobType);
      if (experienceLevel !== 'All') params.append('experienceLevel', experienceLevel);
      if (fresherOnly) params.append('fresher', 'true');
      if (careerOnly) params.append('careerOnly', 'true');
      if (sort) params.append('sort', sort);
      params.append('page', page.toString());
      // Increase limit to 24 so all jobs for searched companies appear immediately
      params.append('limit', '24');

      const res = await api.get(`/jobs?${params.toString()}`);
      if (res.data.success) {
        setJobs(res.data.jobs);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Failed to load jobs', err);
    } finally {
      setLoading(false);
    }
  };

  // Sync state when URL search params change
  useEffect(() => {
    const urlQ = searchParams.get('q');
    const urlLoc = searchParams.get('location');
    if (urlQ !== null && urlQ !== keyword) {
      setKeyword(urlQ);
    }
    if (urlLoc !== null && urlLoc !== location) {
      setLocation(urlLoc);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchJobs();
  }, [category, workMode, jobType, experienceLevel, fresherOnly, careerOnly, sort, page, keyword, location]);

  const handleSyncLiveJobs = async () => {
    try {
      setSyncing(true);
      const res = await api.post('/jobs/sync-live-jobs');
      if (res.data.success) {
        success(res.data.message || 'Live career jobs synchronized!');
        fetchJobs();
      }
    } catch (err: any) {
      error('Failed to sync live jobs');
    } finally {
      setSyncing(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (keyword.trim()) newParams.set('q', keyword.trim());
    else newParams.delete('q');
    if (location.trim()) newParams.set('location', location.trim());
    else newParams.delete('location');
    setSearchParams(newParams);
    fetchJobs();
  };

  const clearAllFilters = () => {
    setKeyword('');
    setLocation('');
    setCategory('All');
    setWorkMode('All');
    setJobType('All');
    setExperienceLevel('All');
    setFresherOnly(false);
    setCareerOnly(false);
    setSort('newest');
    setPage(1);
  };

  const hasActiveFilters =
    category !== 'All' ||
    workMode !== 'All' ||
    jobType !== 'All' ||
    experienceLevel !== 'All' ||
    fresherOnly ||
    careerOnly ||
    Boolean(keyword) ||
    Boolean(location);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title & Sync Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Indian Tech Jobs & Career Pages
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Search any of 1,000+ Indian companies or filter by tech stack and Indian tech hubs.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleSyncLiveJobs}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:border-indigo-300 shadow-xs transition"
            >
              <RotateCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-indigo-600' : ''}`} />
              <span>{syncing ? 'Syncing Real Openings...' : '🔄 Sync Live Jobs'}</span>
            </button>
          </div>
        </div>

        {/* Top Search & Filter Bar - Only Search & City */}
        <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/80 shadow-sm mb-6">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
            <div className="flex-1 flex items-center gap-3 w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus-within:border-indigo-400 focus-within:bg-white transition">
              <Search className="w-5 h-5 text-indigo-600 shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search jobs, companies, or skills (e.g. TCS, React)..."
                className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              {keyword && (
                <button type="button" onClick={() => setKeyword('')}>
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </button>
              )}
            </div>

            <div className="flex-1 flex items-center gap-3 w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus-within:border-indigo-400 focus-within:bg-white transition">
              <MapPin className="w-5 h-5 text-indigo-600 shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City (Bangalore, Hyderabad, Pune, Remote)..."
                className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              {location && (
                <button type="button" onClick={() => setLocation('')}>
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-indigo-600/20 transition shrink-0"
            >
              Search
            </button>
          </form>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Filters</h3>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Easy Apply Toggle */}
              <div className="py-3.5 border-b border-slate-100">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={easyApplyOnly}
                    onChange={(e) => {
                      setEasyApplyOnly(e.target.checked);
                      setPage(1);
                    }}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                    <span className="text-xs font-black text-slate-900">
                      ⚡ Easy Apply Jobs Only
                    </span>
                  </div>
                </label>
              </div>

              {/* Official Career Portal Toggle */}
              <div className="py-4 border-b border-slate-100">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={careerOnly}
                    onChange={(e) => {
                      setCareerOnly(e.target.checked);
                      setPage(1);
                    }}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-bold text-slate-800">
                      Official Career Portals Only
                    </span>
                  </div>
                </label>
              </div>

              {/* Fresher Quick Filter */}
              <div className="py-4 border-b border-slate-100">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fresherOnly}
                    onChange={(e) => {
                      setFresherOnly(e.target.checked);
                      setPage(1);
                    }}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    Fresher Jobs Only (0-1 Yrs)
                  </span>
                </label>
              </div>

              {/* Category */}
              <div className="py-4 border-b border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Work Mode */}
              <div className="py-4 border-b border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Work Mode
                </label>
                <div className="space-y-1.5">
                  {WORK_MODES.map((mode) => (
                    <label key={mode} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="radio"
                        name="workMode"
                        checked={workMode === mode}
                        onChange={() => {
                          setWorkMode(mode);
                          setPage(1);
                        }}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Job Type */}
              <div className="py-4 border-b border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Job Type
                </label>
                <div className="space-y-1.5">
                  {JOB_TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="radio"
                        name="jobType"
                        checked={jobType === type}
                        onChange={() => {
                          setJobType(type);
                          setPage(1);
                        }}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div className="pt-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Experience Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => {
                    setExperienceLevel(e.target.value);
                    setPage(1);
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {EXP_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Job Listings Main Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Verified Company Career Hub Spotlight Banner */}
            {!loading && jobs.length > 0 && keyword && (
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5 border border-indigo-800/40">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white p-2.5 border border-white/20 shadow-md shrink-0 flex items-center justify-center">
                    <img
                      src={jobs[0].companyLogo || (jobs[0].company as any)?.logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(jobs[0].companyName)}`}
                      alt={jobs[0].companyName}
                      className="w-11 h-11 object-contain rounded"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified Official Career Openings
                      </span>
                      <span className="text-xs text-indigo-300 font-semibold">
                        Showing all {total} available jobs
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                      {jobs[0].companyName}
                    </h2>
                    <p className="text-xs text-indigo-200 mt-1 flex items-center gap-2 flex-wrap">
                      <span>Official Career Portal:</span>
                      <a
                        href={jobs[0].careerUrl || (jobs[0].company as any)?.careerPageUrl || 'https://www.tcs.com/careers/india'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white underline font-bold hover:text-indigo-300 flex items-center gap-1"
                      >
                        <span className="max-w-[280px] sm:max-w-md truncate">
                          {jobs[0].careerUrl || (jobs[0].company as any)?.careerPageUrl || 'Official Portal'}
                        </span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <a
                    href={jobs[0].careerUrl || (jobs[0].company as any)?.careerPageUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-extrabold text-xs shadow-md hover:bg-indigo-50 flex items-center gap-1.5 transition"
                  >
                    <span>Visit Official Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-xs sm:text-sm font-semibold text-slate-600">
                Showing <span className="font-extrabold text-slate-900">{jobs.length}</span> of{' '}
                <span className="font-extrabold text-slate-900">{total}</span> opportunities
                {keyword && <span className="text-indigo-600 font-bold"> for "{keyword}"</span>}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="lg:hidden px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-medium">Sort by:</span>
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
                      setPage(1);
                    }}
                    className="p-1.5 rounded-lg border border-slate-200 font-semibold text-slate-800 bg-white focus:outline-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="salary_high">Highest CTC</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Jobs Grid */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-44 rounded-2xl bg-white border border-slate-200 p-6 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No jobs found matching your criteria</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
                  Try searching for another company or explore their verified career portal directly.
                </p>

                {keyword && (
                  <button
                    onClick={() => setCompanyModalName(keyword)}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md transition"
                  >
                    ⚡ Check Official Career Portal for "{keyword}" ↗
                  </button>
                )}

                <div className="mt-3">
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    Reset All Filters
                  </button>
                </div>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-xl text-xs font-bold transition ${
                      page === p
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Company Jobs Modal */}
      {companyModalName && (
        <CompanyJobsModal
          companyName={companyModalName}
          isOpen={Boolean(companyModalName)}
          onClose={() => setCompanyModalName(null)}
        />
      )}

      {/* Apply Modal */}
      {selectedJobForApply && (
        <ApplyModal
          job={selectedJobForApply}
          isOpen={Boolean(selectedJobForApply)}
          onClose={() => setSelectedJobForApply(null)}
          onSuccess={() => {
            setSelectedJobForApply(null);
            success('Application submitted successfully!');
          }}
        />
      )}
    </div>
  );
};
