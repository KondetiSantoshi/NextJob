'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/client';
import { JobSeekerProfile, User, ProjectItem, Certification, LanguageItem } from '../types';
import {
  User as UserIcon,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Linkedin,
  Github,
  MapPin,
  Mail,
  Phone,
  FileText,
  Edit3,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  IndianRupee,
  Clock,
  Sparkles,
  ExternalLink,
  Code,
  Languages,
  FolderGit2,
  Upload,
  Download,
  ShieldCheck,
  Calendar,
  Layers,
  Compass,
} from 'lucide-react';

export const CandidateProfilePage: React.FC = () => {
  const params = useParams<{ id?: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { user: currentUser, profile: myProfile, refreshUser } = useAuth();
  const { success, error } = useToast();

  const isSelf = !id || id === currentUser?._id;

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<JobSeekerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit Profile Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTab, setEditTab] = useState<'basic' | 'career' | 'preferences'>('basic');
  const [editHeadline, setEditHeadline] = useState('');
  const [editAbout, setEditAbout] = useState('');
  const [editPrimaryRole, setEditPrimaryRole] = useState('Full Stack Developer');
  const [editCurrentCompany, setEditCurrentCompany] = useState('');
  const [editCurrentDesignation, setEditCurrentDesignation] = useState('');
  const [editTotalExperienceYears, setEditTotalExperienceYears] = useState<number>(0);
  const [editCurrentSalary, setEditCurrentSalary] = useState('');
  const [editExpectedSalary, setEditExpectedSalary] = useState('');
  const [editNoticePeriod, setEditNoticePeriod] = useState('Immediate / 30 Days');
  const [editAvailabilityStatus, setEditAvailabilityStatus] = useState<
    'Actively looking' | 'Casually exploring' | 'Serving notice period' | 'Not looking'
  >('Actively looking');
  const [editLastWorkingDay, setEditLastWorkingDay] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [editCurrentCity, setEditCurrentCity] = useState('');
  const [editOpenToRelocate, setEditOpenToRelocate] = useState(true);
  const [editPreferredLocations, setEditPreferredLocations] = useState('');
  const [editPreferredWorkModes, setEditPreferredWorkModes] = useState('');
  const [editPortfolio, setEditPortfolio] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [editGithub, setEditGithub] = useState('');
  const [editLeetcode, setEditLeetcode] = useState('');
  const [editTwitter, setEditTwitter] = useState('');

  // Add Skill Modal
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Expert'>('Intermediate');

  // Add Experience Modal
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expLocation, setExpLocation] = useState('');
  const [expDuration, setExpDuration] = useState('');
  const [expDesc, setExpDesc] = useState('');

  // Add Education Modal
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [eduDegree, setEduDegree] = useState('');
  const [eduCollege, setEduCollege] = useState('');
  const [eduField, setEduField] = useState('');
  const [eduYears, setEduYears] = useState('');
  const [eduGrade, setEduGrade] = useState('');

  // Add Project Modal
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectTech, setProjectTech] = useState('');
  const [projectLiveUrl, setProjectLiveUrl] = useState('');
  const [projectGithubUrl, setProjectGithubUrl] = useState('');
  const [projectDuration, setProjectDuration] = useState('');

  // Add Certification Modal
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certName, setCertName] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certIssueDate, setCertIssueDate] = useState('');
  const [certUrl, setCertUrl] = useState('');

  // Add Language Modal
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [langName, setLangName] = useState('');
  const [langProficiency, setLangProficiency] = useState<'Basic' | 'Conversational' | 'Fluent' | 'Native / Bilingual'>('Fluent');

  // Resume Upload
  const [uploadingResume, setUploadingResume] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      if (isSelf) {
        const res = await api.get('/profile/me');
        if (res.data.success) {
          setProfileData(res.data.profile);
          setProfileUser(currentUser);
        }
      } else {
        const res = await api.get(`/profile/user/${id}`);
        if (res.data.success) {
          setProfileUser(res.data.user);
          setProfileData(res.data.profile);
        }
      }
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id, currentUser]);

  const openEditModal = () => {
    setEditHeadline(profileData?.headline || currentUser?.headline || '');
    setEditAbout(profileData?.about || currentUser?.bio || '');
    setEditPrimaryRole(profileData?.primaryRole || 'Full Stack Developer');
    setEditCurrentCompany(profileData?.currentCompany || '');
    setEditCurrentDesignation(profileData?.currentDesignation || '');
    setEditTotalExperienceYears(profileData?.totalExperienceYears || 0);
    setEditCurrentSalary(profileData?.currentSalary || '');
    setEditExpectedSalary(profileData?.expectedSalary || '');
    setEditNoticePeriod(profileData?.noticePeriod || 'Immediate / 30 Days');
    setEditAvailabilityStatus(profileData?.availabilityStatus || 'Actively looking');
    setEditLastWorkingDay(profileData?.lastWorkingDay || '');
    setEditMobile(profileData?.mobile || currentUser?.mobile || '');
    setEditCurrentCity(profileData?.currentCity || currentUser?.location || '');
    setEditOpenToRelocate(profileData?.openToRelocate !== false);
    setEditPreferredLocations((profileData?.preferredLocations || []).join(', '));
    setEditPreferredWorkModes((profileData?.preferredWorkModes || []).join(', '));
    setEditPortfolio(profileData?.portfolioUrl || '');
    setEditLinkedin(profileData?.linkedinUrl || '');
    setEditGithub(profileData?.githubUrl || '');
    setEditLeetcode(profileData?.leetcodeUrl || '');
    setEditTwitter(profileData?.twitterUrl || '');
    setEditTab('basic');
    setEditModalOpen(true);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const prefLocs = editPreferredLocations
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const prefModes = editPreferredWorkModes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await api.put('/profile', {
        headline: editHeadline,
        about: editAbout,
        primaryRole: editPrimaryRole,
        currentCompany: editCurrentCompany,
        currentDesignation: editCurrentDesignation,
        totalExperienceYears: Number(editTotalExperienceYears) || 0,
        currentSalary: editCurrentSalary,
        expectedSalary: editExpectedSalary,
        noticePeriod: editNoticePeriod,
        availabilityStatus: editAvailabilityStatus,
        lastWorkingDay: editLastWorkingDay,
        mobile: editMobile,
        currentCity: editCurrentCity,
        openToRelocate: editOpenToRelocate,
        preferredLocations: prefLocs,
        preferredWorkModes: prefModes,
        portfolioUrl: editPortfolio,
        linkedinUrl: editLinkedin,
        githubUrl: editGithub,
        leetcodeUrl: editLeetcode,
        twitterUrl: editTwitter,
      });

      if (res.data.success) {
        success('Profile updated successfully!');
        setProfileData(res.data.profile);
        setEditModalOpen(false);
        refreshUser();
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  // Skill Handlers
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    try {
      const currentSkills = profileData?.skills || [];
      const updatedSkills = [...currentSkills, { name: newSkillName.trim(), level: newSkillLevel }];
      const res = await api.put('/profile', { skills: updatedSkills });

      if (res.data.success) {
        success('Skill added successfully');
        setProfileData(res.data.profile);
        setSkillModalOpen(false);
        setNewSkillName('');
      }
    } catch (err) {
      error('Failed to add skill');
    }
  };

  const handleDeleteSkill = async (skillName: string) => {
    try {
      const currentSkills = profileData?.skills || [];
      const updatedSkills = currentSkills.filter((s) => s.name !== skillName);
      const res = await api.put('/profile', { skills: updatedSkills });

      if (res.data.success) {
        success('Skill removed');
        setProfileData(res.data.profile);
      }
    } catch (err) {
      error('Failed to remove skill');
    }
  };

  // Experience Handlers
  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const currentExp = profileData?.experience || [];
      const updatedExp = [
        ...currentExp,
        {
          title: expTitle,
          company: expCompany,
          location: expLocation,
          startDate: expDuration,
          description: expDesc,
          current: true,
        },
      ];
      const res = await api.put('/profile', { experience: updatedExp });
      if (res.data.success) {
        success('Experience added');
        setProfileData(res.data.profile);
        setExpModalOpen(false);
        setExpTitle('');
        setExpCompany('');
        setExpLocation('');
        setExpDuration('');
        setExpDesc('');
      }
    } catch (err) {
      error('Failed to add experience');
    }
  };

  const handleDeleteExperience = async (index: number) => {
    try {
      const currentExp = profileData?.experience || [];
      const updatedExp = currentExp.filter((_, idx) => idx !== index);
      const res = await api.put('/profile', { experience: updatedExp });
      if (res.data.success) {
        success('Experience removed');
        setProfileData(res.data.profile);
      }
    } catch (err) {
      error('Failed to remove experience');
    }
  };

  // Education Handlers
  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const currentEdu = profileData?.education || [];
      const updatedEdu = [
        ...currentEdu,
        {
          degree: eduDegree,
          institution: eduCollege,
          fieldOfStudy: eduField,
          endYear: eduYears,
          grade: eduGrade,
        },
      ];
      const res = await api.put('/profile', { education: updatedEdu });
      if (res.data.success) {
        success('Education added');
        setProfileData(res.data.profile);
        setEduModalOpen(false);
        setEduDegree('');
        setEduCollege('');
        setEduField('');
        setEduYears('');
        setEduGrade('');
      }
    } catch (err) {
      error('Failed to add education');
    }
  };

  const handleDeleteEducation = async (index: number) => {
    try {
      const currentEdu = profileData?.education || [];
      const updatedEdu = currentEdu.filter((_, idx) => idx !== index);
      const res = await api.put('/profile', { education: updatedEdu });
      if (res.data.success) {
        success('Education removed');
        setProfileData(res.data.profile);
      }
    } catch (err) {
      error('Failed to remove education');
    }
  };

  // Project Handlers
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const currentProjects = profileData?.projects || [];
      const techList = projectTech
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const updatedProjects = [
        ...currentProjects,
        {
          title: projectTitle,
          description: projectDesc,
          techStack: techList,
          liveUrl: projectLiveUrl,
          githubUrl: projectGithubUrl,
          duration: projectDuration,
        },
      ];
      const res = await api.put('/profile', { projects: updatedProjects });
      if (res.data.success) {
        success('Project added successfully!');
        setProfileData(res.data.profile);
        setProjectModalOpen(false);
        setProjectTitle('');
        setProjectDesc('');
        setProjectTech('');
        setProjectLiveUrl('');
        setProjectGithubUrl('');
        setProjectDuration('');
      }
    } catch (err) {
      error('Failed to add project');
    }
  };

  const handleDeleteProject = async (index: number) => {
    try {
      const currentProjects = profileData?.projects || [];
      const updatedProjects = currentProjects.filter((_, idx) => idx !== index);
      const res = await api.put('/profile', { projects: updatedProjects });
      if (res.data.success) {
        success('Project removed');
        setProfileData(res.data.profile);
      }
    } catch (err) {
      error('Failed to remove project');
    }
  };

  // Certification Handlers
  const handleAddCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const currentCerts = profileData?.certifications || [];
      const updatedCerts = [
        ...currentCerts,
        {
          name: certName,
          issuer: certIssuer,
          issueDate: certIssueDate,
          credentialUrl: certUrl,
        },
      ];
      const res = await api.put('/profile', { certifications: updatedCerts });
      if (res.data.success) {
        success('Certification added!');
        setProfileData(res.data.profile);
        setCertModalOpen(false);
        setCertName('');
        setCertIssuer('');
        setCertIssueDate('');
        setCertUrl('');
      }
    } catch (err) {
      error('Failed to add certification');
    }
  };

  const handleDeleteCertification = async (index: number) => {
    try {
      const currentCerts = profileData?.certifications || [];
      const updatedCerts = currentCerts.filter((_, idx) => idx !== index);
      const res = await api.put('/profile', { certifications: updatedCerts });
      if (res.data.success) {
        success('Certification removed');
        setProfileData(res.data.profile);
      }
    } catch (err) {
      error('Failed to remove certification');
    }
  };

  // Language Handlers
  const handleAddLanguage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!langName.trim()) return;
    try {
      const currentLangs = profileData?.languages || [];
      const updatedLangs = [
        ...currentLangs,
        {
          language: langName.trim(),
          proficiency: langProficiency,
        },
      ];
      const res = await api.put('/profile', { languages: updatedLangs });
      if (res.data.success) {
        success('Language added!');
        setProfileData(res.data.profile);
        setLangModalOpen(false);
        setLangName('');
      }
    } catch (err) {
      error('Failed to add language');
    }
  };

  const handleDeleteLanguage = async (index: number) => {
    try {
      const currentLangs = profileData?.languages || [];
      const updatedLangs = currentLangs.filter((_, idx) => idx !== index);
      const res = await api.put('/profile', { languages: updatedLangs });
      if (res.data.success) {
        success('Language removed');
        setProfileData(res.data.profile);
      }
    } catch (err) {
      error('Failed to remove language');
    }
  };

  // Resume File Upload Handler
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingResume(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        const resumeRes = await api.post('/profile/resumes', {
          name: res.data.filename || file.name,
          url: res.data.fileUrl,
          size: `${Math.round(file.size / 1024)} KB`,
        });

        if (resumeRes.data.success) {
          success('Resume uploaded successfully!');
          fetchProfile();
        }
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to upload resume file');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    try {
      const res = await api.delete(`/profile/resumes/${resumeId}`);
      if (res.data.success) {
        success('Resume removed');
        fetchProfile();
      }
    } catch (err) {
      error('Failed to delete resume');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const user = isSelf ? currentUser : profileUser;
  const primaryResume = profileData?.resumes?.find((r) => r.isPrimary) || profileData?.resumes?.[0];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ================= 1. HERO PROFILE CARD ================= */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Decorative Gradient Banner */}
          <div className="h-36 sm:h-44 bg-gradient-to-r from-indigo-600 via-indigo-700 to-sky-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/20"></div>
          </div>

          {/* Profile Header Main Info */}
          <div className="px-6 sm:px-10 pb-8 relative">
            {/* Top Row: Floating Avatar on left + Action button on right */}
            <div className="flex items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
              <div className="relative">
                <img
                  src={
                    user?.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      user?.name || 'Candidate'
                    )}`
                  }
                  alt={user?.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-xl bg-white shrink-0 ring-1 ring-slate-900/5"
                />
              </div>

              {isSelf && (
                <button
                  onClick={openEditModal}
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-indigo-600/25 flex items-center gap-2 transition shrink-0 hover:scale-[1.02] active:scale-[0.98] mb-1"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Full Profile</span>
                </button>
              )}
            </div>

            {/* Candidate Name, Title & Role - Fully positioned inside the clean white section */}
            <div className="space-y-1 mb-5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {user?.name}
                </h1>
                {user?.isVerified && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Verified Seeker</span>
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base font-bold text-indigo-600">
                {profileData?.headline || user?.headline || 'Tech Professional • Seeking Opportunities'}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-700">{profileData?.primaryRole || 'Full Stack Developer'}</span>
                {profileData?.currentCompany && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>Currently at <strong className="text-slate-800">{profileData.currentCompany}</strong></span>
                  </>
                )}
                {profileData?.currentDesignation && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600 font-medium">({profileData.currentDesignation})</span>
                  </>
                )}
              </p>
            </div>

            {/* Availability & High-Impact Status Bar */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5 pb-5 border-b border-slate-100">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  profileData?.availabilityStatus === 'Serving notice period'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : profileData?.availabilityStatus === 'Casually exploring'
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                <span>{profileData?.availabilityStatus || 'Actively looking'}</span>
              </span>

              {profileData?.noticePeriod && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  Notice: {profileData.noticePeriod}
                </span>
              )}

              {profileData?.openToRelocate && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-purple-600" />
                  Open to Relocate
                </span>
              )}
            </div>

            {/* Metrics Matrix: Experience, Current CTC, Expected CTC, Location, Phone, Email */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-slate-400" /> Experience
                </span>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {profileData?.totalExperienceYears
                    ? `${profileData.totalExperienceYears} Years`
                    : 'Fresher'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <IndianRupee className="w-3 h-3 text-slate-400" /> Current CTC
                </span>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {profileData?.currentSalary || 'Confidential'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <IndianRupee className="w-3 h-3 text-emerald-600" /> Expected CTC
                </span>
                <p className="text-sm font-extrabold text-emerald-700 mt-0.5">
                  {profileData?.expectedSalary || 'Negotiable'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> Location
                </span>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5 truncate">
                  {profileData?.currentCity || user?.location || 'India'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" /> Phone
                </span>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5 truncate">
                  {profileData?.mobile || user?.mobile || 'Not provided'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" /> Email
                </span>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5 truncate">
                  {user?.email || 'N/A'}
                </p>
              </div>
            </div>

            {/* Social & Developer Profiles */}
            <div className="pt-5 flex flex-wrap items-center gap-2.5">
              {profileData?.portfolioUrl && (
                <a
                  href={profileData.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition border border-slate-200/80"
                >
                  <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Portfolio Site</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                </a>
              )}
              {profileData?.linkedinUrl && (
                <a
                  href={profileData.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-xs font-bold text-blue-700 flex items-center gap-1.5 transition border border-blue-200"
                >
                  <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                  <span>LinkedIn</span>
                  <ExternalLink className="w-2.5 h-2.5 text-blue-400" />
                </a>
              )}
              {profileData?.githubUrl && (
                <a
                  href={profileData.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white flex items-center gap-1.5 transition"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                </a>
              )}
              {profileData?.leetcodeUrl && (
                <a
                  href={profileData.leetcodeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-xs font-bold text-amber-800 flex items-center gap-1.5 transition border border-amber-200"
                >
                  <Code className="w-3.5 h-3.5 text-amber-600" />
                  <span>LeetCode / Coding</span>
                  <ExternalLink className="w-2.5 h-2.5 text-amber-500" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ================= 2. TWO-COLUMN LAYOUT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLUMNS: About, Experience, Projects, Education */}
          <div className="lg:col-span-2 space-y-8">
            {/* About / Executive Summary */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>Executive Summary</span>
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {profileData?.about ||
                  user?.bio ||
                  'Passionate technology professional with proven engineering skills. Eager to solve challenging problems and build scalable web and mobile solutions in fast-paced teams.'}
              </p>
            </div>

            {/* Work Experience */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    <span>Work Experience</span>
                  </h3>
                  <p className="text-xs text-slate-500">Employment history, company roles and responsibilities</p>
                </div>
                {isSelf && (
                  <button
                    onClick={() => setExpModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs hover:bg-indigo-100 flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Role</span>
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {profileData?.experience && profileData.experience.length > 0 ? (
                  profileData.experience.map((exp, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900">{exp.title}</h4>
                          <p className="text-xs font-semibold text-slate-600 mt-0.5">
                            {exp.company}
                            {exp.location && ` • ${exp.location}`}
                          </p>
                          <p className="text-[11px] font-bold text-indigo-600 mt-0.5">
                            {exp.startDate || '2022'} - {exp.endDate || (exp.current ? 'Present' : '2024')}
                          </p>
                          {exp.description && (
                            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {isSelf && (
                        <button
                          onClick={() => handleDeleteExperience(idx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
                          title="Remove experience"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-slate-400">
                    No work experience listed yet. Click "+ Add Role" to showcase your experience.
                  </div>
                )}
              </div>
            </div>

            {/* Key Technical Projects */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <FolderGit2 className="w-5 h-5 text-indigo-600" />
                    <span>Projects & Open Source</span>
                  </h3>
                  <p className="text-xs text-slate-500">Live products, applications, and GitHub repositories</p>
                </div>
                {isSelf && (
                  <button
                    onClick={() => setProjectModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs hover:bg-indigo-100 flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {profileData?.projects && profileData.projects.length > 0 ? (
                  profileData.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2.5 relative group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-base font-bold text-slate-900">{proj.title}</h4>
                          {proj.duration && (
                            <span className="text-[11px] font-semibold text-slate-400">
                              {proj.duration}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {proj.liveUrl && (
                            <a
                              href={proj.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-indigo-600 hover:bg-indigo-50 flex items-center gap-1 transition"
                            >
                              <span>Live Demo</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 flex items-center gap-1 transition"
                            >
                              <Github className="w-3 h-3" />
                              <span>Code</span>
                            </a>
                          )}
                          {isSelf && (
                            <button
                              onClick={() => handleDeleteProject(idx)}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>

                      {proj.techStack && proj.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {proj.techStack.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-slate-700 border border-slate-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-slate-400">
                    No projects added yet. Click "+ Add Project" to highlight your best work.
                  </div>
                )}
              </div>
            </div>

            {/* Education Details */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                    <span>Education Details</span>
                  </h3>
                  <p className="text-xs text-slate-500">Academic qualifications, colleges, and GPA</p>
                </div>
                {isSelf && (
                  <button
                    onClick={() => setEduModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs hover:bg-indigo-100 flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Degree</span>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {profileData?.education && profileData.education.length > 0 ? (
                  profileData.education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{edu.degree}</h4>
                          <p className="text-xs text-slate-600 mt-0.5">{edu.institution}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Batch of {edu.endYear || '2023'}{' '}
                            {edu.fieldOfStudy && `• ${edu.fieldOfStudy}`}{' '}
                            {edu.grade && `• Grade: ${edu.grade}`}
                          </p>
                        </div>
                      </div>

                      {isSelf && (
                        <button
                          onClick={() => handleDeleteEducation(idx)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-slate-400">
                    No education credentials listed yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT 1 COLUMN: Skills, Resume, Preferences, Certifications, Languages */}
          <div className="space-y-8">
            {/* Resume / CV Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Resume & Documents</span>
                </h3>
                {isSelf && (
                  <label className="cursor-pointer px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs hover:bg-indigo-100 flex items-center gap-1 transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                      disabled={uploadingResume}
                    />
                  </label>
                )}
              </div>

              {primaryResume ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate max-w-[170px]">
                          {primaryResume.name}
                        </p>
                        <p className="text-[10px] text-slate-400">{primaryResume.size || 'PDF'}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Primary
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={primaryResume.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 text-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Resume</span>
                    </a>
                    {isSelf && (
                      <button
                        onClick={() => handleDeleteResume(primaryResume._id)}
                        className="p-2 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-5 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Upload className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-slate-600">No resume uploaded</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Upload your latest CV in PDF format for recruiters
                  </p>
                </div>
              )}
            </div>

            {/* Technical Skills */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Code className="w-4 h-4 text-indigo-600" />
                  <span>Technical Skills</span>
                </h3>
                {isSelf && (
                  <button
                    onClick={() => setSkillModalOpen(true)}
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {profileData?.skills && profileData.skills.length > 0 ? (
                  profileData.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span>{s.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold">({s.level})</span>
                      {isSelf && (
                        <button
                          onClick={() => handleDeleteSkill(s.name)}
                          className="text-slate-400 hover:text-rose-600 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No skills added yet.</p>
                )}
              </div>
            </div>

            {/* Career & Work Preferences */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-600" />
                <span>Job Preferences</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Preferred Work Modes:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(profileData?.preferredWorkModes && profileData.preferredWorkModes.length > 0
                      ? profileData.preferredWorkModes
                      : ['Remote', 'Hybrid']
                    ).map((m, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-100"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Preferred Locations:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(profileData?.preferredLocations && profileData.preferredLocations.length > 0
                      ? profileData.preferredLocations
                      : ['Bangalore', 'Hyderabad', 'Pune', 'Remote']
                    ).map((loc, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                      >
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications & Badges */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>Certifications</span>
                </h3>
                {isSelf && (
                  <button
                    onClick={() => setCertModalOpen(true)}
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {profileData?.certifications && profileData.certifications.length > 0 ? (
                  profileData.certifications.map((c, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2"
                    >
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">{c.name}</h5>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {c.issuer} {c.issueDate && `• ${c.issueDate}`}
                        </p>
                        {c.credentialUrl && (
                          <a
                            href={c.credentialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1 mt-1"
                          >
                            <span>Verify Credential</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                      {isSelf && (
                        <button
                          onClick={() => handleDeleteCertification(idx)}
                          className="text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No certifications listed.</p>
                )}
              </div>
            </div>

            {/* Languages Known */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Languages className="w-4 h-4 text-indigo-600" />
                  <span>Languages Known</span>
                </h3>
                {isSelf && (
                  <button
                    onClick={() => setLangModalOpen(true)}
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {profileData?.languages && profileData.languages.length > 0 ? (
                  profileData.languages.map((l, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span>{l.language}</span>
                      <span className="text-[10px] text-indigo-600 font-bold">({l.proficiency})</span>
                      {isSelf && (
                        <button
                          onClick={() => handleDeleteLanguage(idx)}
                          className="text-slate-400 hover:text-rose-600 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                      English (Fluent)
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                      Hindi (Fluent)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= EDIT PROFILE MODAL ================= */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-1">Edit Candidate Profile</h3>
            <p className="text-xs text-slate-500 mb-5">
              Update your career details, compensation, notice period, and technical specializations.
            </p>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setEditTab('basic')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  editTab === 'basic'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                1. Basic & Role
              </button>
              <button
                type="button"
                onClick={() => setEditTab('career')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  editTab === 'career'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                2. Experience & CTC
              </button>
              <button
                type="button"
                onClick={() => setEditTab('preferences')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  editTab === 'preferences'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                3. Preferences & Links
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {/* TAB 1: BASIC & ROLE */}
              {editTab === 'basic' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Professional Headline *
                    </label>
                    <input
                      type="text"
                      required
                      value={editHeadline}
                      onChange={(e) => setEditHeadline(e.target.value)}
                      placeholder="e.g. Senior Full Stack Engineer • React, Node.js, AWS"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Primary Role Track
                      </label>
                      <select
                        value={editPrimaryRole}
                        onChange={(e) => setEditPrimaryRole(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        <option value="Full Stack Developer">Full Stack Developer</option>
                        <option value="Frontend Engineer">Frontend Engineer (React / Next.js)</option>
                        <option value="Backend Engineer">Backend Engineer (Java / Go / Node)</option>
                        <option value="DevOps & Cloud Architect">DevOps & Cloud Architect</option>
                        <option value="Artificial Intelligence / GenAI">AI & Machine Learning</option>
                        <option value="Data Engineer / Analytics">Data Engineer / Big Data</option>
                        <option value="Mobile App Developer">Mobile App Developer (React Native/Flutter)</option>
                        <option value="SDET / QA Automation">SDET / QA Automation</option>
                        <option value="Product Manager">Product Manager</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Current City / Location
                      </label>
                      <input
                        type="text"
                        value={editCurrentCity}
                        onChange={(e) => setEditCurrentCity(e.target.value)}
                        placeholder="e.g. Bangalore, Karnataka"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Phone / WhatsApp Number
                      </label>
                      <input
                        type="text"
                        value={editMobile}
                        onChange={(e) => setEditMobile(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Open to Relocate?
                      </label>
                      <select
                        value={editOpenToRelocate ? 'yes' : 'no'}
                        onChange={(e) => setEditOpenToRelocate(e.target.value === 'yes')}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        <option value="yes">Yes - Open to Relocate across India</option>
                        <option value="no">No - Prefer Current City Only</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Professional Summary / Bio
                    </label>
                    <textarea
                      rows={3}
                      value={editAbout}
                      onChange={(e) => setEditAbout(e.target.value)}
                      placeholder="Brief overview of your experience, technical achievements, and domains..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: CAREER & CTC */}
              {editTab === 'career' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Current Company
                      </label>
                      <input
                        type="text"
                        value={editCurrentCompany}
                        onChange={(e) => setEditCurrentCompany(e.target.value)}
                        placeholder="e.g. Infosys, TCS, Startup"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Current Designation
                      </label>
                      <input
                        type="text"
                        value={editCurrentDesignation}
                        onChange={(e) => setEditCurrentDesignation(e.target.value)}
                        placeholder="e.g. Software Engineer II"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Total Experience (Yrs)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={editTotalExperienceYears}
                        onChange={(e) => setEditTotalExperienceYears(Number(e.target.value))}
                        placeholder="e.g. 3.5"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Current CTC
                      </label>
                      <input
                        type="text"
                        value={editCurrentSalary}
                        onChange={(e) => setEditCurrentSalary(e.target.value)}
                        placeholder="e.g. ₹14 LPA"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Expected CTC
                      </label>
                      <input
                        type="text"
                        value={editExpectedSalary}
                        onChange={(e) => setEditExpectedSalary(e.target.value)}
                        placeholder="e.g. ₹24 LPA"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Notice Period
                      </label>
                      <select
                        value={editNoticePeriod}
                        onChange={(e) => setEditNoticePeriod(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        <option value="Immediate Joiner">Immediate Joiner (0 days)</option>
                        <option value="15 Days">15 Days</option>
                        <option value="30 Days">30 Days</option>
                        <option value="45 Days">45 Days</option>
                        <option value="60 Days">60 Days</option>
                        <option value="90 Days">90 Days</option>
                        <option value="Serving Notice Period">Serving Notice Period</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Job Search Status
                      </label>
                      <select
                        value={editAvailabilityStatus}
                        onChange={(e: any) => setEditAvailabilityStatus(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        <option value="Actively looking">Actively looking for jobs</option>
                        <option value="Casually exploring">Casually exploring offers</option>
                        <option value="Serving notice period">Serving notice period</option>
                        <option value="Not looking">Not looking right now</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PREFERENCES & SOCIAL LINKS */}
              {editTab === 'preferences' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Preferred Job Locations (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editPreferredLocations}
                      onChange={(e) => setEditPreferredLocations(e.target.value)}
                      placeholder="e.g. Bangalore, Hyderabad, Pune, Remote"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Preferred Work Modes (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editPreferredWorkModes}
                      onChange={(e) => setEditPreferredWorkModes(e.target.value)}
                      placeholder="e.g. Remote, Hybrid, On-site"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        LinkedIn Profile URL
                      </label>
                      <input
                        type="url"
                        value={editLinkedin}
                        onChange={(e) => setEditLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        GitHub Profile URL
                      </label>
                      <input
                        type="url"
                        value={editGithub}
                        onChange={(e) => setEditGithub(e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Portfolio Website URL
                      </label>
                      <input
                        type="url"
                        value={editPortfolio}
                        onChange={(e) => setEditPortfolio(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        LeetCode / HackerRank URL
                      </label>
                      <input
                        type="url"
                        value={editLeetcode}
                        onChange={(e) => setEditLeetcode(e.target.value)}
                        placeholder="https://leetcode.com/u/..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Footer action buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD PROJECT MODAL ================= */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Add Technical Project</h3>
            <p className="text-xs text-slate-500 mb-4">Highlight apps, libraries, or tools you built.</p>
            <form onSubmit={handleAddProject} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Distributed Task Queue / E-Commerce Engine"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="What does it do? Key architectural challenges solved..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Technologies Used (comma-separated)
                </label>
                <input
                  type="text"
                  value={projectTech}
                  onChange={(e) => setProjectTech(e.target.value)}
                  placeholder="e.g. React, Node.js, Redis, Docker"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Live URL</label>
                  <input
                    type="url"
                    value={projectLiveUrl}
                    onChange={(e) => setProjectLiveUrl(e.target.value)}
                    placeholder="https://app.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={projectGithubUrl}
                    onChange={(e) => setProjectGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD CERTIFICATION MODAL ================= */}
      {certModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Add Certification</h3>
            <p className="text-xs text-slate-500 mb-4">Credentials from AWS, Google, Oracle, Microsoft, etc.</p>
            <form onSubmit={handleAddCertification} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Certification Name *</label>
                <input
                  type="text"
                  required
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issuing Organization *</label>
                <input
                  type="text"
                  required
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                  placeholder="e.g. Amazon Web Services / Google Cloud"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Issue Date</label>
                  <input
                    type="text"
                    value={certIssueDate}
                    onChange={(e) => setCertIssueDate(e.target.value)}
                    placeholder="e.g. Dec 2024"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Credential Link</label>
                  <input
                    type="url"
                    value={certUrl}
                    onChange={(e) => setCertUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCertModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Save Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD LANGUAGE MODAL ================= */}
      {langModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xs w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Add Language</h3>
            <form onSubmit={handleAddLanguage} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Language *</label>
                <input
                  type="text"
                  required
                  value={langName}
                  onChange={(e) => setLangName(e.target.value)}
                  placeholder="e.g. English, Hindi, German"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Proficiency</label>
                <select
                  value={langProficiency}
                  onChange={(e: any) => setLangProficiency(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                >
                  <option value="Basic">Basic</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Native / Bilingual">Native / Bilingual</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLangModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD SKILL MODAL ================= */}
      {skillModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Add Technical Skill</h3>
            <form onSubmit={handleAddSkill} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. Docker, TypeScript, PyTorch"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Proficiency Level
                </label>
                <select
                  value={newSkillLevel}
                  onChange={(e: any) => setNewSkillLevel(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSkillModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600"
                >
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD EXPERIENCE MODAL ================= */}
      {expModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Add Experience</h3>
            <form onSubmit={handleAddExperience} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company *</label>
                <input
                  type="text"
                  required
                  value={expCompany}
                  onChange={(e) => setExpCompany(e.target.value)}
                  placeholder="e.g. Infosys, TCS, Startup"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={expLocation}
                    onChange={(e) => setExpLocation(e.target.value)}
                    placeholder="e.g. Bangalore"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={expDuration}
                    onChange={(e) => setExpDuration(e.target.value)}
                    placeholder="e.g. 2022 - Present"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Responsibilities / Work</label>
                <textarea
                  rows={2}
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  placeholder="Built microservices with Spring Boot, reduced API latency by 30%..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setExpModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600"
                >
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD EDUCATION MODAL ================= */}
      {eduModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Add Education</h3>
            <form onSubmit={handleAddEducation} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Degree *</label>
                <input
                  type="text"
                  required
                  value={eduDegree}
                  onChange={(e) => setEduDegree(e.target.value)}
                  placeholder="e.g. B.Tech / MCA / B.Sc"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Institution / College *
                </label>
                <input
                  type="text"
                  required
                  value={eduCollege}
                  onChange={(e) => setEduCollege(e.target.value)}
                  placeholder="e.g. National Institute of Technology"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    value={eduYears}
                    onChange={(e) => setEduYears(e.target.value)}
                    placeholder="e.g. 2024"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    CGPA / Grade
                  </label>
                  <input
                    type="text"
                    value={eduGrade}
                    onChange={(e) => setEduGrade(e.target.value)}
                    placeholder="e.g. 8.5 / 85%"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEduModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600"
                >
                  Save Degree
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
