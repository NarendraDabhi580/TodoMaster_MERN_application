const mongoose = require("mongoose");

const connectDb = async () => {
  const isProduction = process.env.NODE_ENV === "production";
  const dbURI = isProduction
    ? process.env.MONGO_URI
    : "mongodb://localhost:27017/test-prac";

  console.log(
    `Connecting to database... (${isProduction ? "Production" : "Development"})`
  );

  try {
    await mongoose.connect(dbURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDb;
