import { Search, Filter, Plus, CheckSquare } from "lucide-react";
import PropTypes from "prop-types";

const TasksHeader = ({
  searchQuery,
  onSearchChange,
  isFilterOpen,
  onFilterToggle,
  onNewTaskClick,
}) => {
  return (
    <div className="relative z-10 flex flex-col gap-6 px-8 py-8 md:flex-row md:items-center md:justify-between border-b border-(--border-color) bg-(--bg-secondary)/80 backdrop-blur-xl transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30">
          <CheckSquare className="h-6 w-6 text-indigo-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-(--text-primary)">
            Tasks
          </h1>
          <p className="text-sm text-(--text-secondary)">
            Manage your daily tasks and workflow
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search title, description or tags..."
            className="pl-9 pr-4 py-2 bg-(--bg-secondary) border border-(--border-color) rounded-lg text-sm text-(--text-primary) placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-full md:w-64 transition-colors"
            onChange={onSearchChange}
            value={searchQuery}
          />
        </div>
        <button
          onClick={onFilterToggle}
          className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
            isFilterOpen
              ? "bg-indigo-600 border-indigo-500 text-white"
              : "bg-(--bg-secondary) border-(--border-color) text-(--text-primary) hover:bg-(--bg-primary)"
          }`}
        >
          <Filter className="h-4 w-4" />
          Filter
        </button>
        <button
          onClick={onNewTaskClick}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium text-white transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Plus className="h-4 w-4" />
          New Task
        </button>
      </div>
    </div>
  );
};

TasksHeader.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  isFilterOpen: PropTypes.bool.isRequired,
  onFilterToggle: PropTypes.func.isRequired,
  onNewTaskClick: PropTypes.func.isRequired,
};

export default TasksHeader;
