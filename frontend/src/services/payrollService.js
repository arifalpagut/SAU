import api from './api';

export const payrollService = {
  getAll: (params) => api.get('/payroll', { params }),
  getById: (id) => api.get(`/payroll/${id}`),
  calculate: (data) => api.post('/payroll/calculate', data),
  run: (data) => api.post('/payroll/run', data),
  update: (id, data) => api.put(`/payroll/${id}`, data),
  remove: (id) => api.delete(`/payroll/${id}`),
  exportBulk: (params) => api.get('/payroll/export/bulk', { params, responseType: 'blob' }),
  getReport: (params) => api.get('/reports/payroll', { params }),
};

export default payrollService;
