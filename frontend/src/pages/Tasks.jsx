import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  ClipboardList,
  Filter,
  Calendar,
  User,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Modal from "../components/Modal";
import { PageLoader } from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";
import StatusBadge, { PriorityBadge } from "../components/StatusBadge";
import toast from "react-hot-toast";
import { tasksApi, employeesApi } from "../services/api";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    task_activity: "",
    subject_apartment: "",
    assigned_to_id: "",
    assigned_to: "",
    schedule_date: "",
    priority: "medium",
    status: "pending",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const itemsPerPage = 10;
  const [employees, setEmployees] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, employeesRes] = await Promise.all([
        tasksApi.getAll(),
        employeesApi.getAll(),
      ]);

      setEmployees(employeesRes.data || []);

      const data = tasksRes.data.map((task) => ({
        id: task._id,
        task_activity: task.title || task.name || "",
        subject_apartment: task.notes || task.location || "",
        assigned_to_id: task.assignedTo?._id || "",
        assigned_to: task.assignedTo?.name || "",
        schedule_date: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
        priority: task.priority || "medium",
        status: task.status || "pending",
        type: task.type || "other",
        description: task.description || "",
      }));
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.task_activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.subject_apartment
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      task.assigned_to.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || task.status === filterStatus;
    const matchesPriority = !filterPriority || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        task_activity: task.task_activity,
        subject_apartment: task.subject_apartment,
        assigned_to_id: task.assigned_to_id || "",
        assigned_to: task.assigned_to,
        schedule_date: task.schedule_date,
        priority: task.priority,
        status: task.status,
        description: task.description || "",
      });
    } else {
      setEditingTask(null);
      setFormData({
        task_activity: "",
        subject_apartment: "",
        assigned_to_id: "",
        assigned_to: "",
        schedule_date: "",
        priority: "medium",
        status: "pending",
        description: "",
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.task_activity.trim()) {
      errors.task_activity = "Task activity is required";
    }
    if (!formData.schedule_date) {
      errors.schedule_date = "Schedule date is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingTask) {
        await tasksApi.update(editingTask.id, {
          title: formData.task_activity,
          notes: formData.subject_apartment,
          assignedTo: formData.assigned_to_id || undefined,
          dueDate: formData.schedule_date,
          priority: formData.priority,
          status: formData.status,
          description: formData.description,
        });
        toast.success("Task updated successfully");
      } else {
        await tasksApi.create({
          title: formData.task_activity,
          notes: formData.subject_apartment,
          assignedTo: formData.assigned_to_id || undefined,
          dueDate: formData.schedule_date,
          priority: formData.priority,
          status: formData.status,
          description: formData.description,
        });
        toast.success("Task created successfully");
      }
      closeModal();
      fetchData();
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Failed to save task");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await tasksApi.delete(id);
        toast.success("Task deleted successfully");
        fetchData();
      } catch (error) {
        console.error("Error deleting task:", error);
        toast.error("Failed to delete task");
      }
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    toast.success("Task status updated");
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const inProgress = tasks.filter((t) => t.status === "in-progress").length;
    const pending = tasks.filter((t) => t.status === "pending").length;
    return { total, completed, inProgress, pending };
  };

  const stats = getTaskStats();

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="text-slate-500 mt-1">
            Manage and track all maintenance tasks
          </p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-xs text-slate-500">Total Tasks</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-warning-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
            <p className="text-xs text-slate-500">Pending</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
            <User className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {stats.inProgress}
            </p>
            <p className="text-xs text-slate-500">In Progress</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-success-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {stats.completed}
            </p>
            <p className="text-xs text-slate-500">Completed</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="select"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="select"
            >
              <option value="">All Priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No tasks found"
          description={
            searchQuery || filterStatus || filterPriority
              ? "Try adjusting your search or filter criteria"
              : "Get started by creating your first task"
          }
          action={() => openModal()}
          actionLabel="Add Task"
        />
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Location</th>
                  <th>Assigned To</th>
                  <th>Schedule Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <div>
                        <p className="font-medium text-slate-900">
                          {task.task_activity}
                        </p>
                        <p className="text-xs text-slate-500">{task.type}</p>
                      </div>
                    </td>
                    <td className="text-slate-600">{task.subject_apartment}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                          {task.assigned_to
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "NA"}
                        </div>
                        <span>{task.assigned_to || "Unassigned"}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {task.schedule_date}
                      </div>
                    </td>
                    <td>
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td>
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task.id, e.target.value)
                        }
                        className="text-xs font-medium px-2 py-1 rounded-full border-0 bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openModal(task)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="p-2 rounded-lg hover:bg-danger-50 text-slate-400 hover:text-danger-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredTasks.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTask ? "Edit Task" : "Create Task"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Task Activity *</label>
            <input
              type="text"
              value={formData.task_activity}
              onChange={(e) =>
                setFormData({ ...formData, task_activity: e.target.value })
              }
              className={`input ${
                formErrors.task_activity ? "input-error" : ""
              }`}
              placeholder="Enter task description"
            />
            {formErrors.task_activity && (
              <p className="mt-1.5 text-sm text-danger-600">
                {formErrors.task_activity}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Location</label>
              <input
                type="text"
                value={formData.subject_apartment}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subject_apartment: e.target.value,
                  })
                }
                className="input"
                placeholder="Enter location"
              />
            </div>

            <div>
              <label className="label">Assigned To</label>
              <select
                value={formData.assigned_to_id || ""}
                onChange={(e) => {
                  const selectedEmp = employees.find(
                    (emp) => emp._id === e.target.value
                  );
                  setFormData({
                    ...formData,
                    assigned_to_id: e.target.value,
                    assigned_to: selectedEmp?.name || "",
                  });
                }}
                className="select"
              >
                <option value="">Select employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="label">Schedule Date *</label>
              <input
                type="date"
                value={formData.schedule_date}
                onChange={(e) =>
                  setFormData({ ...formData, schedule_date: e.target.value })
                }
                className={`input ${
                  formErrors.schedule_date ? "input-error" : ""
                }`}
              />
              {formErrors.schedule_date && (
                <p className="mt-1.5 text-sm text-danger-600">
                  {formErrors.schedule_date}
                </p>
              )}
            </div>

            <div>
              <label className="label">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="label">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="select"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="input min-h-[80px]"
              placeholder="Additional details..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={closeModal} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingTask ? "Update" : "Create"} Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;
