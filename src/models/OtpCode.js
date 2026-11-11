const mongoose = require('mongoose');

const otpCodeSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

otpCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/** @type {import('mongoose').Model<any>} */
const OtpCode =
  mongoose.models.OtpCode || mongoose.model('OtpCode', otpCodeSchema);

module.exports = OtpCode;
