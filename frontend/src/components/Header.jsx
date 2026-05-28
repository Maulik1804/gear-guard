import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Wrench,
  ClipboardList,
  FileText,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  notificationsApi,
  equipmentApi,
  workOrdersApi,
  tasksApi,
  employeesApi,
} from "../services/api";
import { formatDistanceToNow } from "date-fns";

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

const Header = ({ onMenuClick, isMenuOpen = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);

  // Load avatar from localStorage
  useEffect(() => {
    const savedAvatar = localStorage.getItem("gearguard_avatar");
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }

    // Listen for storage changes (when avatar is updated in Settings)
    const handleStorageChange = (e) => {
      if (e.key === "gearguard_avatar") {
        setAvatar(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const currentPage =
    pageNames[location.pathname] ||
    Object.entries(pageNames).find(
      ([path]) => path !== "/" && location.pathname.startsWith(path),
    )?.[1] ||
    "Dashboard";

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await notificationsApi.getAll(20, false);
      const notifs = response.data.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        time: n.created_at
          ? formatDistanceToNow(new Date(n.created_at), { addSuffix: true })
          : "Just now",
        unread: !n.is_read,
        type: n.notification_type,
        referenceType: n.reference_type,
        referenceId: n.reference_id,
      }));
      setNotifications(notifs);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Fetch notifications on mount and periodically
  useEffect(() => {
    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Search suggestions with debounce
  useEffect(() => {
    const searchData = async () => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setSearchResults([]);
        setShowSearchSuggestions(false);
        return;
      }

      setSearchLoading(true);
      try {
        const [equipmentRes, workOrdersRes, tasksRes, employeesRes] =
          await Promise.all([
            equipmentApi.getAll().catch(() => ({ data: [] })),
            workOrdersApi.getAll().catch(() => ({ data: [] })),
            tasksApi.getAll().catch(() => ({ data: [] })),
            employeesApi.getAll().catch(() => ({ data: [] })),
          ]);

        const query = searchQuery.toLowerCase();
        const results = [];

        // Filter equipment
        (equipmentRes.data || []).forEach((item) => {
          if (
            item.name?.toLowerCase().includes(query) ||
            item.equipmentCode?.toLowerCase().includes(query)
          ) {
            results.push({
              id: item._id,
              title: item.name,
              subtitle: item.equipmentCode || item.category,
              type: "equipment",
              icon: Wrench,
              path: `/equipment/${item._id}`,
            });
          }
        });

        // Filter work orders
        (workOrdersRes.data || []).forEach((item) => {
          if (
            item.workOrderNumber?.toLowerCase().includes(query) ||
            item.title?.toLowerCase().includes(query)
          ) {
            results.push({
              id: item._id,
              title: item.workOrderNumber || item.title,
              subtitle: item.status,
              type: "work-order",
              icon: FileText,
              path: "/work-orders",
            });
          }
        });

        // Filter tasks
        (tasksRes.data || []).forEach((item) => {
          if (
            item.title?.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query)
          ) {
            results.push({
              id: item._id,
              title: item.title,
              subtitle: item.type || item.status,
              type: "task",
              icon: ClipboardList,
              path: "/tasks",
            });
          }
        });

        // Filter employees
        (employeesRes.data || []).forEach((item) => {
          const name = item.user?.name || item.name;
          if (
            name?.toLowerCase().includes(query) ||
            item.employeeCode?.toLowerCase().includes(query)
          ) {
            results.push({
              id: item._id,
              title: name,
              subtitle: item.position || item.department,
              type: "employee",
              icon: Users,
              path: "/employees",
            });
          }
        });

        setSearchResults(results.slice(0, 8)); // Limit to 8 results
        setShowSearchSuggestions(results.length > 0);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setSearchLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchData, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const markAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, unread: false })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, unread: false } : n)),
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="app-sidebar"
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
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
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="text"
              name="global-search"
              autoComplete="off"
              spellCheck={false}
              aria-label="Search equipment, tasks, and work orders"
              placeholder="Search equipment, tasks, orders…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() =>
                searchResults.length > 0 && setShowSearchSuggestions(true)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  setShowSearchSuggestions(false);
                  navigate(
                    `/equipment?search=${encodeURIComponent(searchQuery)}`,
                  );
                }
                if (e.key === "Escape") {
                  setShowSearchSuggestions(false);
                }
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-0 rounded-xl text-sm placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Search Suggestions Dropdown */}
          {showSearchSuggestions && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowSearchSuggestions(false)}
              />
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-20 overflow-hidden">
                {searchLoading ? (
                  <div className="px-4 py-3 text-center text-sm text-slate-500">
                    Searching...
                  </div>
                ) : (
                  <>
                    <div className="max-h-80 overflow-y-auto">
                      {searchResults.map((result) => {
                        const IconComponent = result.icon;
                        return (
                          <button
                            key={`${result.type}-${result.id}`}
                            onClick={() => {
                              setShowSearchSuggestions(false);
                              setSearchQuery("");
                              navigate(result.path);
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                              <IconComponent className="w-4 h-4 text-slate-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">
                                {result.title}
                              </p>
                              <p className="text-xs text-slate-500 truncate">
                                {result.subtitle} •{" "}
                                <span className="capitalize">
                                  {result.type.replace("-", " ")}
                                </span>
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {searchResults.length > 0 && (
                      <div className="px-4 py-2 bg-slate-50 text-center border-t border-slate-100">
                        <button
                          onClick={() => {
                            setShowSearchSuggestions(false);
                            navigate(
                              `/equipment?search=${encodeURIComponent(
                                searchQuery,
                              )}`,
                            );
                          }}
                          className="text-xs text-primary-600 font-medium hover:underline"
                        >
                          View all results for "{searchQuery}"
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
              aria-haspopup="menu"
              aria-expanded={showNotifications}
              aria-controls="notifications-menu"
              className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              <Bell className="w-6 h-6" aria-hidden="true" />
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
                <div
                  id="notifications-menu"
                  role="menu"
                  aria-label="Notifications"
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-20 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">
                      Notifications
                    </h3>
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-xs text-primary-600 font-medium cursor-pointer hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() => markAsRead(notification.id)}
                        className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 ${
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
                      </button>
                    ))}
                  </div>
                  <div className="px-4 py-3 bg-slate-50 text-center">
                    <button
                      type="button"
                      className="text-sm text-primary-600 font-medium cursor-pointer hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User menu */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="Open user menu"
              aria-haspopup="menu"
              aria-expanded={showUserMenu}
              aria-controls="user-menu"
              className="flex items-center gap-2 pl-3 border-l border-slate-200 hover:bg-slate-50 rounded-lg py-1 pr-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-slate-900">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {user?.role || "Admin"}
                </p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  showUserMenu ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {/* User dropdown menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div
                  id="user-menu"
                  role="menu"
                  aria-label="User menu"
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-20 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate("/settings");
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
                    >
                      <User
                        className="w-4 h-4 text-slate-400"
                        aria-hidden="true"
                      />
                      My Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate("/settings");
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
                    >
                      <Settings
                        className="w-4 h-4 text-slate-400"
                        aria-hidden="true"
                      />
                      Settings
                    </button>
                  </div>
                  <div className="border-t border-slate-100 py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                        navigate("/login");
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-danger-600 hover:bg-danger-50 flex items-center gap-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-danger-500"
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
