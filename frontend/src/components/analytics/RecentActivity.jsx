import { motion } from "framer-motion";
import PropTypes from "prop-types";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  TrendingUp,
  ListTodo,
} from "lucide-react";

const RecentActivity = ({ tasks }) => {
  // Sort tasks by most recent (you can add createdAt/updatedAt fields to your schema for better tracking)
  // For now, we'll show tasks grouped by status with most important first
  const recentTasks = [...tasks]
    .sort((a, b) => {
      // Prioritize: In Progress > Pending > Completed
      const statusOrder = { "In Progress": 0, Pending: 1, Completed: 2 };
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };

      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 8); // Show only 8 most relevant tasks

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return CheckCircle2;
      case "In Progress":
        return Clock;
      case "Pending":
        return AlertCircle;
      default:
        return ListTodo;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return {
          bg: "bg-(--bg-secondary)",
          border: "border-(--border-color)",
          text: "text-green-600 dark:text-green-600 dark:text-green-400",
          iconBg: "bg-green-100 dark:bg-green-500/20",
        };
      case "In Progress":
        return {
          bg: "bg-(--bg-secondary)",
          border: "border-(--border-color)",
          text: "text-blue-600 dark:text-blue-400",
          iconBg: "bg-blue-100 dark:bg-blue-500/20",
        };
      case "Pending":
        return {
          bg: "bg-(--bg-secondary)",
          border: "border-(--border-color)",
          text: "text-orange-600 dark:text-orange-400",
          iconBg: "bg-orange-100 dark:bg-orange-500/20",
        };
      default:
        return {
          bg: "bg-(--bg-secondary)",
          border: "border-(--border-color)",
          text: "text-(--text-secondary)",
          iconBg: "bg-neutral-100 dark:bg-neutral-500/20",
        };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600 dark:text-red-400";
      case "Medium":
        return "text-yellow-700 dark:text-yellow-400";
      case "Low":
        return "text-green-600 dark:text-green-400";
      default:
        return "text-(--text-secondary)";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-xl border border-(--border-color) bg-(--bg-secondary) p-6 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-500/30">
            <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-(--text-primary)">
              Recent Activity
            </h3>
            <p className="text-sm text-(--text-secondary)">
              Your most important tasks at a glance
            </p>
          </div>
        </div>
        <div className="text-sm text-(--text-secondary)">
          Showing {Math.min(recentTasks.length, 8)} of {tasks.length} tasks
        </div>
      </div>

      {/* Activity List */}
      {recentTasks.length > 0 ? (
        <div className="space-y-3">
          {recentTasks.map((task, index) => {
            const StatusIcon = getStatusIcon(task.status);
            const colors = getStatusColor(task.status);
            const priorityColor = getPriorityColor(task.priority);

            return (
              <motion.div
                key={task._id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className={`flex items-start gap-4 rounded-lg border ${colors.border} ${colors.bg} p-4 backdrop-blur-sm transition-all hover:scale-[1.02]`}
              >
                {/* Icon */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colors.iconBg}`}
                >
                  <StatusIcon className={`h-5 w-5 ${colors.text}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-(--text-primary) line-clamp-1">
                      {task.title}
                    </h4>
                    <span
                      className={`text-xs font-medium ${priorityColor} shrink-0`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-xs text-(--text-secondary) line-clamp-1 mb-2">
                    {task.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-(--text-secondary)">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{task.dueDate}</span>
                    </div>
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-(--text-secondary)">•</span>
                        <span className="line-clamp-1">
                          {task.tags.slice(0, 2).join(", ")}
                          {task.tags.length > 2 && ` +${task.tags.length - 2}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${colors.text} ${colors.bg} border ${colors.border}`}
                >
                  {task.status}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--bg-secondary) border border-(--border-color) mb-4">
            <ListTodo className="h-8 w-8 text-(--text-secondary)" />
          </div>
          <p className="text-sm text-(--text-secondary)">No tasks available</p>
          <p className="text-xs text-(--text-secondary) mt-1">
            Create some tasks to see your activity
          </p>
        </div>
      )}
    </motion.div>
  );
};

RecentActivity.propTypes = {
  tasks: PropTypes.array.isRequired,
};

export default RecentActivity;
