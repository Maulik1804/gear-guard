import { AlertCircle, CheckCircle2 } from "lucide-react";

const EmptyState = ({
  icon: Icon = AlertCircle,
  title,
  description,
  action,
  actionLabel,
  variant = "default",
}) => {
  const variants = {
    default: "bg-slate-100 text-slate-400",
    success: "bg-success-100 text-success-500",
    warning: "bg-warning-100 text-warning-500",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${variants[variant]}`}
      >
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-center max-w-md mb-6">{description}</p>
      {action && (
        <button onClick={action} className="btn-primary">
          {actionLabel || "Take Action"}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
