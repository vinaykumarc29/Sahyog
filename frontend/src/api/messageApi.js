import api from './axios.js';

export const getMessagesApi = (userId) =>
  api.get(`/api/messages/${userId}`);

export const sendMessageApi = (userId, content) =>
  api.post(`/api/messages/${userId}`, { content });

// Returns { count: number, lastMessageAt: string | null }
export const getUnreadCountApi = () =>
  api.get('/api/messages/unread-count');

export const getConversationsApi = () =>
  api.get('/api/messages/conversations');

