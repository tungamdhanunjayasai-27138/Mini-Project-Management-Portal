import axios from "axios";

const TOKEN_KEY = "task_portal_token";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const setAuthToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const hasAuthToken = () => Boolean(localStorage.getItem(TOKEN_KEY));

export const isUnauthorizedError = (error) => error?.response?.status === 401;

export const registerUser = async (payload) => {
  const response = await api.post("/auth/register", payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await api.post("/auth/login", payload);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const getTasks = async (params = {}) => {
  const response = await api.get("/tasks", { params });
  return response.data;
};

export const createTask = async (payload) => {
  const response = await api.post("/tasks", payload);
  return response.data;
};

export const updateTask = async (id, payload) => {
  const response = await api.put(`/tasks/${id}`, payload);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export const getTaskStats = async () => {
  const response = await api.get("/tasks/stats");
  return response.data;
};
