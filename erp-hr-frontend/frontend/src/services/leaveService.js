import api from './api';

export const leaveService = {
  list: (params) => api.get('/api/leaves', { params }),
  create: (data) => api.post('/api/leaves', data),
  approve: (id) => api.patch(`/api/leaves/${id}/approve`),
  reject: (id, rejectionReason) => api.patch(`/api/leaves/${id}/reject`, { rejectionReason }),
  cancel: (id) => api.patch(`/api/leaves/${id}/cancel`),
  getTypes: () => api.get('/api/leaves/leave-types/all'),
  getBalance: (employeeId) => api.get(`/api/leaves/balances/${employeeId || ''}`),
  getCalendar: () => api.get('/api/leaves/calendar/all'),
  createType: (data) => api.post('/api/leaves/leave-types', data)
};
