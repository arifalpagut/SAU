import api from './api';
export const payrollService = {
  calculate: (data) => api.post('/api/payroll/calculate', data),
  generate: (data) => api.post('/api/payroll/generate', data),
  run: (month, year) => api.post('/api/payroll/run', { month, year }),
  list: (params) => api.get('/api/payroll', { params }),
  getById: (id) => api.get(`/api/payroll/${id}`),
  getByEmployee: (eid) => api.get(`/api/payroll/employee/${eid}`),
  getByPeriod: (y, m) => api.get(`/api/payroll/period/${y}/${m}`),
  getMyPayrolls: () => api.get('/api/payroll/my'),
  approve: (id) => api.put(`/api/payroll/${id}/approve`),
  cancel: (id) => api.put(`/api/payroll/${id}/cancel`),
  getCostReport: (params) => api.get('/api/payroll/reports/cost', { params }),
  getParameters: (year) => api.get('/api/payroll/parameters', { params: { year } })
};