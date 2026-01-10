const monggose = require("mongoose");

const TodoSchema = new monggose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
    dueDate: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    userId: {
      type: monggose.Schema.Types.ObjectId,
      ref: "user",
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    lastReminderSent: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const todoModel = monggose.model("todo", TodoSchema);

module.exports = todoModel;
