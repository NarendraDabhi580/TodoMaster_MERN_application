import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  ListTodo,
  TrendingUp,
  AlertCircle,
  Zap,
} from "lucide-react";
import PropTypes from "prop-types";

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: ListTodo,
      gradient: "from-blue-500/20 to-blue-600/20",
      border: "border-blue-500/30",
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/20",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      gradient: "from-green-500/20 to-green-600/20",
      border: "border-green-500/30",
      iconColor: "text-green-400",
      iconBg: "bg-green-500/20",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: Clock,
      gradient: "from-yellow-500/20 to-yellow-600/20",
      border: "border-yellow-500/30",
      iconColor: "text-yellow-400",
      iconBg: "bg-yellow-500/20",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: AlertCircle,
      gradient: "from-orange-500/20 to-orange-600/20",
      border: "border-orange-500/30",
      iconColor: "text-orange-400",
      iconBg: "bg-orange-500/20",
    },
    {
      title: "High Priority",
      value: stats.high,
      icon: TrendingUp,
      gradient: "from-red-500/20 to-red-600/20",
      border: "border-red-500/30",
      iconColor: "text-red-400",
      iconBg: "bg-red-500/20",
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      icon: Zap,
      gradient: "from-purple-500/20 to-purple-600/20",
      border: "border-purple-500/30",
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`relative overflow-hidden rounded-xl border ${card.border} bg-gradient-to-br ${card.gradient} p-5 backdrop-blur-sm transition-all hover:scale-105`}
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-neutral-400">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-white">{card.value}</p>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.iconBg}`}
              >
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </div>

            {/* Animated background effect */}
            <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/5 blur-2xl"></div>
          </motion.div>
        );
      })}
    </div>
  );
};

StatsCards.propTypes = {
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
};

export default StatsCards;
