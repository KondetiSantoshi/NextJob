'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '../api/client';
import { Company, Job, CompanyReview } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { JobCard } from '../components/JobCard';
import { ApplyModal } from '../components/ApplyModal';
import { resolveCompanyLogo } from '../utils/companyLogo';
import {
  Building2,
  CheckCircle2,
  Star,
  MapPin,
  Globe,
  Users,
  Calendar,
  Briefcase,
  Plus,
  X,
  ArrowRight,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';

export const CompanyDetailsPage: React.FC = () => {
  const params = useParams<{ id?: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { user } = useAuth();
  const { success, error } = useToast();

  const [company, setCompany] = useState<Company | null>(null);
  const [openJobs, setOpenJobs] = useState<Job[]>([]);
  const [reviews, setReviews] = useState<CompanyReview[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);

  // Review modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [workLife, setWorkLife] = useState(4);
  const [salaryBenefit, setSalaryBenefit] = useState(4);
  const [cultureScore, setCultureScore] = useState(4);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/companies/${id}`);
      if (res.data.success) {
        setCompany(res.data.company);
        setOpenJobs(res.data.openJobs || []);
        setReviews(res.data.reviews || []);
        setIsFollowing(res.data.isFollowing || false);
      }
    } catch (err) {
      console.error('Failed to load company details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCompanyDetails();
  }, [id]);

  const handleToggleFollow = async () => {
    if (!user) {
      error('Please sign in to follow companies');
      return;
    }

    try {
      const res = await api.post(`/companies/${company?._id}/follow`);
      if (res.data.success) {
        setIsFollowing(res.data.isFollowing);
        success(res.data.message);
      }
    } catch (err) {
      error('Failed to toggle follow');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      error('Please log in to submit a review');
      return;
    }

    try {
      setIsSubmittingReview(true);
      const res = await api.post(`/companies/${company?._id}/reviews`, {
        rating,
        title: reviewTitle,
        roleTitle,
        pros,
        cons,
        workLifeBalance: workLife,
        salaryBenefits: salaryBenefit,
        culture: cultureScore,
      });

      if (res.data.success) {
        success('Review submitted successfully!');
        setReviews([res.data.review, ...reviews]);
        if (company) {
          setCompany({
            ...company,
            rating: res.data.companyRating,
            reviewsCount: res.data.reviewsCount,
          });
        }
        setReviewModalOpen(false);
        setReviewTitle('');
        setPros('');
        setCons('');
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Company Not Found</h2>
        <Link href="/companies" className="mt-4 inline-block text-indigo-600 font-semibold">
          ← Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Company Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div
            className="h-44 sm:h-56 bg-cover bg-center relative"
            style={{
              backgroundImage: `url(${
                company.banner ||
                'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80'
              })`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
          </div>

          <div className="px-6 sm:px-10 pb-8 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
              <div className="flex items-end gap-5">
                <img
                  src={resolveCompanyLogo(company.name, company.logo)}
                  alt={company.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-contain bg-white p-3 border-4 border-white shadow-xl"
                />
                <div className="mb-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      {company.name}
                    </h1>
                    {company.verified && (
                      <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
                    {company.industry} • Headquarters: {company.location}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {company.careerPageUrl && (
                  <a
                    href={company.careerPageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition flex items-center gap-1.5"
                  >
                    <span>Official Careers Portal</span>
                    <Globe className="w-4 h-4" />
                  </a>
                )}

                <button
                  onClick={handleToggleFollow}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                    isFollowing
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20'
                  }`}
                >
                  {isFollowing ? 'Following' : '+ Follow Company'}
                </button>

                <button
                  onClick={() => setReviewModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition flex items-center gap-1.5"
                >
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Write Review
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-slate-100 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Rating</p>
                  <p className="font-bold text-slate-800">
                    {company.rating || 4.5} ({company.reviewsCount || 0} Reviews)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Company Size</p>
                  <p className="font-bold text-slate-800">{company.size || '500+ employees'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Founded Year</p>
                  <p className="font-bold text-slate-800">{company.foundedYear || 2014}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Website</p>
                  <a
                    href={company.website || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-indigo-600 hover:underline truncate block max-w-[150px]"
                  >
                    {company.website?.replace(/^https?:\/\//, '') || 'Website'}
                  </a>
                </div>
              </div>
            </div>

            {/* Description & Perks */}
            <div className="pt-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">About {company.name}</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {company.description}
              </p>

              {company.benefits && company.benefits.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Company Perks & Benefits
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {company.benefits.map((b, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Open Job Positions at this company */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Active Job Openings at {company.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Apply directly to hiring managers at this organization
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
              {openJobs.length} Positions Available
            </span>
          </div>

          {openJobs.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 shadow-sm">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">
                No active openings currently posted on NexJob
              </p>
              {company.careerPageUrl && (
                <div className="mt-3">
                  <a
                    href={company.careerPageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs transition"
                  >
                    <span>Check live openings on {company.name} Careers</span>
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {openJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onApplyClick={(j) => setSelectedJobForApply(j)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Employee Reviews & Ratings Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Employee Reviews & Culture</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Honest feedback from verified team members
              </p>
            </div>
            <button
              onClick={() => setReviewModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              Write Review
            </button>
          </div>

          {reviews.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No reviews written yet. Be the first employee to share your experience!
            </p>
          ) : (
            <div className="space-y-6">
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="pb-6 border-b border-slate-100 last:border-0 last:pb-0 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          rev.author?.avatar ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                            rev.author?.name || 'User'
                          )}`
                        }
                        alt="Author"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{rev.title}</h4>
                        <p className="text-xs text-slate-500">
                          {rev.roleTitle} • {rev.isCurrentEmployee ? 'Current Employee' : 'Former Employee'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2.5 py-1 rounded-lg">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{rev.rating}.0 / 5.0</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                      <span className="font-bold text-emerald-800">Pros: </span>
                      <span className="text-slate-700">{rev.pros}</span>
                    </div>
                    <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-100">
                      <span className="font-bold text-rose-800">Cons: </span>
                      <span className="text-slate-700">{rev.cons}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Write Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setReviewModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-2">Write Review for {company.name}</h3>
            <p className="text-xs text-slate-500 mb-5">
              Share your authentic workplace experience to help fellow job seekers.
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Overall Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200 fill-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">{rating}.0 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Role Title at Company
                </label>
                <input
                  type="text"
                  required
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Fast-paced culture and great leadership"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pros</label>
                <textarea
                  rows={2}
                  required
                  value={pros}
                  onChange={(e) => setPros(e.target.value)}
                  placeholder="What did you love about working here?"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cons</label>
                <textarea
                  rows={2}
                  required
                  value={cons}
                  onChange={(e) => setCons(e.target.value)}
                  placeholder="What could be improved?"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {isSubmittingReview ? 'Posting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      <ApplyModal
        job={selectedJobForApply}
        isOpen={Boolean(selectedJobForApply)}
        onClose={() => setSelectedJobForApply(null)}
      />
    </div>
  );
};
