import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const FilterPanel = ({ isOpen, filter, onFilterChange }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden border-b border-(--border-color) bg-(--bg-secondary) backdrop-blur-sm"
        >
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            <div>
              <h3 className="text-xs font-semibold text-(--text-secondary) uppercase tracking-wider mb-3">
                Status
              </h3>
              <div className="flex flex-wrap gap-3">
                {["In Progress", "Pending", "Completed"].map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 text-sm text-(--text-primary) cursor-pointer bg-(--bg-primary) px-3 py-1.5 rounded-lg border border-(--border-color) transition-colors hover:bg-(--bg-secondary)"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-(--border-color) bg-(--bg-secondary) text-indigo-500 focus:ring-indigo-500/50"
                      name={status}
                      checked={!!filter?.[status]}
                      onChange={(event) => onFilterChange(event, status)}
                    />
                    {status}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-(--text-secondary) uppercase tracking-wider mb-3">
                Priority
              </h3>
              <div className="flex flex-wrap gap-3">
                {["High", "Medium", "Low"].map((priority) => (
                  <label
                    key={priority}
                    className="flex items-center gap-2 text-sm text-(--text-primary) cursor-pointer bg-(--bg-primary) px-3 py-1.5 rounded-lg border border-(--border-color) transition-colors hover:bg-(--bg-secondary)"
                  >
                    <input
                      type="checkbox"
                      name={priority}
                      checked={!!filter?.[priority]}
                      className="rounded border-(--border-color) bg-(--bg-secondary) text-indigo-500 focus:ring-indigo-500/50"
                      onChange={(event) => onFilterChange(event, priority)}
                    />
                    {priority}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

FilterPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  filter: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default FilterPanel;
