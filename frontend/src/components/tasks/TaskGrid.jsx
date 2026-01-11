import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import PropTypes from "prop-types";
import TaskCard from "./TaskCard";

const TaskGrid = ({
  tasks,
  onEditTask,
  onNewTaskClick,
  onDeleteTask,
  highlightedTaskId,
}) => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {tasks.map((task) => (
          <TaskCard
            key={task._id || task.id}
            task={task}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            isHighlighted={highlightedTaskId === (task._id || task.id)}
          />
        ))}

        {/* Add New Placeholder */}
        <motion.button
          onClick={onNewTaskClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-indigo-500/30 bg-indigo-500/5 p-6 text-indigo-500/60 transition-all hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-600 min-h-[200px] cursor-pointer"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500">
            <Plus className="h-6 w-6" />
          </div>
          <span className="font-medium">Create New Task</span>
        </motion.button>
      </div>
    </div>
  );
};

TaskGrid.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string, // MongoDB ID
      id: PropTypes.number, // Dummy data ID
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
      dueDate: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEditTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onNewTaskClick: PropTypes.func.isRequired,
  highlightedTaskId: PropTypes.string,
};

export default TaskGrid;
