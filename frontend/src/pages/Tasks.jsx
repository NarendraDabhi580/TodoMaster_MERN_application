import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TasksHeader from "../components/tasks/TasksHeader";
import FilterPanel from "../components/tasks/FilterPanel";
import TaskGrid from "../components/tasks/TaskGrid";
import NewTaskModal from "../components/tasks/NewTaskModal";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

/* ================= MAIN PAGE ================= */
const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState({});
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [searchParams] = useSearchParams();
  const highlightedTaskId = searchParams.get("highlight");

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium",
    dueDate: "",
    tags: "",
  });

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get("/todo/todos");
      setTasks(response.data.todo);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const searchedTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;

    const query = searchQuery.toLowerCase();
    return tasks.filter((task) => {
      const titleMatch = task.title?.toLowerCase().includes(query);
      const descriptionMatch = task.description?.toLowerCase().includes(query);
      const dueDateMatch = task.dueDate?.toLowerCase().includes(query);
      const tagsMatch = task.tags?.some((tag) =>
        tag.toLowerCase().includes(query)
      );

      return titleMatch || descriptionMatch || dueDateMatch || tagsMatch;
    });
  }, [tasks, searchQuery]);

  const handleFilter = (event) => {
    const { name, checked } = event.target ?? {};

    setFilter((pre) => ({ ...pre, [name]: checked }));
  };

  const filteredTasks = useMemo(() => {
    if (!searchedTasks?.length) return [];

    let activePriority = [];
    let activeStatus = [];

    Object.keys(filter)?.forEach((key) => {
      if (!filter[key]) return;

      if (["High", "Medium", "Low"]?.includes(key)) {
        activePriority.push(key);
      }

      if (["In Progress", "Pending", "Completed"]?.includes(key)) {
        activeStatus.push(key);
      }
    });

    // If no filters are active, return all searched tasks
    if (!activePriority.length && !activeStatus.length) {
      return searchedTasks;
    }

    return searchedTasks.filter((task) => {
      // If only status filters are active, check status only
      if (activeStatus.length && !activePriority.length) {
        return activeStatus.includes(task.status);
      }

      // If only priority filters are active, check priority only
      if (activePriority.length && !activeStatus.length) {
        return activePriority.includes(task.priority);
      }

      // If both filters are active, task must match BOTH
      return (
        activeStatus.includes(task.status) &&
        activePriority.includes(task.priority)
      );
    });
  }, [filter, searchedTasks]);

  const handleEditTask = (task) => {
    setIsEditMode(true);
    setEditingTaskId(task._id);
    setNewTask({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      tags: Array.isArray(task.tags) ? task.tags.join(", ") : task.tags,
    });
    setIsNewTaskOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await axiosInstance.delete(`/todo/todos/${taskId}`);
      toast.success(response.data.message);
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const handleNewTaskSubmit = async () => {
    try {
      // Convert comma-separated tags string to array
      const tagsArray = newTask.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const taskData = {
        ...newTask,
        tags: tagsArray,
      };

      if (isEditMode) {
        // Update existing task
        const response = await axiosInstance.put(
          `/todo/todos/${editingTaskId}`,
          taskData
        );
        toast.success(response.data.message);
      } else {
        // Create new task
        const response = await axiosInstance.post("/todo/todos", taskData);
        toast.success(response.data.message);
      }

      // Refetch tasks to update the list
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsNewTaskOpen(false);
      setIsEditMode(false);
      setEditingTaskId(null);
      // Reset form
      setNewTask({
        title: "",
        description: "",
        status: "Pending",
        priority: "Medium",
        dueDate: "",
        tags: "",
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
      {/* Header */}
      <TasksHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        isFilterOpen={isFilterOpen}
        onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
        onNewTaskClick={() => setIsNewTaskOpen(true)}
      />

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        filter={filter}
        onFilterChange={handleFilter}
      />

      {/* Content */}
      <TaskGrid
        tasks={filteredTasks}
        onEditTask={handleEditTask}
        onNewTaskClick={() => setIsNewTaskOpen(true)}
        onDeleteTask={handleDeleteTask}
        highlightedTaskId={highlightedTaskId}
      />

      {/* New Task Modal */}
      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => {
          setIsNewTaskOpen(false);
          setIsEditMode(false);
          setEditingTaskId(null);
          setNewTask({
            title: "",
            description: "",
            status: "Pending",
            priority: "Medium",
            dueDate: "",
            tags: "",
          });
        }}
        newTask={newTask}
        onTaskChange={setNewTask}
        onSubmit={handleNewTaskSubmit}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default Tasks;
