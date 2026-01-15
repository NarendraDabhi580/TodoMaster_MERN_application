const TodoModel = require("../models/Todo");

const createTodo = async (req, res) => {
  const { title, description, status, priority, dueDate, tags } = req.body;

  if (!title || !description || !status || !priority || !dueDate || !tags) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const todo = await TodoModel.create({
    title,
    description,
    status,
    priority,
    dueDate,
    tags,
    userId: req.user.id,
  });

  res.status(201).json({
    message: "Task created",
    todo,
  });
};

const getTodos = async (req, res) => {
  const todos = await TodoModel.find({ userId: req.user.id });

  res.json({
    message: "Tasks retrieved",
    todo: todos,
  });
};

const updateTodo = async (req, res) => {
  const { title, description, status, priority, dueDate, tags } = req.body;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Task ID required" });
  }

  const todo = await TodoModel.findByIdAndUpdate(
    id,
    { title, description, status, priority, dueDate, tags },
    { new: true }
  );

  if (!todo) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({
    message: "Task updated",
    updateTodo: todo,
  });
};

const deleteTodo = async (req, res) => {
  const { id } = req.params;

  const todo = await TodoModel.findByIdAndDelete(id);

  if (!todo) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ message: "Task deleted" });
};

module.exports = { createTodo, getTodos, updateTodo, deleteTodo };
