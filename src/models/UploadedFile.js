const mongoose = require('mongoose');

const uploadedFileSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    data: {
      type: Buffer,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

/** @type {import('mongoose').Model<any>} */
const UploadedFile =
  mongoose.models.UploadedFile ||
  mongoose.model('UploadedFile', uploadedFileSchema);

module.exports = UploadedFile;
