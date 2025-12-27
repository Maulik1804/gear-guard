import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Building2,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || "Demo",
    last_name: user?.last_name || "User",
    email: user?.email || "demo@gearguard.com",
    phone: user?.phone || "",
    job_title: user?.job_title || "Administrator",
    timezone: "America/New_York",
  });

  const [companyData, setCompanyData] = useState({
    name: user?.company_name || "Demo Company",
    address: "123 Industrial Way",
    city: "Detroit",
    state: "MI",
    country: "USA",
    phone: "555-0000",
    email: "info@company.com",
    website: "www.company.com",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_work_orders: true,
    email_tasks: true,
    email_maintenance: true,
    email_reports: false,
    push_work_orders: true,
    push_tasks: true,
    push_maintenance: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
    two_factor: false,
    session_timeout: "30",
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    sidebar_collapsed: false,
    compact_mode: false,
    date_format: "MM/DD/YYYY",
    time_format: "12h",
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "company", label: "Company", icon: Building2 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  const handleSave = (section) => {
    toast.success(`${section} settings saved successfully`);
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Profile Information
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Update your personal information
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-semibold">
          {profileData.first_name[0]}
          {profileData.last_name[0]}
        </div>
        <div>
          <button className="btn-secondary text-sm">Change Avatar</button>
          <p className="text-xs text-slate-400 mt-2">
            JPG, PNG or GIF. Max 2MB.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="label">First Name</label>
          <input
            type="text"
            value={profileData.first_name}
            onChange={(e) =>
              setProfileData({ ...profileData, first_name: e.target.value })
            }
            className="input"
          />
        </div>
        <div>
          <label className="label">Last Name</label>
          <input
            type="text"
            value={profileData.last_name}
            onChange={(e) =>
              setProfileData({ ...profileData, last_name: e.target.value })
            }
            className="input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) =>
              setProfileData({ ...profileData, email: e.target.value })
            }
            className="input"
          />
        </div>
        <div>
          <label className="label">Phone</label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) =>
              setProfileData({ ...profileData, phone: e.target.value })
            }
            className="input"
            placeholder="555-0100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="label">Job Title</label>
          <input
            type="text"
            value={profileData.job_title}
            onChange={(e) =>
              setProfileData({ ...profileData, job_title: e.target.value })
            }
            className="input"
          />
        </div>
        <div>
          <label className="label">Timezone</label>
          <select
            value={profileData.timezone}
            onChange={(e) =>
              setProfileData({ ...profileData, timezone: e.target.value })
            }
            className="select"
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <button onClick={() => handleSave("Profile")} className="btn-primary">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderCompanySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Company Information
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Manage your company details
        </p>
      </div>

      <div>
        <label className="label">Company Name</label>
        <input
          type="text"
          value={companyData.name}
          onChange={(e) =>
            setCompanyData({ ...companyData, name: e.target.value })
          }
          className="input"
        />
      </div>

      <div>
        <label className="label">Address</label>
        <input
          type="text"
          value={companyData.address}
          onChange={(e) =>
            setCompanyData({ ...companyData, address: e.target.value })
          }
          className="input"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <div>
          <label className="label">City</label>
          <input
            type="text"
            value={companyData.city}
            onChange={(e) =>
              setCompanyData({ ...companyData, city: e.target.value })
            }
            className="input"
          />
        </div>
        <div>
          <label className="label">State</label>
          <input
            type="text"
            value={companyData.state}
            onChange={(e) =>
              setCompanyData({ ...companyData, state: e.target.value })
            }
            className="input"
          />
        </div>
        <div>
          <label className="label">Country</label>
          <input
            type="text"
            value={companyData.country}
            onChange={(e) =>
              setCompanyData({ ...companyData, country: e.target.value })
            }
            className="input"
          />
        </div>
        <div>
          <label className="label">Phone</label>
          <input
            type="tel"
            value={companyData.phone}
            onChange={(e) =>
              setCompanyData({ ...companyData, phone: e.target.value })
            }
            className="input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            value={companyData.email}
            onChange={(e) =>
              setCompanyData({ ...companyData, email: e.target.value })
            }
            className="input"
          />
        </div>
        <div>
          <label className="label">Website</label>
          <input
            type="text"
            value={companyData.website}
            onChange={(e) =>
              setCompanyData({ ...companyData, website: e.target.value })
            }
            className="input"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <button onClick={() => handleSave("Company")} className="btn-primary">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Notification Preferences
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Configure how you receive notifications
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-slate-900 mb-4">
            Email Notifications
          </h4>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-700">Work Order Updates</p>
                <p className="text-sm text-slate-500">
                  Receive emails about work order status changes
                </p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.email_work_orders}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    email_work_orders: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-700">Task Assignments</p>
                <p className="text-sm text-slate-500">
                  Receive emails when tasks are assigned to you
                </p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.email_tasks}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    email_tasks: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-700">
                  Maintenance Reminders
                </p>
                <p className="text-sm text-slate-500">
                  Receive reminders for scheduled maintenance
                </p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.email_maintenance}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    email_maintenance: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-700">Weekly Reports</p>
                <p className="text-sm text-slate-500">
                  Receive weekly summary reports
                </p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.email_reports}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    email_reports: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h4 className="font-medium text-slate-900 mb-4">
            Push Notifications
          </h4>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-700">Work Order Alerts</p>
                <p className="text-sm text-slate-500">
                  Receive push notifications for urgent work orders
                </p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.push_work_orders}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    push_work_orders: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-700">Task Reminders</p>
                <p className="text-sm text-slate-500">
                  Get reminded about upcoming tasks
                </p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.push_tasks}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    push_tasks: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-700">Maintenance Alerts</p>
                <p className="text-sm text-slate-500">
                  Receive alerts for overdue maintenance
                </p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.push_maintenance}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    push_maintenance: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <button
          onClick={() => handleSave("Notification")}
          className="btn-primary"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Security Settings
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account security
        </p>
      </div>

      <div className="p-4 bg-slate-50 rounded-xl">
        <h4 className="font-medium text-slate-900 mb-4">Change Password</h4>
        <div className="space-y-4">
          <div>
            <label className="label">Current Password</label>
            <input
              type="password"
              value={securitySettings.current_password}
              onChange={(e) =>
                setSecuritySettings({
                  ...securitySettings,
                  current_password: e.target.value,
                })
              }
              className="input"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="label">New Password</label>
            <input
              type="password"
              value={securitySettings.new_password}
              onChange={(e) =>
                setSecuritySettings({
                  ...securitySettings,
                  new_password: e.target.value,
                })
              }
              className="input"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <input
              type="password"
              value={securitySettings.confirm_password}
              onChange={(e) =>
                setSecuritySettings({
                  ...securitySettings,
                  confirm_password: e.target.value,
                })
              }
              className="input"
              placeholder="••••••••"
            />
          </div>
          <button className="btn-secondary">Update Password</button>
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
          <div>
            <p className="font-medium text-slate-700">
              Two-Factor Authentication
            </p>
            <p className="text-sm text-slate-500">
              Add an extra layer of security to your account
            </p>
          </div>
          <input
            type="checkbox"
            checked={securitySettings.two_factor}
            onChange={(e) =>
              setSecuritySettings({
                ...securitySettings,
                two_factor: e.target.checked,
              })
            }
            className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />
        </label>

        <div className="p-4 bg-slate-50 rounded-xl">
          <label className="label">Session Timeout (minutes)</label>
          <select
            value={securitySettings.session_timeout}
            onChange={(e) =>
              setSecuritySettings({
                ...securitySettings,
                session_timeout: e.target.value,
              })
            }
            className="select max-w-xs"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            <option value="480">8 hours</option>
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <button onClick={() => handleSave("Security")} className="btn-primary">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Appearance</h3>
        <p className="text-sm text-slate-500 mt-1">
          Customize how the application looks
        </p>
      </div>

      <div>
        <label className="label">Theme</label>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {["light", "dark", "system"].map((theme) => (
            <button
              key={theme}
              onClick={() =>
                setAppearanceSettings({ ...appearanceSettings, theme })
              }
              className={`p-4 rounded-xl border-2 transition-all ${
                appearanceSettings.theme === theme
                  ? "border-primary-500 bg-primary-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div
                className={`w-full h-12 rounded-lg mb-3 ${
                  theme === "light"
                    ? "bg-white border border-slate-200"
                    : theme === "dark"
                    ? "bg-slate-800"
                    : "bg-gradient-to-r from-white to-slate-800"
                }`}
              />
              <p className="text-sm font-medium text-slate-700 capitalize">
                {theme}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-700">Compact Mode</p>
            <p className="text-sm text-slate-500">Reduce padding and spacing</p>
          </div>
          <input
            type="checkbox"
            checked={appearanceSettings.compact_mode}
            onChange={(e) =>
              setAppearanceSettings({
                ...appearanceSettings,
                compact_mode: e.target.checked,
              })
            }
            className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />
        </label>

        <label className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-700">Collapse Sidebar</p>
            <p className="text-sm text-slate-500">
              Show only icons in the sidebar
            </p>
          </div>
          <input
            type="checkbox"
            checked={appearanceSettings.sidebar_collapsed}
            onChange={(e) =>
              setAppearanceSettings({
                ...appearanceSettings,
                sidebar_collapsed: e.target.checked,
              })
            }
            className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="label">Date Format</label>
          <select
            value={appearanceSettings.date_format}
            onChange={(e) =>
              setAppearanceSettings({
                ...appearanceSettings,
                date_format: e.target.value,
              })
            }
            className="select"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        <div>
          <label className="label">Time Format</label>
          <select
            value={appearanceSettings.time_format}
            onChange={(e) =>
              setAppearanceSettings({
                ...appearanceSettings,
                time_format: e.target.value,
              })
            }
            className="select"
          >
            <option value="12h">12 Hour (AM/PM)</option>
            <option value="24h">24 Hour</option>
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <button
          onClick={() => handleSave("Appearance")}
          className="btn-primary"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileSettings();
      case "company":
        return renderCompanySettings();
      case "notifications":
        return renderNotificationSettings();
      case "security":
        return renderSecuritySettings();
      case "appearance":
        return renderAppearanceSettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">
          Manage your account and application preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="card p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary-50 text-primary-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 ${
                        activeTab === tab.id
                          ? "text-primary-600"
                          : "text-slate-400"
                      }`}
                    />
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="card p-6">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
