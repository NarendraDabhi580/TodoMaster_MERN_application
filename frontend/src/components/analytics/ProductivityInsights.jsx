import { motion } from "framer-motion";
import PropTypes from "prop-types";
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Target,
  Zap,
} from "lucide-react";

const ProductivityInsights = ({ stats, tasks }) => {
  // Calculate insights
  const insights = [];

  // Completion rate insight
  if (parseFloat(stats.completionRate) >= 70) {
    insights.push({
      type: "success",
      icon: CheckCircle2,
      title: "Great Progress!",
      message: `You've completed ${stats.completionRate}% of your tasks. Keep up the excellent work!`,
      color: "green",
    });
  } else if (parseFloat(stats.completionRate) >= 40) {
    insights.push({
      type: "warning",
      icon: Target,
      title: "Room for Improvement",
      message: `Your completion rate is ${stats.completionRate}%. Try to focus on completing pending tasks.`,
      color: "yellow",
    });
  } else {
    insights.push({
      type: "alert",
      icon: AlertTriangle,
      title: "Needs Attention",
      message: `Only ${stats.completionRate}% of tasks completed. Consider prioritizing your workload.`,
      color: "red",
    });
  }

  // High priority tasks insight
  if (stats.high > 0) {
    const highPriorityCompleted = tasks.filter(
      (t) => t.priority === "High" && t.status === "Completed"
    ).length;
    const highPriorityRate = (
      (highPriorityCompleted / stats.high) *
      100
    ).toFixed(0);

    insights.push({
      type: "info",
      icon: TrendingUp,
      title: "High Priority Focus",
      message: `${highPriorityCompleted} out of ${stats.high} high priority tasks completed (${highPriorityRate}%).`,
      color: "blue",
    });
  }

  // Pending tasks insight
  if (stats.pending > stats.completed) {
    insights.push({
      type: "warning",
      icon: AlertTriangle,
      title: "Pending Tasks Alert",
      message: `You have ${stats.pending} pending tasks. Consider starting on them to improve productivity.`,
      color: "orange",
    });
  }

  // Productivity boost suggestion
  if (stats.inProgress > 5) {
    insights.push({
      type: "tip",
      icon: Zap,
      title: "Productivity Tip",
      message: `You have ${stats.inProgress} tasks in progress. Focus on completing a few before starting new ones.`,
      color: "purple",
    });
  } else if (stats.total > 0) {
    insights.push({
      type: "tip",
      icon: Lightbulb,
      title: "Stay Organized",
      message:
        "Break down large tasks into smaller, manageable subtasks for better tracking.",
      color: "indigo",
    });
  }

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
      className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 border border-purple-500/30">
          <Lightbulb className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">
            Productivity Insights
          </h3>
          <p className="text-sm text-neutral-400">
            AI-powered recommendations for better task management
          </p>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          const colors = colorClasses[insight.color];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={`rounded-lg border ${colors.border} bg-gradient-to-br ${colors.gradient} p-4 backdrop-blur-sm`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colors.iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${colors.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-neutral-400">{insight.message}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* No insights fallback */}
      {insights.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-neutral-500">
            No insights available yet. Add some tasks to get started!
          </p>
        </div>
      )}
    </motion.div>
  );
};

ProductivityInsights.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    completed: PropTypes.number.isRequired,
    inProgress: PropTypes.number.isRequired,
    pending: PropTypes.number.isRequired,
    high: PropTypes.number.isRequired,
    completionRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }).isRequired,
  tasks: PropTypes.array.isRequired,
};

export default ProductivityInsights;
