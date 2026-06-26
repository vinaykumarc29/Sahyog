import api from './axios.js';

/**
 * Search users by name or skill.
 * @param {string} q - Search query
 * @param {'users'|'skills'} type - Search mode
 */
export const searchApi = (q, type = 'users') =>
  api.get('/api/search', { params: { q, type } });
