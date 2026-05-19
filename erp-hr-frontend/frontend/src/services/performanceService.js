import api from './api';

export const performanceService = {
  listPeriods: () => api.get('/api/performance/periods'),
  createPeriod: (data) => api.post('/api/performance/periods', data),
  updatePeriod: (id, data) => api.patch(`/api/performance/periods/${id}`, data),
  listGoals: (params) => api.get('/api/performance/goals', { params }),
  createGoal: (data) => api.post('/api/performance/goals', data),
  updateGoal: (id, data) => api.put(`/api/performance/goals/${id}`, data),
  selfScore: (id, selfScore) => api.patch(`/api/performance/goals/${id}/self-score`, { selfScore }),
  managerScore: (id, managerScore) => api.patch(`/api/performance/goals/${id}/manager-score`, { managerScore }),
  listEvaluations: (params) => api.get('/api/performance/evaluations', { params }),
  getReports: () => api.get('/api/performance/reports')
};
