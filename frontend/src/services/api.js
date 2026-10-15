import axios from 'axios';

// Create dedicated axios client instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Normalizes API error objects into user-friendly strings.
 * @param {Error} error 
 * @returns {string}
 */
export const formatApiError = (error) => {
  if (error.response?.data) {
    const data = error.response.data;
    if (data.message) {
      if (data.errors) {
        const fieldErrors = Object.values(data.errors).join(', ');
        return `${data.message}: ${fieldErrors}`;
      }
      return data.message;
    }
  }
  if (error.message === 'Network Error') {
    return 'Cannot reach the backend server. Please verify the server is running on port 5000.';
  }
  return error.message || 'An unexpected error occurred';
};

// API Endpoints
export const employeeApi = {
  // Get all employees with pagination, search, and sorting
  getAll: async (params = {}) => {
    const response = await api.get('/employees', { params });
    return response.data;
  },

  // Get single employee by ID
  getById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  // Create a new employee
  create: async (data) => {
    const response = await api.post('/employees', data);
    return response.data;
  },

  // Update existing employee by ID
  update: async (id, data) => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  // Delete employee by ID
  delete: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  // Get employee dashboard statistics
  getStats: async () => {
    const response = await api.get('/employees/stats');
    return response.data;
  },

  // Health check
  health: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
