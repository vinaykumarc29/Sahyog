import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios.js';
import { normalizeUser } from '../api/mappers.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/api/auth/me')
        .then(res => setUser(normalizeUser(res.data)))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(normalizeUser(userData));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Refresh user data from server (e.g. after profile edit)
  const refreshUser = async () => {
    try {
      const res = await api.get('/api/auth/me');
      setUser(normalizeUser(res.data));
    } catch {
      // ignore
    }
  };

  // Update local user state after an edit without a full refetch
  const updateUser = (userData) => {
    setUser(normalizeUser(userData));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refreshUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);