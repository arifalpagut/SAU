import api from './api';

export const leaveService = {
  getLeaves: (params) => api.get('/leaves', { params }),
  getLeaveById: (id) => api.get(`/leaves/${id}`),
  createLeave: (data) => api.post('/leaves', data),
  updateLeave: (id, data) => api.put(`/leaves/${id}`, data),
  deleteLeave: (id) => api.delete(`/leaves/${id}`),
  approveLeave: (id, data = {}) => api.patch(`/leaves/${id}/approve`, data),
  rejectLeave: (id, data = {}) => api.patch(`/leaves/${id}/reject`, data),
  getLeaveSummary: (params) => api.get('/reports/leave-summary', { params }),
};

export default leaveService;
