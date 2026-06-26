import { useState, useEffect, useCallback } from 'react';
import { getMatchesApi } from '../api/userApi.js';
import { normalizeUser } from '../api/mappers.js';

/**
 * Fetches skill matches from the server-side matching algorithm.
 * Returns an array of { user, score } objects sorted by score desc.
 */
export const useMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getMatchesApi();
      // Backend returns [{ user, score }]
      const normalized = res.data.map(item => ({
        user: normalizeUser(item.user),
        score: item.score,
      }));
      setMatches(normalized);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return { matches, loading, error, refetch: fetchMatches };
};
