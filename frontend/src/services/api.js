import axios from 'axios';

// Create base axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
};

// Employees API
export const employeesAPI = {
  getAll: (params) => api.get('/employees', { params }),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  getProfile: (id) => api.get(`/employees/${id}/profile`),
  updateProfile: (id, data) => api.put(`/employees/${id}/profile`, data),
};

// Attendance API
export const attendanceAPI = {
  getAll: (params) => api.get('/attendance', { params }),
  getById: (id) => api.get(`/attendance/${id}`),
  create: (data) => api.post('/attendance', data),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  delete: (id) => api.delete(`/attendance/${id}`),
  checkIn: (data) => api.post('/attendance/check-in', data),
  checkOut: (id) => api.post(`/attendance/${id}/check-out`),
  getMyAttendance: (params) => api.get('/attendance/my', { params }),
  getReport: (params) => api.get('/attendance/report', { params }),
};

// Leave API
export const leaveAPI = {
  getAll: (params) => api.get('/leave', { params }),
  getById: (id) => api.get(`/leave/${id}`),
  create: (data) => api.post('/leave', data),
  update: (id, data) => api.put(`/leave/${id}`, data),
  delete: (id) => api.delete(`/leave/${id}`),
  approve: (id) => api.put(`/leave/${id}/approve`),
  reject: (id, reason) => api.put(`/leave/${id}/reject`, { reason }),
  getMyLeaves: (params) => api.get('/leave/my', { params }),
  getBalance: () => api.get('/leave/balance'),
};

// Payroll API
export const payrollAPI = {
  getAll: (params) => api.get('/payroll', { params }),
  getById: (id) => api.get(`/payroll/${id}`),
  create: (data) => api.post('/payroll', data),
  update: (id, data) => api.put(`/payroll/${id}`, data),
  delete: (id) => api.delete(`/payroll/${id}`),
  generatePayslip: (id) => api.get(`/payroll/${id}/payslip`),
  getMyPayslips: (params) => api.get('/payroll/my', { params }),
  getSalaryStructure: (id) => api.get(`/payroll/salary-structure/${id}`),
  updateSalaryStructure: (id, data) => api.put(`/payroll/salary-structure/${id}`, data),
};

// Performance API
export const performanceAPI = {
  getAll: (params) => api.get('/performance', { params }),
  getById: (id) => api.get(`/performance/${id}`),
  create: (data) => api.post('/performance', data),
  update: (id, data) => api.put(`/performance/${id}`, data),
  delete: (id) => api.delete(`/performance/${id}`),
  getMyReviews: (params) => api.get('/performance/my', { params }),
  submitReview: (id, data) => api.post(`/performance/${id}/review`, data),
  getGoals: (employeeId) => api.get(`/performance/goals/${employeeId}`),
  updateGoals: (employeeId, data) => api.put(`/performance/goals/${employeeId}`, data),
};

// Training API
export const trainingAPI = {
  getAll: (params) => api.get('/training', { params }),
  getById: (id) => api.get(`/training/${id}`),
  create: (data) => api.post('/training', data),
  update: (id, data) => api.put(`/training/${id}`, data),
  delete: (id) => api.delete(`/training/${id}`),
  enroll: (id) => api.post(`/training/${id}/enroll`),
  unenroll: (id) => api.post(`/training/${id}/unenroll`),
  getMyTrainings: (params) => api.get('/training/my', { params }),
  getMaterials: (id) => api.get(`/training/${id}/materials`),
  submitAssignment: (id, data) => api.post(`/training/${id}/assignment`, data),
  getProgress: (id) => api.get(`/training/${id}/progress`),
};

export default api;
