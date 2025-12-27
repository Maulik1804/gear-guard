import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Cog,
  FileText,
  ClipboardList,
  Users,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Wrench,
  Building2,
} from "lucide-react";
import StatusBadge, { PriorityBadge } from "../components/StatusBadge";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEquipment: 156,
    activeWorkOrders: 23,
    pendingTasks: 45,
    scheduledMaintenance: 12,
    completedToday: 8,
    overdueItems: 3,
  });

  const [recentWorkOrders, setRecentWorkOrders] = useState([
    {
      id: 1,
      number: "WO-2024-001",
      equipment: "CNC Machine #1",
      status: "in-progress",
      priority: "high",
      assignee: "John Smith",
    },
    {
      id: 2,
      number: "WO-2024-002",
      equipment: "HVAC Unit A",
      status: "pending",
      priority: "medium",
      assignee: "Sarah Johnson",
    },
    {
      id: 3,
      number: "WO-2024-003",
      equipment: "Conveyor Belt #3",
      status: "completed",
      priority: "low",
      assignee: "Mike Brown",
    },
    {
      id: 4,
      number: "WO-2024-004",
      equipment: "Forklift #2",
      status: "draft",
      priority: "high",
      assignee: "Emily Davis",
    },
    {
      id: 5,
      number: "WO-2024-005",
      equipment: "Generator B",
      status: "in-progress",
      priority: "medium",
      assignee: "Tom Wilson",
    },
  ]);

  const [upcomingMaintenance, setUpcomingMaintenance] = useState([
    {
      id: 1,
      equipment: "Industrial Pump #1",
      type: "Preventive",
      date: "2024-12-28",
      time: "09:00 AM",
    },
    {
      id: 2,
      equipment: "Air Compressor",
      type: "Inspection",
      date: "2024-12-28",
      time: "02:00 PM",
    },
    {
      id: 3,
      equipment: "Electrical Panel A",
      type: "Calibration",
      date: "2024-12-29",
      time: "10:00 AM",
    },
    {
      id: 4,
      equipment: "CNC Machine #2",
      type: "Preventive",
      date: "2024-12-30",
      time: "11:00 AM",
    },
  ]);

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      action: "completed",
      item: "Work Order WO-2024-003",
      user: "Mike Brown",
      time: "10 min ago",
    },
    {
      id: 2,
      action: "created",
      item: "Task: Inspect HVAC filters",
      user: "Sarah Johnson",
      time: "25 min ago",
    },
    {
      id: 3,
      action: "updated",
      item: "Equipment: Forklift #2",
      user: "Emily Davis",
      time: "1 hour ago",
    },
    {
      id: 4,
      action: "assigned",
      item: "Maintenance schedule",
      user: "John Smith",
      time: "2 hours ago",
    },
    {
      id: 5,
      action: "completed",
      item: "Task: Oil change on CNC #1",
      user: "Tom Wilson",
      time: "3 hours ago",
    },
  ]);

  const statCards = [
    {
      title: "Total Equipment",
      value: stats.totalEquipment,
      icon: Cog,
      color: "primary",
      change: "+12%",
      trend: "up",
      link: "/equipment",
    },
    {
      title: "Active Work Orders",
      value: stats.activeWorkOrders,
      icon: FileText,
      color: "secondary",
      change: "+5%",
      trend: "up",
      link: "/work-orders",
    },
    {
      title: "Pending Tasks",
      value: stats.pendingTasks,
      icon: ClipboardList,
      color: "warning",
      change: "-8%",
      trend: "down",
      link: "/tasks",
    },
    {
      title: "Scheduled Maintenance",
      value: stats.scheduledMaintenance,
      icon: Calendar,
      color: "success",
      change: "+3%",
      trend: "up",
      link: "/maintenance-schedules",
    },
  ];

  const colorClasses = {
    primary: {
      bg: "bg-primary-50",
      icon: "bg-primary-100 text-primary-600",
      text: "text-primary-600",
    },
    secondary: {
      bg: "bg-secondary-50",
      icon: "bg-secondary-100 text-secondary-600",
      text: "text-secondary-600",
    },
    warning: {
      bg: "bg-warning-50",
      icon: "bg-warning-100 text-warning-600",
      text: "text-warning-600",
    },
    success: {
      bg: "bg-success-50",
      icon: "bg-success-100 text-success-600",
      text: "text-success-600",
    },
  };

  const getActivityIcon = (action) => {
    switch (action) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-success-500" />;
      case "created":
        return <Activity className="w-4 h-4 text-primary-500" />;
      case "updated":
        return <TrendingUp className="w-4 h-4 text-secondary-500" />;
      case "assigned":
        return <Users className="w-4 h-4 text-warning-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 mt-1">
            Welcome back! Here's what's happening with your maintenance
            operations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="select py-2">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, index) => (
          <Link key={index} to={stat.link} className="card-hover p-6 group">
            <div className="flex items-start justify-between">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  colorClasses[stat.color].icon
                }`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-success-600" : "text-danger-600"
                }`}
              >
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.title}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-success-100 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-success-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {stats.completedToday}
            </p>
            <p className="text-sm text-slate-500">Completed Today</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-danger-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-danger-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {stats.overdueItems}
            </p>
            <p className="text-sm text-slate-500">Overdue Items</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">5</p>
            <p className="text-sm text-slate-500">Work Centers</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Work Orders */}
        <div className="lg:col-span-2 card">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Work Orders
            </h2>
            <Link
              to="/work-orders"
              className="text-sm text-primary-600 font-medium hover:text-primary-700"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Work Order</th>
                  <th>Equipment</th>
                  <th>Assignee</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentWorkOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-medium text-primary-600">
                      {order.number}
                    </td>
                    <td>{order.equipment}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                          {order.assignee
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span>{order.assignee}</span>
                      </div>
                    </td>
                    <td>
                      <PriorityBadge priority={order.priority} />
                    </td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Activity
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                    {getActivityIcon(activity.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">
                      <span className="font-medium">{activity.user}</span>{" "}
                      <span className="text-slate-500">{activity.action}</span>{" "}
                      <span className="font-medium">{activity.item}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Maintenance */}
      <div className="card">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Upcoming Maintenance
          </h2>
          <Link
            to="/maintenance-schedules"
            className="text-sm text-primary-600 font-medium hover:text-primary-700"
          >
            View Calendar
          </Link>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingMaintenance.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Wrench className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-0.5 rounded-full">
                    {item.type}
                  </span>
                </div>
                <h3 className="font-medium text-slate-900 mb-2 truncate">
                  {item.equipment}
                </h3>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span>{item.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                  <Clock className="w-4 h-4" />
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
