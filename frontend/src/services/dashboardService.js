import api from './api';

export const dashboardService = {
  getSummary: () => api.get('/dashboard/summary'),
  getStats: () => api.get('/dashboard/stats'),
  getRecentActivities: () => api.get('/dashboard/recent-activities'),
};

export default dashboardService;
