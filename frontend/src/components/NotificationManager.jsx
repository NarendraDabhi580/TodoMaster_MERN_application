import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

const NotificationManager = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.webNotifications) return;

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const checkReminders = async () => {
      try {
        const response = await axiosInstance.get("/todo/todos");
        const tasks = response.data.todo || [];

        // --- TESTING CONFIGURATION (FRONTEND) ---
        // Set to specific time string "HH:MM" (24h format) to test notification trigger.
        // e.g. "00:22" for 12:22 AM.
        const TEST_TIME_TRIGGER = "00:40";

        if (TEST_TIME_TRIGGER) {
          const currentTime = new Date();
          const [hours, minutes] = TEST_TIME_TRIGGER.split(":").map(Number);

          // If we haven't reached the test time yet
          if (
            currentTime.getHours() < hours ||
            (currentTime.getHours() === hours &&
              currentTime.getMinutes() < minutes)
          ) {
            console.log(
              `[Frontend Notification] Waiting for test time ${TEST_TIME_TRIGGER}... Current: ${currentTime.toLocaleTimeString()}`
            );
            return;
          }
        }
        // ----------------------

        tasks.forEach((task) => {
          if (
            task.status === "Completed" ||
            task.status === "completed" ||
            task.status === "Complete"
          )
            return;

          // Check due date
          let isDue = false;

          if (task.dueDate) {
            const now = new Date();
            now.setHours(0, 0, 0, 0);

            // Handle YYYY-MM-DD manually
            if (
              typeof task.dueDate === "string" &&
              task.dueDate.match(/^\d{4}-\d{2}-\d{2}$/)
            ) {
              const [y, m, d] = task.dueDate.split("-").map(Number);
              const taskDate = new Date(y, m - 1, d, 0, 0, 0, 0);
              if (taskDate.getTime() === now.getTime()) {
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
          }

          if (isDue) {
            // Check if we already notified this session to avoid spam loop
            // Use localStorage to persistent across reloads, map taskId -> lastNotifiedTime
            const lastNotified = localStorage.getItem(`notified_${task._id}`);
            const now = Date.now();
            const COOLDOWN = 6 * 60 * 60 * 1000; // 6 hours cooldown

            // Override cooldown if testing exact time trigger has just "unlocked"
            // Actually, if user sets new test time, we might want to ignore cooldown to allow re-test.
            // But for simplicity, we keep cooldown unless we clear localStorage.
            // To make testing easier, let's log if prevented by cooldown.

            if (lastNotified && now - parseInt(lastNotified, 10) <= COOLDOWN) {
              if (TEST_TIME_TRIGGER) {
                console.log(`[Frontend] Bypassing cooldown for testing.`);
              } else {
                console.log(
                  `[Frontend] Skipping notification for ${task.title} due to cooldown.`
                );
                return; // Skip if cooldown active and not testing
              }
            }

            // Send notification (if strict checks passed or bypassed)
            sendNotification(task);
            localStorage.setItem(`notified_${task._id}`, now.toString());
          }
        });
      } catch (error) {
        console.error("Error fetching tasks for notifications", error);
      }
    };

    const sendNotification = (task) => {
      if (!("Notification" in window)) {
        console.log("[Frontend] Browser does not support notifications.");
        return;
      }

      if (Notification.permission === "granted") {
        console.log("[Frontend] Creating native notification for:", task.title);

        // Show in-app toast as well (guaranteed to be visible if app is open)
        toast(`Task Due: ${task.title}`, {
          icon: "🔔",
          duration: 5000,
        });

        try {
          const n = new Notification(`Task Reminder: ${task.title}`, {
            body: `Due: ${task.dueDate}\nPriority: ${task.priority}`,
            requireInteraction: true,
            silent: false,
          });

          n.onclick = (e) => {
            e.preventDefault(); // Prevent standard browser behavior if any
            window.focus();
            window.location.href = `/tasks?highlight=${task._id}`;
            n.close();
          };

          n.onerror = (e) => {
            console.error("[Frontend] Notification error event:", e);
          };
        } catch (error) {
          console.error(
            "[Frontend] Failed to create Notification object:",
            error
          );
        }
      } else {
        console.log(
          "[Frontend] Notification permission NOT granted. Current state:",
          Notification.permission
        );
      }
    };

    const interval = setInterval(checkReminders, 60 * 1000); // Check every minute
    checkReminders(); // Initial check

    return () => clearInterval(interval);
  }, [user]);

  return null; // Logic only component
};

export default NotificationManager;
