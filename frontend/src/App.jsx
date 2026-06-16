import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const WorkCenters = lazy(() => import("./pages/WorkCenters"));
const Equipment = lazy(() => import("./pages/Equipment"));
const EquipmentDetails = lazy(() => import("./pages/EquipmentDetails"));
const Tasks = lazy(() => import("./pages/Tasks"));
const WorkOrders = lazy(() => import("./pages/WorkOrders"));
const Teams = lazy(() => import("./pages/Teams"));
const MaintenanceSchedules = lazy(() => import("./pages/MaintenanceSchedules"));
const MaintenanceKanban = lazy(() => import("./pages/MaintenanceKanban"));
const Employees = lazy(() => import("./pages/Employees"));
const Locations = lazy(() => import("./pages/Locations"));
const Settings = lazy(() => import("./pages/Settings"));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1e293b",
                color: "#fff",
                borderRadius: "10px",
              },
              success: {
                iconTheme: {
                  primary: "#22c55e",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                  <p className="text-slate-600 font-medium">Loading...</p>
                </div>
              </div>
            }
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="work-centers" element={<WorkCenters />} />
                <Route path="equipment" element={<Equipment />} />
                <Route path="equipment/:id" element={<EquipmentDetails />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="work-orders" element={<WorkOrders />} />
                <Route path="teams" element={<Teams />} />
                <Route
                  path="maintenance-schedules"
                  element={<MaintenanceSchedules />}
                />
                <Route
                  path="maintenance-kanban"
                  element={<MaintenanceKanban />}
                />
                <Route path="employees" element={<Employees />} />
                <Route path="locations" element={<Locations />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
