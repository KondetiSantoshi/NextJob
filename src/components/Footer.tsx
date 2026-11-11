'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase, Github, Linkedin, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Nex<span className="text-indigo-400">Job</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              India’s next-generation professional ecosystem uniting job seekers, top recruiters,
              knowledge communities, and verified company networks.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white flex items-center justify-center text-slate-400 transition"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white flex items-center justify-center text-slate-400 transition"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white flex items-center justify-center text-slate-400 transition"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* For Job Seekers */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Job Seekers</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/jobs" className="hover:text-indigo-400 transition">
                  Search All Jobs
                </Link>
              </li>
              <li>
                <Link href="/jobs?fresher=true" className="hover:text-indigo-400 transition">
                  Fresher Jobs
                </Link>
              </li>
              <li>
                <Link href="/jobs?workMode=Remote" className="hover:text-indigo-400 transition">
                  Remote Opportunities
                </Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-indigo-400 transition">
                  Top Hiring Companies
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-indigo-400 transition">
                  Interview Experiences
                </Link>
              </li>
              <li>
                <Link href="/resumes" className="hover:text-indigo-400 transition">
                  Resume Builder & Upload
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Employers</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/post-job" className="hover:text-indigo-400 transition">
                  Post a Job Opening
                </Link>
              </li>
              <li>
                <Link href="/dashboard/recruiter" className="hover:text-indigo-400 transition">
                  Recruiter Hub
                </Link>
              </li>
              <li>
                <Link href="/register?role=recruiter" className="hover:text-indigo-400 transition">
                  Register Company Profile
                </Link>
              </li>
              <li>
                <Link href="/network" className="hover:text-indigo-400 transition">
                  Talent Sourcing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-400 transition">
                  Hiring Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">NexJob</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/about" className="hover:text-indigo-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-400 transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-indigo-400 transition">
                  CareerPulse Community
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-indigo-400 transition">
                  Privacy & Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} NexJob Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            Built with modern Next.js, React, Node.js & MongoDB
          </div>
        </div>
      </div>
    </footer>
  );
};
