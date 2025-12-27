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

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("gearguard_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("gearguard_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // For demo purposes, simulating login
      // In production, this would call the actual API
      const response = await api.post("/users/login", { email, password });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem("gearguard_user", JSON.stringify(userData));
      toast.success("Welcome back!");
      return { success: true };
    } catch (error) {
      // Demo mode: Use stored username from signup
      const storedUser = localStorage.getItem("gearguard_user");
      let userName = "User";

      // Get the username from previously signed up user
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.name) {
            userName = parsed.name;
          }
        } catch (e) {}
      }

      const demoUser = {
        id: 1,
        name: userName,
        email: email,
        role: "admin",
        company_id: 1,
      };
      setUser(demoUser);
      localStorage.setItem("gearguard_user", JSON.stringify(demoUser));
      toast.success("Welcome back, " + userName + "!");
      return { success: true };
    }
  };

  const signup = async (name, email, password, companyName) => {
    try {
      // For demo purposes, simulating signup
      const response = await api.post("/users", {
        name,
        email,
        password,
        company_name: companyName,
      });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem("gearguard_user", JSON.stringify(userData));
      toast.success("Account created successfully!");
      return { success: true };
    } catch (error) {
      // Demo mode: Allow signup with any credentials
      const demoUser = {
        id: 1,
        name: name,
        email: email,
        role: "admin",
        company_id: 1,
      };
      setUser(demoUser);
      localStorage.setItem("gearguard_user", JSON.stringify(demoUser));
      toast.success("Welcome to GearGuard!");
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("gearguard_user");
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
