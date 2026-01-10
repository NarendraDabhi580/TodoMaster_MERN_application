import { useState, useEffect, useMemo } from "react";
import AnalyticsHeader from "../components/analytics/AnalyticsHeader";
import StatsCards from "../components/analytics/StatsCards";
import TaskDistributionChart from "../components/analytics/TaskDistributionChart";
import PriorityBreakdownChart from "../components/analytics/PriorityBreakdownChart";
import StatusTimelineChart from "../components/analytics/StatusTimelineChart";
import RecentActivity from "../components/analytics/RecentActivity";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

/* ================= MAIN PAGE ================= */
const Analytics = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("all"); // all, week, month

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/todo/todos");
      setTasks(response.data.todo);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const pending = tasks.filter((t) => t.status === "Pending").length;
    const high = tasks.filter((t) => t.priority === "High").length;
    const medium = tasks.filter((t) => t.priority === "Medium").length;
    const low = tasks.filter((t) => t.priority === "Low").length;

    const completionRate =
      total > 0 ? ((completed / total) * 100).toFixed(1) : 0;

    return {
      total,
      completed,
      inProgress,
      pending,
      high,
      medium,
      low,
      completionRate,
    };
  }, [tasks]);

  // Prepare data for charts
  const chartData = useMemo(() => {
    // Status distribution
    const statusData = [
      { name: "Completed", value: stats.completed, color: "#10b981" },
      { name: "In Progress", value: stats.inProgress, color: "#3b82f6" },
      { name: "Pending", value: stats.pending, color: "#f59e0b" },
    ];

    // Priority distribution
    const priorityData = [
      { name: "High", value: stats.high, color: "#ef4444" },
      { name: "Medium", value: stats.medium, color: "#f59e0b" },
      { name: "Low", value: stats.low, color: "#10b981" },
    ];

    // Combined data for bar chart
    const combinedData = [
      {
        name: "High",
        Completed: tasks.filter(
          (t) => t.priority === "High" && t.status === "Completed"
        ).length,
        "In Progress": tasks.filter(
          (t) => t.priority === "High" && t.status === "In Progress"
        ).length,
        Pending: tasks.filter(
          (t) => t.priority === "High" && t.status === "Pending"
        ).length,
      },
      {
        name: "Medium",
        Completed: tasks.filter(
          (t) => t.priority === "Medium" && t.status === "Completed"
        ).length,
        "In Progress": tasks.filter(
          (t) => t.priority === "Medium" && t.status === "In Progress"
        ).length,
        Pending: tasks.filter(
          (t) => t.priority === "Medium" && t.status === "Pending"
        ).length,
      },
      {
        name: "Low",
        Completed: tasks.filter(
          (t) => t.priority === "Low" && t.status === "Completed"
        ).length,
        "In Progress": tasks.filter(
          (t) => t.priority === "Low" && t.status === "In Progress"
        ).length,
        Pending: tasks.filter(
          (t) => t.priority === "Low" && t.status === "Pending"
        ).length,
      },
    ];

    return {
      statusData,
      priorityData,
      combinedData,
    };
  }, [tasks, stats]);

  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
      {/* Header */}
      <AnalyticsHeader
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        onRefresh={fetchTasks}
        isLoading={isLoading}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Distribution Pie Chart */}
            <TaskDistributionChart data={chartData.statusData} />

            {/* Priority Breakdown Pie Chart */}
            <PriorityBreakdownChart data={chartData.priorityData} />
          </div>

          {/* Status Timeline Bar Chart */}
          <StatusTimelineChart data={chartData.combinedData} />

          {/* Recent Activity */}
          <RecentActivity tasks={tasks} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
