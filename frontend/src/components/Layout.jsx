import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useWorkspace } from '../context/WorkspaceContext.jsx';
import { Header } from './Header.jsx';

export const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { currentUser, users: allUsers, teams: allTeams } = useWorkspace();

  // build real notifications from pendingRequests
  const notifications = (currentUser?.pendingRequests || []).map(reqId => {
    const sender = (allUsers || []).find(u => u.id === String(reqId));
    return {
      id: `conn-${reqId}`,
      type: 'connection_request',
      title: 'Connection Request',
      message: sender ? `${sender.name} wants to connect with you` : 'Someone wants to connect with you',
      senderId: String(reqId),
      isRead: false,
      timestamp: 'Recently',
    };
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearchSubmit = (query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!currentUser) return <>{children}</>;

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
      <main>{children}</main>
    </div>
  );
};

export default Layout;