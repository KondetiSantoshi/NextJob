const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    resumeUrl: {
      type: String,
      required: true,
    },
    resumeName: {
      type: String,
      default: 'Resume.pdf',
    },
    coverNote: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Applied', 'Viewed', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'],
      default: 'Applied',
      index: true,
    },
    interviewDetails: {
      date: String,
      time: String,
      mode: {
        type: String,
        enum: ['Google Meet', 'Zoom', 'In-Person', 'Telephonic'],
        default: 'Google Meet',
      },
      link: String,
      notes: String,
    },
    recruiterNotes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
