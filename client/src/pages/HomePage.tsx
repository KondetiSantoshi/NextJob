import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Job, Company } from '../types';
import { JobCard } from '../components/JobCard';
import { ApplyModal } from '../components/ApplyModal';
import { CompanyJobsModal } from '../components/CompanyJobsModal';
import { useToast } from '../context/ToastContext';
import {
  Search,
  MapPin,
  Briefcase,
  Sparkles,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Code,
  Globe,
  Database,
  Cpu,
  Server,
  Cloud,
  Layout,
  RotateCw,
  Zap,
  TrendingUp,
  Award,
  ChevronRight,
  IndianRupee,
  Clock,
} from 'lucide-react';

const TOP_INDIAN_COMPANIES = [
  { name: 'Tata Consultancy Services', short: 'TCS', logo: '/logos/tcs.svg', careerUrl: 'https://www.tcs.com/careers/india', tag: 'IT Giant', ctc: '₹4L - ₹24L', roles: '120+ Jobs', loc: 'Pan India' },
  { name: 'Infosys', short: 'Infosys', logo: '/logos/infosys.svg', careerUrl: 'https://www.infosys.com/careers.html', tag: 'IT Giant', ctc: '₹4.5L - ₹35L', roles: '95+ Jobs', loc: 'Bangalore / Pune' },
  { name: 'Wipro Technologies', short: 'Wipro', logo: '/logos/wipro.svg', careerUrl: 'https://careers.wipro.com', tag: 'IT Giant', ctc: '₹5L - ₹30L', roles: '80+ Jobs', loc: 'Bangalore / Hyd' },
  { name: 'Flipkart', short: 'Flipkart', logo: '/logos/flipkart.svg', careerUrl: 'https://www.flipkartcareers.com', tag: 'Top Unicorn', ctc: '₹22L - ₹65L', roles: '45+ Jobs', loc: 'Bangalore' },
  { name: 'Swiggy', short: 'Swiggy', logo: '/logos/swiggy.svg', careerUrl: 'https://careers.swiggy.com', tag: 'Top Unicorn', ctc: '₹28L - ₹85L', roles: '35+ Jobs', loc: 'Bangalore / Remote' },
  { name: 'Zomato & Blinkit', short: 'Zomato', logo: '/logos/zomato.svg', careerUrl: 'https://www.zomato.com/careers', tag: 'Top Unicorn', ctc: '₹26L - ₹60L', roles: '40+ Jobs', loc: 'Gurgaon / Remote' },
  { name: 'PhonePe', short: 'PhonePe', logo: '/logos/phonepe.svg', careerUrl: 'https://careers.phonepe.com', tag: 'FinTech', ctc: '₹30L - ₹52L', roles: '25+ Jobs', loc: 'Bangalore' },
  { name: 'Razorpay', short: 'Razorpay', logo: '/logos/razorpay.svg', careerUrl: 'https://razorpay.com/jobs', tag: 'FinTech', ctc: '₹32L - ₹50L', roles: '30+ Jobs', loc: 'Bangalore' },
  { name: 'CRED', short: 'CRED', logo: '/logos/cred.svg', careerUrl: 'https://careers.cred.club', tag: 'FinTech', ctc: '₹38L - ₹60L', roles: '15+ Jobs', loc: 'Bangalore' },
  { name: 'Reliance Jio', short: 'Jio', logo: '/logos/jio.svg', careerUrl: 'https://careers.jio.com', tag: 'Telecom & AI', ctc: '₹16L - ₹42L', roles: '60+ Jobs', loc: 'Mumbai / Pune' },
  { name: 'Google India', short: 'Google', logo: '/logos/google.svg', careerUrl: 'https://careers.google.com/jobs/results/?location=India', tag: 'Global MNC', ctc: '₹45L - ₹90L', roles: '42+ Jobs', loc: 'Bangalore / Hyd' },
  { name: 'Microsoft India', short: 'Microsoft', logo: '/logos/microsoft.svg', careerUrl: 'https://careers.microsoft.com', tag: 'Global MNC', ctc: '₹35L - ₹78L', roles: '38+ Jobs', loc: 'Hyderabad / BLR' },
];

const POPULAR_HUBS = [
  'All Cities',
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Delhi-NCR',
  'Mumbai',
  'Chennai',
  'Remote',
];

