import { useState, useEffect, useCallback } from 'react';
import { getTeamByIdApi } from '../api/teamApi.js';
import { normalizeTeam } from '../api/mappers.js';

/**
 * Fetches a single team by ID directly from the API.
 * Avoids the bug where full teams disappear from the list endpoint.
 */
export const useTeam = (teamId) => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTeam = useCallback(async () => {
    if (!teamId) return;
    setLoading(true);
    setError('');
    try {
      const res = await getTeamByIdApi(teamId);
      setTeam(normalizeTeam(res.data));
    } catch (err) {
      setError(err.response?.data?.message || 'Team not found');
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  return { team, loading, error, refetch: fetchTeam };
};
