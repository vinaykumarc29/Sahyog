import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios.js';
import { useAuth } from './AuthContext.jsx';
import { normalizeUser, normalizeTeam } from '../api/mappers.js';

const WorkspaceContext = createContext(null);

export const WorkspaceProvider = ({ children }) => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const loadWorkspaceData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [meRes, usersRes, teamsRes] = await Promise.all([
        api.get('/api/auth/me'),
        api.get('/api/users'),
        api.get('/api/teams'),
      ]);
      const normalizedCurrentUser = normalizeUser(meRes.data);
      login(localStorage.getItem('token'), normalizedCurrentUser);
      setCurrentUser(normalizedCurrentUser);
      setUsers(usersRes.data.map(normalizeUser));
      setTeams(teamsRes.data.map(normalizeTeam));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load data from the backend.');
    } finally {
      setLoading(false);
    }
  }, [login]);

  useEffect(() => {
    if (user) loadWorkspaceData();
  }, [user?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WorkspaceContext.Provider
      value={{ loading, error, users, teams, currentUser, reloadWorkspace: loadWorkspaceData }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);
