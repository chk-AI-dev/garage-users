import api from './api';

// Auth APIs
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data)
};

// User APIs
export const userApi = {
  getAllUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  updateUserStatus: (id, status) => api.put(`/users/${id}/status`, { status })
};

// Profile APIs
export const profileApi = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  uploadProfileImage: (formData) => 
    api.post('/profile/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  changePassword: (data) => api.put('/profile/change-password', data)
};

// Dashboard APIs
export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
  getUserStats: () => api.get('/dashboard/user-stats')
};
