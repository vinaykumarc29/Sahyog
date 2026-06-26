import api from './axios.js';

// Auth
export const loginApi = (email, password) =>
  api.post('/api/auth/login', { email, password });

export const registerApi = (data) =>
  api.post('/api/auth/register', data);

export const getMeApi = () =>
  api.get('/api/auth/me');

// Users
export const getUsersApi = () =>
  api.get('/api/users');

export const getUserByIdApi = (id) =>
  api.get(`/api/users/${id}`);

export const getMatchesApi = () =>
  api.get('/api/users/matches');

export const updateProfileApi = (data) =>
  api.put('/api/users/profile', data);

export const sendConnectionRequestApi = (id) =>
  api.post(`/api/users/connect/${id}`);

export const acceptConnectionApi = (id) =>
  api.put(`/api/users/connect/${id}/accept`);

export const rejectConnectionApi = (id) =>
  api.put(`/api/users/connect/${id}/reject`);

export const removeConnectionApi = (id) =>
  api.delete(`/api/users/connect/${id}`);

