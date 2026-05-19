import api from './api';

export const payrollService = {
  run: (month, year) => api.post('/api/payroll/run', { month, year }),
  list: (params) => api.get('/api/payroll', { params }),
  getById: (id) => api.get(`/api/payroll/${id}`),
  getMyPayrolls: () => api.get('/api/payroll/my'),
  approve: (id) => api.patch(`/api/payroll/${id}/approve`),
  getCostReport: (params) => api.get('/api/payroll/reports/cost', { params })
};
