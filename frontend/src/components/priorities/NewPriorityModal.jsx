import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Calendar, Edit, TrendingUp } from "lucide-react";
import PropTypes from "prop-types";

const NewPriorityModal = ({
  isOpen,
  onClose,
  newTask,
  onTaskChange,
  onSubmit,
  isEditMode = false,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-indigo-600/20 to-purple-600/20">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600">
                    {isEditMode ? (
                      <Edit className="h-5 w-5 text-white" />
                    ) : (
                      <TrendingUp className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {isEditMode
                        ? "Edit Priority Task"
                        : "Create Priority Task"}
                    </h2>
                    <p className="text-xs text-neutral-400">
                      Set task priority and details
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-neutral-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                <form
                  id="priority-task-form"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Priority Selection - Featured */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                    <label className="block text-sm font-medium text-white mb-3">
                      Priority Level <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {["High", "Medium", "Low"].map((priority) => {
                        const isSelected = newTask.priority === priority;
                        const colors = {
                          High: "from-red-500/20 to-red-600/20 border-red-500/50 text-red-300",
                          Medium:
                            "from-yellow-500/20 to-yellow-600/20 border-yellow-500/50 text-yellow-300",
                          Low: "from-green-500/20 to-green-600/20 border-green-500/50 text-green-300",
                        };
                        return (
                          <button
                            key={priority}
                            type="button"
                            onClick={() =>
                              onTaskChange({ ...newTask, priority })
                            }
                            className={`px-4 py-3 rounded-lg border-2 font-semibold text-sm transition-all ${
                              isSelected
                                ? `bg-gradient-to-r ${colors[priority]} scale-105`
                                : "border-white/10 bg-white/5 text-neutral-400 hover:bg-white/10"
                            }`}
                          >
                            {priority}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Task Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) =>
                        onTaskChange({ ...newTask, title: e.target.value })
                      }
                      placeholder="Enter task title..."
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) =>
                        onTaskChange({
                          ...newTask,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe your task..."
                      rows={4}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none"
                      required
                    />
                  </div>

                  {/* Status and Due Date Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newTask.status}
                        onChange={(e) =>
                          onTaskChange({ ...newTask, status: e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all cursor-pointer"
                        required
                      >
                        <option value="Pending" className="bg-neutral-900">
                          Pending
                        </option>
                        <option value="In Progress" className="bg-neutral-900">
                          In Progress
                        </option>
                        <option value="Completed" className="bg-neutral-900">
                          Completed
                        </option>
                      </select>
                    </div>

                    {/* Due Date */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Due Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none" />
                        <input
                          type="text"
                          value={newTask.dueDate}
                          onChange={(e) =>
                            onTaskChange({
                              ...newTask,
                              dueDate: e.target.value,
                            })
                          }
                          placeholder="e.g., Today, Tomorrow..."
                          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Tags <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newTask.tags}
                      onChange={(e) =>
                        onTaskChange({ ...newTask, tags: e.target.value })
                      }
                      placeholder="e.g., Urgent, Important, Work (comma-separated)"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                      required
                    />
                    <p className="mt-1.5 text-xs text-neutral-500">
                      Separate multiple tags with commas
                    </p>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 bg-black/20">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="priority-task-form"
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-sm font-medium text-white transition-all shadow-lg shadow-indigo-500/20"
                >
                  {isEditMode ? "Update Task" : "Create Task"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

NewPriorityModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  newTask: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
  }).isRequired,
  onTaskChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
};

export default NewPriorityModal;
