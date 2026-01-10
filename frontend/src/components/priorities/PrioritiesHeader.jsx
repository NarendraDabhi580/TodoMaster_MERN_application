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
        return "from-red-500/20 to-red-600/20 border-red-500/30 text-red-300";
      case "Medium":
        return "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-300";
      case "Low":
        return "from-green-500/20 to-green-600/20 border-green-500/30 text-green-300";
      default:
        return "from-indigo-500/20 to-indigo-600/20 border-indigo-500/30 text-indigo-300";
    }
  };

  return (
    <div className="flex flex-col gap-6 border-b border-white/5 bg-black/20 backdrop-blur-sm px-6 py-6">
      {/* Title and Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30">
            <TrendingUp className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Priorities</h1>
            <p className="text-sm text-neutral-400">
              Manage tasks by priority level
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
            <span className="text-sm text-neutral-400">High:</span>
            <span className="text-sm font-semibold text-white">
              {stats.High}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-neutral-400">Medium:</span>
            <span className="text-sm font-semibold text-white">
              {stats.Medium}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-neutral-400">Low:</span>
            <span className="text-sm font-semibold text-white">
              {stats.Low}
            </span>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={onSearchChange}
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 outline-none transition-all focus:border-indigo-500/50 focus:bg-white/10"
          />
        </div>

        {/* Priority Filter Tabs */}
        <div className="flex items-center gap-2">
          {priorities.map((priority) => (
            <motion.button
              key={priority}
              onClick={() => onPriorityChange(priority)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedPriority === priority
                  ? `bg-gradient-to-r ${getPriorityColor(priority)} border`
                  : "border border-white/10 bg-white/5 text-neutral-400 hover:bg-white/10"
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
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40"
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