const CATEGORIES_DISPLAY = [
  { name: 'Software Development', icon: Code, count: '1,420+ Jobs', hot: true },
  { name: 'Web Development', icon: Globe, count: '980+ Jobs', hot: false },
  { name: 'Artificial Intelligence', icon: Cpu, count: '640+ Jobs', hot: true },
  { name: 'Data Science', icon: Database, count: '520+ Jobs', hot: false },
  { name: 'Cloud Computing', icon: Cloud, count: '480+ Jobs', hot: false },
  { name: 'DevOps', icon: Server, count: '410+ Jobs', hot: false },
  { name: 'UI/UX Design', icon: Layout, count: '390+ Jobs', hot: false },
  { name: 'Cybersecurity', icon: ShieldCheck, count: '290+ Jobs', hot: true },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHub, setSelectedHub] = useState('All Cities');
  const [selectedExp, setSelectedExp] = useState('All Experience');

  const [activeCompanyForModal, setActiveCompanyForModal] = useState<string | null>(null);

  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);

  const [activeTab, setActiveTab] = useState<'all' | 'easy' | 'career' | 'remote'>('all');
  const [syncingJobs, setSyncingJobs] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/jobs?limit=12');
      if (res.data.success) {
        setFeaturedJobs(res.data.jobs);
      }
    } catch (err) {
      console.error('Failed to load homepage data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSyncLiveJobs = async () => {
    try {
      setSyncingJobs(true);
      const res = await api.post('/jobs/sync-live-jobs');
      if (res.data.success) {
        success(res.data.message || `Synchronized live career openings!`);
        fetchData();
      }
    } catch (err: any) {
      error('Failed to sync live jobs');
    } finally {
      setSyncingJobs(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query && selectedHub === 'All Cities') {
      navigate('/jobs');
      return;
    }

    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (selectedHub !== 'All Cities') params.append('location', selectedHub);
    navigate(`/jobs?${params.toString()}`);
  };

  const filteredJobs = featuredJobs.filter((job) => {
    if (activeTab === 'career') return Boolean(job.careerUrl);
    if (activeTab === 'remote') return job.workMode === 'Remote';
    if (activeTab === 'easy') return true;
    return true;
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-600 selection:text-white">
      {/* HERO SECTION - MODERN CLEAN LIGHT SAAS DESIGN */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 pt-12 pb-20 sm:pt-16 sm:pb-28 border-b border-slate-200/80">
        {/* Soft background accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-60">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl"></div>
          <div className="absolute top-10 -right-20 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline, Unified Search Console & Badges */}
            <div className="lg:col-span-7 text-left space-y-6">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-900 text-xs font-bold tracking-wide shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Verified Direct Career Portals • 1,000+ Indian Companies & MNCs</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-[1.12]">
                Find Career Page Jobs Across{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 bg-clip-text text-transparent">
                  India’s Top Companies.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
                Search verified job openings directly from the career pages of TCS, Infosys, Swiggy, Flipkart, Reliance Jio, Google India & 1,000+ top employers. Real CTC, 1-click apply, zero ghost jobs.
              </p>

              {/* UNIFIED MULTI-SEGMENT SEARCH CONSOLE */}
              <div className="bg-white rounded-3xl p-3 shadow-xl shadow-slate-200/70 border border-slate-200/90">
                <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2">
                  {/* Segment 1: Company or Skill */}
                  <div className="flex-1 flex items-center gap-3 w-full px-3.5 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus-within:border-indigo-400 focus-within:bg-white transition">
                    <Search className="w-5 h-5 text-indigo-600 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Company (TCS, Swiggy, Jio) or Role (React, Python)..."
                      className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
                    />
                  </div>

                  {/* Segment 2: Location Dropdown */}
                  <div className="flex items-center gap-2 w-full sm:w-auto px-3.5 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <select
                      value={selectedHub}
                      onChange={(e) => setSelectedHub(e.target.value)}
                      className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      {POPULAR_HUBS.map((hub) => (
                        <option key={hub} value={hub}>
                          {hub}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition group shrink-0"
                  >
                    <span>Search Jobs</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>

                {/* Popular Indian Companies Quick Filters */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 px-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                    Direct Career Portals:
                  </span>
                  {['TCS', 'Infosys', 'Swiggy', 'Zomato', 'Flipkart', 'PhonePe', 'Reliance Jio', 'CRED', 'Google India', 'Paytm'].map((comp) => (
                    <button
                      key={comp}
                      type="button"
                      onClick={() => setActiveCompanyForModal(comp)}
                      className="text-xs px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-bold transition flex items-center gap-1 border border-slate-200/70"
                    >
                      <span>{comp}</span>
                      <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  100% Real Career Page URLs
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  Direct Recruiter Contacts
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  Fast Phone/Email OTP Sign-In
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Live Indian Career Portals Showcase */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden border border-slate-800">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Live Verified Indian Career Portals
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                    Active Hiring
                  </span>
                </div>

                {/* Company Live Cards */}
                <div className="mt-4 space-y-3">
                  {[
                    {
                      name: 'Tata Consultancy Services',
                      short: 'TCS',
                      logo: '/logos/tcs.svg',
                      title: 'System Specialist & Full Stack Engineers',
                      ctc: '₹9L - ₹24L PA',
                      loc: 'Bangalore, Mumbai, Pune, Hyd',
                      roles: '120+ Openings',
                      url: 'https://www.tcs.com/careers/india'
                    },
                    {
                      name: 'Swiggy & Instamart',
                      short: 'Swiggy',
                      logo: '/logos/swiggy.svg',
                      title: 'SDE III - Distributed Systems & ML Engine',
                      ctc: '₹35L - ₹85L PA',
                      loc: 'Bangalore / Remote',
                      roles: '35+ Openings',
                      url: 'https://careers.swiggy.com'
                    },
                    {
                      name: 'Reliance Jio Platforms',
                      short: 'Jio',
                      logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Jio',
                      title: '5G Core Software Engineers & Indic LLM Scientists',
                      ctc: '₹16L - ₹42L PA',
                      loc: 'Navi Mumbai / Bangalore',
                      roles: '60+ Openings',
                      url: 'https://careers.jio.com'
                    },
                    {
                      name: 'Google India',
                      short: 'Google India',
                      logo: '/logos/google.svg',
                      title: 'Software Engineer III, Cloud Spanner & ML',
                      ctc: '₹45L - ₹90L PA',
                      loc: 'Bangalore / Hyderabad',
                      roles: '42+ Openings',
                      url: 'https://careers.google.com'
                    }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveCompanyForModal(item.short)}
                      className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500 cursor-pointer transition-all duration-200 group flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white p-1.5 shrink-0 flex items-center justify-center">
                          <img
                            src={item.logo}
                            alt={item.name}
                            className="w-7 h-7 object-contain"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                              {item.name}
                            </h4>
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                          </div>
                          <p className="text-[11px] text-slate-300 font-medium line-clamp-1 mt-0.5">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                            <span className="text-emerald-400 font-bold">{item.ctc}</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-slate-400 truncate max-w-[120px]">{item.loc}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-extrabold text-indigo-300 bg-indigo-950/90 border border-indigo-700/60 px-2 py-0.5 rounded-md inline-block mb-1">
                          {item.roles}
                        </span>
                        <div className="text-[11px] text-slate-400 group-hover:text-white font-semibold flex items-center justify-end gap-1">
                          <span>Jobs</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <button
                    onClick={handleSyncLiveJobs}
                    disabled={syncingJobs}
                    className="flex items-center gap-1.5 text-indigo-300 hover:text-white font-bold transition"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${syncingJobs ? 'animate-spin text-amber-300' : ''}`} />
                    <span>{syncingJobs ? 'Syncing...' : 'Sync Live Jobs'}</span>
                  </button>

                  <Link
                    to="/companies"
                    className="text-slate-300 hover:text-white font-bold flex items-center gap-1"
                  >
                    <span>View all 1,000+ companies</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOP INDIAN EMPLOYERS & UNICORNS GRID */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
                <Building2 className="w-4 h-4" />
                <span>Verified Direct Career Portals</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Top Indian Employers & Global GCCs
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Click any company to instantly view its live verified career portal and available openings.
              </p>
            </div>
            <Link
              to="/companies"
              className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group shrink-0"
            >
              <span>Explore All Indian Companies</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Clean Light Brand Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {TOP_INDIAN_COMPANIES.map((company, idx) => (
              <div
                key={idx}
                className="group p-4 rounded-3xl border border-slate-200/90 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 bg-white flex flex-col justify-between relative"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 p-2 shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-8 h-8 object-contain rounded"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {company.tag}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-1">
                    {company.name}
                  </h3>

                  <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                    <span>{company.ctc}</span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                    {company.loc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                  <a
                    href={company.careerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-0.5"
                    title="Official career website"
                  >
                    <span>Careers</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>

                  <button
                    onClick={() => setActiveCompanyForModal(company.short)}
                    className="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white text-xs font-bold transition shadow-xs"
                  >
                    Jobs
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED ACTIVE JOBS SECTION */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
                <Briefcase className="w-4 h-4" />
                <span>Verified Direct Openings</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Authentic Job Postings Across India
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Direct openings verified with genuine company career portal links.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs self-start md:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Jobs ({featuredJobs.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('easy')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'easy'
                    ? 'bg-emerald-600 text-white shadow-sm font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>⚡ Easy Apply</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('career')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'career'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Career Portals Only</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('remote')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'remote'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Remote Only
              </button>
            </div>
          </div>

          {/* Job Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-64 rounded-2xl bg-white border border-slate-200 p-6 animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.slice(0, 9).map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onApplyClick={(j) => setSelectedJobForApply(j)}
                />
              ))}
            </div>
          )}

          {/* View More Link */}
          <div className="mt-12 text-center">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/25 transition group"
            >
              <span>Explore All {featuredJobs.length}+ Real Jobs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* POPULAR TECH CATEGORIES */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Popular Career Disciplines
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              High-growth tracks actively hiring across Indian tech hubs.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {CATEGORIES_DISPLAY.map((cat, i) => {
              const IconComp = cat.icon;
              return (
                <Link
                  key={i}
                  to={`/jobs?category=${encodeURIComponent(cat.name)}`}
                  className="group p-5 rounded-2xl border border-slate-200/80 hover:border-indigo-500 hover:shadow-lg transition-all bg-white relative flex flex-col justify-between"
                >
                  {cat.hot && (
                    <span className="absolute top-3 right-3 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                      Hot
                    </span>
                  )}
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-xs">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{cat.count}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CAREERPULSE COMMUNITY SHOWCASE */}
      <section className="py-16 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
                <Users className="w-4 h-4" />
                <span>Peer Career Network</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                CareerPulse Community Circles
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Join 50,000+ Indian job seekers & working pros sharing real interview loops, offer comparisons, and walk-in drive alerts.
              </p>
            </div>
            <Link
              to="/community"
              className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group shrink-0"
            >
              <span>Explore All CareerPulse Discussions</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/community"
              className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700">
                  Interview Experiences
                </span>
                <span className="text-xs text-slate-400">1.8k discussions</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                TCS, Infosys & Swiggy SDE Technical Round Questions (2025-26)
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2">
                Real candidate transcripts covering machine coding, DSA, system design, and managerial rounds with proven tips.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 pt-2">
                <span>View discussion</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/community"
              className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700">
                  Salary & Negotiations
                </span>
                <span className="text-xs text-slate-400">2.4k discussions</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                Negotiating Counter-Offers Between Bengaluru Tech Unicorns
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2">
                How candidates navigated base salary vs. ESOP splits and joining bonuses for senior engineering roles.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 pt-2">
                <span>View discussion</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/community"
              className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700">
                  Fresher & Walk-in Drives
                </span>
                <span className="text-xs text-slate-400">3.1k discussions</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                Off-Campus & Walk-in Hiring Drives in Hyderabad, Pune & BLR
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2">
                Verified schedules, test links, and eligibility criteria for engineering and BCA/MCA graduates.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 pt-2">
                <span>View discussion</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* RECRUITER CTA */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-2xl sm:text-3xl font-black">
                Are you an Employer or Recruiter in India?
              </h3>
              <p className="mt-2 text-sm sm:text-base text-indigo-100">
                Post your open roles to thousands of verified Indian tech candidates. Shortlist candidates, download resumes, and hire faster.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/post-job"
                className="px-6 py-3.5 rounded-2xl bg-white text-indigo-900 font-extrabold text-sm shadow-lg hover:bg-indigo-50 transition"
              >
                Post a Job Free
              </Link>
              <Link
                to="/register?role=recruiter"
                className="px-6 py-3.5 rounded-2xl bg-indigo-500/30 border border-white/30 text-white font-extrabold text-sm hover:bg-white/20 transition"
              >
                Recruiter Sign Up
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Company Career Jobs Modal */}
      {activeCompanyForModal && (
        <CompanyJobsModal
          companyName={activeCompanyForModal}
          isOpen={Boolean(activeCompanyForModal)}
          onClose={() => setActiveCompanyForModal(null)}
        />
      )}

      {/* Quick Apply Modal */}
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
