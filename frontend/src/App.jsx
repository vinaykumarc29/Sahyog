import { useEffect, useState, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import api from './api/axios.js';
import { approveApplicantApi, rejectApplicantApi } from './api/teamApi.js';
import { getUnreadCountApi } from './api/messageApi.js';

import { normalizeTeam, normalizeUser } from './api/mappers.js';
import { Layout } from './components/Layout.jsx';
import { useTeam } from './hooks/useTeam.js';
import { useMatches } from './hooks/useMatches.js';

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

/* ─── Loading & Error States ──────────────────────────────────── */
const LoadingState = () => (
  <div className="min-h-screen grid place-items-center bg-[#FCF8FF] text-xs font-bold text-text-secondary">
    Loading Sahyog...
  </div>
);

const ErrorState = ({ error }) => (
  <div className="min-h-screen grid place-items-center bg-[#FCF8FF] p-6">
    <div className="bg-white border border-red-100 rounded-2xl p-6 max-w-md text-center shadow-sm">
      <p className="text-sm font-bold text-red-600">{error}</p>
      <p className="text-xs text-text-secondary mt-2">Check that the server is running on port 4000 and MongoDB is connected.</p>
    </div>
  </div>
);

/* ─── Route Guards ────────────────────────────────────────────── */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingState />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

/* ─── Shared workspace data hook ─────────────────────────────── */
const useWorkspaceData = () => {
  const { user, login } = useAuth();
  const [state, setState] = useState({ loading: true, error: '', users: [], teams: [], currentUser: null });

  const load = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: '' }));
      const [meRes, usersRes, teamsRes] = await Promise.all([
        api.get('/api/auth/me'),
        api.get('/api/users'),
        api.get('/api/teams'),
      ]);
      const currentUser = normalizeUser(meRes.data);
      login(localStorage.getItem('token'), currentUser);
      setState({
        loading: false,
        error: '',
        currentUser,
        users: usersRes.data.map(normalizeUser),
        teams: teamsRes.data.map(normalizeTeam),
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Could not load data from the backend.',
      }));
    }
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user?._id]);

  return { ...state, reload: load };
};

/* ─── DataRoute — gate for all data-dependent routes ──────────── */
const DataRoute = ({ children }) => {
  const data = useWorkspaceData();
  if (data.loading) return <LoadingState />;
  if (data.error) return <ErrorState error={data.error} />;
  return children(data);
};

/* ─── Route Components ────────────────────────────────────────── */

const DashboardRoute = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastMessageAt, setLastMessageAt] = useState(null);

  useEffect(() => {
    getUnreadCountApi()
      .then(res => {
        setUnreadCount(res.data.count ?? 0);
        setLastMessageAt(res.data.lastMessageAt ?? null);
      })
      .catch(() => {}); // silently fail — stat card falls back to 0
  }, []);

  return (
    <DataRoute>
      {({ currentUser, users, teams, reload }) => (
        <Layout currentUser={currentUser} allUsers={users} allTeams={teams}>
          <Dashboard
            currentUser={currentUser}
            allUsers={users}
            allTeams={teams}
            notifications={[]}
            activePosts={[]}
            unreadCount={unreadCount}
            lastMessageAt={lastMessageAt}
            setActiveTab={(tab) => {
              if (tab === 'matches') navigate('/matches');
              else if (tab === 'teams') navigate('/teams');
              else if (tab.startsWith('profile-')) navigate(`/profile/${tab.replace('profile-', '')}`);
              else if (tab.startsWith('team-')) navigate(`/teams/${tab.replace('team-', '')}`);
            }}
            onAcceptConnection={async (id) => {
              if ((currentUser.pendingRequests || []).includes(id)) {
                await api.put(`/api/users/connect/${id}/accept`);
              } else {
                await api.post(`/api/users/connect/${id}`);
              }
              await reload();
            }}
            onRejectConnection={async (id) => {
              await api.put(`/api/users/connect/${id}/reject`);
              await reload();
            }}
            onTriggerCreateTeam={() => navigate('/teams/create')}
          />
        </Layout>
      )}
    </DataRoute>
  );
};

