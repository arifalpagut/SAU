import api from "./api";

export const getLeaves = (params) => api.get("/leaves", { params });
export const getLeave = (id) => api.get(`/leaves/${id}`);
export const createLeave = (data) => api.post("/leaves", data);
export const updateLeave = (id, data) => api.patch(`/leaves/${id}`, data);
