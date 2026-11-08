export type UserRole = 'job_seeker' | 'recruiter' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  role: UserRole;
  location?: string;
  avatar?: string;
  headline?: string;
  bio?: string;
  company?: Company | string;
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

export interface Education {
  _id?: string;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  startYear?: string;
  endYear?: string;
  grade?: string;
}

export interface Experience {
  _id?: string;
  title: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export interface Certification {
  _id?: string;
  name: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
}

export interface SkillItem {
  _id?: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface ProjectItem {
  _id?: string;
  title: string;
  description: string;
  techStack?: string[];
  liveUrl?: string;
  githubUrl?: string;
  duration?: string;
}

export interface LanguageItem {
  _id?: string;
  language: string;
  proficiency: 'Basic' | 'Conversational' | 'Fluent' | 'Native / Bilingual';
}

export interface ResumeItem {
  _id: string;
  name: string;
  url: string;
  size: string;
  isPrimary: boolean;
  uploadedAt: string;
}

export interface JobSeekerProfile {
  _id: string;
  user: User | string;
  headline?: string;
  about?: string;
  primaryRole?: string;
  currentCompany?: string;
  currentDesignation?: string;
  totalExperienceYears?: number;
  currentSalary?: string;
  expectedSalary?: string;
  noticePeriod?: string;
  availabilityStatus?: 'Actively looking' | 'Casually exploring' | 'Serving notice period' | 'Not looking';
  lastWorkingDay?: string;
  mobile?: string;
  currentCity?: string;
  openToRelocate?: boolean;
  skills: SkillItem[];
  education: Education[];
  experience: Experience[];
  projects?: ProjectItem[];
  certifications: Certification[];
  languages?: LanguageItem[];
  resumes: ResumeItem[];
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  leetcodeUrl?: string;
  twitterUrl?: string;
  preferredLocations?: string[];
  preferredJobTypes?: string[];
  preferredWorkModes?: string[];
}

export interface Company {
  _id: string;
  name: string;
  slug?: string;
  logo?: string;
  banner?: string;
  website?: string;
  careerPageUrl?: string;
  industry: string;
  size?: string;
  location: string;
  headquarters?: string;
  description: string;
  foundedYear?: number;
  verified?: boolean;
  rating?: number;
  reviewsCount?: number;
  followers?: string[];
  benefits?: string[];
  openingsCount?: number;
}

export interface Job {
  _id: string;
  title: string;
  company: Company;
  companyName: string;
  companyLogo?: string;
  recruiter: User | string;
  category: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  experienceLevel: 'Fresher' | 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Lead / Director';
  minExperience: number;
  maxExperience: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryRange: string;
  location: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  vacancies: number;
  education?: string;
  deadline?: string;
  status: 'active' | 'closed' | 'draft';
  featured?: boolean;
  urgent?: boolean;
  viewsCount?: number;
  applicantsCount?: number;
  careerUrl?: string;
  source?: 'official_career_page' | 'internal' | 'live_scraped';
  externalId?: string;
  createdAt: string;
  updatedAt?: string;
}

export type ApplicationStatus =
  | 'Applied'
  | 'Viewed'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Selected'
  | 'Rejected';

export interface InterviewDetails {
  date: string;
  time: string;
  mode: 'Google Meet' | 'Zoom' | 'In-Person' | 'Telephonic';
  link?: string;
  notes?: string;
}

export interface Application {
  _id: string;
  job: Job;
  applicant: User;
  recruiter: User | string;
  company?: Company;
  resumeUrl: string;
  resumeName: string;
  coverNote?: string;
  status: ApplicationStatus;
  interviewDetails?: InterviewDetails;
  recruiterNotes?: string;
  createdAt: string;
  profile?: JobSeekerProfile;
}

export interface PostComment {
  _id: string;
  post: string;
  author: User;
  content: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  author: User;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'link' | 'none';
  tags?: string[];
  likes: string[];
  sharesCount: number;
  isLiked?: boolean;
  commentsCount?: number;
  comments?: PostComment[];
  createdAt: string;
}

export interface CommunityAnswer {
  _id: string;
  topic: string;
  author: User;
  content: string;
  upvotes: string[];
  isUpvoted?: boolean;
  isAccepted?: boolean;
  createdAt: string;
}

export interface CommunityTopic {
  _id: string;
  author: User;
  category: string;
  title: string;
  content: string;
  tags?: string[];
  upvotes: string[];
  isUpvoted?: boolean;
  viewsCount?: number;
  answersCount?: number;
  createdAt: string;
}

export interface ConnectionItem {
  _id: string;
  name: string;
  avatar?: string;
  headline?: string;
  location?: string;
  role: UserRole;
  company?: any;
}

export interface MessageItem {
  _id: string;
  sender: User;
  recipient: User;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  user: User;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
}

export interface NotificationItem {
  _id: string;
  recipient: string;
  sender?: User;
  type: 'application_status' | 'interview_scheduled' | 'job_alert' | 'connection_request' | 'post_like' | 'system';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface CompanyReview {
  _id: string;
  company: string;
  author: User;
  rating: number;
  title: string;
  roleTitle?: string;
  isCurrentEmployee?: boolean;
  pros: string;
  cons: string;
  workLifeBalance: number;
  salaryBenefits: number;
  culture: number;
  createdAt: string;
}
