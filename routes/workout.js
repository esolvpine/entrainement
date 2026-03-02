// routes/workout.js routing file
"use strict";
const express = require("express");
const router = express.Router();
const Workout = require("../workoutModel");

// Helper function to escape RegExp special characters
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// LIST
router.route("/").get(async (req, res) => {
  try {
    if (!req.query.user) {
      return res.status(400).json({ error: "User is required" });
    }
    const workouts = await Workout.find({ user: req.query.user });
    res.json({ workouts });
  } catch (error) {
    console.error("Error fetching workouts:", error);
    res.status(500).json({ error: error.message });
  }
});

// VIEW WORKOUT VIA ID
router.route("/view/:workoutid").get(async (req, res) => {
  try {
    const id = req.params.workoutid;
    if (!id) {
      return res.status(400).json({ error: "Workout ID is required" });
    }
    const workout = await Workout.findOne({ _id: id });
    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }
    res.json({ workout });
  } catch (error) {
    console.error("Error fetching workout:", error);
    res.status(500).json({ error: error.message });
  }
});

// ADD WORKOUT
router.route("/add").post(async (req, res) => {
  try {
    if (!req.body.user) {
      return res.status(400).json({ error: "User is required" });
    }
    if (!req.body.name) {
      return res.status(400).json({ error: "Workout name is required" });
    }
    const newWorkout = new Workout(req.body);
    const newID = Math.floor(+new Date());
    newWorkout._id = newID;
    await newWorkout.save();
    res.status(201).json({ newWorkout });
  } catch (error) {
    console.error("Error adding workout:", error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
router.route("/update").post(async (req, res) => {
  try {
    const payload = req.body;
    const id = payload._id;
    if (!id) {
      return res.status(400).json({ error: "Workout ID is required" });
    }
    delete payload._id;
    const updatedWorkout = await Workout.findByIdAndUpdate(
      id,
      payload,
      { new: true, runValidators: true }
    );
    if (!updatedWorkout) {
      return res.status(404).json({ error: "Workout not found" });
    }
    res.json({ workout: updatedWorkout });
  } catch (error) {
    console.error("Error updating workout:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE
router.route("/delete").post(async (req, res) => {
  try {
    if (!req.body.obj || !req.body.obj._id) {
      return res.status(400).json({ error: "Workout ID is required" });
    }
    const payload = req.body.obj._id;
    const result = await Workout.deleteOne({ _id: payload });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Workout not found" });
    }
    res.json({ message: "deleted" });
  } catch (error) {
    console.error("Error deleting workout:", error);
    res.status(500).json({ error: error.message });
  }
});

// FIND
router.route("/find").post(async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: "Search name is required" });
    }
    // Escape user input to prevent RegExp DoS vulnerability
    const escapedName = escapeRegex(req.body.name);
    const regexpName = new RegExp(escapedName, "i");
    const workouts = await Workout.find({ name: regexpName });
    res.json({ workouts });
  } catch (error) {
    console.error("Error finding workouts:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
