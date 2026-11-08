import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Company } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CompanyJobsModal } from '../components/CompanyJobsModal';
import {
  Building2,
  Search,
  Star,
  CheckCircle2,
  MapPin,
  ArrowRight,
  ExternalLink,
  Users,
  Filter,
  Sparkles,
  RotateCw,
  Briefcase,
} from 'lucide-react';

const SECTORS = [
  'All Sectors',
  'IT Services & Consulting',
  'FoodTech & Quick Commerce',
  'Fintech & Digital Payments',
  'E-commerce & Quick Commerce',
  'Cloud, Search & AI',
  'Telecom, 5G, Cloud & AI',
  'Banking & Financial Technology',
  'Enterprise SaaS & Cloud',
];

const INDIAN_HUBS = [
  'All Cities',
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Mumbai',
  'Delhi-NCR',
  'Chennai',
];

export const CompanyDirectoryPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [sector, setSector] = useState('All Sectors');
  const [selectedCity, setSelectedCity] = useState('All Cities');

  // Modal for Viewing Company Jobs
  const [selectedCompanyForModal, setSelectedCompanyForModal] = useState<string | null>(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (keyword.trim()) params.append('q', keyword.trim());
      if (sector !== 'All Sectors') params.append('industry', sector);
      if (selectedCity !== 'All Cities') params.append('location', selectedCity);

      const res = await api.get(`/companies?${params.toString()}`);
      if (res.data.success) {
        setCompanies(res.data.companies);
      }
    } catch (err) {
      console.error('Failed to load companies', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [sector, selectedCity]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCompanies();
  };

  const handleToggleFollow = async (companyId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      error('Please log in to follow companies');
      return;
    }

    try {
      const res = await api.post(`/companies/${companyId}/follow`);
      if (res.data.success) {
        success(res.data.message);
        setCompanies((prev) =>
          prev.map((c) =>
            c._id === companyId
              ? {
                  ...c,
                  followers: res.data.isFollowing
                    ? [...(c.followers || []), user._id]
                    : (c.followers || []).filter((id) => id !== user._id),
                }
              : c
          )
        );
      }
    } catch (err) {
      error('Failed to toggle follow');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-indigo-200 border border-white/15 mb-3.5 inline-block">
              ⚡ Over 1,000+ Indian Companies & MNC Career Portals
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Indian Companies Career Directory
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Explore verified official career pages and live job openings for India’s top IT services giants, consumer unicorns, fintechs, and global tech engineering centers.
            </p>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 flex items-center gap-3 w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
              <Search className="w-5 h-5 text-indigo-600 shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search by company name, technology, or domain (e.g. TCS, Swiggy, Infosys, Flipkart, Paytm)..."
                className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-indigo-600/20 transition shrink-0"
            >
              Search Companies
            </button>
          </form>

          {/* Quick Filter Selectors */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
            {/* Sector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
                Sector:
              </span>
              {SECTORS.slice(0, 5).map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSector(sec)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    sector === sec
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>

            {/* City Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <MapPin className="w-4 h-4 text-slate-400" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="text-xs font-semibold p-2 rounded-xl border border-slate-200 text-slate-800 bg-white focus:outline-none"
              >
                {INDIAN_HUBS.map((hub) => (
                  <option key={hub} value={hub}>
                    {hub}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Companies Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-3xl"></div>
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-sm">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No companies found matching "{keyword}"</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              You can search for any company in India and we will dynamically locate its official career portal.
            </p>
            {keyword && (
              <button
                onClick={() => setSelectedCompanyForModal(keyword)}
                className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition"
              >
                Search Official Career Jobs for "{keyword}" ↗
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => {
              const isFollowing = user && company.followers?.includes(user._id);

              return (
                <div
                  key={company._id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Logo & Follow */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={
                            company.logo ||
                            `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                              company.name
                            )}`
                          }
                          alt={company.name}
                          className="w-14 h-14 rounded-2xl object-contain bg-slate-50 p-2 border border-slate-200 shadow-xs shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Link
                              to={`/companies/${company._id}`}
                              className="text-base font-extrabold text-slate-900 hover:text-indigo-600 transition"
                            >
                              {company.name}
                            </Link>
                            {company.verified && (
                              <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-medium">{company.industry}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs">
                            <span className="flex items-center gap-1 text-amber-600 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              {company.rating || 4.3}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500">
                              {company.reviewsCount || 42}+ reviews
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleToggleFollow(company._id, e)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                          isFollowing
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                        }`}
                      >
                        {isFollowing ? 'Following' : '+ Follow'}
                      </button>
                    </div>

                    {/* Description */}
                    <p className="mt-4 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {company.description}
                    </p>

                    {/* Location & Career Page Link */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{company.headquarters || company.location}</span>
                      </div>

                      {company.careerPageUrl && (
                        <a
                          href={company.careerPageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg transition"
                          title="Visit official careers website"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Bottom Actions: View Jobs & Profile */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedCompanyForModal(company.name)}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-xs transition"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>View Career Jobs</span>
                    </button>

                    <Link
                      to={`/companies/${company._id}`}
                      className="text-xs font-bold text-slate-700 hover:text-indigo-600 flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition"
                    >
                      <span>Company Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Company Jobs Modal */}
      {selectedCompanyForModal && (
        <CompanyJobsModal
          companyName={selectedCompanyForModal}
          isOpen={Boolean(selectedCompanyForModal)}
          onClose={() => setSelectedCompanyForModal(null)}
        />
      )}
    </div>
  );
};
