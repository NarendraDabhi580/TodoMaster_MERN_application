import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MoreVertical, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import StatusBadge from "./StatusBadge";
import PriorityIndicator from "./PriorityIndicator";

const TaskCard = ({ task, onEditTask, onDeleteTask, isHighlighted }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (isHighlighted && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isHighlighted]);

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isHighlighted ? 1.02 : 1,
        borderColor: isHighlighted
          ? "rgba(99, 102, 241, 0.5)"
          : "rgba(255, 255, 255, 0.05)",
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={`group relative flex flex-col gap-3 rounded-xl border bg-(--bg-secondary) p-5 backdrop-blur-sm transition-colors hover:bg-(--bg-primary) ${
        isHighlighted
          ? "shadow-[0_0_30px_rgba(99,102,241,0.2)] ring-1 ring-indigo-500/50"
          : "border-white/5"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <StatusBadge status={task.status} />
          <h3 className="text-lg font-semibold text-(--text-primary) group-hover:text-indigo-500 transition-colors mt-2">
            {task.title}
          </h3>
        </div>

        {/* Three Dots Menu */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-(--text-secondary) hover:text-(--text-primary) transition-colors p-1 hover:bg-(--bg-primary) rounded-lg cursor-pointer"
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
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-(--text-primary) hover:bg-(--bg-primary) hover:text-(--text-primary) transition-colors cursor-pointer"
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
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
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

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-(--border-color)">
        <PriorityIndicator priority={task.priority} />
        <div className="flex items-center gap-4 text-xs text-(--text-secondary)">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {task.dueDate &&
              !isNaN(new Date(task.dueDate).getTime()) &&
              task.dueDate.includes("-")
                ? new Date(task.dueDate).toLocaleDateString()
                : task.dueDate}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
  }).isRequired,
  onEditTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  isHighlighted: PropTypes.bool,
};

export default TaskCard;
