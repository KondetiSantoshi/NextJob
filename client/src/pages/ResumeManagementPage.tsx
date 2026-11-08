import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ResumeItem } from '../types';
import {
  FileText,
  Upload,
  CheckCircle2,
  Trash2,
  Download,
  Star,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const ResumeManagementPage: React.FC = () => {
  const { profile, refreshUser } = useAuth();
  const { success, error } = useToast();

  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (profile?.resumes) {
      setResumes(profile.resumes);
    }
  }, [profile]);

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
        const resumeRes = await api.post('/profile/resumes', {
          name: res.data.filename,
          url: res.data.fileUrl,
          size: res.data.size,
        });

        if (resumeRes.data.success) {
          setResumes(resumeRes.data.resumes);
          success('Resume uploaded successfully!');
          refreshUser();
        }
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to upload resume file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetPrimary = async (resumeId: string) => {
    try {
      const res = await api.put(`/profile/resumes/${resumeId}/primary`);
      if (res.data.success) {
        success('Primary resume updated');
        setResumes(res.data.resumes);
        refreshUser();
      }
    } catch (err) {
      error('Failed to set primary resume');
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      const res = await api.delete(`/profile/resumes/${resumeId}`);
      if (res.data.success) {
        success('Resume deleted');
        setResumes(res.data.resumes);
        refreshUser();
      }
    } catch (err) {
      error('Failed to delete resume');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white mb-2 inline-block">
            CV & Documents
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Resume Management</h1>
          <p className="text-xs sm:text-sm text-indigo-100/90 mt-1">
            Upload tailored resumes for specific job roles and configure your primary application CV
          </p>
        </div>

        {/* Upload Box */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm text-center">
          <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 rounded-2xl p-8 transition bg-indigo-50/20 relative group">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center gap-2 pointer-events-none">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 mt-2">
                {isUploading ? 'Uploading Resume Document...' : 'Click or Drag & Drop to Upload Resume'}
              </h3>
              <p className="text-xs text-slate-400">Supported formats: PDF, DOCX (Max 10MB)</p>
            </div>
          </div>
        </div>

        {/* Resumes List */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Your Uploaded Resumes</h2>

          {resumes.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No resumes uploaded yet. Upload a PDF resume above to start applying in one click.
            </p>
          ) : (
            <div className="space-y-3">
              {resumes.map((r) => (
                <div
                  key={r._id || r.url}
                  className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    r.isPrimary
                      ? 'border-indigo-300 bg-indigo-50/40'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{r.name}</h4>
                        {r.isPrimary && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {r.size || 'PDF'} • Uploaded {new Date(r.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!r.isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(r._id)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-indigo-400 text-xs font-semibold text-slate-700 transition"
                      >
                        Set as Primary
                      </button>
                    )}

                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition"
                      title="Download / View"
                    >
                      <Download className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => handleDeleteResume(r._id)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
