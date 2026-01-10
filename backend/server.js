const express = require("express");
require("dotenv").config();
const connectDb = require("./config/db");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const todoRoutes = require("./routes/todo.routes");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

connectDb();
app.use((req, res, next) => {
  if (req.method === "POST" && !req.headers["content-type"]) {
    req.headers["content-type"] = "application/json";
  }
  next();
});
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello This is server 3200");
});

app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);
app.use("/uploads", express.static("uploads"));

app.listen(3200, () => {
  console.log("Srver is running on PORT : 3200");
  const startScheduler = require("./utils/scheduler");
  startScheduler();
});
// Server config
