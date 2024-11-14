
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  category: { type: String, enum: ["daily", "special", "social"] },
  completed: { type: Boolean, required: true },
  username: {
    type: String,
    required: true,
    ref: "Soniccccusers", 
  },
  points: { type: Number, required: true },
  // other fields...
});

module.exports = mongoose.model(" Tasks", taskSchema);
