import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Filter,
  Grid,
  List,
  User,
  Briefcase,
} from "lucide-react";
import Modal from "../components/Modal";
import { PageLoader } from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import Pagination from "../components/Pagination";
import toast from "react-hot-toast";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    department: "",
    job_title: "",
    status: "active",
    work_center: "",
    hire_date: "",
    skills: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const itemsPerPage = 12;

  const departments = [
    "Engineering",
    "Maintenance",
    "Operations",
    "Quality",
    "Safety",
    "Administration",
  ];
  const workCenters = [
    "Production Floor",
    "Assembly Line A",
    "Assembly Line B",
    "Warehouse",
    "Quality Lab",
    "Admin Office",
  ];

  useEffect(() => {
    setTimeout(() => {
      setEmployees([
        {
          id: 1,
          first_name: "John",
          last_name: "Smith",
          email: "john.smith@company.com",
          phone: "555-0101",
          department: "Maintenance",
          job_title: "Senior Technician",
          status: "active",
          work_center: "Production Floor",
          hire_date: "2020-03-15",
          skills: "Electrical, HVAC, PLC",
        },
        {
          id: 2,
          first_name: "Sarah",
          last_name: "Johnson",
          email: "sarah.j@company.com",
          phone: "555-0102",
          department: "Engineering",
          job_title: "Maintenance Engineer",
          status: "active",
          work_center: "Assembly Line A",
          hire_date: "2019-07-22",
          skills: "Mechanical, CAD, Welding",
        },
        {
          id: 3,
          first_name: "Mike",
          last_name: "Brown",
          email: "mike.b@company.com",
          phone: "555-0103",
          department: "Maintenance",
          job_title: "Maintenance Technician",
          status: "active",
          work_center: "Assembly Line B",
          hire_date: "2021-01-10",
          skills: "Hydraulics, Pneumatics",
        },
        {
          id: 4,
          first_name: "Emily",
          last_name: "Davis",
          email: "emily.d@company.com",
          phone: "555-0104",
          department: "Operations",
          job_title: "Operations Supervisor",
          status: "active",
          work_center: "Production Floor",
          hire_date: "2018-11-05",
          skills: "Lean Manufacturing, Six Sigma",
        },
        {
          id: 5,
          first_name: "Tom",
          last_name: "Wilson",
          email: "tom.w@company.com",
          phone: "555-0105",
          department: "Quality",
          job_title: "Quality Inspector",
          status: "active",
          work_center: "Quality Lab",
          hire_date: "2020-06-18",
          skills: "Metrology, ISO Standards",
        },
        {
          id: 6,
          first_name: "Lisa",
          last_name: "Anderson",
          email: "lisa.a@company.com",
          phone: "555-0106",
          department: "Safety",
          job_title: "Safety Coordinator",
          status: "active",
          work_center: "Admin Office",
          hire_date: "2019-09-30",
          skills: "OSHA, Hazmat, First Aid",
        },
        {
          id: 7,
          first_name: "David",
          last_name: "Martinez",
          email: "david.m@company.com",
          phone: "555-0107",
          department: "Maintenance",
          job_title: "Apprentice Technician",
          status: "active",
          work_center: "Warehouse",
          hire_date: "2023-02-14",
          skills: "Basic Electrical, Mechanical",
        },
        {
          id: 8,
          first_name: "Jennifer",
          last_name: "Taylor",
          email: "jennifer.t@company.com",
          phone: "555-0108",
          department: "Engineering",
          job_title: "Reliability Engineer",
          status: "on-leave",
          work_center: "Production Floor",
          hire_date: "2017-04-20",
          skills: "RCM, Vibration Analysis, Oil Analysis",
        },
        {
          id: 9,
          first_name: "Robert",
          last_name: "Lee",
          email: "robert.l@company.com",
          phone: "555-0109",
          department: "Maintenance",
          job_title: "HVAC Specialist",
          status: "active",
          work_center: "Assembly Line A",
          hire_date: "2021-08-12",
          skills: "HVAC, Refrigeration",
        },
        {
          id: 10,
          first_name: "Amanda",
          last_name: "White",
          email: "amanda.w@company.com",
          phone: "555-0110",
          department: "Administration",
          job_title: "Maintenance Planner",
          status: "active",
          work_center: "Admin Office",
          hire_date: "2022-05-01",
          skills: "CMMS, Scheduling, Excel",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredEmployees = employees.filter((employee) => {
    const fullName =
      `${employee.first_name} ${employee.last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.job_title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      !filterDepartment || employee.department === filterDepartment;
    const matchesStatus = !filterStatus || employee.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModal = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        phone: employee.phone || "",
        department: employee.department,
        job_title: employee.job_title,
        status: employee.status,
        work_center: employee.work_center || "",
        hire_date: employee.hire_date || "",
        skills: employee.skills || "",
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        department: "",
        job_title: "",
        status: "active",
        work_center: "",
        hire_date: "",
        skills: "",
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.first_name.trim())
      errors.first_name = "First name is required";
    if (!formData.last_name.trim()) errors.last_name = "Last name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Invalid email format";
    if (!formData.department) errors.department = "Department is required";
    if (!formData.job_title.trim()) errors.job_title = "Job title is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingEmployee) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editingEmployee.id ? { ...emp, ...formData } : emp
        )
      );
      toast.success("Employee updated successfully");
    } else {
      const newEmployee = {
        id: Date.now(),
        ...formData,
      };
      setEmployees((prev) => [newEmployee, ...prev]);
      toast.success("Employee added successfully");
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      toast.success("Employee deleted successfully");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-success-100 text-success-700",
      inactive: "bg-slate-100 text-slate-600",
      "on-leave": "bg-warning-100 text-warning-700",
    };
    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          styles[status] || styles.inactive
        }`}
      >
        {status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
      </span>
    );
  };

  const getDepartmentStats = () => {
    const stats = {};
    departments.forEach((dept) => {
      stats[dept] = employees.filter((e) => e.department === dept).length;
    });
    return stats;
  };

  const deptStats = getDepartmentStats();

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          <p className="text-slate-500 mt-1">
            Manage your maintenance team members
          </p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <Plus className="w-5 h-5" />
          Add Employee
        </button>
      </div>

      {/* Department Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() =>
              setFilterDepartment(filterDepartment === dept ? "" : dept)
            }
            className={`card p-3 text-center transition-all ${
              filterDepartment === dept
                ? "ring-2 ring-primary-500 bg-primary-50"
                : "hover:border-slate-300"
            }`}
          >
            <p className="text-2xl font-bold text-slate-900">
              {deptStats[dept] || 0}
            </p>
            <p className="text-xs text-slate-500 mt-1">{dept}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="select"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
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
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
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

      {/* Employees Grid/List */}
      {filteredEmployees.length === 0 ? (
        <EmptyState
          icon={User}
          title="No employees found"
          description={
            searchQuery || filterDepartment || filterStatus
              ? "Try adjusting your search or filter criteria"
              : "Get started by adding your first employee"
          }
          action={() => openModal()}
          actionLabel="Add Employee"
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedEmployees.map((employee) => (
            <div
              key={employee.id}
              className="card p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-lg font-semibold">
                  {employee.first_name[0]}
                  {employee.last_name[0]}
                </div>
                {getStatusBadge(employee.status)}
              </div>

              <h3 className="font-semibold text-slate-900">
                {employee.first_name} {employee.last_name}
              </h3>
              <p className="text-sm text-primary-600 font-medium">
                {employee.job_title}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {employee.department}
              </p>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{employee.email}</span>
                </div>
                {employee.phone && (
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone className="w-4 h-4" />
                    <span>{employee.phone}</span>
                  </div>
                )}
                {employee.work_center && (
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin className="w-4 h-4" />
                    <span>{employee.work_center}</span>
                  </div>
                )}
              </div>

              {employee.skills && (
                <div className="mt-4 flex flex-wrap gap-1">
                  {employee.skills
                    .split(",")
                    .slice(0, 3)
                    .map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => openModal(employee)}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(employee.id)}
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
                  <th>Employee</th>
                  <th>Contact</th>
                  <th>Department</th>
                  <th>Work Center</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-semibold">
                          {employee.first_name[0]}
                          {employee.last_name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {employee.first_name} {employee.last_name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {employee.job_title}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="text-sm">{employee.email}</p>
                      <p className="text-sm text-slate-400">{employee.phone}</p>
                    </td>
                    <td className="text-slate-600">{employee.department}</td>
                    <td className="text-slate-600">
                      {employee.work_center || "-"}
                    </td>
                    <td>{getStatusBadge(employee.status)}</td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openModal(employee)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(employee.id)}
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
          totalItems={filteredEmployees.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingEmployee ? "Edit Employee" : "Add Employee"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">First Name *</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                className={`input ${
                  formErrors.first_name ? "input-error" : ""
                }`}
                placeholder="John"
              />
              {formErrors.first_name && (
                <p className="mt-1.5 text-sm text-danger-600">
                  {formErrors.first_name}
                </p>
              )}
            </div>

            <div>
              <label className="label">Last Name *</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                className={`input ${formErrors.last_name ? "input-error" : ""}`}
                placeholder="Smith"
              />
              {formErrors.last_name && (
                <p className="mt-1.5 text-sm text-danger-600">
                  {formErrors.last_name}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`input ${formErrors.email ? "input-error" : ""}`}
                placeholder="john.smith@company.com"
              />
              {formErrors.email && (
                <p className="mt-1.5 text-sm text-danger-600">
                  {formErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="label">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="input"
                placeholder="555-0100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Department *</label>
              <select
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className={`select ${
                  formErrors.department ? "input-error" : ""
                }`}
              >
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {formErrors.department && (
                <p className="mt-1.5 text-sm text-danger-600">
                  {formErrors.department}
                </p>
              )}
            </div>

            <div>
              <label className="label">Job Title *</label>
              <input
                type="text"
                value={formData.job_title}
                onChange={(e) =>
                  setFormData({ ...formData, job_title: e.target.value })
                }
                className={`input ${formErrors.job_title ? "input-error" : ""}`}
                placeholder="Maintenance Technician"
              />
              {formErrors.job_title && (
                <p className="mt-1.5 text-sm text-danger-600">
                  {formErrors.job_title}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Work Center</label>
              <select
                value={formData.work_center}
                onChange={(e) =>
                  setFormData({ ...formData, work_center: e.target.value })
                }
                className="select"
              >
                <option value="">Select work center</option>
                {workCenters.map((wc) => (
                  <option key={wc} value={wc}>
                    {wc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Hire Date</label>
              <input
                type="date"
                value={formData.hire_date}
                onChange={(e) =>
                  setFormData({ ...formData, hire_date: e.target.value })
                }
                className="input"
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>

          <div>
            <label className="label">Skills</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) =>
                setFormData({ ...formData, skills: e.target.value })
              }
              className="input"
              placeholder="Electrical, HVAC, PLC (comma separated)"
            />
            <p className="mt-1.5 text-sm text-slate-400">
              Separate skills with commas
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={closeModal} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingEmployee ? "Update" : "Add"} Employee
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Employees;