const MatchesRoute = () => {
  const navigate = useNavigate();
  const { matches, loading, error } = useMatches();

  return (
    <DataRoute>
      {({ currentUser, users, reload }) => {
        if (loading) return (
          <Layout currentUser={currentUser} allUsers={users}>
            <LoadingState />
          </Layout>
        );

        // Merge server match scores with full user objects
        const matchedUsers = matches.map(m => ({
          ...m.user,
          _serverScore: m.score,
        }));

        return (
          <Layout currentUser={currentUser} allUsers={users}>
            <MatchesPage
              currentUser={currentUser}
              allUsers={matchedUsers.length > 0 ? matchedUsers : users}
              serverMatches={matches}
              onConnectTrigger={async (id) => {
                await api.post(`/api/users/connect/${id}`);
                await reload();
              }}
              onViewProfile={(id) => navigate(`/profile/${id}`)}
            />
          </Layout>
        );
      }}
    </DataRoute>
  );
};

const ProfileRoute = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <DataRoute>
      {({ currentUser, users, teams, reload }) => {
        // Try to find in users list first, fallback to currentUser if viewing own profile
        const viewingUser = users.find(u => u.id === id) || (currentUser.id === id ? currentUser : null);
        if (!viewingUser) return <Navigate to="/dashboard" replace />;
        return (
          <Layout currentUser={currentUser} allUsers={users} allTeams={teams}>
            <ProfilePage
              viewingUser={viewingUser}
              currentUser={currentUser}
              allUsers={users}
              allTeams={teams}
              onBackToDashboard={() => navigate('/dashboard')}
              onInitiateChat={() => navigate('/chat')}
              onToggleConnection={async (targetUserId) => {
                const targetId = targetUserId || viewingUser.id;
                if (targetId !== currentUser.id) {
                  if ((currentUser.connections || []).includes(targetId)) {
                    await api.delete(`/api/users/connect/${targetId}`);
                  } else {
                    await api.post(`/api/users/connect/${targetId}`);
                  }
                }
                await reload();
              }}
              onEditProfileTrigger={() => navigate('/profile/edit')}
            />
          </Layout>
        );
      }}
    </DataRoute>
  );
};

const EditProfileRoute = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  return (
    <DataRoute>
      {({ currentUser }) => (
        <Layout currentUser={currentUser}>
          <EditProfilePage
            currentUser={currentUser}
            onCancel={() => navigate(`/profile/${currentUser.id}`)}
            onSaveProfile={async (profile) => {
              const res = await api.put('/api/users/profile', {
                name: profile.name,
                college: profile.college,
                bio: profile.bio,
                skillsToTeach: profile.skillsToTeach,
                skillsToLearn: profile.skillsToLearn,
                openToLearnAll: profile.isOpenToLearnAnything,
                githubUrl: profile.github,
                linkedinUrl: profile.linkedin,
              });
              login(localStorage.getItem('token'), normalizeUser(res.data));
              navigate(`/profile/${currentUser.id}`);
            }}
          />
        </Layout>
      )}
    </DataRoute>
  );
};

const TeamsRoute = () => {
  const navigate = useNavigate();
  return (
    <DataRoute>
      {({ currentUser, users, teams }) => (
        <Layout currentUser={currentUser} allUsers={users} allTeams={teams}>
          <TeamFinderPage
            allTeams={teams}
            onViewTeamDetail={(id) => navigate(`/teams/${id}`)}
            onNavigateToCreateTeam={() => navigate('/teams/create')}
          />
        </Layout>
      )}
    </DataRoute>
  );
};

const CreateTeamRoute = () => {
  const navigate = useNavigate();
  return (
    <DataRoute>
      {({ currentUser, users, teams }) => (
        <Layout currentUser={currentUser} allUsers={users} allTeams={teams}>
          <CreateTeamPage
            onCancel={() => navigate('/teams')}
            onPublishTeam={async (team) => {
              await api.post('/api/teams', {
                name: team.name,
                tagline: team.tagline,
                hackathonName: team.hackathonName,
                theme: team.theme,
                eventDate: team.eventDate,
                description: team.description,
                requiredSkills: team.requiredSkills,
                maxSize: team.maxSize,
              });
              navigate('/teams');
            }}
          />
        </Layout>
      )}
    </DataRoute>
  );
};

