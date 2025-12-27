import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Building2,
  MoreVertical,
  Filter,
} from "lucide-react";
import Modal from "../components/Modal";
import { PageLoader } from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";
import toast from "react-hot-toast";

const WorkCenters = () => {
  const [workCenters, setWorkCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkCenter, setEditingWorkCenter] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    work_center_group: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);

  const itemsPerPage = 10;

  // Sample data
  useEffect(() => {
    setTimeout(() => {
      setWorkCenters([
        {
          id: 1,
          name: "Assembly Line 1",
          work_center_group: "Manufacturing",
          equipment_count: 15,
          created_at: "2024-01-15",
        },
        {
          id: 2,
          name: "Assembly Line 2",
          work_center_group: "Manufacturing",
          equipment_count: 12,
          created_at: "2024-02-20",
        },
        {
          id: 3,
          name: "Welding Station",
          work_center_group: "Fabrication",
          equipment_count: 8,
          created_at: "2024-03-10",
        },
        {
          id: 4,
          name: "Paint Booth",
          work_center_group: "Finishing",
          equipment_count: 5,
          created_at: "2024-03-15",
        },
        {
          id: 5,
          name: "Quality Control Lab",
          work_center_group: "Quality",
          equipment_count: 20,
          created_at: "2024-04-01",
        },
        {
          id: 6,
          name: "Packaging Area",
          work_center_group: "Shipping",
          equipment_count: 10,
          created_at: "2024-04-15",
        },
        {
          id: 7,
          name: "CNC Workshop",
          work_center_group: "Machining",
          equipment_count: 18,
          created_at: "2024-05-01",
        },
        {
          id: 8,
          name: "Maintenance Bay",
          work_center_group: "Support",
          equipment_count: 6,
          created_at: "2024-05-10",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const groups = [...new Set(workCenters.map((wc) => wc.work_center_group))];

  const filteredWorkCenters = workCenters.filter((wc) => {
    const matchesSearch =
      wc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wc.work_center_group.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterGroup || wc.work_center_group === filterGroup;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredWorkCenters.length / itemsPerPage);
  const paginatedWorkCenters = filteredWorkCenters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModal = (workCenter = null) => {
    if (workCenter) {
      setEditingWorkCenter(workCenter);
      setFormData({
        name: workCenter.name,
        work_center_group: workCenter.work_center_group,
      });
    } else {
      setEditingWorkCenter(null);
      setFormData({ name: "", work_center_group: "" });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingWorkCenter(null);
    setFormData({ name: "", work_center_group: "" });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Work center name is required";
    }
    if (!formData.work_center_group.trim()) {
      errors.work_center_group = "Group is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingWorkCenter) {
      setWorkCenters((prev) =>
        prev.map((wc) =>
          wc.id === editingWorkCenter.id ? { ...wc, ...formData } : wc
        )
      );
      toast.success("Work center updated successfully");
    } else {
      const newWorkCenter = {
        id: Date.now(),
        ...formData,
        equipment_count: 0,
        created_at: new Date().toISOString().split("T")[0],
      };
      setWorkCenters((prev) => [newWorkCenter, ...prev]);
      toast.success("Work center created successfully");
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this work center?")) {
      setWorkCenters((prev) => prev.filter((wc) => wc.id !== id));
      toast.success("Work center deleted successfully");
    }
    setActiveDropdown(null);
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Work Centers</h1>
          <p className="text-slate-500 mt-1">
            Manage your facility work centers and production areas
          </p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <Plus className="w-5 h-5" />
          Add Work Center
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search work centers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="select"
            >
              <option value="">All Groups</option>
              {groups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Work Centers Table */}
      {filteredWorkCenters.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No work centers found"
          description={
            searchQuery || filterGroup
              ? "Try adjusting your search or filter criteria"
              : "Get started by adding your first work center"
          }
          action={() => openModal()}
          actionLabel="Add Work Center"
        />
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Group</th>
                  <th>Equipment</th>
                  <th>Created</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedWorkCenters.map((workCenter) => (
                  <tr key={workCenter.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-primary-600" />
                        </div>
                        <span className="font-medium text-slate-900">
                          {workCenter.name}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                        {workCenter.work_center_group}
                      </span>
                    </td>
                    <td>
                      <span className="font-medium">
                        {workCenter.equipment_count}
                      </span>
                      <span className="text-slate-400 ml-1">items</span>
                    </td>
                    <td className="text-slate-500">{workCenter.created_at}</td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(workCenter)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-primary-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(workCenter.id)}
                          className="p-2 rounded-lg hover:bg-danger-50 text-slate-500 hover:text-danger-600 transition-colors"
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
            totalItems={filteredWorkCenters.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingWorkCenter ? "Edit Work Center" : "Add Work Center"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Work Center Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`input ${formErrors.name ? "input-error" : ""}`}
              placeholder="Enter work center name"
            />
            {formErrors.name && (
              <p className="mt-1.5 text-sm text-danger-600">
                {formErrors.name}
              </p>
            )}
          </div>

          <div>
            <label className="label">Group</label>
            <input
              type="text"
              value={formData.work_center_group}
              onChange={(e) =>
                setFormData({ ...formData, work_center_group: e.target.value })
              }
              className={`input ${
                formErrors.work_center_group ? "input-error" : ""
              }`}
              placeholder="e.g., Manufacturing, Fabrication, Quality"
              list="group-suggestions"
            />
            <datalist id="group-suggestions">
              {groups.map((group) => (
                <option key={group} value={group} />
              ))}
            </datalist>
            {formErrors.work_center_group && (
              <p className="mt-1.5 text-sm text-danger-600">
                {formErrors.work_center_group}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={closeModal} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingWorkCenter ? "Update" : "Create"} Work Center
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default WorkCenters;
