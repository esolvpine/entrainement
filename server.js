const express = require("express");
const port = process.env.PORT || 5507;
const workoutRouter = require("./routes/workout");
const exerciseRouter = require("./routes/exercise");
const cors = require("cors");

// Connect to MongoDB
require("./mongooseConnect");

// Server
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Router
app.use("/workouts", workoutRouter);
app.use("/exercises", exerciseRouter);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/views/index.html", (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).json({ error: "Failed to load page" });
    }
  });
});

app.listen(port, (err) => {
  if (err) {
    console.error("ERROR starting server:", err);
    process.exit(1);
  }
  console.log(`Listening on port ${port}`);
});
