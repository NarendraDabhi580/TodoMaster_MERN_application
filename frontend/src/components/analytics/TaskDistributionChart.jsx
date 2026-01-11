import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { PieChartIcon } from "lucide-react";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-(--border-color) bg-(--bg-secondary)/95 p-3 shadow-xl backdrop-blur-sm">
        <p className="text-sm font-semibold text-(--text-primary)">
          {payload[0].name}
        </p>
        <p className="text-sm text-(--text-secondary)">
          Tasks:{" "}
          <span className="font-semibold text-(--text-primary)">
            {payload[0].value}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
};

const CustomLegend = ({ payload }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className="text-sm text-(--text-secondary)">
            {entry.value}:{" "}
            <span className="font-semibold text-(--text-primary)">
              {entry.payload.value}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
};

CustomLegend.propTypes = {
  payload: PropTypes.array,
};

const TaskDistributionChart = ({ data }) => {
  const totalTasks = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl border border-(--border-color) bg-linear-to-br from-white/5 to-white/2 p-6 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20 border border-green-500/30">
          <PieChartIcon className="h-5 w-5 text-green-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-(--text-primary)">
            Task Status Distribution
          </h3>
          <p className="text-sm text-(--text-secondary)">
            Overview of task completion status
          </p>
        </div>
      </div>

      {/* Chart */}
      {totalTasks > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-neutral-500">No task data available</p>
        </div>
      )}
    </motion.div>
  );
};

TaskDistributionChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TaskDistributionChart;
