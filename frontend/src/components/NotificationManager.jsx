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
        const now = new Date();
        const currentHHMM = now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });

        // Target times: 12:01 AM ("00:01"), 01:00 PM ("13:00"), 08:00 PM ("20:00")
        const TARGET_TIMES = ["00:01", "13:00", "20:00"];

        if (!TARGET_TIMES.includes(currentHHMM)) {
          return;
        }

        const response = await axiosInstance.get("/todo/todos");
        const tasks = response.data.todo || [];

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
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Handle YYYY-MM-DD manually
            if (
              typeof task.dueDate === "string" &&
              task.dueDate.match(/^\d{4}-\d{2}-\d{2}$/)
            ) {
              const [y, m, d] = task.dueDate.split("-").map(Number);
              const taskDate = new Date(y, m - 1, d, 0, 0, 0, 0);
              if (taskDate.getTime() === today.getTime()) {
                isDue = true;
              }
            } else {
              const parsedDate = new Date(task.dueDate);
              if (!isNaN(parsedDate.getTime())) {
                parsedDate.setHours(0, 0, 0, 0);
                if (parsedDate.getTime() === today.getTime()) {
                  isDue = true;
                }
              }
            }
          }

          if (isDue) {
            // Unique key for this specific time slot
            const storageKey = `notified_${task._id}_${currentHHMM}`;
            const alreadyNotified = localStorage.getItem(storageKey);

            if (alreadyNotified) {
              return;
            }

            // Send notification
            sendNotification(task);

            // Mark as notified for this specific time slot
            localStorage.setItem(storageKey, "true");

            // Optional: Clean up old keys (e.g., previous slots) to keep storage clean
            // Not strictly necessary for functionality but good for hygiene
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
