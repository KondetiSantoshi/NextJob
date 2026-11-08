const mongoose = require('mongoose');

const communityTopicSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Job Discussions',
        'Interview Experiences',
        'Career Advice',
        'Technical Discussions',
        'Fresher Job Updates',
        'Walk-in Interview Updates',
        'Government Job Updates',
        'Work-from-Home Opportunities',
      ],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide topic title'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide question or discussion content'],
    },
    tags: [String],
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    viewsCount: {
      type: Number,
      default: 0,
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

communityTopicSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('CommunityTopic', communityTopicSchema);
