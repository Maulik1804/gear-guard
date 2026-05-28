import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { usersApi, companiesApi } from "../services/api";
import {
  User,
  Building2,
  Bell,
  Shield,
  Save,
  ChevronRight,
  Loader2,
  Camera,
} from "lucide-react";
import toast from "react-hot-toast";

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingCompany, setSavingCompany] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    job_title: "",
    timezone: "America/New_York",
  });

  const [companyData, setCompanyData] = useState({
    _id: "",
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    email: "",
    website: "",
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

  // Helper to check if user ID is a valid MongoDB ObjectId
  const isValidObjectId = (id) => {
    return id && /^[a-fA-F0-9]{24}$/.test(String(id));
  };

  // Load avatar from localStorage on mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem("gearguard_avatar");
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []);

  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    // Convert to base64 and save
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setAvatar(base64);
      localStorage.setItem("gearguard_avatar", base64);

      // Update user context with avatar
      if (updateUser) {
        updateUser({ ...user, avatar: base64 });
      }

      toast.success("Avatar updated successfully");
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  // Load user and company data
  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;

      // If user ID is not a valid MongoDB ObjectId (demo mode), use local data
      if (!isValidObjectId(user.id)) {
        setProfileData({
          name: user.name || "",
          email: user.email || "",
          phone: "",
          job_title: "",
          timezone: "America/New_York",
        });
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Load user data
        const userRes = await usersApi.getById(user.id);
        const userData = userRes.data;

        setProfileData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          job_title: userData.job_title || "",
          timezone: userData.timezone || "America/New_York",
        });

        if (userData.notification_settings) {
          setNotificationSettings(userData.notification_settings);
        }

        setSecuritySettings((prev) => ({
          ...prev,
          two_factor: userData.two_factor_enabled || false,
          session_timeout: String(userData.session_timeout || 30),
        }));

        // Load company data if user has a company
        if (userData.company) {
          const companyId =
            typeof userData.company === "object"
              ? userData.company._id
              : userData.company;
          const companyRes = await companiesApi.getById(companyId);
          setCompanyData(companyRes.data);
        }
      } catch (error) {
        console.error("Failed to load settings data:", error);
        // Set default values from user context if API fails
        setProfileData({
          name: user.name || "",
          email: user.email || "",
          phone: "",
          job_title: "",
          timezone: "America/New_York",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "company", label: "Company", icon: Building2 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      // If valid MongoDB ObjectId, save to API
      if (isValidObjectId(user.id)) {
        await usersApi.update(user.id, {
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          job_title: profileData.job_title,
          timezone: profileData.timezone,
        });
      }

      // Update the auth context with new user data (works for both demo and real mode)
      if (updateUser) {
        updateUser({
          ...user,
          name: profileData.name,
          email: profileData.email,
        });
      }

      toast.success("Profile settings saved successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save profile settings"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveCompany = async () => {
    if (!companyData._id || !isValidObjectId(companyData._id)) {
      // Demo mode - just show success
      toast.success("Company settings saved successfully");
      return;
    }

    setSavingCompany(true);
    try {
      await companiesApi.update(companyData._id, {
        name: companyData.name,
        address: companyData.address,
        city: companyData.city,
        state: companyData.state,
        country: companyData.country,
        phone: companyData.phone,
        email: companyData.email,
        website: companyData.website,
      });
      toast.success("Company settings saved successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save company settings"
      );
    } finally {
      setSavingCompany(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSavingNotifications(true);
    try {
      if (isValidObjectId(user.id)) {
        await usersApi.update(user.id, {
          notification_settings: notificationSettings,
        });
      }
      toast.success("Notification settings saved successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save notification settings"
      );
    } finally {
      setSavingNotifications(false);
    }
  };

  const handleSaveSecurity = async () => {
    setSavingSecurity(true);
    try {
      if (isValidObjectId(user.id)) {
        await usersApi.update(user.id, {
          two_factor_enabled: securitySettings.two_factor,
          session_timeout: parseInt(securitySettings.session_timeout),
        });
      }
      toast.success("Security settings saved successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save security settings"
      );
    } finally {
      setSavingSecurity(false);
    }
  };

  const handleChangePassword = async () => {
    if (!securitySettings.current_password || !securitySettings.new_password) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (securitySettings.new_password !== securitySettings.confirm_password) {
      toast.error("New passwords do not match");
      return;
    }

    if (securitySettings.new_password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!isValidObjectId(user.id)) {
      toast.error("Password change is not available in demo mode");
      return;
    }

    setSavingSecurity(true);
    try {
      await usersApi.changePassword(user.id, {
        current_password: securitySettings.current_password,
        new_password: securitySettings.new_password,
      });
      toast.success("Password changed successfully");
      setSecuritySettings((prev) => ({
        ...prev,
        current_password: "",
        new_password: "",
        confirm_password: "",
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setSavingSecurity(false);
    }
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
        <div className="relative group">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-semibold">
              {profileData.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Camera className="w-6 h-6 text-white" />
          </button>
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary text-sm"
          >
            Change Avatar
          </button>
          <p className="text-xs text-slate-400 mt-2">
            JPG, PNG or GIF. Max 2MB.
          </p>
        </div>
      </div>

      <div>
        <label className="label">Full Name</label>
        <input
          type="text"
          value={profileData.name}
          onChange={(e) =>
            setProfileData({ ...profileData, name: e.target.value })
          }
          className="input"
        />
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
        <button
          onClick={handleSaveProfile}
          disabled={savingProfile}
          className="btn-primary"
        >
          {savingProfile ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {savingProfile ? "Saving..." : "Save Changes"}
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
        <button
          onClick={handleSaveCompany}
          disabled={savingCompany}
          className="btn-primary"
        >
          {savingCompany ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {savingCompany ? "Saving..." : "Save Changes"}
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
          onClick={handleSaveNotifications}
          disabled={savingNotifications}
          className="btn-primary"
        >
          {savingNotifications ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {savingNotifications ? "Saving..." : "Save Changes"}
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
          <button
            onClick={handleChangePassword}
            disabled={savingSecurity}
            className="btn-secondary"
          >
            {savingSecurity ? "Updating..." : "Update Password"}
          </button>
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
        <button
          onClick={handleSaveSecurity}
          disabled={savingSecurity}
          className="btn-primary"
        >
          {savingSecurity ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {savingSecurity ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      );
    }

    switch (activeTab) {
      case "profile":
        return renderProfileSettings();
      case "company":
        return renderCompanySettings();
      case "notifications":
        return renderNotificationSettings();
      case "security":
        return renderSecuritySettings();
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
