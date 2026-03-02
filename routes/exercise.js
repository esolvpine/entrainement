// routes/exercise.js routing file
"use strict";

const express = require("express");
const router = express.Router();
const Exercise = require("../exerciseModel");

// LIST
router.route("/").get(async (req, res) => {
  try {
    if (!req.query.user) {
      return res.status(400).json({ error: "User is required" });
    }
    const exercises = await Exercise.find({ user: req.query.user });
    res.json({ exercises });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({ error: error.message });
  }
});

// ADD EXERCISE
router.route("/add").post(async (req, res) => {
  try {
    if (!req.body.user) {
      return res.status(400).json({ error: "User is required" });
    }
    if (!req.body.name) {
      return res.status(400).json({ error: "Exercise name is required" });
    }
    const newExercise = new Exercise(req.body);
    const newID = Math.floor(+new Date());
    newExercise._id = newID;
    await newExercise.save();
    res.status(201).json({ newExercise });
  } catch (error) {
    console.error("Error adding exercise:", error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
router.route("/update").post(async (req, res) => {
  try {
    const payload = req.body;
    const id = payload._id;
    if (!id) {
      return res.status(400).json({ error: "Exercise ID is required" });
    }
    delete payload._id;
    const updatedExercise = await Exercise.findByIdAndUpdate(
      id,
      payload,
      { new: true, runValidators: true }
    );
    if (!updatedExercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    res.json({ exercise: updatedExercise });
  } catch (error) {
    console.error("Error updating exercise:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE
router.route("/delete").post(async (req, res) => {
  try {
    if (!req.body.obj || !req.body.obj._id) {
      return res.status(400).json({ error: "Exercise ID is required" });
    }
    const payload = req.body.obj._id;
    const result = await Exercise.deleteOne({ _id: payload });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    res.json({ message: "deleted" });
  } catch (error) {
    console.error("Error deleting exercise:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
