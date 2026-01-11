const TodoModel = require("../models/Todo");
const UserModel = require("../models/User");
const nodemailer = require("nodemailer");

const sendEmail = async (email, task) => {
  // Transporter setup
  // Note: For production, use environment variables or a secure configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Determine Frontend URL (assume standard local if env not set, should be configured in prod)
  const appUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  // Direct link to the task on the Tasks page with highlighting
  const taskLink = `${appUrl}/tasks?highlight=${task._id}`;

  const message = `
    Hi,
    
    This is a reminder for your task: "${task.title}"
    Due Date: ${task.dueDate}
    Priority: ${task.priority}
    Description: ${task.description}

    View Task: ${taskLink}
    
    Best,
    Task Manager App
  `;

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Task Reminder: ${task.title}`,
        text: message,
      });
      console.log(`Email sent to ${email} for task "${task.title}"`);
    } else {
      console.log("----------------------------------------------------");
      console.log("[MOCK EMAIL SYSTEM]");
      console.log(`To: ${email}`);
      console.log(`Subject: Task Reminder: ${task.title}`);
      console.log(`Body: ${message}`);
      console.log("----------------------------------------------------");
    }
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};

const checkReminders = async () => {
  try {
    const now = new Date();
    // Format current time as HH:MM (24h)
    const currentHHMM = now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    // Target times: 12:01 AM ("00:01"), 12:01 PM ("12:01"), 8:00 PM ("20:00")
    // Reverted per user request (frontend has its own logic)
    const TARGET_TIMES = ["00:01", "12:01", "20:00"];

    if (!TARGET_TIMES.includes(currentHHMM)) {
      // For production we might NOT want to log every minute to avoid clutter
      // but for now it's fine.
      // console.log(`[Scheduler] Waiting... Current: ${currentHHMM}`);
      return;
    }

    console.log(
      `[Scheduler] Trigger time ${currentHHMM} matched! Checking tasks...`
    );

    // Reset time to 00:00:00 for accurate date comparison
    now.setHours(0, 0, 0, 0);

    // Find tasks that contain "due" date today.
    // We don't filter by `reminderSent: false` anymore because we want multi-send.
    // Instead we check `lastReminderSent` in loop.
    const tasks = await TodoModel.find({
      status: { $nin: ["Completed", "completed"] },
    }).populate("userId");

    for (const task of tasks) {
      const user = task.userId;
      if (!user) continue;
      if (!task.dueDate) continue;

      let isDue = false;

      // Strict Date Check
      if (task.dueDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = task.dueDate.split("-").map(Number);
        const taskLocalMidnight = new Date(year, month - 1, day, 0, 0, 0, 0);
        if (taskLocalMidnight.getTime() === now.getTime()) {
          isDue = true;
        }
      } else {
        const parsedDate = new Date(task.dueDate);
        if (!isNaN(parsedDate.getTime())) {
          parsedDate.setHours(0, 0, 0, 0);
          if (parsedDate.getTime() === now.getTime()) {
            isDue = true;
          }
        }
      }

      if (isDue) {
        // CHECK IF ALREADY SENT RECENTLY (e.g. within last 10 minutes)
        // This prevents double sending if the scheduler runs multiple times within the same "HH:MM" window
        // (though setInterval is roughly 60s, execution time might cause drift/overlap).
        if (task.lastReminderSent) {
          const lastSent = new Date(task.lastReminderSent);
          const timeDiff = Date.now() - lastSent.getTime();
          // If sent less than 15 minutes ago, skip
          if (timeDiff < 15 * 60 * 1000) {
            console.log(
              `Skipping task ${
                task.title
              } - already sent reminder at ${lastSent.toLocaleTimeString()}`
            );
            continue;
          }
        }

        // Send Email if enabled
        if (user.emailNotifications) {
          await sendEmail(user.email, task);
          console.log("-----------------------------------------");
          console.log("NOTIFICATION SENT TO USER:", user.email);
          console.log("-----------------------------------------");
        }

        // Update tracking
        task.reminderSent = true; // Legacy boolean
        task.lastReminderSent = new Date(); // Track exact time
        await task.save();
      }
    }
  } catch (error) {
    console.error("Scheduler error:", error);
  }
};

const startScheduler = () => {
  // Check immediately on startup
  checkReminders();
  // Check every minute
  setInterval(checkReminders, 60 * 1000);
  console.log("Task notification scheduler started");
};

module.exports = startScheduler;
