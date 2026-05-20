import api from './api';

export const employeeService = {
  list: (params) => api.get('/api/employees', { params }),
  getById: (id) => api.get(`/api/employees/${id}`),
  create: (data) => api.post('/api/employees', data),
  update: (id, data) => api.put(`/api/employees/${id}`, data),
  updateStatus: (id, status) => api.patch(`/api/employees/${id}/status`, { status }),
  getProfileSummary: (id) => api.get(`/api/employees/${id}/profile-summary`),
  getLeaveHistory: (id) => api.get(`/api/employees/${id}/leave-history`),
  getPayrollHistory: (id) => api.get(`/api/employees/${id}/payroll-history`),
  getPerformanceHistory: (id) => api.get(`/api/employees/${id}/performance-history`)
};