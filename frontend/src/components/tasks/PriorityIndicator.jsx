import PropTypes from "prop-types";

const PriorityIndicator = ({ priority }) => {
  const colors = {
    High: "bg-red-500",
    Medium: "bg-orange-500",
    Low: "bg-green-500",
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-2 w-2 rounded-full ${colors[priority]}`} />
      <span className="text-xs text-neutral-400">{priority} Priority</span>
    </div>
  );
};

PriorityIndicator.propTypes = {
  priority: PropTypes.string.isRequired,
};

export default PriorityIndicator;
