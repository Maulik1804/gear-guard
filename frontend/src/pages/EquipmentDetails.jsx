import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Cog,
  MapPin,
  Calendar,
  User,
  FileText,
  Wrench,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ClipboardList,
} from "lucide-react";
import { PageLoader } from "../components/LoadingSpinner";
import StatusBadge, { PriorityBadge } from "../components/StatusBadge";
import toast from "react-hot-toast";
import {
  equipmentApi,
  maintenanceSchedulesApi,
  workOrdersApi,
} from "../services/api";

const EquipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);

  useEffect(() => {
    const fetchEquipmentDetails = async () => {
      try {
        setLoading(true);
        const [equipmentRes, maintenanceRes, workOrdersRes] = await Promise.all(
          [
            equipmentApi.getById(id),
            maintenanceSchedulesApi.getAll(),
            workOrdersApi.getAll(),
          ]
        );

        const eq = equipmentRes.data;
        setEquipment({
          id: eq._id,
          equipment_name: eq.name || "",
          type_model: eq.model || "",
          serial_number: eq.serialNumber || "",
          category: eq.category || "",
          status: eq.status || "active",
          location: eq.location?.name || "",
          work_center: eq.workCenter?.name || "",
          responsible_person: eq.responsiblePerson?.name || "",
          purchase_date: eq.purchaseDate
            ? new Date(eq.purchaseDate).toISOString().split("T")[0]
            : "",
          warranty_expiry: eq.warrantyExpiry
            ? new Date(eq.warrantyExpiry).toISOString().split("T")[0]
            : "",
          last_maintenance: eq.lastMaintenanceDate
            ? new Date(eq.lastMaintenanceDate).toISOString().split("T")[0]
            : "",
          next_maintenance: eq.nextMaintenanceDate
            ? new Date(eq.nextMaintenanceDate).toISOString().split("T")[0]
            : "",
          total_maintenance_count: eq.maintenanceCount || 0,
          uptime_percentage: eq.uptimePercentage || 0,
          description: eq.description || "",
        });

        // Filter maintenance history for this equipment
        const equipmentMaintenance = (maintenanceRes.data || [])
          .filter((m) => m.equipment?._id === id)
          .map((m) => ({
            id: m._id,
            date: m.scheduledDate
              ? new Date(m.scheduledDate).toISOString().split("T")[0]
              : "",
            type: m.type || "Preventive",
            description: m.description || "",
            technician: m.assignedTo?.name || "Unassigned",
            status: m.status || "scheduled",
          }));
        setMaintenanceHistory(equipmentMaintenance);

        // Filter work orders for this equipment
        const equipmentWorkOrders = (workOrdersRes.data || [])
          .filter((wo) => wo.equipment?._id === id)
          .map((wo) => ({
            id: wo._id,
            number: wo.workOrderNumber || `WO-${wo._id?.slice(-6)}`,
            title: wo.title || wo.notes || "Work Order",
            priority: wo.priority || "medium",
            status: wo.status || "pending",
            due_date: wo.endDate
              ? new Date(wo.endDate).toISOString().split("T")[0]
              : "",
          }));
        setWorkOrders(equipmentWorkOrders);
      } catch (error) {
        console.error("Error fetching equipment details:", error);
        toast.error("Failed to load equipment details");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipmentDetails();
  }, [id]);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this equipment?")) {
      try {
        await equipmentApi.delete(id);
        toast.success("Equipment deleted successfully");
        navigate("/equipment");
      } catch (error) {
        console.error("Error deleting equipment:", error);
        toast.error("Failed to delete equipment");
      }
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!equipment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-slate-900">
          Equipment not found
        </h2>
        <Link
          to="/equipment"
          className="text-primary-600 hover:underline mt-2 inline-block"
        >
          Back to Equipment
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "maintenance", label: "Maintenance History" },
    { id: "work-orders", label: "Work Orders" },
  ];

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          to="/equipment"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Equipment
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center relative`}
            >
              <Cog className="w-8 h-8 text-slate-600" />
              <div
                className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${getStatusColor(
                  equipment.status
                )} ring-2 ring-white`}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {equipment.equipment_name}
              </h1>
              <p className="text-slate-500 mt-1">
                {equipment.type_model} • {equipment.serial_number}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                  {equipment.category}
                </span>
                <StatusBadge status={equipment.status} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Smart Maintenance Button */}
            <Link
              to={`/maintenance-kanban?equipment=${encodeURIComponent(
                equipment.equipment_name
              )}`}
              className="btn-primary relative"
            >
              <ClipboardList className="w-4 h-4" />
              Maintenance
              {/* Badge with open request count */}
              {workOrders.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {workOrders.length}
                </span>
              )}
            </Link>
            <button className="btn-outline">
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button onClick={handleDelete} className="btn-danger">
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {equipment.uptime_percentage}%
              </p>
              <p className="text-xs text-slate-500">Uptime</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {equipment.total_maintenance_count}
              </p>
              <p className="text-xs text-slate-500">Maintenances</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                {equipment.next_maintenance}
              </p>
              <p className="text-xs text-slate-500">Next Maintenance</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-secondary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {workOrders.length}
              </p>
              <p className="text-xs text-slate-500">Open Orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Equipment Details */}
          <div className="lg:col-span-2 card">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">
                Equipment Details
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Location</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-900">
                      {equipment.location}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Work Center</p>
                  <span className="font-medium text-slate-900">
                    {equipment.work_center}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">
                    Responsible Person
                  </p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-900">
                      {equipment.responsible_person}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Purchase Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-900">
                      {equipment.purchase_date}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Warranty Expiry</p>
                  <span className="font-medium text-slate-900">
                    {equipment.warranty_expiry}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">
                    Last Maintenance
                  </p>
                  <span className="font-medium text-slate-900">
                    {equipment.last_maintenance}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-sm text-slate-500 mb-2">Description</p>
                <p className="text-slate-700">{equipment.description}</p>
              </div>
            </div>
          </div>

          {/* Upcoming Maintenance */}
          <div className="card">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Upcoming</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="p-4 bg-warning-50 rounded-xl border border-warning-100">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">
                      Scheduled Maintenance
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      {equipment.next_maintenance}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      Preventive maintenance due in 19 days
                    </p>
                  </div>
                </div>
              </div>

              {workOrders.slice(0, 2).map((order) => (
                <div key={order.id} className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary-600">
                      {order.number}
                    </span>
                    <PriorityBadge priority={order.priority} size="sm" />
                  </div>
                  <p className="text-sm text-slate-900">{order.title}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Due: {order.due_date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "maintenance" && (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Technician</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceHistory.map((record) => (
                  <tr key={record.id}>
                    <td className="font-medium">{record.date}</td>
                    <td>
                      <span className="px-2.5 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                        {record.type}
                      </span>
                    </td>
                    <td className="text-slate-600">{record.description}</td>
                    <td>{record.technician}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success-500" />
                        <span className="text-success-600 font-medium text-sm">
                          Completed
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "work-orders" && (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Work Order</th>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {workOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-medium text-primary-600">
                      {order.number}
                    </td>
                    <td>{order.title}</td>
                    <td>
                      <PriorityBadge priority={order.priority} />
                    </td>
                    <td className="text-slate-600">{order.due_date}</td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentDetails;
