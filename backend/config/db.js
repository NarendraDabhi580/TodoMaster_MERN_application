const mongoose = require("mongoose");

const connectDb = () => {
  mongoose
    .connect("mongodb://localhost:27017/test-prac")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => {
      console.log("MongoDB connection failed :", err);
    });
};


module.exports = connectDb;