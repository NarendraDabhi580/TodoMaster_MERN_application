const mongoose = require("mongoose");

const connectDb = () => {
  // Use Local DB for development (default) to preserve local data access
  // Use Cloud DB (MONGO_URI) only in Production
  const dbURI =
    process.env.NODE_ENV === "production"
      ? process.env.MONGO_URI
      : "mongodb://localhost:27017/test-prac";

  console.log("-----------------------------------------");
  console.log(
    `[Database] Connecting to: ${
      dbURI.includes("localhost")
        ? "Local MongoDB (test-prac)"
        : "Cloud MongoDB (Atlas)"
    }`
  );
  console.log("-----------------------------------------");

  return mongoose
    .connect(dbURI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => {
      console.log("MongoDB connection failed :", err);
      process.exit(1);
    });
};

module.exports = connectDb;
