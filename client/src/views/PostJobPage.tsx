'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/client';
import { Company } from '../types';
import {
  Briefcase,
  Building2,
  MapPin,
  IndianRupee,
  Calendar,
  Sparkles,
  Plus,
  X,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';

const CATEGORIES = [
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

export const PostJobPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const router = useRouter();

  const company = user?.company as Company;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Software Development');
  const [workMode, setWorkMode] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');
  const [jobType, setJobType] = useState<'Full-time' | 'Part-time' | 'Contract' | 'Internship'>('Full-time');
  const [minExp, setMinExp] = useState(2);
  const [maxExp, setMaxExp] = useState(5);
  const [salaryMin, setSalaryMin] = useState(15);
  const [salaryMax, setSalaryMax] = useState(25);
  const [salaryRange, setSalaryRange] = useState('₹15 - 25 LPA');
  const [location, setLocation] = useState(user?.location || 'Bangalore, India');
  const [vacancies, setVacancies] = useState(2);
  const [education, setEducation] = useState("Bachelor's Degree in Computer Science or related field");
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [description, setDescription] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState('');
  const [featured, setFeatured] = useState(false);

  // Skill tags
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript', 'Node.js']);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || skills.length === 0) {
      error('Please complete job title, description, and at least one required skill');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post('/jobs', {
        title,
        category,
        workMode,
        jobType,
        minExperience: Number(minExp),
        maxExperience: Number(maxExp),
        salaryMin: Number(salaryMin),
        salaryMax: Number(salaryMax),
        salaryRange: salaryRange || `₹${salaryMin} - ${salaryMax} LPA`,
        location,
        vacancies: Number(vacancies),
        education,
        deadline,
        description,
        requirements: requirementsText,
        responsibilities: responsibilitiesText,
        skills,
        featured,
      });

      if (res.data.success) {
        success('Job opening posted successfully! Candidates can now apply.');
        router.push('/dashboard/recruiter');
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to post job opening');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white mb-2 inline-block">
            Recruiter Job Publisher
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Post a New Job Opening</h1>
          <p className="text-xs sm:text-sm text-indigo-100/90 mt-1">
            Publish your job opening to reach thousands of qualified candidates on NexJob
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Job Designation / Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Job Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Work Mode, Job Type, Vacancies */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Work Mode *
                </label>
                <select
                  value={workMode}
                  onChange={(e: any) => setWorkMode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition"
                >
                  <option value="Remote">Remote (100% WFH)</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site (Office)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Job Type *
                </label>
                <select
                  value={jobType}
                  onChange={(e: any) => setJobType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Number of Vacancies
                </label>
                <input
                  type="number"
                  min={1}
                  value={vacancies}
                  onChange={(e) => setVacancies(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>
            </div>

            {/* Experience Range & Salary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Experience Required (Years)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={minExp}
                    onChange={(e) => setMinExp(Number(e.target.value))}
                    placeholder="Min"
                    className="w-1/2 px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                  <span className="text-slate-400 font-bold">to</span>
                  <input
                    type="number"
                    min={0}
                    value={maxExp}
                    onChange={(e) => setMaxExp(Number(e.target.value))}
                    placeholder="Max"
                    className="w-1/2 px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Salary Display (e.g. ₹18 - 28 LPA)
                </label>
                <input
                  type="text"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  placeholder="₹15 - 25 LPA"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>
            </div>

            {/* Location & Application Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Job Location (City / State) *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bangalore, India"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Application Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>
            </div>

            {/* Required Skills (Interactive Chips) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Required Technical Skills (Press Enter or click +) *
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="e.g. Python, Docker, React, AWS"
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs hover:bg-indigo-100 transition"
                >
                  + Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Educational Qualification */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Educational Qualification
              </label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g. B.Tech / B.E. / MCA in Computer Science"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Job Overview & Role Description *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the opportunity, core technical stack, and day-to-day team impact..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            {/* Key Requirements */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Key Requirements (One bullet point per line)
              </label>
              <textarea
                rows={3}
                value={requirementsText}
                onChange={(e) => setRequirementsText(e.target.value)}
                placeholder="3+ years of production experience with TypeScript and React&#10;Deep understanding of distributed systems and REST APIs&#10;Proven track record in agile team environments"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            {/* Responsibilities */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Key Responsibilities (One bullet point per line)
              </label>
              <textarea
                rows={3}
                value={responsibilitiesText}
                onChange={(e) => setResponsibilitiesText(e.target.value)}
                placeholder="Architect and build high-performance checkout flows&#10;Maintain 99.9% uptime and zero-downtime releases&#10;Mentor junior software developers"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            {/* Featured Checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-bold text-slate-800">
                  Highlight this as a Featured Job Posting (Top of Search Results)
                </span>
              </label>
            </div>

            {/* Submit Bar */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => router.push('/dashboard/recruiter')}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Publishing...' : 'Publish Job Posting'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
