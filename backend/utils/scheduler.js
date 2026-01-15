const nodemailer = require("nodemailer");
const TodoModel = require("../models/Todo");

const sendEmail = async (email, task) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const appUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const taskLink = `${appUrl}/tasks?highlight=${task._id}`;

  const message = `
    Hello,

    Reminder for your task: "${task.title}"
    Due Date: ${task.dueDate}
    Priority: ${task.priority}
    Description: ${task.description}

    View Task: ${taskLink}

    Best regards,
    TaskMaster
  `;

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Reminder: ${task.title}`,
        text: message,
      });
      console.log(`Email sent to ${email}`);
    } else {
      console.log(`[MOCK EMAIL] To: ${email} | Task: ${task.title}`);
    }
  } catch (error) {
    console.error("Failed to send email:", error.message);
  }
};

const checkReminders = async () => {
  try {
    const now = new Date();
    const currentTime = now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    const TARGET_TIMES = ["00:01", "12:01", "20:00"];

    if (!TARGET_TIMES.includes(currentTime)) return;

    now.setHours(0, 0, 0, 0);

    const tasks = await TodoModel.find({
      status: { $nin: ["Completed", "completed"] },
    }).populate("userId");

    for (const task of tasks) {
      if (!task.userId || !task.dueDate) continue;

      let isDue = false;
      const dueDate = new Date(task.dueDate);

      if (!isNaN(dueDate.getTime())) {
        // Handle timezone offset for YYYY-MM-DD strings
        if (task.dueDate.length === 10) {
          const [y, m, d] = task.dueDate.split("-").map(Number);
          const localDue = new Date(y, m - 1, d);
          if (localDue.getTime() === now.getTime()) isDue = true;
        } else {
          dueDate.setHours(0, 0, 0, 0);
          if (dueDate.getTime() === now.getTime()) isDue = true;
        }
      }

      if (isDue) {
        if (task.lastReminderSent) {
          const lastSent = new Date(task.lastReminderSent);
          if (Date.now() - lastSent.getTime() < 15 * 60 * 1000) continue;
        }

        if (task.userId.emailNotifications) {
          await sendEmail(task.userId.email, task);
        }

        task.reminderSent = true;
        task.lastReminderSent = new Date();
        await task.save();
      }
    }
  } catch (error) {
    console.error("Scheduler error:", error.message);
  }
};

const startScheduler = () => {
  checkReminders();
  setInterval(checkReminders, 60000);
  console.log("Scheduler active");
};

module.exports = startScheduler;
