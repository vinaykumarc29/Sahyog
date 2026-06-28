import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { WorkspaceProvider } from '../context/WorkspaceContext'
import LoadingState from './LoadingState';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingState />;
  if (!user) return <Navigate to="/login" replace />;

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!adminOnly && user.isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  if (adminOnly) {
    return children;
  }

  return <WorkspaceProvider>{children}</WorkspaceProvider>;
}


