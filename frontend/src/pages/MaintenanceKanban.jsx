import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Plus,
  Search,
  Filter,
  Clock,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Calendar,
  MoreVertical,
  User,
  Edit2,
  Eye,
} from "lucide-react";
import Modal from "../components/Modal";
import { PageLoader } from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import { format, isPast, parseISO } from "date-fns";

// Kanban stages configuration
const STAGES = {
  new: {
    id: "new",
    title: "New",
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: Plus,
  },
  "in-progress": {
    id: "in-progress",
    title: "In Progress",
    color: "bg-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    icon: Wrench,
  },
  repaired: {
    id: "repaired",
    title: "Repaired",
    color: "bg-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: CheckCircle2,
  },
  scrap: {
    id: "scrap",
    title: "Scrap",
    color: "bg-slate-500",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    icon: Trash2,
  },
};

// Avatar component for technicians
const TechnicianAvatar = ({ name, size = "sm" }) => {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const colors = [
    "bg-primary-500",
    "bg-secondary-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-cyan-500",
  ];

  // Generate consistent color based on name
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;
  const bgColor = colors[colorIndex];

  const sizeClasses = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
  };

  return (
    <div
      className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center text-white font-semibold shadow-sm`}
      title={name}
    >
      {initials}
    </div>
  );
};

// Kanban Card Component
const KanbanCard = ({ request, index, onEdit, onView }) => {
  const isOverdue =
    request.due_date &&
    isPast(parseISO(request.due_date)) &&
    request.stage !== "repaired" &&
    request.stage !== "scrap";

  return (
    <Draggable draggableId={request.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            bg-white rounded-xl border p-4 mb-3 cursor-grab active:cursor-grabbing
            transition-all duration-200 group
            ${
              snapshot.isDragging
                ? "shadow-xl rotate-2 scale-105"
                : "shadow-sm hover:shadow-md"
            }
            ${isOverdue ? "border-l-4 border-l-red-500" : "border-slate-200"}
          `}
        >
          {/* Overdue indicator */}
          {isOverdue && (
            <div className="flex items-center gap-1.5 text-red-600 text-xs font-medium mb-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Overdue</span>
            </div>
          )}

          {/* Card Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900 text-sm line-clamp-2">
                {request.title}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {request.equipment_name}
              </p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onView(request);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card Body */}
          <p className="text-xs text-slate-600 line-clamp-2 mb-3">
            {request.description}
          </p>

          {/* Priority Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                request.priority === "urgent"
                  ? "bg-red-100 text-red-700"
                  : request.priority === "high"
                  ? "bg-orange-100 text-orange-700"
                  : request.priority === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {request.priority}
            </span>
            {request.maintenance_type && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                {request.maintenance_type}
              </span>
            )}
          </div>

          {/* Card Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            {/* Technician Avatar */}
            <div className="flex items-center gap-2">
              {request.assigned_to ? (
                <>
                  <TechnicianAvatar name={request.assigned_to} />
                  <span className="text-xs text-slate-600 hidden sm:block">
                    {request.assigned_to.split(" ")[0]}
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <User className="w-4 h-4" />
                  <span className="text-xs">Unassigned</span>
                </div>
              )}
            </div>

            {/* Due Date */}
            {request.due_date && (
              <div
                className={`flex items-center gap-1 text-xs ${
                  isOverdue ? "text-red-600 font-medium" : "text-slate-500"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{format(parseISO(request.due_date), "MMM d")}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

// Kanban Column Component
const KanbanColumn = ({ stage, requests, onEdit, onView, onAddNew }) => {
  const stageConfig = STAGES[stage];
  const StageIcon = stageConfig.icon;

  return (
    <div className="flex-1 min-w-[300px] max-w-[350px]">
      {/* Column Header */}
      <div
        className={`${stageConfig.bgColor} ${stageConfig.borderColor} border rounded-t-xl p-4`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`${stageConfig.color} w-8 h-8 rounded-lg flex items-center justify-center`}
            >
              <StageIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                {stageConfig.title}
              </h3>
              <p className="text-xs text-slate-500">{requests.length} items</p>
            </div>
          </div>
          {stage === "new" && (
            <button
              onClick={onAddNew}
              className="p-2 rounded-lg hover:bg-white/50 text-slate-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Column Body - Droppable Area */}
      <Droppable droppableId={stage}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              ${stageConfig.bgColor} ${stageConfig.borderColor} 
              border border-t-0 rounded-b-xl p-3 min-h-[500px] 
              transition-colors duration-200
              ${snapshot.isDraggingOver ? "bg-opacity-70" : ""}
            `}
          >
            {requests.map((request, index) => (
              <KanbanCard
                key={request.id}
                request={request}
                index={index}
                onEdit={onEdit}
                onView={onView}
              />
            ))}
            {provided.placeholder}

            {requests.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                <StageIcon className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No requests</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

const MaintenanceKanban = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingRequest, setViewingRequest] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    equipment_name: "",
    description: "",
    priority: "medium",
    maintenance_type: "",
    assigned_to: "",
    due_date: "",
    stage: "new",
  });
  const [formErrors, setFormErrors] = useState({});

  const equipmentList = [
    "CNC Machine #1",
    "CNC Machine #2",
    "HVAC Unit A",
    "HVAC Unit B",
    "Conveyor Belt #1",
    "Forklift #1",
    "Generator A",
    "Air Compressor",
  ];

  const technicians = [
    { id: 1, name: "John Smith" },
    { id: 2, name: "Sarah Johnson" },
    { id: 3, name: "Mike Brown" },
    { id: 4, name: "Emily Davis" },
    { id: 5, name: "Tom Wilson" },
  ];

  const maintenanceTypes = [
    "Preventive",
    "Corrective",
    "Inspection",
    "Emergency",
    "Calibration",
  ];

  useEffect(() => {
    // Simulated data - in real app, fetch from API
    setTimeout(() => {
      setRequests([
        {
          id: 1,
          title: "Oil leak repair",
          equipment_name: "CNC Machine #1",
          description:
            "Hydraulic system showing signs of oil leakage near the main cylinder",
          priority: "high",
          maintenance_type: "Corrective",
          assigned_to: "John Smith",
          due_date: "2024-12-26",
          stage: "new",
        },
        {
          id: 2,
          title: "Filter replacement",
          equipment_name: "HVAC Unit A",
          description:
            "Quarterly filter replacement as per maintenance schedule",
          priority: "medium",
          maintenance_type: "Preventive",
          assigned_to: "Sarah Johnson",
          due_date: "2024-12-28",
          stage: "new",
        },
        {
          id: 3,
          title: "Belt tension adjustment",
          equipment_name: "Conveyor Belt #1",
          description:
            "Belt slipping during operation, needs tension adjustment",
          priority: "urgent",
          maintenance_type: "Emergency",
          assigned_to: "Mike Brown",
          due_date: "2024-12-27",
          stage: "in-progress",
        },
        {
          id: 4,
          title: "Annual safety inspection",
          equipment_name: "Forklift #1",
          description: "Complete safety inspection and certification renewal",
          priority: "high",
          maintenance_type: "Inspection",
          assigned_to: "Emily Davis",
          due_date: "2024-12-30",
          stage: "in-progress",
        },
        {
          id: 5,
          title: "Generator overhaul",
          equipment_name: "Generator A",
          description: "Major overhaul completed - all parts replaced",
          priority: "high",
          maintenance_type: "Corrective",
          assigned_to: "Tom Wilson",
          due_date: "2024-12-25",
          stage: "repaired",
        },
        {
          id: 6,
          title: "Compressor motor failure",
          equipment_name: "Air Compressor",
          description: "Motor burnt out - beyond economical repair",
          priority: "low",
          maintenance_type: "Corrective",
          assigned_to: "John Smith",
          due_date: "2024-12-20",
          stage: "scrap",
        },
        {
          id: 7,
          title: "Coolant system flush",
          equipment_name: "CNC Machine #2",
          description: "Routine coolant flush and refill",
          priority: "low",
          maintenance_type: "Preventive",
          assigned_to: "",
          due_date: "2025-01-05",
          stage: "new",
        },
        {
          id: 8,
          title: "Thermostat replacement",
          equipment_name: "HVAC Unit B",
          description: "Faulty thermostat causing temperature fluctuations",
          priority: "medium",
          maintenance_type: "Corrective",
          assigned_to: "Sarah Johnson",
          due_date: "2024-12-24",
          stage: "in-progress",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  // Filter requests
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.equipment_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (request.assigned_to &&
        request.assigned_to.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPriority =
      !filterPriority || request.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  // Group requests by stage
  const getRequestsByStage = (stage) => {
    return filteredRequests.filter((r) => r.stage === stage);
  };

  // Handle drag end
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // If no destination or same position, do nothing
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the request that was dragged
    const requestId = parseInt(draggableId);
    const newStage = destination.droppableId;

    // Update the request's stage
    setRequests((prev) =>
      prev.map((request) =>
        request.id === requestId ? { ...request, stage: newStage } : request
      )
    );

    // Show toast notification
    const stageTitle = STAGES[newStage].title;
    toast.success(`Moved to ${stageTitle}`);
  };

  const openModal = (request = null) => {
    if (request) {
      setEditingRequest(request);
      setFormData({
        title: request.title,
        equipment_name: request.equipment_name,
        description: request.description,
        priority: request.priority,
        maintenance_type: request.maintenance_type || "",
        assigned_to: request.assigned_to || "",
        due_date: request.due_date || "",
        stage: request.stage,
      });
    } else {
      setEditingRequest(null);
      setFormData({
        title: "",
        equipment_name: "",
        description: "",
        priority: "medium",
        maintenance_type: "",
        assigned_to: "",
        due_date: "",
        stage: "new",
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
    setViewingRequest(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRequest(null);
    setViewingRequest(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }
    if (!formData.equipment_name) {
      errors.equipment_name = "Equipment is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingRequest) {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === editingRequest.id ? { ...r, ...formData } : r
        )
      );
      toast.success("Request updated successfully");
    } else {
      const newRequest = {
        id: Date.now(),
        ...formData,
      };
      setRequests((prev) => [...prev, newRequest]);
      toast.success("Request created successfully");
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this request?")) {
      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast.success("Request deleted successfully");
      closeModal();
    }
  };

  const handleView = (request) => {
    setViewingRequest(request);
  };

  // Stats
  const stats = {
    total: requests.length,
    new: requests.filter((r) => r.stage === "new").length,
    inProgress: requests.filter((r) => r.stage === "in-progress").length,
    repaired: requests.filter((r) => r.stage === "repaired").length,
    overdue: requests.filter(
      (r) =>
        r.due_date &&
        isPast(parseISO(r.due_date)) &&
        r.stage !== "repaired" &&
        r.stage !== "scrap"
    ).length,
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Maintenance Kanban
          </h1>
          <p className="text-slate-500 mt-1">
            Drag and drop requests between stages
          </p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <Plus className="w-5 h-5" />
          New Request
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="card p-4">
          <p className="text-sm text-slate-500">Total</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {stats.total}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500">New</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.new}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500">In Progress</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {stats.inProgress}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500">Repaired</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {stats.repaired}
          </p>
        </div>
        <div className="card p-4 border-red-200">
          <p className="text-sm text-red-600">Overdue</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {stats.overdue}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12"
            />
          </div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="select"
          >
            <option value="">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Object.keys(STAGES).map((stage) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              requests={getRequestsByStage(stage)}
              onEdit={openModal}
              onView={handleView}
              onAddNew={() => openModal()}
            />
          ))}
        </div>
      </DragDropContext>

      {/* View Request Modal */}
      {viewingRequest && (
        <Modal
          isOpen={!!viewingRequest}
          onClose={() => setViewingRequest(null)}
          title="Request Details"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {viewingRequest.title}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {viewingRequest.equipment_name}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  viewingRequest.priority === "urgent"
                    ? "bg-red-100 text-red-700"
                    : viewingRequest.priority === "high"
                    ? "bg-orange-100 text-orange-700"
                    : viewingRequest.priority === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {viewingRequest.priority} priority
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  STAGES[viewingRequest.stage].bgColor
                } ${STAGES[viewingRequest.stage].borderColor} border`}
              >
                {STAGES[viewingRequest.stage].title}
              </span>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-500">
                Description
              </label>
              <p className="text-slate-700 mt-1">
                {viewingRequest.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-500">
                  Assigned To
                </label>
                <div className="flex items-center gap-2 mt-1">
                  {viewingRequest.assigned_to ? (
                    <>
                      <TechnicianAvatar
                        name={viewingRequest.assigned_to}
                        size="md"
                      />
                      <span className="text-slate-700">
                        {viewingRequest.assigned_to}
                      </span>
                    </>
                  ) : (
                    <span className="text-slate-400">Unassigned</span>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">
                  Due Date
                </label>
                <p className="text-slate-700 mt-1">
                  {viewingRequest.due_date
                    ? format(parseISO(viewingRequest.due_date), "MMM d, yyyy")
                    : "No due date"}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  setViewingRequest(null);
                  openModal(viewingRequest);
                }}
                className="btn-primary flex-1"
              >
                <Edit2 className="w-4 h-4" />
                Edit Request
              </button>
              <button
                onClick={() => handleDelete(viewingRequest.id)}
                className="btn-secondary text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingRequest ? "Edit Request" : "New Maintenance Request"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className={`input ${formErrors.title ? "border-red-500" : ""}`}
              placeholder="Brief description of the issue"
            />
            {formErrors.title && (
              <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
            )}
          </div>

          <div>
            <label className="label">Equipment *</label>
            <select
              value={formData.equipment_name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  equipment_name: e.target.value,
                }))
              }
              className={`select ${
                formErrors.equipment_name ? "border-red-500" : ""
              }`}
            >
              <option value="">Select equipment</option>
              {equipmentList.map((eq) => (
                <option key={eq} value={eq}>
                  {eq}
                </option>
              ))}
            </select>
            {formErrors.equipment_name && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.equipment_name}
              </p>
            )}
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="input min-h-[80px]"
              placeholder="Detailed description of the maintenance request"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, priority: e.target.value }))
                }
                className="select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="label">Maintenance Type</label>
              <select
                value={formData.maintenance_type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    maintenance_type: e.target.value,
                  }))
                }
                className="select"
              >
                <option value="">Select type</option>
                {maintenanceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Assign To</label>
              <select
                value={formData.assigned_to}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    assigned_to: e.target.value,
                  }))
                }
                className="select"
              >
                <option value="">Unassigned</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.name}>
                    {tech.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Due Date</label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, due_date: e.target.value }))
                }
                className="input"
              />
            </div>
          </div>

          {editingRequest && (
            <div>
              <label className="label">Stage</label>
              <select
                value={formData.stage}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, stage: e.target.value }))
                }
                className="select"
              >
                {Object.entries(STAGES).map(([key, stage]) => (
                  <option key={key} value={key}>
                    {stage.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              {editingRequest ? "Update Request" : "Create Request"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MaintenanceKanban;
