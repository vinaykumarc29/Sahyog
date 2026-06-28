import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext.jsx';

import { Layout } from './components/Layout.jsx';

import { LandingPage } from './pages/LandingPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { MatchesPage } from './pages/MatchesPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { EditProfilePage } from './pages/EditProfilePage.jsx';
import { TeamFinderPage } from './pages/TeamFinderPage.jsx';
import { TeamDetailPage } from './pages/TeamDetailPage.jsx';
import { CreateTeamPage } from './pages/CreateTeamPage.jsx';
import { ChatPage } from './pages/ChatPage.jsx';
import { SearchResultsPage } from './pages/SearchResultsPage.jsx';
import { NotificationsPage } from './pages/NotificationsPage.jsx';
import ProtectedRoute from './pages/ProtectedRoute.jsx';
import LoadingState from './pages/LoadingState.jsx';
import { AdminDashboard } from './pages/AdminDashboard.jsx';

const ErrorState = ({ error }) => (
  <div className="min-h-screen grid place-items-center bg-[#FCF8FF] p-6">
    <div className="bg-white border border-red-100 rounded-2xl p-6 max-w-md text-center shadow-sm">
      <p className="text-sm font-bold text-red-600">{error}</p>
      <p className="text-xs text-text-secondary mt-2">Check that the server is running on port 5000 and MongoDB is connected.</p>
    </div>
  </div>
);

/* ─── Route Guard — redirects to login, wraps children in WorkspaceProvider ── */


/* ─── Workspace Gate — holds render until context data is ready ─ */
const WorkspaceGate = ({ children }) => {
  const { loading, error } = useWorkspace();
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  return children;
};

/* ─── AppLayout — Layout reads its own data from context ─────── */
const AppLayout = ({ children }) => {
  const { currentUser, users, teams } = useWorkspace();
  return (
    <Layout >
      {children}
    </Layout>
  );
};

/* ─── Gated — shorthand: WorkspaceGate + AppLayout combined ────── */
const Gated = ({ children }) => (
  <WorkspaceGate>
    <AppLayout>{children}</AppLayout>
  </WorkspaceGate>
);

/* ─── Search — needs URL param, wrapped in Gated ─────────────── */
const SearchWrapper = () => {
  const query = new URLSearchParams(window.location.search).get('q') || '';
  return (
    <Gated>
      <SearchResultsPage searchQuery={query} />
    </Gated>
  );
};

/* ─── App ─────────────────────────────────────────────────────── */
const App = () => {
  const navigate = useNavigate();
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage onStartOnboarding={() => navigate('/register')} onLogin={() => navigate('/login')} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes — each page is fully self-contained */}
      <Route path="/dashboard"       element={<ProtectedRoute><Gated><Dashboard /></Gated></ProtectedRoute>} />
      <Route path="/matches"         element={<ProtectedRoute><Gated><MatchesPage /></Gated></ProtectedRoute>} />
      {/* /profile/edit MUST come before /profile/:id */}
      <Route path="/profile/edit"    element={<ProtectedRoute><Gated><EditProfilePage /></Gated></ProtectedRoute>} />
      <Route path="/profile/:id"     element={<ProtectedRoute><Gated><ProfilePage /></Gated></ProtectedRoute>} />
      <Route path="/teams"           element={<ProtectedRoute><Gated><TeamFinderPage /></Gated></ProtectedRoute>} />
      <Route path="/teams/create"    element={<ProtectedRoute><Gated><CreateTeamPage /></Gated></ProtectedRoute>} />
      <Route path="/teams/:id"       element={<ProtectedRoute><Gated><TeamDetailPage /></Gated></ProtectedRoute>} />
      <Route path="/chat"            element={<ProtectedRoute><Gated><ChatPage /></Gated></ProtectedRoute>} />
      <Route path="/search"          element={<ProtectedRoute><SearchWrapper /></ProtectedRoute>} />
      <Route path="/notifications"   element={<ProtectedRoute><Gated><NotificationsPage /></Gated></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin"           element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
