const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  validateOwnership,
} = require("../middleware/auth.middleware");
const {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} = require("../controllers/todo.controller");

router.post("/todos", authMiddleware, createTodo);
router.get("/todos", authMiddleware, getTodos);
router.put("/todos/:id", authMiddleware, validateOwnership, updateTodo);
router.delete("/todos/:id", authMiddleware, validateOwnership, deleteTodo);

module.exports = router;
