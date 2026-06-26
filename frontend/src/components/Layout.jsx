import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Header } from './Header.jsx';

/**
 * Layout wraps all authenticated pages with the sticky Header.
 * Receives currentUser, allUsers, allTeams, and notifications to pass into Header.
 */
export const Layout = ({ children, currentUser, allUsers = [], allTeams = [], notifications = [] }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearchSubmit = (query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF8FF] font-sans">
      <Header
        currentUser={currentUser}
        allUsers={allUsers}
        allTeams={allTeams}
        notifications={notifications}
        markNotificationsAsRead={() => {}}
        onLogout={handleLogout}
        onSearchSubmit={handleSearchSubmit}
      />
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
