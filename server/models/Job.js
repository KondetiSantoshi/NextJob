const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide job title'],
      trim: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a job category'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide job description'],
    },
    requirements: [String],
    responsibilities: [String],
    skills: {
      type: [String],
      required: [true, 'Please provide at least one required skill'],
      index: true,
    },
    experienceLevel: {
      type: String,
      enum: ['Fresher', 'Entry Level', 'Mid Level', 'Senior Level', 'Lead / Director'],
      default: 'Mid Level',
    },
    minExperience: {
      type: Number,
      default: 0,
    },
    maxExperience: {
      type: Number,
      default: 5,
    },
    salaryMin: {
      type: Number,
      default: 0,
    },
    salaryMax: {
      type: Number,
      default: 0,
    },
    salaryRange: {
      type: String,
      required: true,
      default: 'Competitive CTC',
    },
    location: {
      type: String,
      required: [true, 'Please provide job location'],
      trim: true,
      index: true,
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      default: 'Full-time',
    },
    workMode: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site'],
      default: 'On-site',
    },
    vacancies: {
      type: Number,
      default: 1,
    },
    education: {
      type: String,
      default: "Bachelor's Degree in Computer Science, Engineering or related field",
    },
    deadline: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    careerUrl: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      enum: ['official_career_page', 'internal', 'live_scraped'],
      default: 'official_career_page',
    },
    externalId: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    urgent: {
      type: Boolean,
      default: false,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Full text search indexes for designation, skills, company, location
jobSchema.index({
  title: 'text',
  description: 'text',
  skills: 'text',
  companyName: 'text',
  location: 'text',
});

module.exports = mongoose.model('Job', jobSchema);
