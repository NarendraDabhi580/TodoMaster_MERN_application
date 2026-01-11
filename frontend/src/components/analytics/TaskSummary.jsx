import { motion } from "framer-motion";
import PropTypes from "prop-types";
import {
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  Target,
  Calendar,
} from "lucide-react";

const TaskSummary = ({ stats, tasks }) => {
  // Calculate additional metrics
  const metrics = [];

  // Completion rate metric
  const completionRate = parseFloat(stats.completionRate);
  if (completionRate >= 70) {
    metrics.push({
      icon: CheckCircle2,
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      description: `${stats.completed} out of ${stats.total} tasks completed`,
      color: "green",
    });
  } else if (completionRate >= 40) {
    metrics.push({
      icon: Target,
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      description: `${stats.completed} out of ${stats.total} tasks completed`,
      color: "yellow",
    });
  } else {
    metrics.push({
      icon: AlertTriangle,
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      description: `${stats.completed} out of ${stats.total} tasks completed`,
      color: "red",
    });
  }

  // High priority completion
  const highPriorityCompleted = tasks.filter(
    (t) => t.priority === "High" && t.status === "Completed"
  ).length;
  const highPriorityTotal = stats.high;
  const highPriorityRate =
    highPriorityTotal > 0
      ? ((highPriorityCompleted / highPriorityTotal) * 100).toFixed(0)
      : 0;

  metrics.push({
    icon: TrendingUp,
    title: "High Priority Progress",
    value: `${highPriorityCompleted}/${highPriorityTotal}`,
    description: `${highPriorityRate}% of high priority tasks completed`,
    color: "red",
  });

  // In Progress tasks
  metrics.push({
    icon: Clock,
    title: "Active Tasks",
    value: stats.inProgress,
    description: `Tasks currently in progress`,
    color: "blue",
  });

  // Pending tasks
  metrics.push({
    icon: Calendar,
    title: "Pending Tasks",
    value: stats.pending,
    description: `Tasks waiting to be started`,
    color: "orange",
  });

  // Task distribution
  const mostCommonPriority =
    stats.high >= stats.medium && stats.high >= stats.low
      ? "High"
      : stats.medium >= stats.low
      ? "Medium"
      : "Low";

  const mostCommonStatus =
    stats.completed >= stats.inProgress && stats.completed >= stats.pending
      ? "Completed"
      : stats.inProgress >= stats.pending
      ? "In Progress"
      : "Pending";

  metrics.push({
    icon: Target,
    title: "Most Common Priority",
    value: mostCommonPriority,
    description: `${stats[mostCommonPriority.toLowerCase()]} tasks`,
    color:
      mostCommonPriority === "High"
        ? "red"
        : mostCommonPriority === "Medium"
        ? "yellow"
        : "green",
  });

  metrics.push({
    icon: CheckCircle2,
    title: "Most Common Status",
    value: mostCommonStatus,
    description: `${
      mostCommonStatus === "Completed"
        ? stats.completed
        : mostCommonStatus === "In Progress"
        ? stats.inProgress
        : stats.pending
    } tasks`,
    color:
      mostCommonStatus === "Completed"
        ? "green"
        : mostCommonStatus === "In Progress"
        ? "blue"
        : "orange",
  });

  const colorClasses = {
    green: {
      gradient: "from-green-500/20 to-green-600/20",
      border: "border-green-500/30",
      iconBg: "bg-green-500/20",
      iconColor: "text-green-400",
    },
    yellow: {
      gradient: "from-yellow-500/20 to-yellow-600/20",
      border: "border-yellow-500/30",
      iconBg: "bg-yellow-500/20",
      iconColor: "text-yellow-400",
    },
    red: {
      gradient: "from-red-500/20 to-red-600/20",
      border: "border-red-500/30",
      iconBg: "bg-red-500/20",
      iconColor: "text-red-400",
    },
    blue: {
      gradient: "from-blue-500/20 to-blue-600/20",
      border: "border-blue-500/30",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
    },
    orange: {
      gradient: "from-orange-500/20 to-orange-600/20",
      border: "border-orange-500/30",
      iconBg: "bg-orange-500/20",
      iconColor: "text-orange-400",
    },
    purple: {
      gradient: "from-purple-500/20 to-purple-600/20",
      border: "border-purple-500/30",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400",
    },
    indigo: {
      gradient: "from-indigo-500/20 to-indigo-600/20",
      border: "border-indigo-500/30",
      iconBg: "bg-indigo-500/20",
      iconColor: "text-indigo-400",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-xl border border-(--border-color) bg-gradient-to-br from-white/5 to-white/2 p-6 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20 border border-indigo-500/30">
          <Target className="h-5 w-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-(--text-primary)">Task Summary</h3>
          <p className="text-sm text-(--text-secondary)">
            Quick overview of your task metrics
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const colors = colorClasses[metric.color];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              className={`rounded-lg border ${colors.border} bg-gradient-to-br ${colors.gradient} p-4 backdrop-blur-sm`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colors.iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${colors.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-(--text-secondary) mb-1">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-(--text-primary) mb-1">
                    {metric.value}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {metric.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* No tasks fallback */}
      {stats.total === 0 && (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-neutral-500">
            No tasks available. Create some tasks to see your summary!
          </p>
        </div>
      )}
    </motion.div>
  );
};

TaskSummary.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    completed: PropTypes.number.isRequired,
    inProgress: PropTypes.number.isRequired,
    pending: PropTypes.number.isRequired,
    high: PropTypes.number.isRequired,
    medium: PropTypes.number.isRequired,
    low: PropTypes.number.isRequired,
    completionRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }).isRequired,
  tasks: PropTypes.array.isRequired,
};

export default TaskSummary;
