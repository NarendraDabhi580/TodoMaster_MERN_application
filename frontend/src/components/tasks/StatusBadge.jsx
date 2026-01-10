import PropTypes from "prop-types";

const StatusBadge = ({ status }) => {
  const styles = {
    "In Progress": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Completed: "bg-green-500/10 text-green-400 border-green-500/20",
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        styles[status] || "bg-neutral-800 text-neutral-400 border-neutral-700"
      }`}
    >
      {status}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

export default StatusBadge;
