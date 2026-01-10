const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getUser,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshToken);
router.get("/me", authMiddleware, getUser);
router.put("/me", authMiddleware, upload.single("profilePicture"), updateUser);
router.post("/change-password", authMiddleware, changePassword);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

module.exports = router;
