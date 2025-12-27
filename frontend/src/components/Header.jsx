import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, Bell, Search, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const pageNames = {
  "/dashboard": "Dashboard",
  "/work-centers": "Work Centers",
  "/equipment": "Equipment",
  "/tasks": "Tasks",
  "/work-orders": "Work Orders",
  "/teams": "Teams",
  "/maintenance-schedules": "Maintenance Schedules",
  "/employees": "Employees",
  "/locations": "Locations",
  "/settings": "Settings",
};

const Header = ({ onMenuClick }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const currentPage =
    pageNames[location.pathname] ||
    Object.entries(pageNames).find(
      ([path]) => path !== "/" && location.pathname.startsWith(path)
    )?.[1] ||
    "Dashboard";

  const notifications = [
    {
      id: 1,
      title: "Maintenance Due",
      message: "Equipment #123 maintenance is due tomorrow",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Task Completed",
      message: "John completed the HVAC inspection",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "New Work Order",
      message: "New work order #WO-456 created",
      time: "3 hours ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              {currentPage}
            </h1>
            <p className="text-sm text-slate-500 hidden sm:block">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search equipment, tasks, orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-0 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-20 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">
                      Notifications
                    </h3>
                    <span className="text-xs text-primary-600 font-medium cursor-pointer hover:underline">
                      Mark all as read
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${
                          notification.unread ? "bg-primary-50/30" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-2 h-2 mt-2 rounded-full ${
                              notification.unread
                                ? "bg-primary-500"
                                : "bg-transparent"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-slate-500 truncate">
                              {notification.message}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 bg-slate-50 text-center">
                    <span className="text-sm text-primary-600 font-medium cursor-pointer hover:underline">
                      View all notifications
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User menu */}
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-slate-900">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-slate-500 capitalize">
                {user?.role || "Admin"}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
