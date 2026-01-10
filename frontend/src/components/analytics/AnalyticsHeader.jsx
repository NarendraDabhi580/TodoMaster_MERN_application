import { BarChart3, RefreshCw, Calendar } from "lucide-react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const AnalyticsHeader = ({
  timeRange,
  onTimeRangeChange,
  onRefresh,
  isLoading,
}) => {
  const timeRanges = [
    { value: "all", label: "All Time" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
  ];

  return (
    <div className="flex flex-col gap-6 border-b border-white/5 bg-black/20 backdrop-blur-sm px-6 py-6">
      {/* Title and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-500/30">
            <BarChart3 className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Analytics Dashboard
            </h1>
            <p className="text-sm text-neutral-400">
              Track your productivity and task insights
            </p>
          </div>
        </div>

        {/* Refresh Button */}
        <motion.button
          onClick={onRefresh}
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </motion.button>
      </div>

      {/* Time Range Filter */}
      <div className="flex items-center gap-3">
        <Calendar className="h-4 w-4 text-neutral-500" />
        <span className="text-sm text-neutral-400">Time Range:</span>
        <div className="flex items-center gap-2">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => onTimeRangeChange(range.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === range.value
                  ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 text-purple-300"
                  : "border border-white/10 bg-white/5 text-neutral-400 hover:bg-white/10"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

AnalyticsHeader.propTypes = {
  timeRange: PropTypes.string.isRequired,
  onTimeRangeChange: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default AnalyticsHeader;
