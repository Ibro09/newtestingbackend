const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  points: { type: Number, required: true },
  clicks: { type: Number, required: true, default: 1 },
  savedPts: { type: Number, required: true, default: 500 },
  spin: { type: Number, required: true, default: 5},
  level: { type: Number, required: true, default: 1 },
  premium: { type: Boolean, required: true },
  referrer: { type: String, required: true, default: "23323442" },
  referrals: { type: [String], required: true, default: [] },
  // other fields...
});

module.exports = mongoose.model("Soniccccusers", userSchema);
  