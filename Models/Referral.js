const mongoose = require("mongoose");

const referralsSchema = new mongoose.Schema({
  referrer: { type: String, required: true, default:'23323442' },
  referrals: { type: [String], required: true, default: [] },
  username: {
    type: String,
    required: true,
    ref: "Soniccccusers",
     unique:true
  },
  
});

module.exports = mongoose.model("Referrals", referralsSchema);