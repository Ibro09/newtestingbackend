const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  username: { type: String, required: true },
  points: { type: Number, required: true },
  clicks: { type: Number, required: true, default: 1 },
  savedPts: { type: Number, required: true, default: 500 },
  spin: { type: Number, required: true },
  level: { type: Number, required: true, default: 1 },
  referrals: { type: [String], required: true, default: [] },
  premium: { type: Boolean, required: true },
  // other fields...
});

module.exports = mongoose.model("Soniccccusers", userSchema);
