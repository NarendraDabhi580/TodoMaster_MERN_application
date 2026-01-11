import { Search, Plus, TrendingUp } from "lucide-react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const PrioritiesHeader = ({
  searchQuery,
  onSearchChange,
  selectedPriority,
  onPriorityChange,
  onNewTaskClick,
  stats,
}) => {
  const priorities = ["All", "High", "Medium", "Low"];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "from-red-500/20 to-red-600/20 border-red-500/30 text-red-500";
      case "Medium":
        return "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-600";
      case "Low":
        return "from-green-500/20 to-green-600/20 border-green-500/30 text-green-500";
      default:
        return "from-indigo-500/20 to-indigo-600/20 border-indigo-500/30 text-indigo-500";
    }
  };

  return (
    <div className="flex flex-col gap-6 border-b border-(--border-color) bg-(--bg-secondary)/80 backdrop-blur-xl px-6 py-6 transition-colors duration-300">
      {/* Title and Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30">
            <TrendingUp className="h-6 w-6 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-(--text-primary)">
              Priorities
            </h1>
            <p className="text-sm text-(--text-secondary)">
              Manage tasks by priority level
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-(--border-color) bg-(--bg-secondary) px-4 py-2 transition-colors">
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
            <span className="text-sm text-(--text-secondary)">High:</span>
            <span className="text-sm font-semibold text-(--text-primary)">
              {stats.High}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-(--border-color) bg-(--bg-secondary) px-4 py-2 transition-colors">
            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-(--text-secondary)">Medium:</span>
            <span className="text-sm font-semibold text-(--text-primary)">
              {stats.Medium}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-(--border-color) bg-(--bg-secondary) px-4 py-2 transition-colors">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-(--text-secondary)">Low:</span>
            <span className="text-sm font-semibold text-(--text-primary)">
              {stats.Low}
            </span>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--text-secondary)" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={onSearchChange}
            className="w-full rounded-lg border border-(--border-color) bg-(--bg-secondary) py-2.5 pl-10 pr-4 text-sm text-(--text-primary) placeholder-neutral-500 outline-none transition-all focus:border-indigo-500/50 focus:bg-(--bg-primary)"
          />
        </div>

        {/* Priority Filter Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {priorities.map((priority) => (
            <motion.button
              key={priority}
              onClick={() => onPriorityChange(priority)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                selectedPriority === priority
                  ? `bg-linear-to-r ${getPriorityColor(priority)} border`
                  : "border border-(--border-color) bg-(--bg-secondary) text-(--text-secondary) hover:bg-(--bg-primary)"
              }`}
            >
              {priority}
            </motion.button>
          ))}
        </div>

        {/* New Task Button */}
        <motion.button
          onClick={onNewTaskClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          New Task
        </motion.button>
      </div>
    </div>
  );
};

PrioritiesHeader.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  selectedPriority: PropTypes.string.isRequired,
  onPriorityChange: PropTypes.func.isRequired,
  onNewTaskClick: PropTypes.func.isRequired,
  stats: PropTypes.shape({
    High: PropTypes.number.isRequired,
    Medium: PropTypes.number.isRequired,
    Low: PropTypes.number.isRequired,
    Total: PropTypes.number.isRequired,
  }).isRequired,
};

export default PrioritiesHeader;
