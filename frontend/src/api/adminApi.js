import axios from 'axios';

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Stats
export const getStatsApi = () => adminApi.get('/api/admin/stats');

// Users
export const getAdminUsersApi = () => adminApi.get('/api/admin/users');
export const getUserByIdApi = (id) => adminApi.get(`/api/admin/users/${id}`);
export const suspendUserApi = (id) => adminApi.put(`/api/admin/users/${id}/suspend`);
export const activateUserApi = (id) => adminApi.put(`/api/admin/users/${id}/activate`);
export const deleteUserApi = (id) => adminApi.delete(`/api/admin/users/${id}`);
export const editUserApi = (id, data) => adminApi.put(`/api/admin/users/${id}/edit`, data);

// Teams
export const getAdminTeamsApi = () => adminApi.get('/api/admin/teams');
export const getAdminTeamByIdApi = (id) => adminApi.get(`/api/admin/teams/${id}`);
export const deleteTeamAdminApi = (id) => adminApi.delete(`/api/admin/teams/${id}`);
export const removeMemberAdminApi = (teamId, userId) => adminApi.delete(`/api/admin/teams/${teamId}/members/${userId}`);
export const closeTeamApi = (id) => adminApi.put(`/api/admin/teams/${id}/close`);

// Skills
export const getSkillStatsApi = () => adminApi.get('/api/admin/skills');

// Search
export const adminSearchApi = (q) => adminApi.get(`/api/admin/skills/search?q=${encodeURIComponent(q)}`);

export default adminApi;