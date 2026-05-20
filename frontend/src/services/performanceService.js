import api from './api';

export const performanceService = {
  getPeriods: (params) => api.get('/performance/periods', { params }),
  getPeriodById: (id) => api.get(`/performance/periods/${id}`),
  createPeriod: (data) => api.post('/performance/periods', data),
  updatePeriod: (id, data) => api.put(`/performance/periods/${id}`, data),
  deletePeriod: (id) => api.delete(`/performance/periods/${id}`),

  getGoals: (params) => api.get('/performance/goals', { params }),
  getGoalById: (id) => api.get(`/performance/goals/${id}`),
  createGoal: (data) => api.post('/performance/goals', data),
  updateGoal: (id, data) => api.put(`/performance/goals/${id}`, data),
  deleteGoal: (id) => api.delete(`/performance/goals/${id}`),

  getReviews: (params) => api.get('/performance/reviews', { params }),
  getReviewById: (id) => api.get(`/performance/reviews/${id}`),
  createReview: (data) => api.post('/performance/reviews', data),
  updateReview: (id, data) => api.put(`/performance/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/performance/reviews/${id}`),
};

export default performanceService;
