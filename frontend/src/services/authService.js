import api from './api';

export const authService = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  refresh: (refreshToken) => api.post('/api/auth/refresh', { refreshToken }),
  logout: (refreshToken) => api.post('/api/auth/logout', { refreshToken }),
  changePassword: (currentPassword, newPassword) => api.post('/api/auth/change-password', { currentPassword, newPassword })
};
