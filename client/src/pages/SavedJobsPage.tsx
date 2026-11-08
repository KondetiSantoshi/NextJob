import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Job } from '../types';
import { JobCard } from '../components/JobCard';
import { ApplyModal } from '../components/ApplyModal';
import { Bookmark, Briefcase } from 'lucide-react';

export const SavedJobsPage: React.FC = () => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/jobs/seeker/saved');
      if (res.data.success) {
        setSavedJobs(res.data.jobs);
      }
    } catch (err) {
      console.error('Failed to load saved jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleSaveToggle = (jobId: string, isSaved: boolean) => {
    if (!isSaved) {
      setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white mb-2 inline-block">
            Bookmarked Opportunities
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Saved Jobs</h1>
          <p className="text-xs sm:text-sm text-indigo-100/90 mt-1">
            Review and apply to jobs you have bookmarked for later
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-56 bg-slate-200 animate-pulse rounded-3xl"></div>
            ))}
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-sm">
            <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No saved jobs yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Save openings while searching so you can revisit and apply anytime.
            </p>
            <Link
              to="/jobs"
              className="mt-4 inline-block px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              Search All Jobs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                isSavedInitial={true}
                onSaveToggle={handleSaveToggle}
                onApplyClick={(j) => setSelectedJobForApply(j)}
              />
            ))}
          </div>
        )}
      </div>

      <ApplyModal
        job={selectedJobForApply}
        isOpen={Boolean(selectedJobForApply)}
        onClose={() => setSelectedJobForApply(null)}
      />
    </div>
  );
};
