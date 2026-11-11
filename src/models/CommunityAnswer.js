const mongoose = require('mongoose');

const communityAnswerSchema = new mongoose.Schema(
  {
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CommunityTopic',
      required: true,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/** @type {import('mongoose').Model<any>} */
const CommunityAnswer =
  mongoose.models.CommunityAnswer ||
  mongoose.model('CommunityAnswer', communityAnswerSchema);

module.exports = CommunityAnswer;
