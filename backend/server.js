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
    origin: [
      "http://localhost:5173", // Local development
      "http://localhost:3000", // Local production test
      process.env.FRONTEND_URL, // Primary frontend URL (Netlify)
      process.env.CLIENT_URL, // Alternative frontend URL
    ].filter(Boolean), // Filter out undefined if env var not set
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

  // Serve static files from the frontend build
  app.use(
    express.static(frontendPath, {
      maxAge: "1d", // Cache static assets for 1 day
      etag: true,
    })
  );

  // Catch-all route for SPA (MUST BE LAST)
  // This handles all routes that don't match API routes
  app.get(/^\/(?!api).*/, (req, res) => {
    const indexPath = path.join(frontendPath, "index.html");
    console.log(`SPA Fallback: ${req.path} -> index.html`);
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error("Error serving index.html:", err);
        res.status(500).send("Error loading application");
      }
    });
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
