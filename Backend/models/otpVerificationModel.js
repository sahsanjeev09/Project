const mongoose = require("mongoose");

const otpVerificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  email: { type: String, required: true },
  otpCode: { type: String, required: true },
  createdAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
});

const OTPVerification = mongoose.model("OTPVerification", otpVerificationSchema);
module.exports = OTPVerification;
