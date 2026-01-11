const express = require("express");
require("dotenv").config();
const connectDb = require("./config/db");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const todoRoutes = require("./routes/todo.routes");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL].filter(Boolean), // Filter out undefined if env var not set
    credentials: true,
  })
);

// Trust proxy is required for secure cookies behind Render/Heroku load balancers
app.set("trust proxy", 1);

// connectDb called before server start
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

/* ================= FRONTEND SERVE (AFTER APIs) ================= */
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(frontendPath));

  // Catch-all (MUST BE LAST)
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Srver is running on PORT : ${PORT}`);
    console.log("Environment:", process.env.NODE_ENV);
    const startScheduler = require("./utils/scheduler");
    startScheduler();
  });
});
// Server config
