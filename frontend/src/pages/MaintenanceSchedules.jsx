import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  List,
  Grid,
} from "lucide-react";
import Modal from "../components/Modal";
import { PageLoader } from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import toast from "react-hot-toast";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";

const MaintenanceSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [viewMode, setViewMode] = useState("calendar"); // 'calendar' or 'list'
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    equipment_name: "",
    task_description: "",
    scheduled_date: "",
    scheduled_time: "",
    duration_hours: "",
    assigned_to: "",
    status: "scheduled",
    notes: "",
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

  const employees = [
    { id: 1, name: "John Smith" },
    { id: 2, name: "Sarah Johnson" },
    { id: 3, name: "Mike Brown" },
    { id: 4, name: "Emily Davis" },
    { id: 5, name: "Tom Wilson" },
  ];

  useEffect(() => {
    setTimeout(() => {
      setSchedules([
        {
          id: 1,
          equipment_name: "CNC Machine #1",
          task_description: "Preventive maintenance",
          scheduled_date: "2024-12-28",
          scheduled_time: "09:00",
          duration_hours: 4,
          assigned_to: "John Smith",
          status: "scheduled",
          notes: "",
        },
        {
          id: 2,
          equipment_name: "HVAC Unit A",
          task_description: "Filter replacement",
          scheduled_date: "2024-12-28",
          scheduled_time: "14:00",
          duration_hours: 2,
          assigned_to: "Mike Brown",
          status: "scheduled",
          notes: "",
        },
        {
          id: 3,
          equipment_name: "Conveyor Belt #1",
          task_description: "Belt tension check",
          scheduled_date: "2024-12-30",
          scheduled_time: "10:00",
          duration_hours: 1,
          assigned_to: "Sarah Johnson",
          status: "scheduled",
          notes: "",
        },
        {
          id: 4,
          equipment_name: "Generator A",
          task_description: "Annual inspection",
          scheduled_date: "2024-12-31",
          scheduled_time: "08:00",
          duration_hours: 6,
          assigned_to: "Tom Wilson",
          status: "scheduled",
          notes: "",
        },
        {
          id: 5,
          equipment_name: "Forklift #1",
          task_description: "Safety inspection",
          scheduled_date: "2025-01-02",
          scheduled_time: "09:00",
          duration_hours: 2,
          assigned_to: "Emily Davis",
          status: "scheduled",
          notes: "",
        },
        {
          id: 6,
          equipment_name: "Air Compressor",
          task_description: "Oil change",
          scheduled_date: "2025-01-05",
          scheduled_time: "11:00",
          duration_hours: 3,
          assigned_to: "John Smith",
          status: "scheduled",
          notes: "",
        },
        {
          id: 7,
          equipment_name: "CNC Machine #2",
          task_description: "Calibration",
          scheduled_date: "2024-12-26",
          scheduled_time: "10:00",
          duration_hours: 4,
          assigned_to: "Mike Brown",
          status: "completed",
          notes: "",
        },
        {
          id: 8,
          equipment_name: "HVAC Unit B",
          task_description: "Coolant level check",
          scheduled_date: "2024-12-25",
          scheduled_time: "14:00",
          duration_hours: 1,
          assigned_to: "Sarah Johnson",
          status: "completed",
          notes: "",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearch =
      schedule.equipment_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      schedule.task_description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      schedule.assigned_to.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || schedule.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calendar helpers
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const getSchedulesForDate = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return schedules.filter((s) => s.scheduled_date === dateStr);
  };

  const openModal = (schedule = null, date = null) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        equipment_name: schedule.equipment_name,
        task_description: schedule.task_description,
        scheduled_date: schedule.scheduled_date,
        scheduled_time: schedule.scheduled_time,
        duration_hours: schedule.duration_hours?.toString() || "",
        assigned_to: schedule.assigned_to,
        status: schedule.status,
        notes: schedule.notes || "",
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        equipment_name: "",
        task_description: "",
        scheduled_date: date ? format(date, "yyyy-MM-dd") : "",
        scheduled_time: "",
        duration_hours: "",
        assigned_to: "",
        status: "scheduled",
        notes: "",
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSchedule(null);
    setSelectedDate(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.equipment_name) {
      errors.equipment_name = "Equipment is required";
    }
    if (!formData.task_description.trim()) {
      errors.task_description = "Task description is required";
    }
    if (!formData.scheduled_date) {
      errors.scheduled_date = "Date is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const scheduleData = {
      ...formData,
      duration_hours: parseFloat(formData.duration_hours) || 0,
    };

    if (editingSchedule) {
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === editingSchedule.id ? { ...s, ...scheduleData } : s
        )
      );
      toast.success("Schedule updated successfully");
    } else {
      const newSchedule = {
        id: Date.now(),
        ...scheduleData,
      };
      setSchedules((prev) => [newSchedule, ...prev]);
      toast.success("Schedule created successfully");
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this schedule?")) {
      setSchedules((prev) => prev.filter((s) => s.id !== id));
      toast.success("Schedule deleted successfully");
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    openModal(null, date);
  };

  const getScheduleStats = () => {
    const today = new Date();
    const todayStr = format(today, "yyyy-MM-dd");

    return {
      total: schedules.length,
      today: schedules.filter((s) => s.scheduled_date === todayStr).length,
      upcoming: schedules.filter(
        (s) => s.scheduled_date > todayStr && s.status === "scheduled"
      ).length,
      completed: schedules.filter((s) => s.status === "completed").length,
    };
  };

  const stats = getScheduleStats();

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Maintenance Schedules
          </h1>
          <p className="text-slate-500 mt-1">
            Plan and track scheduled maintenance activities
          </p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <Plus className="w-5 h-5" />
          Schedule Maintenance
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm text-slate-500">Total Scheduled</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {stats.total}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500">Today</p>
          <p className="text-2xl font-bold text-primary-600 mt-1">
            {stats.today}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500">Upcoming</p>
          <p className="text-2xl font-bold text-warning-600 mt-1">
            {stats.upcoming}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500">Completed</p>
          <p className="text-2xl font-bold text-success-600 mt-1">
            {stats.completed}
          </p>
        </div>
      </div>

      {/* View Toggle & Filters */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search schedules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="select"
            >
              <option value="">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("calendar")}
                className={`p-2.5 ${
                  viewMode === "calendar"
                    ? "bg-primary-50 text-primary-600"
                    : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                <Calendar className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 ${
                  viewMode === "list"
                    ? "bg-primary-50 text-primary-600"
                    : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === "calendar" ? (
        <div className="card">
          {/* Calendar Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-slate-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const daySchedules = getSchedulesForDate(day);
                const isToday = isSameDay(day, new Date());
                const isCurrentMonth = isSameMonth(day, currentMonth);

                return (
                  <div
                    key={index}
                    onClick={() => handleDateClick(day)}
                    className={`
                      min-h-[100px] p-2 rounded-lg border cursor-pointer transition-colors
                      ${isCurrentMonth ? "bg-white" : "bg-slate-50"}
                      ${
                        isToday
                          ? "border-primary-500 bg-primary-50/30"
                          : "border-slate-100"
                      }
                      hover:border-primary-300 hover:bg-slate-50
                    `}
                  >
                    <div
                      className={`text-sm font-medium mb-1 ${
                        isToday
                          ? "text-primary-600"
                          : isCurrentMonth
                          ? "text-slate-900"
                          : "text-slate-400"
                      }`}
                    >
                      {format(day, "d")}
                    </div>
                    <div className="space-y-1">
                      {daySchedules.slice(0, 2).map((schedule) => (
                        <div
                          key={schedule.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(schedule);
                          }}
                          className={`text-xs p-1.5 rounded truncate cursor-pointer ${
                            schedule.status === "completed"
                              ? "bg-success-100 text-success-700"
                              : "bg-primary-100 text-primary-700"
                          }`}
                        >
                          {schedule.equipment_name}
                        </div>
                      ))}
                      {daySchedules.length > 2 && (
                        <div className="text-xs text-slate-500 pl-1">
                          +{daySchedules.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : /* List View */
      filteredSchedules.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No schedules found"
          description={
            searchQuery || filterStatus
              ? "Try adjusting your search or filter criteria"
              : "Get started by scheduling your first maintenance"
          }
          action={() => openModal()}
          actionLabel="Schedule Maintenance"
        />
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Task</th>
                  <th>Date & Time</th>
                  <th>Duration</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td className="font-medium text-slate-900">
                      {schedule.equipment_name}
                    </td>
                    <td className="text-slate-600">
                      {schedule.task_description}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-sm">{schedule.scheduled_date}</p>
                          <p className="text-xs text-slate-400">
                            {schedule.scheduled_time}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{schedule.duration_hours || "-"} hrs</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                          {schedule.assigned_to
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "NA"}
                        </div>
                        <span>{schedule.assigned_to || "Unassigned"}</span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={schedule.status} />
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openModal(schedule)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(schedule.id)}
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
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingSchedule ? "Edit Schedule" : "Schedule Maintenance"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Equipment *</label>
              <select
                value={formData.equipment_name}
                onChange={(e) =>
                  setFormData({ ...formData, equipment_name: e.target.value })
                }
                className={`select ${
                  formErrors.equipment_name ? "input-error" : ""
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
                <p className="mt-1.5 text-sm text-danger-600">
                  {formErrors.equipment_name}
                </p>
              )}
            </div>

            <div>
              <label className="label">Assigned To</label>
              <select
                value={formData.assigned_to}
                onChange={(e) =>
                  setFormData({ ...formData, assigned_to: e.target.value })
                }
                className="select"
              >
                <option value="">Select assignee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.name}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Task Description *</label>
            <input
              type="text"
              value={formData.task_description}
              onChange={(e) =>
                setFormData({ ...formData, task_description: e.target.value })
              }
              className={`input ${
                formErrors.task_description ? "input-error" : ""
              }`}
              placeholder="Enter task description"
            />
            {formErrors.task_description && (
              <p className="mt-1.5 text-sm text-danger-600">
                {formErrors.task_description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="label">Date *</label>
              <input
                type="date"
                value={formData.scheduled_date}
                onChange={(e) =>
                  setFormData({ ...formData, scheduled_date: e.target.value })
                }
                className={`input ${
                  formErrors.scheduled_date ? "input-error" : ""
                }`}
              />
              {formErrors.scheduled_date && (
                <p className="mt-1.5 text-sm text-danger-600">
                  {formErrors.scheduled_date}
                </p>
              )}
            </div>

            <div>
              <label className="label">Time</label>
              <input
                type="time"
                value={formData.scheduled_time}
                onChange={(e) =>
                  setFormData({ ...formData, scheduled_time: e.target.value })
                }
                className="input"
              />
            </div>

            <div>
              <label className="label">Duration (hours)</label>
              <input
                type="number"
                step="0.5"
                value={formData.duration_hours}
                onChange={(e) =>
                  setFormData({ ...formData, duration_hours: e.target.value })
                }
                className="input"
                placeholder="0"
              />
            </div>
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
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="input min-h-[80px]"
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={closeModal} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingSchedule ? "Update" : "Create"} Schedule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MaintenanceSchedules;
