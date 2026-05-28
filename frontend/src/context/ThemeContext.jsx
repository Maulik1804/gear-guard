import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get saved theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem("gearguard_theme");
    // Always return 'light' if no valid theme is saved
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }
    return "light";
  });

  const [compactMode, setCompactMode] = useState(() => {
    const saved = localStorage.getItem("gearguard_compact_mode");
    return saved === "true";
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("gearguard_sidebar_collapsed");
    return saved === "true";
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    // Always remove both classes first
    root.classList.remove("light", "dark");

    // Only add 'dark' class if dark mode, otherwise don't add any class (light is default)
    if (theme === "dark") {
      root.classList.add("dark");
    }

    // Save to localStorage
    localStorage.setItem("gearguard_theme", theme);
  }, [theme]);

  // Apply compact mode
  useEffect(() => {
    const root = document.documentElement;
    if (compactMode) {
      root.classList.add("compact");
    } else {
      root.classList.remove("compact");
    }
    localStorage.setItem("gearguard_compact_mode", compactMode.toString());
  }, [compactMode]);

  // Save sidebar state
  useEffect(() => {
    localStorage.setItem(
      "gearguard_sidebar_collapsed",
      sidebarCollapsed.toString()
    );
  }, [sidebarCollapsed]);

  const value = {
    theme,
    setTheme,
    compactMode,
    setCompactMode,
    sidebarCollapsed,
    setSidebarCollapsed,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeContext;
