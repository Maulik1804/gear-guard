import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  MapPin,
  Building2,
  ChevronRight,
  Grid,
  List,
  Factory,
  Map,
  Warehouse,
} from "lucide-react";
import Modal from "../components/Modal";
import { PageLoader } from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";
import toast from "react-hot-toast";

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zip_code: "",
    description: "",
    contact_person: "",
    contact_phone: "",
    contact_email: "",
    equipment_count: 0,
    is_active: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const itemsPerPage = 12;

  const locationTypes = [
    "Plant",
    "Building",
    "Floor",
    "Zone",
    "Warehouse",
    "Office",
    "Storage",
  ];

  useEffect(() => {
    setTimeout(() => {
      setLocations([
        {
          id: 1,
          name: "Main Manufacturing Plant",
          code: "MMP-001",
          type: "Plant",
          address: "123 Industrial Way",
          city: "Detroit",
          state: "MI",
          country: "USA",
          zip_code: "48201",
          description: "Primary manufacturing facility",
          contact_person: "Robert Thompson",
          contact_phone: "555-1001",
          contact_email: "r.thompson@company.com",
          equipment_count: 45,
          is_active: true,
        },
        {
          id: 2,
          name: "Assembly Building A",
          code: "AB-A01",
          type: "Building",
          address: "123 Industrial Way",
          city: "Detroit",
          state: "MI",
          country: "USA",
          zip_code: "48201",
          description: "Main assembly operations",
          contact_person: "Susan Miller",
          contact_phone: "555-1002",
          contact_email: "s.miller@company.com",
          equipment_count: 28,
          is_active: true,
          parent_id: 1,
        },
        {
          id: 3,
          name: "Assembly Building B",
          code: "AB-B01",
          type: "Building",
          address: "123 Industrial Way",
          city: "Detroit",
          state: "MI",
          country: "USA",
          zip_code: "48201",
          description: "Secondary assembly operations",
          contact_person: "James Wilson",
          contact_phone: "555-1003",
          contact_email: "j.wilson@company.com",
          equipment_count: 22,
          is_active: true,
          parent_id: 1,
        },
        {
          id: 4,
          name: "North Warehouse",
          code: "WH-N01",
          type: "Warehouse",
          address: "456 Storage Blvd",
          city: "Detroit",
          state: "MI",
          country: "USA",
          zip_code: "48202",
          description: "Parts and materials storage",
          contact_person: "Maria Garcia",
          contact_phone: "555-1004",
          contact_email: "m.garcia@company.com",
          equipment_count: 8,
          is_active: true,
        },
        {
          id: 5,
          name: "Quality Control Lab",
          code: "QC-L01",
          type: "Zone",
          address: "123 Industrial Way",
          city: "Detroit",
          state: "MI",
          country: "USA",
          zip_code: "48201",
          description: "Quality testing and inspection",
          contact_person: "David Lee",
          contact_phone: "555-1005",
          contact_email: "d.lee@company.com",
          equipment_count: 12,
          is_active: true,
          parent_id: 2,
        },
        {
          id: 6,
          name: "CNC Machining Zone",
          code: "CNC-Z01",
          type: "Zone",
          address: "123 Industrial Way",
          city: "Detroit",
          state: "MI",
          country: "USA",
          zip_code: "48201",
          description: "CNC machining operations",
          contact_person: "Tom Brown",
          contact_phone: "555-1006",
          contact_email: "t.brown@company.com",
          equipment_count: 15,
          is_active: true,
          parent_id: 2,
        },
        {
          id: 7,
          name: "Administrative Office",
          code: "ADM-001",
          type: "Office",
          address: "789 Corporate Dr",
          city: "Detroit",
          state: "MI",
          country: "USA",
          zip_code: "48203",
          description: "Administrative and HR offices",
          contact_person: "Linda Davis",
          contact_phone: "555-1007",
          contact_email: "l.davis@company.com",
          equipment_count: 5,
          is_active: true,
        },
        {
          id: 8,
          name: "South Storage",
          code: "ST-S01",
          type: "Storage",
          address: "123 Industrial Way",
          city: "Detroit",
          state: "MI",
          country: "USA",
          zip_code: "48201",
          description: "Tool and spare parts storage",
          contact_person: "Chris Johnson",
          contact_phone: "555-1008",
          contact_email: "c.johnson@company.com",
          equipment_count: 3,
          is_active: true,
          parent_id: 1,
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredLocations = locations.filter((location) => {
    const matchesSearch =
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.city?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !filterType || location.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
  const paginatedLocations = filteredLocations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModal = (location = null) => {
    if (location) {
      setEditingLocation(location);
      setFormData({
        name: location.name,
        code: location.code,
        type: location.type,
        address: location.address || "",
        city: location.city || "",
        state: location.state || "",
        country: location.country || "",
        zip_code: location.zip_code || "",
        description: location.description || "",
        contact_person: location.contact_person || "",
        contact_phone: location.contact_phone || "",
        contact_email: location.contact_email || "",
        equipment_count: location.equipment_count || 0,
        is_active: location.is_active !== false,
      });
    } else {
      setEditingLocation(null);
      setFormData({
        name: "",
        code: "",
        type: "",
        address: "",
        city: "",
        state: "",
        country: "",
        zip_code: "",
        description: "",
        contact_person: "",
        contact_phone: "",
        contact_email: "",
        equipment_count: 0,
        is_active: true,
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLocation(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.code.trim()) errors.code = "Code is required";
    if (!formData.type) errors.type = "Type is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingLocation) {
      setLocations((prev) =>
        prev.map((loc) =>
          loc.id === editingLocation.id ? { ...loc, ...formData } : loc
        )
      );
      toast.success("Location updated successfully");
    } else {
      const newLocation = {
        id: Date.now(),
        ...formData,
      };
      setLocations((prev) => [newLocation, ...prev]);
      toast.success("Location added successfully");
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this location?")) {
      setLocations((prev) => prev.filter((loc) => loc.id !== id));
      toast.success("Location deleted successfully");
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Plant":
        return <Factory className="w-5 h-5" />;
      case "Building":
        return <Building2 className="w-5 h-5" />;
      case "Warehouse":
        return <Warehouse className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Plant":
        return "bg-primary-100 text-primary-600";
      case "Building":
        return "bg-secondary-100 text-secondary-600";
      case "Warehouse":
        return "bg-warning-100 text-warning-600";
      case "Zone":
        return "bg-success-100 text-success-600";
      case "Office":
        return "bg-slate-100 text-slate-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getLocationStats = () => {
    const total = locations.length;
    const totalEquipment = locations.reduce(
      (sum, loc) => sum + (loc.equipment_count || 0),
      0
    );
    const typeCount = {};
    locationTypes.forEach((type) => {
      typeCount[type] = locations.filter((l) => l.type === type).length;
    });
    return { total, totalEquipment, typeCount };
  };

  const stats = getLocationStats();

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Locations</h1>
          <p className="text-slate-500 mt-1">
            Manage facility locations and zones
          </p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <Plus className="w-5 h-5" />
          Add Location
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary-100">
              <Map className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-sm text-slate-500">Total Locations</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-secondary-100">
              <Factory className="w-5 h-5 text-secondary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.typeCount["Plant"] || 0}
              </p>
              <p className="text-sm text-slate-500">Plants</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-warning-100">
              <Warehouse className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.typeCount["Warehouse"] || 0}
              </p>
              <p className="text-sm text-slate-500">Warehouses</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-success-100">
              <Building2 className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.totalEquipment}
              </p>
              <p className="text-sm text-slate-500">Total Equipment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="select"
            >
              <option value="">All Types</option>
              {locationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
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

      {/* Locations Grid/List */}
      {filteredLocations.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No locations found"
          description={
            searchQuery || filterType
              ? "Try adjusting your search or filter criteria"
              : "Get started by adding your first location"
          }
          action={() => openModal()}
          actionLabel="Add Location"
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedLocations.map((location) => (
            <div
              key={location.id}
              className="card p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-xl ${getTypeColor(location.type)}`}
                >
                  {getTypeIcon(location.type)}
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    location.is_active
                      ? "bg-success-100 text-success-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {location.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <h3 className="font-semibold text-slate-900">{location.name}</h3>
              <p className="text-sm text-primary-600 font-medium mt-0.5">
                {location.code}
              </p>

              <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">
                  {location.city}, {location.state}
                </span>
              </div>

              {location.description && (
                <p className="mt-3 text-sm text-slate-500 line-clamp-2">
                  {location.description}
                </p>
              )}

              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Equipment</span>
                  <span className="font-semibold text-slate-900">
                    {location.equipment_count}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => openModal(location)}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(location.id)}
                  className="p-2 rounded-lg hover:bg-danger-50 text-slate-400 hover:text-danger-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Address</th>
                  <th>Contact</th>
                  <th>Equipment</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLocations.map((location) => (
                  <tr key={location.id}>
                    <td>
                      <div>
                        <p className="font-medium text-slate-900">
                          {location.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {location.code}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(
                          location.type
                        )}`}
                      >
                        {getTypeIcon(location.type)}
                        {location.type}
                      </span>
                    </td>
                    <td>
                      <p className="text-sm">{location.address}</p>
                      <p className="text-sm text-slate-400">
                        {location.city}, {location.state}
                      </p>
                    </td>
                    <td>
                      <p className="text-sm">
                        {location.contact_person || "-"}
                      </p>
                      <p className="text-sm text-slate-400">
                        {location.contact_phone}
                      </p>
                    </td>
                    <td className="font-medium text-slate-900">
                      {location.equipment_count}
                    </td>
                    <td>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          location.is_active
                            ? "bg-success-100 text-success-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {location.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openModal(location)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(location.id)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredLocations.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingLocation ? "Edit Location" : "Add Location"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-2">
              <label className="label">Location Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`input ${formErrors.name ? "input-error" : ""}`}
                placeholder="Main Manufacturing Plant"
              />
              {formErrors.name && (
                <p className="mt-1.5 text-sm text-danger-600">
                  {formErrors.name}
                </p>
              )}
            </div>

            <div>
              <label className="label">Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
                className={`input ${formErrors.code ? "input-error" : ""}`}
                placeholder="MMP-001"
              />
              {formErrors.code && (
                <p className="mt-1.5 text-sm text-danger-600">
                  {formErrors.code}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Type *</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className={`select ${formErrors.type ? "input-error" : ""}`}
              >
                <option value="">Select type</option>
                {locationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {formErrors.type && (
                <p className="mt-1.5 text-sm text-danger-600">
                  {formErrors.type}
                </p>
              )}
            </div>

            <div>
              <label className="label">Status</label>
              <select
                value={formData.is_active ? "active" : "inactive"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_active: e.target.value === "active",
                  })
                }
                className="select"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="input"
              placeholder="123 Industrial Way"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            <div>
              <label className="label">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="input"
                placeholder="Detroit"
              />
            </div>
            <div>
              <label className="label">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className="input"
                placeholder="MI"
              />
            </div>
            <div>
              <label className="label">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className="input"
                placeholder="USA"
              />
            </div>
            <div>
              <label className="label">Zip Code</label>
              <input
                type="text"
                value={formData.zip_code}
                onChange={(e) =>
                  setFormData({ ...formData, zip_code: e.target.value })
                }
                className="input"
                placeholder="48201"
              />
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
              placeholder="Brief description of this location..."
              rows={3}
            />
          </div>

          <div className="border-t border-slate-200 pt-5">
            <h4 className="text-sm font-medium text-slate-900 mb-4">
              Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="label">Contact Person</label>
                <input
                  type="text"
                  value={formData.contact_person}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_person: e.target.value })
                  }
                  className="input"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_phone: e.target.value })
                  }
                  className="input"
                  placeholder="555-1001"
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_email: e.target.value })
                  }
                  className="input"
                  placeholder="contact@company.com"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={closeModal} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingLocation ? "Update" : "Add"} Location
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Locations;
