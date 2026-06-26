import api from './axios.js';

export const getMessagesApi = (userId) =>
  api.get(`/api/messages/${userId}`);

export const sendMessageApi = (userId, content) =>
  api.post(`/api/messages/${userId}`, { content });
