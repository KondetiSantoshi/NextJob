const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  fieldOfStudy: { type: String, default: '' },
  startYear: { type: String },
  endYear: { type: String },
  grade: { type: String, default: '' },
});

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, default: '' },
  startDate: { type: String },
  endDate: { type: String },
  current: { type: Boolean, default: false },
  description: { type: String, default: '' },
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  techStack: [String],
  liveUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  duration: { type: String, default: '' },
});

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  issueDate: { type: String },
  credentialUrl: { type: String, default: '' },
});

const languageSchema = new mongoose.Schema({
  language: { type: String, required: true },
  proficiency: {
    type: String,
    enum: ['Basic', 'Conversational', 'Fluent', 'Native / Bilingual'],
    default: 'Fluent',
  },
});

const resumeItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: String, default: '500 KB' },
  isPrimary: { type: Boolean, default: false },
  uploadedAt: { type: Date, default: Date.now },
});

const jobSeekerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    headline: {
      type: String,
      default: '',
    },
    about: {
      type: String,
      default: '',
    },
    primaryRole: {
      type: String,
      default: 'Full Stack Developer',
    },
    currentCompany: {
      type: String,
      default: '',
    },
    currentDesignation: {
      type: String,
      default: '',
    },
    totalExperienceYears: {
      type: Number,
      default: 0,
    },
    currentSalary: {
      type: String,
      default: '',
    },
    expectedSalary: {
      type: String,
      default: '',
    },
    noticePeriod: {
      type: String,
      default: 'Immediate / 30 Days',
    },
    availabilityStatus: {
      type: String,
      enum: ['Actively looking', 'Casually exploring', 'Serving notice period', 'Not looking'],
      default: 'Actively looking',
    },
    lastWorkingDay: {
      type: String,
      default: '',
    },
    mobile: {
      type: String,
      default: '',
    },
    currentCity: {
      type: String,
      default: '',
    },
    openToRelocate: {
      type: Boolean,
      default: true,
    },
    skills: [
      {
        name: { type: String, required: true },
        level: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], default: 'Intermediate' },
      },
    ],
    education: [educationSchema],
    experience: [experienceSchema],
    projects: [projectSchema],
    certifications: [certificationSchema],
    languages: [languageSchema],
    resumes: [resumeItemSchema],
    portfolioUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    leetcodeUrl: { type: String, default: '' },
    twitterUrl: { type: String, default: '' },
    preferredLocations: [String],
    preferredJobTypes: [String],
    preferredWorkModes: [String],
  },
  { timestamps: true }
);

/** @type {import('mongoose').Model<any>} */
const JobSeekerProfile =
  mongoose.models.JobSeekerProfile ||
  mongoose.model('JobSeekerProfile', jobSeekerProfileSchema);

module.exports = JobSeekerProfile;
