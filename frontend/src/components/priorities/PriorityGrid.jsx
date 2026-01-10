import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import PriorityTaskCard from "./PriorityTaskCard";
import { AlertCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";

const PriorityGrid = ({
  groupedTasks,
  onEditTask,
  onDeleteTask,
  selectedPriority,
}) => {
  const priorityConfig = {
    High: {
      icon: TrendingUp,
      color: "red",
      gradient: "from-red-500/20 to-red-600/20",
      border: "border-red-500/30",
      text: "text-red-300",
      iconBg: "bg-red-500/20",
    },
    Medium: {
      icon: Minus,
      color: "yellow",
      gradient: "from-yellow-500/20 to-yellow-600/20",
      border: "border-yellow-500/30",
      text: "text-yellow-300",
      iconBg: "bg-yellow-500/20",
    },
    Low: {
      icon: TrendingDown,
      color: "green",
      gradient: "from-green-500/20 to-green-600/20",
      border: "border-green-500/30",
      text: "text-green-300",
      iconBg: "bg-green-500/20",
    },
  };

  const priorities =
    selectedPriority === "All" ? ["High", "Medium", "Low"] : [selectedPriority];

  const totalTasks = Object.values(groupedTasks).reduce(
    (sum, tasks) => sum + tasks.length,
    0
  );

  if (totalTasks === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 border border-white/10">
            <AlertCircle className="h-10 w-10 text-neutral-500" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">No tasks found</h3>
            <p className="mt-2 text-sm text-neutral-400">
              {selectedPriority === "All"
                ? "Create your first task to get started"
                : `No ${selectedPriority.toLowerCase()} priority tasks found`}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="space-y-8">
        {priorities.map((priority) => {
          const config = priorityConfig[priority];
          const Icon = config.icon;
          const tasks = groupedTasks[priority] || [];

          if (tasks.length === 0 && selectedPriority !== "All") return null;

          return (
            <motion.div
              key={priority}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Priority Section Header */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.iconBg} border ${config.border}`}
                >
                  <Icon className={`h-5 w-5 ${config.text}`} />
                </div>
                <div className="flex-1">
                  <h2 className={`text-lg font-semibold ${config.text}`}>
                    {priority} Priority
                  </h2>
                  <p className="text-sm text-neutral-500">
                    {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
                  </p>
                </div>
                <div
                  className={`h-1 flex-1 rounded-full bg-gradient-to-r ${config.gradient}`}
                ></div>
              </div>

              {/* Tasks Grid */}
              {tasks.length > 0 ? (
                <motion.div
                  layout
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                  <AnimatePresence mode="popLayout">
                    {tasks.map((task) => (
                      <PriorityTaskCard
                        key={task._id}
                        task={task}
                        onEditTask={onEditTask}
                        onDeleteTask={onDeleteTask}
                        priorityConfig={config}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5 p-8">
                  <p className="text-sm text-neutral-500">
                    No {priority.toLowerCase()} priority tasks
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

PriorityGrid.propTypes = {
  groupedTasks: PropTypes.shape({
    High: PropTypes.array,
    Medium: PropTypes.array,
    Low: PropTypes.array,
  }).isRequired,
  onEditTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  selectedPriority: PropTypes.string.isRequired,
};

export default PriorityGrid;
