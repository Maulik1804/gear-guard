const StatusBadge = ({ status, size = "md" }) => {
  const statusConfig = {
    // General statuses
    active: { label: "Active", className: "badge-success" },
    inactive: { label: "Inactive", className: "badge-neutral" },
    pending: { label: "Pending", className: "badge-warning" },
    completed: { label: "Completed", className: "badge-success" },
    cancelled: { label: "Cancelled", className: "badge-danger" },

    // Work Order statuses
    draft: { label: "Draft", className: "badge-neutral" },
    open: { label: "Open", className: "badge-info" },
    "in-progress": { label: "In Progress", className: "badge-warning" },
    in_progress: { label: "In Progress", className: "badge-warning" },
    closed: { label: "Closed", className: "badge-success" },

    // Maintenance statuses
    scheduled: { label: "Scheduled", className: "badge-info" },
    overdue: { label: "Overdue", className: "badge-danger" },

    // Equipment statuses
    operational: { label: "Operational", className: "badge-success" },
    maintenance: { label: "Under Maintenance", className: "badge-warning" },
    "out-of-service": { label: "Out of Service", className: "badge-danger" },
    out_of_service: { label: "Out of Service", className: "badge-danger" },
  };

  const config = statusConfig[status?.toLowerCase()] || {
    label: status || "Unknown",
    className: "badge-neutral",
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
  };

  return (
    <span className={`badge ${config.className} ${sizeClasses[size]}`}>
      {config.label}
    </span>
  );
};

export const PriorityBadge = ({ priority, size = "md" }) => {
  const priorityConfig = {
    high: { label: "High", className: "badge-danger" },
    medium: { label: "Medium", className: "badge-warning" },
    low: { label: "Low", className: "badge-success" },
    critical: { label: "Critical", className: "bg-purple-100 text-purple-700" },
  };

  const config = priorityConfig[priority?.toLowerCase()] || {
    label: priority || "Unknown",
    className: "badge-neutral",
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
  };

  return (
    <span className={`badge ${config.className} ${sizeClasses[size]}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
