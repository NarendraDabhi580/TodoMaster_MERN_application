import { useState, useMemo, useEffect } from "react";
import PrioritiesHeader from "../components/priorities/PrioritiesHeader";
import PriorityGrid from "../components/priorities/PriorityGrid";
import NewPriorityModal from "../components/priorities/NewPriorityModal";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

/* ================= MAIN PAGE ================= */
const Priorities = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [isNewPriorityOpen, setIsNewPriorityOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "High",
    dueDate: "",
    tags: "",
  });

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get("/todo/todos");
      setTasks(response.data.todo);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch tasks");
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

  const filteredTasks = useMemo(() => {
    if (selectedPriority === "All") return searchedTasks;
    return searchedTasks.filter((task) => task.priority === selectedPriority);
  }, [searchedTasks, selectedPriority]);

  // Group tasks by priority
  const groupedTasks = useMemo(() => {
    const groups = {
      High: [],
      Medium: [],
      Low: [],
    };

    filteredTasks.forEach((task) => {
      if (groups[task.priority]) {
        groups[task.priority].push(task);
      }
    });

    return groups;
  }, [filteredTasks]);

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
    setIsNewPriorityOpen(true);
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
      const tagsArray = newTask.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const taskData = {
        ...newTask,
        tags: tagsArray,
      };

      if (isEditMode) {
        const response = await axiosInstance.put(
          `/todo/todos/${editingTaskId}`,
          taskData
        );
        toast.success(response.data.message);
      } else {
        const response = await axiosInstance.post("/todo/todos", taskData);
        toast.success(response.data.message);
      }

      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsNewPriorityOpen(false);
      setIsEditMode(false);
      setEditingTaskId(null);
      setNewTask({
        title: "",
        description: "",
        status: "Pending",
        priority: "High",
        dueDate: "",
        tags: "",
      });
    }
  };

  const priorityStats = useMemo(() => {
    return {
      High: tasks.filter((t) => t.priority === "High").length,
      Medium: tasks.filter((t) => t.priority === "Medium").length,
      Low: tasks.filter((t) => t.priority === "Low").length,
      Total: tasks.length,
    };
  }, [tasks]);

  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
      {/* Header */}
      <PrioritiesHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        onNewTaskClick={() => setIsNewPriorityOpen(true)}
        stats={priorityStats}
      />

      {/* Content */}
      <PriorityGrid
        groupedTasks={groupedTasks}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        selectedPriority={selectedPriority}
      />

      {/* New Task Modal */}
      <NewPriorityModal
        isOpen={isNewPriorityOpen}
        onClose={() => {
          setIsNewPriorityOpen(false);
          setIsEditMode(false);
          setEditingTaskId(null);
          setNewTask({
            title: "",
            description: "",
            status: "Pending",
            priority: "High",
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

export default Priorities;
