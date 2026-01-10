const { verifyAccessToken } = require("../utils/tokenUtils");
const TodoModel = require("../models/Todo");
const mongoose = require("mongoose");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.accessToken ?? "";

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized - Access token not found",
    });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized - Invalid or expired access token",
    });
  }
};

const validateOwnership = async (req, res, next) => {
  const requestTodoId = req.params.id;
  const userId = req.user.id;

  if (!mongoose.isValidObjectId(requestTodoId)) {
    return res.status(400).json({
      message: "Invalid Todo ID",
    });
  }

  const todo = await TodoModel.findOne({
    _id: requestTodoId,
    userId: userId,
  });

  if (!todo) {
    return res.status(403).json({
      message: "You are not allowed to update this todo",
    });
  }

  next();
};

module.exports = { authMiddleware, validateOwnership };