/* TeamDetailRoute: fetches team by ID directly to avoid "not found when full" bug */
const TeamDetailRoute = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { team, loading, error, refetch } = useTeam(id);

  return (
    <DataRoute>
      {({ currentUser, users }) => {
        if (loading) return (
          <Layout currentUser={currentUser} allUsers={users}>
            <LoadingState />
          </Layout>
        );
        if (error || !team) return <Navigate to="/teams" replace />;
        return (
          <Layout currentUser={currentUser} allUsers={users}>
            <TeamDetailPage
              team={team}
              currentUser={currentUser}
              allUsers={users}
              onBack={() => navigate('/teams')}
              onApplySubmit={async (message) => {
                await api.post(`/api/teams/${id}/apply`, { message });
                await refetch();
              }}
              onHandleApplication={async (applicantUserId, action) => {
                if (action === 'approved') {
                  await approveApplicantApi(id, applicantUserId);
                } else if (action === 'rejected') {
                  await rejectApplicantApi(id, applicantUserId);
                }
                await refetch();
              }}
            />
          </Layout>
        );
      }}
    </DataRoute>
  );
};

const ChatRoute = () => (
  <DataRoute>
    {({ currentUser, users }) => (
      <Layout currentUser={currentUser} allUsers={users}>
        <ChatPage
          currentUser={currentUser}
          allUsers={users}
        />
      </Layout>
    )}
  </DataRoute>
);

const SearchRoute = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  return (
    <DataRoute>
      {({ currentUser, users, teams, reload }) => (
        <Layout currentUser={currentUser} allUsers={users} allTeams={teams}>
          <SearchResultsPage
            searchQuery={params.get('q') || ''}
            currentUser={currentUser}
            allUsers={users}
            allTeams={teams}
            onConnectTrigger={async (id) => {
              await api.post(`/api/users/connect/${id}`);
              await reload();
            }}
            onViewProfile={(id) => navigate(`/profile/${id}`)}
            onViewTeam={(id) => navigate(`/teams/${id}`)}
          />
        </Layout>
      )}
    </DataRoute>
  );
};

const NotificationsRoute = () => (
  <DataRoute>
    {({ currentUser, users, reload }) => {
      // Build real notifications from pending connection requests
      const connectionNotifications = (currentUser.pendingRequests || []).map(reqId => {
        const sender = users.find(u => u.id === reqId);
        return {
          id: `conn-${reqId}`,
          type: 'connection_request',
          title: 'Connection Request',
          message: sender ? `${sender.name} wants to connect with you` : 'Someone wants to connect with you',
          senderId: reqId,
          isRead: false,
          timestamp: 'Recently',
        };
      });

      return (
        <Layout currentUser={currentUser} allUsers={users}>
          <NotificationsPage
            notifications={connectionNotifications}
            allUsers={users}
            onMarkAllAsRead={() => {}}
            onClearAll={() => {}}
            onAcceptConnection={async (senderId) => {
              await api.put(`/api/users/connect/${senderId}/accept`);
              await reload();
            }}
            onRejectConnection={async (senderId) => {
              await api.put(`/api/users/connect/${senderId}/reject`);
              await reload();
            }}
            setActiveTab={() => {}}
          />
        </Layout>
      );
    }}
  </DataRoute>
);

/* ─── App ─────────────────────────────────────────────────────── */
const App = () => {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route path="/" element={<LandingPage onStartOnboarding={() => navigate('/register')} onLogin={() => navigate('/login')} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardRoute /></ProtectedRoute>} />
      <Route path="/matches" element={<ProtectedRoute><MatchesRoute /></ProtectedRoute>} />
      {/* /profile/edit must come BEFORE /profile/:id */}
      <Route path="/profile/edit" element={<ProtectedRoute><EditProfileRoute /></ProtectedRoute>} />
      <Route path="/profile/:id" element={<ProtectedRoute><ProfileRoute /></ProtectedRoute>} />
      <Route path="/teams" element={<ProtectedRoute><TeamsRoute /></ProtectedRoute>} />
      <Route path="/teams/create" element={<ProtectedRoute><CreateTeamRoute /></ProtectedRoute>} />
      <Route path="/teams/:id" element={<ProtectedRoute><TeamDetailRoute /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><ChatRoute /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute><SearchRoute /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsRoute /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
