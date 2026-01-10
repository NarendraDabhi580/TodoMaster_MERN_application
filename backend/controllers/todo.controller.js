const TodoModel = require("../models/Todo");

const createTodo = async (req, res) => {
  const { title, description, status, priority, dueDate, tags } =
    req.body ?? {};

  if (
    !req.body ||
    !title ||
    !description ||
    !status ||
    !priority ||
    !dueDate ||
    !tags
  ) {
    return res.status(400).json({
      message: "Required value missing",
    });
  }

  const userId = req.user.id;

  const todo = await TodoModel.create({
    title,
    description,
    status,
    priority,
    dueDate,
    tags,
    userId,
  });

  if (!todo) {
    return res.status(400).json({
      message: "Something went wrong todo not created",
    });
  }

  res.status(201).json({
    message: "Todo created successfully",
    todo: todo,
  });
};

const getTodos = async (req, res) => {
  const userId = req.user.id;

  const todo = await TodoModel.find({ userId: userId });

  if (!todo) {
    return res.status(400).json({
      message: "Something went wrong todo not found",
    });
  }

  res.status(200).json({
    message: "Todo fetched successfully",
    todo: todo,
  });
};

const updateTodo = async (req, res) => {
  const { title, description, status, priority, dueDate, tags } =
    req.body ?? {};
  const todoId = req.params.id;

  if (!req.body) {
    return res.status(400).json({
      message: "Required value missing",
    });
  }

  if (!todoId) {
    return res.status(400).json({
      message: "Todo not found update",
    });
  }

  const todo = await TodoModel.findByIdAndUpdate(
    todoId,
    {
      title: title,
      description: description,
      status: status,
      priority: priority,
      dueDate: dueDate,
      tags: tags,
    },
    { new: true }
  );

  res.status(200).json({
    message: "Todo updated successfully",
    updateTodo: todo,
  });
};

const deleteTodo = async (req, res) => {
  const todoId = req.params.id;

  await TodoModel.findByIdAndDelete(todoId);

  res.status(200).json({
    message: "Todo deleted successfully",
  });
};

module.exports = { createTodo, getTodos, updateTodo, deleteTodo };
