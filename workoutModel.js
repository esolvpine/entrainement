const mongoose = require("mongoose");

const searchSchema = new mongoose.Schema(
  {
    _id: Number,
    name: { type: String, required: true },
    active: { type: Number, default: 1 },
    lastUpdate: { type: Date, default: Date.now },
    completed: { type: Number, default: 0 },
    completedDate: Date,
    exercises: [{ type: Number }], // Array of exercise IDs (Numbers due to custom ID system)
    user: { type: String, required: true },
  },
  { collection: "workouts" }
);

// Add indexes for performance optimization
searchSchema.index({ user: 1 }); // Index for user queries
searchSchema.index({ name: 'text' }); // Text index for name search
searchSchema.index({ user: 1, active: 1 }); // Compound index for active workout queries

module.exports = mongoose.model("Workout", searchSchema);
