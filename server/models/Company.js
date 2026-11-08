const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    logo: {
      type: String,
      default: '',
    },
    banner: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    careerPageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    industry: {
      type: String,
      required: true,
      default: 'Information Technology',
    },
    size: {
      type: String,
      default: '50-200 employees',
    },
    location: {
      type: String,
      required: true,
    },
    headquarters: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
    },
    foundedYear: {
      type: Number,
      default: 2015,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 4.2,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    recruiters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    benefits: [String],
    socialLinks: {
      linkedin: String,
      twitter: String,
      github: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
