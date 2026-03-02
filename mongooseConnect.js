const mongoose = require("mongoose");
require("dotenv").config();

// Validate required environment variables
if (!process.env.DB) {
  console.error("ERROR: DB environment variable is not set");
  process.exit(1);
}

const connection = process.env.DB;

// Connect to MongoDB with new URL parser
mongoose.connect(connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
  process.exit(1);
});

db.once("open", () => {
  console.log("Connected to DB");
});

module.exports = mongoose.connection;
