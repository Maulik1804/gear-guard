import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  FileText,
  Filter,
  DollarSign,
  Calendar,
  Cog,
} from "lucide-react";
import Modal from "../components/Modal";
import { PageLoader } from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";
import toast from "react-hot-toast";
import { workOrdersApi, equipmentApi, workCentersApi } from "../services/api";

const WorkOrders = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    work_order_number: "",
    equipment_id: "",
    equipment_name: "",
    work_center_id: "",
    work_center: "",
    cost: "",
    cost_per_hour: "",
    capacity_task_estimate: "",
    goal_target: "",
    from_date: "",
    to_date: "",
    status: "draft",
    tag: "",
    alternative_information: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const itemsPerPage = 10;
  const [equipmentList, setEquipmentList] = useState([]);
  const [workCentersList, setWorkCentersList] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [workOrdersRes, equipmentRes, workCentersRes] = await Promise.all([
        workOrdersApi.getAll(),
        equipmentApi.getAll(),
        workCentersApi.getAll(),
      ]);

      setEquipmentList(equipmentRes.data || []);
      setWorkCentersList(workCentersRes.data || []);

      const data = workOrdersRes.data.map((wo) => ({
        id: wo._id,
        work_order_number:
          wo.orderNumber || wo.workOrderNumber || wo.work_order_number || "",
        equipment_id: wo.equipment?._id || "",
        equipment_name: wo.equipment?.name || wo.equipment_name || "",
        work_center_id: wo.workCenter?._id || "",
        work_center: wo.workCenter?.name || wo.work_center || "",
        cost: wo.cost || 0,
        cost_per_hour: wo.costPerHour || wo.cost_per_hour || 0,
        capacity_task_estimate:
          wo.estimatedHours || wo.capacity_task_estimate || 0,
        from_date: wo.scheduledDate
          ? new Date(wo.scheduledDate).toISOString().split("T")[0]
          : "",
        to_date: wo.dueDate
          ? new Date(wo.dueDate).toISOString().split("T")[0]
          : "",
        status: wo.status || "draft",
        tag: wo.type || wo.tag || "",
        alternative_information: wo.description || wo.notes || "",
      }));
      setWorkOrders(data);
    } catch (error) {
      console.error("Error fetching work orders:", error);
      toast.error("Failed to load work orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredOrders = workOrders.filter((order) => {
    const matchesSearch =
      order.work_order_number
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.equipment_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.work_center.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const generateOrderNumber = () => {
    const year = new Date().getFullYear();
    const count = workOrders.length + 1;
    return `WO-${year}-${String(count).padStart(3, "0")}`;
  };

  const openModal = (order = null) => {
    if (order) {
      setEditingOrder(order);
      setFormData({
        work_order_number: order.work_order_number,
        equipment_id: order.equipment_id || "",
        equipment_name: order.equipment_name,
        work_center_id: order.work_center_id || "",
        work_center: order.work_center,
        cost: order.cost?.toString() || "",
        cost_per_hour: order.cost_per_hour?.toString() || "",
        capacity_task_estimate: order.capacity_task_estimate?.toString() || "",
        goal_target: order.goal_target || "",
        from_date: order.from_date,
        to_date: order.to_date,
        status: order.status,
        tag: order.tag || "",
        alternative_information: order.alternative_information || "",
      });
    } else {
      setEditingOrder(null);
      setFormData({
        work_order_number: generateOrderNumber(),
        equipment_id: "",
        equipment_name: "",
        work_center_id: "",
        work_center: "",
        cost: "",
        cost_per_hour: "",
        capacity_task_estimate: "",
        goal_target: "",
        from_date: "",
        to_date: "",
        status: "draft",
        tag: "",
        alternative_information: "",
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.work_order_number.trim()) {
      errors.work_order_number = "Work order number is required";
    }
    if (!formData.equipment_id) {
      errors.equipment_name = "Equipment is required";
    }
    if (!formData.from_date) {
      errors.from_date = "Start date is required";
    }
    // Validate end date is not before start date
    if (formData.from_date && formData.to_date) {
      const startDate = new Date(formData.from_date);
      const endDate = new Date(formData.to_date);
      if (endDate < startDate) {
        errors.to_date = "End date cannot be before start date";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Map frontend status to backend status
    const statusMap = {
      draft: "pending",
      pending: "pending",
      "in-progress": "in-progress",
      completed: "completed",
      cancelled: "cancelled",
      "on-hold": "on-hold",
    };

    const orderData = {
      orderNumber: formData.work_order_number,
      title: formData.work_order_number, // Use work order number as title
      equipment: formData.equipment_id || undefined,
      workCenter: formData.work_center_id || undefined,
      cost: parseFloat(formData.cost) || 0,
      estimatedHours: parseFloat(formData.capacity_task_estimate) || 0,
      scheduledDate: formData.from_date
        ? new Date(formData.from_date).toISOString()
        : undefined,
      dueDate: formData.to_date
        ? new Date(formData.to_date).toISOString()
        : undefined,
      status: statusMap[formData.status] || "pending",
      type: formData.tag?.toLowerCase() || "corrective",
      description: formData.alternative_information,
    };

    try {
      if (editingOrder) {
        await workOrdersApi.update(editingOrder.id, orderData);
        toast.success("Work order updated successfully");
      } else {
        await workOrdersApi.create(orderData);
        toast.success("Work order created successfully");
      }
      closeModal();
      fetchData();
    } catch (error) {
      console.error("Error saving work order:", error);
      toast.error("Failed to save work order");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this work order?")) {
      try {
        await workOrdersApi.delete(id);
        toast.success("Work order deleted successfully");
        fetchData();
      } catch (error) {
        console.error("Error deleting work order:", error);
        toast.error("Failed to delete work order");
      }
    }
  };

  const getTotalCost = () => {
    return workOrders.reduce((sum, o) => sum + (o.cost || 0), 0);
  };

  const getStatusCounts = () => {
    return {
      draft: workOrders.filter((o) => o.status === "draft").length,
      pending: workOrders.filter((o) => o.status === "pending").length,
      inProgress: workOrders.filter((o) => o.status === "in-progress").length,
      completed: workOrders.filter((o) => o.status === "completed").length,
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Work Orders</h1>
          <p className="text-slate-500 mt-1">
            Manage work orders for equipment maintenance
          </p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <Plus className="w-5 h-5" />
          Create Work Order
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card p-4">
          <p className="text-sm text-slate-500">Total Orders</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {workOrders.length}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500">Draft</p>
          <p className="text-2xl font-bold text-slate-600 mt-1">
            {statusCounts.draft}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500">In Progress</p>
          <p className="text-2xl font-bold text-warning-600 mt-1">
            {statusCounts.inProgress}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500">Completed</p>
          <p className="text-2xl font-bold text-success-600 mt-1">
            {statusCounts.completed}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500">Total Cost</p>
          <p className="text-2xl font-bold text-primary-600 mt-1">
            ${getTotalCost().toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search work orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Work Orders Table */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No work orders found"
          description={
            searchQuery || filterStatus
              ? "Try adjusting your search or filter criteria"
              : "Get started by creating your first work order"
          }
          action={() => openModal()}
          actionLabel="Create Work Order"
        />
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Work Order</th>
                  <th>Equipment</th>
                  <th>Work Center</th>
                  <th>Date Range</th>
                  <th>Est. Hours</th>
                  <th>Cost</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div>
                        <p className="font-medium text-primary-600">
                          {order.work_order_number || "-"}
                        </p>
                        {order.tag && (
                          <span className="text-xs text-slate-500 capitalize">
                            {order.tag}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Cog className="w-4 h-4 text-slate-400" />
                        <span>{order.equipment_name || "-"}</span>
                      </div>
                    </td>
                    <td className="text-slate-600">
                      {order.work_center || "-"}
                    </td>
                    <td>
                      <div className="text-sm">
                        {order.from_date ? (
                          <>
                            <p>
                              {new Date(order.from_date).toLocaleDateString()}
                            </p>
                            {order.to_date && (
                              <p className="text-slate-400">
                                to{" "}
                                {new Date(order.to_date).toLocaleDateString()}
                              </p>
                            )}
                          </>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="font-medium">
                        {order.capacity_task_estimate || "-"}
                      </span>
                      <span className="text-slate-400 text-sm ml-1">hrs</span>
                    </td>
                    <td>
                      <span className="font-medium text-slate-900">
                        ${order.cost?.toLocaleString() || "0"}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openModal(order)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
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
            totalItems={filteredOrders.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingOrder ? "Edit Work Order" : "Create Work Order"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Work Order Number *</label>
              <input
                type="text"
                value={formData.work_order_number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    work_order_number: e.target.value,
                  })
                }
                className={`input ${
                  formErrors.work_order_number ? "input-error" : ""
                }`}
                placeholder="WO-2024-XXX"
              />
              {formErrors.work_order_number && (
                <p className="mt-1.5 text-sm text-danger-600">
                  {formErrors.work_order_number}
                </p>
              )}
            </div>

            <div>
              <label className="label">Tag</label>
              <select
                value={formData.tag}
                onChange={(e) =>
                  setFormData({ ...formData, tag: e.target.value })
                }
                className="select"
              >
                <option value="">Select tag</option>
                <option value="Preventive">Preventive</option>
                <option value="Corrective">Corrective</option>
                <option value="Inspection">Inspection</option>
                <option value="Safety">Safety</option>
                <option value="Overhaul">Overhaul</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Equipment *</label>
              <select
                value={formData.equipment_id || ""}
                onChange={(e) => {
                  const selectedEquipment = equipmentList.find(
                    (eq) => eq._id === e.target.value
                  );
                  setFormData({
                    ...formData,
                    equipment_id: e.target.value,
                    equipment_name: selectedEquipment?.name || "",
                  });
                }}
                className={`select ${
                  formErrors.equipment_name ? "input-error" : ""
                }`}
              >
                <option value="">Select equipment</option>
                {equipmentList.map((eq) => (
                  <option key={eq._id} value={eq._id}>
                    {eq.name}
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
              <label className="label">Work Center</label>
              <select
                value={formData.work_center_id || ""}
                onChange={(e) => {
                  const selectedWC = workCentersList.find(
                    (wc) => wc._id === e.target.value
                  );
                  setFormData({
                    ...formData,
                    work_center_id: e.target.value,
                    work_center: selectedWC?.name || "",
                  });
                }}
                className="select"
              >
                <option value="">Select work center</option>
                {workCentersList.map((wc) => (
                  <option key={wc._id} value={wc._id}>
                    {wc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Start Date *</label>
              <input
                type="date"
                value={formData.from_date}
                onChange={(e) => {
                  const newFromDate = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    from_date: newFromDate,
                    // Clear end date if it's now before the new start date
                    to_date:
                      prev.to_date &&
                      new Date(prev.to_date) < new Date(newFromDate)
                        ? ""
                        : prev.to_date,
                  }));
                }}
                className={`input ${formErrors.from_date ? "input-error" : ""}`}
              />
              {formErrors.from_date && (
                <p className="mt-1.5 text-sm text-danger-600">
                  {formErrors.from_date}
                </p>
              )}
            </div>

            <div>
              <label className="label">End Date</label>
              <input
                type="date"
                value={formData.to_date}
                min={formData.from_date || undefined}
                onChange={(e) =>
                  setFormData({ ...formData, to_date: e.target.value })
                }
                className={`input ${formErrors.to_date ? "input-error" : ""}`}
              />
              {formErrors.to_date && (
                <p className="mt-1.5 text-sm text-danger-600">
                  {formErrors.to_date}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="label">Estimated Cost ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) =>
                  setFormData({ ...formData, cost: e.target.value })
                }
                className="input"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="label">Cost per Hour ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.cost_per_hour}
                onChange={(e) =>
                  setFormData({ ...formData, cost_per_hour: e.target.value })
                }
                className="input"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="label">Estimated Hours</label>
              <input
                type="number"
                step="0.5"
                value={formData.capacity_task_estimate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacity_task_estimate: e.target.value,
                  })
                }
                className="input"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Goal/Target</label>
              <input
                type="text"
                value={formData.goal_target}
                onChange={(e) =>
                  setFormData({ ...formData, goal_target: e.target.value })
                }
                className="input"
                placeholder="Enter goal or target"
              />
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
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Additional Information</label>
            <textarea
              value={formData.alternative_information}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  alternative_information: e.target.value,
                })
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
              {editingOrder ? "Update" : "Create"} Work Order
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default WorkOrders;
