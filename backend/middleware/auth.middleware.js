const mongoose = require("mongoose");
const { verifyAccessToken } = require("../utils/tokenUtils");
const TodoModel = require("../models/Todo");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const validateOwnership = async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }

  const todo = await TodoModel.findOne({ _id: id, userId });

  if (!todo) {
    return res.status(403).json({ message: "Access denied" });
  }

  next();
};

module.exports = { authMiddleware, validateOwnership };
