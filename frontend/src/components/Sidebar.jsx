import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Wrench,
  ClipboardList,
  FileText,
  Users,
  Calendar,
  UserCircle,
  MapPin,
  Settings,
  LogOut,
  X,
  Cog,
  Columns,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Work Centers", href: "/work-centers", icon: Building2 },
  { name: "Equipment", href: "/equipment", icon: Cog },
  { name: "Tasks", href: "/tasks", icon: ClipboardList },
  { name: "Work Orders", href: "/work-orders", icon: FileText },
  { name: "Teams", href: "/teams", icon: Users },
  { name: "Kanban Board", href: "/maintenance-kanban", icon: Columns },
  { name: "Maintenance", href: "/maintenance-schedules", icon: Calendar },
  { name: "Employees", href: "/employees", icon: UserCircle },
  { name: "Locations", href: "/locations", icon: MapPin },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [avatar, setAvatar] = useState(null);

  // Load avatar from localStorage
  useEffect(() => {
    const savedAvatar = localStorage.getItem("gearguard_avatar");
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === "gearguard_avatar") {
        setAvatar(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        id="app-sidebar"
        className={`
        fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-slate-200 
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">GearGuard</h1>
                <p className="text-xs text-slate-500">Maintenance Tracker</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive =
                  location.pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    location.pathname.startsWith(item.href));

                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                      transition-all duration-200
                      ${
                        isActive
                          ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }
                    `}
                  >
                    <item.icon
                      className={`w-5 h-5 ${
                        isActive ? "text-white" : "text-slate-400"
                      }`}
                    />
                    {item.name}
                  </NavLink>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <NavLink
                to="/settings"
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${
                    location.pathname === "/settings"
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }
                `}
              >
                <Settings
                  className={`w-5 h-5 ${
                    location.pathname === "/settings"
                      ? "text-white"
                      : "text-slate-400"
                  }`}
                />
                Settings
              </NavLink>
            </div>
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
              <button
                type="button"
                onClick={logout}
                aria-label="Sign out"
                className="p-2 text-slate-400 hover:text-danger-500 hover:bg-danger-50 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500 focus-visible:ring-offset-2"
                title="Logout"
              >
                <LogOut className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
