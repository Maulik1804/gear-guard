import axios from "axios";

const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("gearguard_user");
    if (user) {
      const userData = JSON.parse(user);
      // Add user info to headers if needed
      config.headers["X-User-ID"] = userData.id;
      config.headers["X-Company-ID"] = userData.company_id;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("gearguard_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API functions for each entity
export const workCentersApi = {
  getAll: () => api.get("/work-centers"),
  getById: (id) => api.get(`/work-centers/${id}`),
  create: (data) => api.post("/work-centers", data),
  update: (id, data) => api.put(`/work-centers/${id}`, data),
  delete: (id) => api.delete(`/work-centers/${id}`),
};

export const equipmentApi = {
  getAll: () => api.get("/equipment"),
  getById: (id) => api.get(`/equipment/${id}`),
  create: (data) => api.post("/equipment", data),
  update: (id, data) => api.put(`/equipment/${id}`, data),
  delete: (id) => api.delete(`/equipment/${id}`),
  getCategories: () => api.get("/equipment/categories"),
  createCategory: (data) => api.post("/equipment/categories", data),
};

export const tasksApi = {
  getAll: () => api.get("/tasks"),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post("/tasks", data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  getTypes: () => api.get("/tasks/types"),
};

export const workOrdersApi = {
  getAll: () => api.get("/work-orders"),
  getById: (id) => api.get(`/work-orders/${id}`),
  create: (data) => api.post("/work-orders", data),
  update: (id, data) => api.put(`/work-orders/${id}`, data),
  delete: (id) => api.delete(`/work-orders/${id}`),
};

export const teamsApi = {
  getAll: () => api.get("/teams"),
  getById: (id) => api.get(`/teams/${id}`),
  create: (data) => api.post("/teams", data),
  update: (id, data) => api.put(`/teams/${id}`, data),
  delete: (id) => api.delete(`/teams/${id}`),
  addMember: (teamId, employeeId) =>
    api.post(`/teams/${teamId}/members`, { employee_id: employeeId }),
  removeMember: (teamId, memberId) =>
    api.delete(`/teams/${teamId}/members/${memberId}`),
};

export const employeesApi = {
  getAll: () => api.get("/employees"),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post("/employees", data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
};

export const locationsApi = {
  getAll: () => api.get("/locations"),
  getById: (id) => api.get(`/locations/${id}`),
  create: (data) => api.post("/locations", data),
  update: (id, data) => api.put(`/locations/${id}`, data),
  delete: (id) => api.delete(`/locations/${id}`),
};

export const maintenanceSchedulesApi = {
  getAll: () => api.get("/maintenance-schedules"),
  getById: (id) => api.get(`/maintenance-schedules/${id}`),
  create: (data) => api.post("/maintenance-schedules", data),
  update: (id, data) => api.put(`/maintenance-schedules/${id}`, data),
  delete: (id) => api.delete(`/maintenance-schedules/${id}`),
  getByDateRange: (startDate, endDate) =>
    api.get(`/maintenance-schedules/range?start=${startDate}&end=${endDate}`),
};

export default api;
