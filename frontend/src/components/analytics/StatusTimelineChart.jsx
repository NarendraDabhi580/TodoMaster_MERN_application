import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { BarChart3 } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-(--border-color) bg-(--bg-secondary)/95 p-4 shadow-xl backdrop-blur-sm">
        <p className="text-sm font-semibold text-(--text-primary) mb-2">
          {label} Priority
        </p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm text-(--text-secondary)">
            {entry.name}:{" "}
            <span className="font-semibold text-(--text-primary)">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string,
};

const StatusTimelineChart = ({ data }) => {
  const totalTasks = data.reduce(
    (sum, item) => sum + item.Completed + item["In Progress"] + item.Pending,
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-xl border border-(--border-color) bg-gradient-to-br from-white/5 to-white/2 p-6 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 border border-blue-500/30">
          <BarChart3 className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-(--text-primary)">
            Priority vs Status Analysis
          </h3>
          <p className="text-sm text-(--text-secondary)">
            Task status breakdown by priority level
          </p>
        </div>
      </div>

      {/* Chart */}
      {totalTasks > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barGap={8}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              style={{ fontSize: "12px" }}
            />
            <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
            <Bar
              dataKey="Completed"
              fill="#10b981"
              radius={[8, 8, 0, 0]}
              animationBegin={0}
              animationDuration={800}
              activeBar={false}
            />
            <Bar
              dataKey="In Progress"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
              animationBegin={200}
              animationDuration={800}
              activeBar={false}
            />
            <Bar
              dataKey="Pending"
              fill="#f59e0b"
              radius={[8, 8, 0, 0]}
              animationBegin={400}
              animationDuration={800}
              activeBar={false}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-[350px] items-center justify-center">
          <p className="text-sm text-neutral-500">No data available</p>
        </div>
      )}
    </motion.div>
  );
};

StatusTimelineChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      Completed: PropTypes.number.isRequired,
      "In Progress": PropTypes.number.isRequired,
      Pending: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default StatusTimelineChart;
