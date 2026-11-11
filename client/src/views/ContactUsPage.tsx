'use client';

import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  HelpCircle,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';

export const ContactUsPage: React.FC = () => {
  const { success } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      success('Thank you! Your inquiry has been dispatched to our support team.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            We are Here to Help You
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Have questions about enterprise employer plans, candidate accounts, or community
            partnerships? Reach out and our team will respond within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Contact Information</h3>
              <p className="text-xs sm:text-sm text-indigo-100/80 leading-relaxed">
                Connect with our dedicated support lines or visit our tech hubs across India.
              </p>

              <div className="space-y-5 pt-2">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-indigo-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-indigo-200">Email Support</p>
                    <p className="text-sm font-bold text-white">support@nexjob.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-indigo-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-indigo-200">Toll-Free Phone</p>
                    <p className="text-sm font-bold text-white">+91 (800) 456-7890</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-indigo-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-indigo-200">Corporate Headquarters</p>
                    <p className="text-sm font-bold text-white leading-relaxed">
                      Outer Ring Road, Bellandur, Bangalore, Karnataka 560103, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 text-xs text-indigo-200">
              Operating hours: Monday – Saturday, 9:00 AM – 7:00 PM IST
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Send Us a Direct Message</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Employer Plan Inquiry or Bug Report"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Message Details *
                </label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can our support team assist you today?"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
