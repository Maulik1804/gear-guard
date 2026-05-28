import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistUser = (nextUser) => {
    const storageUser = {
      id: nextUser.id,
      name: nextUser.name,
      email: nextUser.email,
      role: nextUser.role,
      company_id: nextUser.company_id,
      company: nextUser.company,
    };

    setUser(storageUser);
    localStorage.setItem("gearguard_user", JSON.stringify(storageUser));
  };

  const normalizeUser = (data) => {
    const userData = data.user || data;

    return {
      ...userData,
      id: userData.id || userData._id,
      company_id:
        userData.company_id ||
        userData.company?._id ||
        userData.company ||
        userData.companyId,
    };
  };

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("gearguard_user");
    if (storedUser) {
      try {
        setUser(normalizeUser(JSON.parse(storedUser)));
      } catch (e) {
        localStorage.removeItem("gearguard_user");
        localStorage.removeItem("gearguard_token");
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener("gearguard:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("gearguard:unauthorized", handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/users/login", { email, password });
      const userData = normalizeUser(response.data);
      persistUser(userData);
      if (response.data.token) {
        localStorage.setItem("gearguard_token", response.data.token);
      }
      toast.success("Welcome back!");
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Invalid email or password";
      toast.error(message);
      throw new Error(message);
    }
  };

  const signup = async (name, email, password, companyName) => {
    try {
      const response = await api.post("/users/register", {
        name,
        email,
        password,
        companyName,
      });
      const userData = normalizeUser(response.data);
      persistUser(userData);
      if (response.data.token) {
        localStorage.setItem("gearguard_token", response.data.token);
      }
      toast.success("Account created successfully!");
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("gearguard_user");
    localStorage.removeItem("gearguard_token");
    toast.success("Logged out successfully");
  };

  const updateUser = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    persistUser(newUserData);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
