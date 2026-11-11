'use client';

import React from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Users,
  Building2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Award,
  Globe,
} from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700">
            About NexJob Platform
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Bridging Talent, Opportunity, and Professional Community
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Inspired by the search depth of Naukri, the networking power of LinkedIn, and the
            peer-powered discussions of CareerPulse Community, NexJob is India's next-generation
            career ecosystem.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Precision Job Matching</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Powerful multi-filter search algorithms that align experience, skills, CTC, and work
              modes with verified employer openings in seconds.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Professional Networking</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Connect directly with engineering directors, recruiters, and fellow builders. Share
              technical insights and accelerate career breakthroughs.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Verified Employer Trust</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Every recruiter and company undergoes rigorous domain verification, eliminating
              spam, fake postings, and fraudulent listings.
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-indigo-900 text-white rounded-3xl p-8 sm:p-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center shadow-xl">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">25,000+</p>
            <p className="text-xs text-indigo-200 mt-1 uppercase tracking-wider font-semibold">
              Active Job Openings
            </p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">500+</p>
            <p className="text-xs text-indigo-200 mt-1 uppercase tracking-wider font-semibold">
              Verified Enterprises
            </p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">100,000+</p>
            <p className="text-xs text-indigo-200 mt-1 uppercase tracking-wider font-semibold">
              Candidate Members
            </p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">99.8%</p>
            <p className="text-xs text-indigo-200 mt-1 uppercase tracking-wider font-semibold">
              Uptime Reliability
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-sm space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Ready to Take the Next Step in Your Career?
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Join thousands of professionals landing dream jobs and hiring managers scaling tech pods.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition"
            >
              Get Started for Free
            </Link>
            <Link
              href="/jobs"
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition"
            >
              Browse Open Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
