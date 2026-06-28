import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios.js';
import { useAuth } from './AuthContext.jsx';
import { normalizeUser, normalizeTeam } from '../api/mappers.js';
import { io } from 'socket.io-client';

const WorkspaceContext = createContext(null);

export const WorkspaceProvider = ({ children }) => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

 const loadWorkspaceData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
        setError('');
      }
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
      if (showLoading) setLoading(false);
    }
  }, [login]);

useEffect(() => {
  if (!user) return;

  loadWorkspaceData(true); // initial load

  const socket = io(import.meta.env.VITE_API_URL);
  socket.emit('joinRoom', String(user._id));

  // any of these fire → load() → all components update
socket.on('connectionRequest',  () => loadWorkspaceData(false));
socket.on('connectionAccepted', () => loadWorkspaceData(false));
socket.on('connectionRejected', () => loadWorkspaceData(false));
socket.on('teamUpdated',        () => loadWorkspaceData(false));
socket.on('receiveMessage', loadWorkspaceData);

  return () => socket.disconnect();
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
