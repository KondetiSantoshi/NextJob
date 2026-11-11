'use client';

import React, { useState, useEffect } from 'react';
import { Job, ResumeItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/client';
import { X, FileText, Upload, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { getSpecificJobApplyUrl } from '../utils/jobRedirect';

interface ApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ job, isOpen, onClose, onSuccess }) => {
  const { user, profile } = useAuth();
  const { success, error } = useToast();
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [selectedResumeUrl, setSelectedResumeUrl] = useState<string>('');
  const [selectedResumeName, setSelectedResumeName] = useState<string>('');
  const [coverNote, setCoverNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    if (profile?.resumes && profile.resumes.length > 0) {
      setResumes(profile.resumes);
      const primary = profile.resumes.find((r) => r.isPrimary) || profile.resumes[0];
      setSelectedResumeUrl(primary.url);
      setSelectedResumeName(primary.name);
    } else {
      setSelectedResumeUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
      setSelectedResumeName('Default_Profile_Resume.pdf');
    }
  }, [profile, isOpen]);

  if (!isOpen || !job) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        // Save to seeker profile
        const resumeRes = await api.post('/profile/resumes', {
          name: res.data.filename,
          url: res.data.fileUrl,
          size: res.data.size,
        });

        if (resumeRes.data.success) {
          setResumes(resumeRes.data.resumes);
          setSelectedResumeUrl(res.data.fileUrl);
          setSelectedResumeName(res.data.filename);
          success('Resume uploaded successfully!');
        }
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to upload resume file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedResumeUrl) {
      error('Please select or upload a resume to proceed');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post(`/applications/${job._id}`, {
        resumeUrl: selectedResumeUrl,
        resumeName: selectedResumeName,
        coverNote,
      });

      if (res.data.success) {
        success('Application successfully submitted! Recruiter has been notified.');
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-2">
            Quick Job Application
          </span>
          <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            {job.companyName} • {job.location}
          </p>
        </div>

        {/* Direct official company requisition banner */}
        <div className="mb-5 p-3.5 bg-gradient-to-r from-indigo-50 via-purple-50 to-slate-50 rounded-2xl border border-indigo-100/90 flex items-center justify-between gap-3">
          <div className="text-xs">
            <span className="font-extrabold text-indigo-950 block">Official Company Requisition</span>
            <span className="text-slate-500">Apply directly on {job.companyName}'s official portal</span>
          </div>
          <a
            href={getSpecificJobApplyUrl(job)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 shrink-0 transition"
          >
            <span>Apply on Site</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Resume Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Resume
            </label>

            {resumes.length > 0 ? (
              <div className="space-y-2 mb-3">
                {resumes.map((r) => (
                  <label
                    key={r._id || r.url}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      selectedResumeUrl === r.url
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 truncate max-w-[220px]">
                          {r.name}
                        </p>
                        <p className="text-xs text-slate-400">{r.size || 'PDF Document'}</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="resumeSelect"
                      checked={selectedResumeUrl === r.url}
                      onChange={() => {
                        setSelectedResumeUrl(r.url);
                        setSelectedResumeName(r.name);
                      }}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                ))}
              </div>
            ) : null}

            {/* Upload alternative */}
            <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-indigo-400 transition bg-slate-50/50">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-1.5 pointer-events-none">
                <Upload className="w-5 h-5 text-indigo-600" />
                <p className="text-xs font-semibold text-slate-700">
                  {isUploading ? 'Uploading file...' : 'Upload New Resume (PDF / DOC)'}
                </p>
                <p className="text-[11px] text-slate-400">Max size 10MB</p>
              </div>
            </div>
          </div>

          {/* Cover Note / Pitch */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Note to Recruiter (Optional)
            </label>
            <textarea
              rows={3}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder="Highlight why your skills and experience are a great fit for this position..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>

          {/* User Confirmation Summary */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3 text-xs text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Applying as <strong className="text-slate-900">{user?.name}</strong> ({user?.email})
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 disabled:opacity-50 transition"
            >
              {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
