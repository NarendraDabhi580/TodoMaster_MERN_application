import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MoreVertical, Edit, Trash2, Tag } from "lucide-react";
import { useState } from "react";
import PropTypes from "prop-types";
import StatusBadge from "../tasks/StatusBadge";

const PriorityTaskCard = ({
  task,
  onEditTask,
  onDeleteTask,
  priorityConfig,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className={`group relative flex flex-col gap-3 rounded-xl border ${priorityConfig.border} bg-(--bg-secondary) p-5 backdrop-blur-sm transition-all hover:shadow-lg hover:bg-(--bg-primary)`}
    >
      {/* Priority Indicator Bar */}
      <div
        className={`absolute left-0 top-0 h-full w-1 rounded-l-xl bg-${priorityConfig.color}-500`}
      ></div>

      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2 flex-1">
          <StatusBadge status={task.status} />
          <h3
            className={`text-lg font-semibold text-(--text-primary) transition-colors`}
          >
            {task.title}
          </h3>
        </div>

        {/* Three Dots Menu */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-(--text-secondary) hover:text-(--text-primary) transition-colors p-1 hover:bg-(--bg-primary) rounded-lg"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                {/* Backdrop to close menu when clicking outside */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsMenuOpen(false)}
                />

                {/* Menu */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-8 z-20 w-48 bg-(--bg-secondary) border border-(--border-color) rounded-lg shadow-xl overflow-hidden"
                >
                  <div className="py-1">
                    {/* Edit */}
                    <button
                      onClick={() => {
                        onEditTask(task);
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-(--text-primary) hover:bg-(--bg-primary) hover:text-(--text-primary) transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Task
                    </button>

                    {/* Divider */}
                    <div className="my-1 border-t border-(--border-color)" />

                    {/* Delete */}
                    <button
                      onClick={() => {
                        onDeleteTask(task._id);
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Task
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className="text-sm text-(--text-secondary) line-clamp-2">
        {task.description}
      </p>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 rounded-md bg-(--bg-primary) px-2 py-1 text-xs text-(--text-primary)"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="inline-flex items-center rounded-md bg-(--bg-primary) px-2 py-1 text-xs text-(--text-secondary)">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-(--border-color)">
        <div
          className={`flex items-center gap-1.5 text-xs ${priorityConfig.text} font-medium`}
        >
          <div
            className={`h-2 w-2 rounded-full bg-${priorityConfig.color}-500 animate-pulse`}
          ></div>
          {task.priority}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-(--text-secondary)">
          <Calendar className="h-3.5 w-3.5" />
          <span>{task.dueDate}</span>
        </div>
      </div>
    </motion.div>
  );
};

PriorityTaskCard.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
    tags: PropTypes.array,
  }).isRequired,
  onEditTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  priorityConfig: PropTypes.shape({
    color: PropTypes.string.isRequired,
    gradient: PropTypes.string.isRequired,
    border: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
};

export default PriorityTaskCard;
