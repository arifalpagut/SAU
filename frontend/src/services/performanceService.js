import api from "./api";

export const getPerformanceReviews = (params) => api.get("/performance", { params });
export const getPerformanceReview = (id) => api.get(`/performance/${id}`);
export const createPerformanceReview = (data) => api.post("/performance", data);
export const updatePerformanceReview = (id, data) => api.put(`/performance/${id}`, data);
