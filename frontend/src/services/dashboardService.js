import api from './api';

export const dashboardService = {
  getSummary: () => api.get('/api/dashboard/summary'),
  getDepartmentDistribution: () => api.get('/api/dashboard/department-distribution'),
  getEmployeeStatusDistribution: () => api.get('/api/dashboard/employee-status'),
  getLeaveStats: () => api.get('/api/dashboard/leave-stats'),
  getPayrollTrend: () => api.get('/api/dashboard/payroll-trend'),
  getPerformanceDistribution: () => api.get('/api/dashboard/performance-distribution'),
  getRecentActivities: () => api.get('/api/dashboard/recent-activities'),
  getPayrollStats: () => api.get('/api/dashboard/payroll-stats'),
  getPerformanceStats: () => api.get('/api/dashboard/performance-stats')
};