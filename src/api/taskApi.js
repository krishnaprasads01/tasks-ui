import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth (if needed in the future)
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Task API functions
export const taskApi = {
  // Get all tasks
  getAllTasks: () => api.get('/tasks'),
  
  // Get task by ID
  getTaskById: (id) => api.get(`/tasks/${id}`),
  
  // Create new task
  createTask: (taskData) => api.post('/tasks', taskData),
  
  // Update task
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  
  // Delete task
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  
  // Get tasks by status
  getTasksByStatus: (status) => api.get(`/tasks/status/${status}`),
  
  // Search tasks
  searchTasks: (keyword) => api.get(`/tasks/search?keyword=${encodeURIComponent(keyword)}`),
};

export default api;
