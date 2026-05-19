import api from './api';

export const dashboardService = {
  getSummary: () => api.get('/api/dashboard/summary'),
  getLeaveStats: () => api.get('/api/dashboard/leave-stats'),
  getPayrollStats: () => api.get('/api/dashboard/payroll-stats'),
  getPerformanceStats: () => api.get('/api/dashboard/performance-stats')
};
