import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  Cog,
  Filter,
  Eye,
  Grid,
  List,
  Settings,
} from "lucide-react";
import Modal from "../components/Modal";
import { PageLoader } from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";
import toast from "react-hot-toast";
import { equipmentApi, locationsApi } from "../services/api";

const Equipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [formData, setFormData] = useState({
    equipment_name: "",
    type_model: "",
    equipment_category_id: "",
    status: "operational",
    description: "",
  });
  const [categoryFormData, setCategoryFormData] = useState({ name: "" });
  const [formErrors, setFormErrors] = useState({});

  const itemsPerPage = 12;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [equipmentRes, categoriesRes] = await Promise.all([
        equipmentApi.getAll(),
        equipmentApi.getCategories(),
      ]);

      const equipmentData = equipmentRes.data.map((eq) => ({
        id: eq._id,
        equipment_name: eq.name || eq.equipment_name || "",
        type_model: eq.model || eq.type_model || "",
        category: eq.category || "",
        status: eq.status || "operational",
        location: eq.location?.name || "Unassigned",
        last_maintenance: eq.lastMaintenanceDate
          ? new Date(eq.lastMaintenanceDate).toISOString().split("T")[0]
          : "Never",
        description: eq.description || "",
      }));

      setEquipment(equipmentData);

      const categoryData = categoriesRes.data.map((cat, index) =>
        typeof cat === "string" ? { id: index + 1, name: cat } : cat
      );
      setCategories(
        categoryData.length > 0
          ? categoryData
          : [
              { id: 1, name: "CNC Machines" },
              { id: 2, name: "HVAC Systems" },
              { id: 3, name: "Conveyors" },
              { id: 4, name: "Forklifts" },
              { id: 5, name: "Generators" },
              { id: 6, name: "Pumps" },
              { id: 7, name: "Compressors" },
            ]
      );
    } catch (error) {
      console.error("Error fetching equipment:", error);
      toast.error("Failed to load equipment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredEquipment = equipment.filter((eq) => {
    const matchesSearch =
      eq.equipment_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.type_model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || eq.category === filterCategory;
    const matchesStatus = !filterStatus || eq.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage);
  const paginatedEquipment = filteredEquipment.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModal = (eq = null) => {
    if (eq) {
      setEditingEquipment(eq);
      setFormData({
        equipment_name: eq.equipment_name,
        type_model: eq.type_model,
        equipment_category_id:
          categories.find((c) => c.name === eq.category)?.id || "",
        status: eq.status,
        description: eq.description || "",
      });
    } else {
      setEditingEquipment(null);
      setFormData({
        equipment_name: "",
        type_model: "",
        equipment_category_id: "",
        status: "operational",
        description: "",
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEquipment(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.equipment_name.trim()) {
      errors.equipment_name = "Equipment name is required";
    }
    if (!formData.equipment_category_id) {
      errors.equipment_category_id = "Category is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const category = categories.find(
      (c) => c.id === parseInt(formData.equipment_category_id)
    );

    try {
      if (editingEquipment) {
        await equipmentApi.update(editingEquipment.id, {
          name: formData.equipment_name,
          model: formData.type_model,
          category: category?.name || "",
          status: formData.status,
          description: formData.description,
        });
        toast.success("Equipment updated successfully");
      } else {
        await equipmentApi.create({
          name: formData.equipment_name,
          model: formData.type_model,
          category: category?.name || "",
          status: formData.status,
          description: formData.description,
        });
        toast.success("Equipment added successfully");
      }
      closeModal();
      fetchData();
    } catch (error) {
      console.error("Error saving equipment:", error);
      toast.error("Failed to save equipment");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this equipment?")) {
      try {
        await equipmentApi.delete(id);
        toast.success("Equipment deleted successfully");
        fetchData();
      } catch (error) {
        console.error("Error deleting equipment:", error);
        toast.error("Failed to delete equipment");
      }
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!categoryFormData.name.trim()) return;

    const newCategory = {
      id: Date.now(),
      name: categoryFormData.name,
    };
    setCategories((prev) => [...prev, newCategory]);
    setCategoryFormData({ name: "" });
    setIsCategoryModalOpen(false);
    toast.success("Category added successfully");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-success-500";
      case "maintenance":
        return "bg-warning-500";
      case "out-of-service":
        return "bg-danger-500";
      default:
        return "bg-slate-500";
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Equipment</h1>
          <p className="text-slate-500 mt-1">
            Manage and track all your equipment and assets
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="btn-outline"
          >
            <Settings className="w-4 h-4" />
            Categories
          </button>
          <button onClick={() => openModal()} className="btn-primary">
            <Plus className="w-5 h-5" />
            Add Equipment
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="select"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="select"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="out-of-service">Out of Service</option>
            </select>
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2.5 ${
                  viewMode === "table"
                    ? "bg-primary-50 text-primary-600"
                    : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 ${
                  viewMode === "grid"
                    ? "bg-primary-50 text-primary-600"
                    : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Display */}
      {filteredEquipment.length === 0 ? (
        <EmptyState
          icon={Cog}
          title="No equipment found"
          description={
            searchQuery || filterCategory || filterStatus
              ? "Try adjusting your search or filter criteria"
              : "Get started by adding your first equipment"
          }
          action={() => openModal()}
          actionLabel="Add Equipment"
        />
      ) : viewMode === "grid" ? (
        // Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {paginatedEquipment.map((eq) => (
            <div key={eq.id} className="card-hover group">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center relative`}
                  >
                    <Cog className="w-6 h-6 text-slate-600" />
                    <div
                      className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(
                        eq.status
                      )} ring-2 ring-white`}
                    />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      to={`/equipment/${eq.id}`}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => openModal(eq)}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(eq.id)}
                      className="p-2 rounded-lg hover:bg-danger-50 text-slate-400 hover:text-danger-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1 truncate">
                  {eq.equipment_name}
                </h3>
                <p className="text-sm text-slate-500 mb-3">{eq.type_model}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                    {eq.category}
                  </span>
                  <StatusBadge status={eq.status} size="sm" />
                </div>
              </div>
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Location</span>
                  <span className="font-medium text-slate-700">
                    {eq.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Table View
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Model</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Last Maintenance</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEquipment.map((eq) => (
                  <tr key={eq.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center relative`}
                        >
                          <Cog className="w-5 h-5 text-slate-600" />
                          <div
                            className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${getStatusColor(
                              eq.status
                            )} ring-2 ring-white`}
                          />
                        </div>
                        <span className="font-medium text-slate-900">
                          {eq.equipment_name}
                        </span>
                      </div>
                    </td>
                    <td className="text-slate-600">{eq.type_model}</td>
                    <td>
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                        {eq.category}
                      </span>
                    </td>
                    <td className="text-slate-600">{eq.location}</td>
                    <td className="text-slate-600">{eq.last_maintenance}</td>
                    <td>
                      <StatusBadge status={eq.status} />
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/equipment/${eq.id}`}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openModal(eq)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(eq.id)}
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
            totalItems={filteredEquipment.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}

      {/* Add/Edit Equipment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingEquipment ? "Edit Equipment" : "Add Equipment"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Equipment Name *</label>
              <input
                type="text"
                value={formData.equipment_name}
                onChange={(e) =>
                  setFormData({ ...formData, equipment_name: e.target.value })
                }
                className={`input ${
                  formErrors.equipment_name ? "input-error" : ""
                }`}
                placeholder="Enter equipment name"
              />
              {formErrors.equipment_name && (
                <p className="mt-1.5 text-sm text-danger-600">
                  {formErrors.equipment_name}
                </p>
              )}
            </div>

            <div>
              <label className="label">Type/Model</label>
              <input
                type="text"
                value={formData.type_model}
                onChange={(e) =>
                  setFormData({ ...formData, type_model: e.target.value })
                }
                className="input"
                placeholder="Enter type or model"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Category *</label>
              <select
                value={formData.equipment_category_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    equipment_category_id: e.target.value,
                  })
                }
                className={`select ${
                  formErrors.equipment_category_id ? "input-error" : ""
                }`}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {formErrors.equipment_category_id && (
                <p className="mt-1.5 text-sm text-danger-600">
                  {formErrors.equipment_category_id}
                </p>
              )}
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
                <option value="operational">Operational</option>
                <option value="maintenance">Under Maintenance</option>
                <option value="repair">Repair</option>
                <option value="offline">Offline</option>
                <option value="scrapped">Scrapped</option>
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
              className="input min-h-[100px]"
              placeholder="Enter equipment description..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={closeModal} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingEquipment ? "Update" : "Add"} Equipment
            </button>
          </div>
        </form>
      </Modal>

      {/* Category Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Manage Categories"
      >
        <div className="space-y-4">
          <div className="max-h-60 overflow-y-auto space-y-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <span className="font-medium text-slate-700">{cat.name}</span>
                <button
                  onClick={() => {
                    setCategories((prev) =>
                      prev.filter((c) => c.id !== cat.id)
                    );
                    toast.success("Category removed");
                  }}
                  className="p-1.5 text-slate-400 hover:text-danger-500 hover:bg-danger-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleAddCategory}
            className="flex gap-3 pt-4 border-t border-slate-200"
          >
            <input
              type="text"
              value={categoryFormData.name}
              onChange={(e) => setCategoryFormData({ name: e.target.value })}
              className="input flex-1"
              placeholder="New category name"
            />
            <button type="submit" className="btn-primary">
              Add
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Equipment;
