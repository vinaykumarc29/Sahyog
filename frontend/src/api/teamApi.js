import api from './axios.js';

export const getTeamsApi = () =>
  api.get('/api/teams');

export const getTeamByIdApi = (id) =>
  api.get(`/api/teams/${id}`);

export const createTeamApi = (data) =>
  api.post('/api/teams', data);

export const applyToTeamApi = (teamId, message) =>
  api.post(`/api/teams/${teamId}/apply`, { message });

export const approveApplicantApi = (teamId, userId) =>
  api.put(`/api/teams/${teamId}/approve/${userId}`);
