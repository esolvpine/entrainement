const mongoose = require("mongoose");

const searchSchema = new mongoose.Schema(
  {
    _id: Number,
    name: { type: String, required: true },
    movement: String,
    active: { type: Number, default: 1 },
    lastUpdate: { type: Date, default: Date.now },
    restInterval: Number,
    sets: [{
      weight: Number,
      reps: Number,
      completed: { type: Number, default: 0 },
      lastUpdate: Date
    }],
    user: { type: String, required: true },
  },
  { collection: "exercises" }
);

// Add indexes for performance optimization
searchSchema.index({ user: 1 }); // Index for user queries
searchSchema.index({ name: 'text' }); // Text index for name search
searchSchema.index({ user: 1, movement: 1 }); // Compound index for movement type queries

module.exports = mongoose.model("Exercise", searchSchema);
