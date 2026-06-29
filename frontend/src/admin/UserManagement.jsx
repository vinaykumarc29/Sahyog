import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Search, MoreVertical, UserMinus, AlertTriangle,
  CheckCircle, X, Mail, BookOpen, Github, Linkedin,
  MessageSquare, Share2, Layers, Edit, Trash2
} from 'lucide-react';
import {
  getAdminUsersApi, suspendUserApi, activateUserApi,
  deleteUserApi, editUserApi, getUserByIdApi
} from '../api/adminApi.js';

export default function UserManagement() {
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [inspectUser, setInspectUser] = useState(null);
  const [inspectDetails, setInspectDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCollege, setEditCollege] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editIsAdmin, setEditIsAdmin] = useState(false);
  const [activeDetailSection, setActiveDetailSection] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const itemsPerPage = 8;

  const load = async () => {
    try {
      const res = await getAdminUsersApi();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleInspect = async (user) => {
    setInspectUser(user);
    setEditName(user.name);
    setEditCollege(user.college || '');
    setEditBio(user.bio || '');
    setEditIsAdmin(user.isAdmin || false);
    setActiveDetailSection(null);
    try {
      const res = await getUserByIdApi(user._id);
      setInspectDetails(res.data);
    } catch { setInspectDetails(null); }
  };

  const handleSuspend = async (id) => {
    setActionLoading(true);
    try {
      await suspendUserApi(id);
      await load();
      if (inspectUser?._id === id) setInspectUser(prev => ({ ...prev, isSuspended: true }));
    } finally { setActionLoading(false); setActiveMenuId(null); }
  };

  const handleActivate = async (id) => {
    setActionLoading(true);
    try {
      await activateUserApi(id);
      await load();
      if (inspectUser?._id === id) setInspectUser(prev => ({ ...prev, isSuspended: false }));
    } finally { setActionLoading(false); setActiveMenuId(null); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    setActionLoading(true);
    try {
      await deleteUserApi(id);
      await load();
      if (inspectUser?._id === id) setInspectUser(null);
    } finally { setActionLoading(false); setActiveMenuId(null); }
  };

  const handleSaveEdit = async () => {
    setActionLoading(true);
    try {
      await editUserApi(inspectUser._id, { name: editName, college: editCollege, bio: editBio, isAdmin: editIsAdmin });
      await load();
      setIsEditing(false);
      setInspectUser(prev => ({ ...prev, name: editName, college: editCollege, bio: editBio, isAdmin: editIsAdmin }));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not save changes.');
    } finally { setActionLoading(false); }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.college?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = selectedStatus === 'All' ? true :
      selectedStatus === 'Active' ? !u.isSuspended :
      selectedStatus === 'Suspended' ? u.isSuspended : true;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div className="flex items-center justify-center h-64 text-sm text-slate-400">Loading users...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-400 text-sm mt-0.5">{users.length} total registered users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search by name, email, college..."
            value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {/* Table - Desktop View */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Scrollable container for the table */}
        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full text-sm relative">
            <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">College</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Skills</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.map((user, index) => {
                // Determine if this is one of the last two items in a list of at least 3
                const isLastItems = paginated.length > 3 && index >= paginated.length - 2;

                return (
                  <motion.tr key={user._id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{user.name}</p>
                          <p className="text-slate-400 text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-slate-600 text-xs">{user.college || '—'}</span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(user.skillsToTeach || []).slice(0, 2).map(s => (
                          <span key={s} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-semibold rounded-full">{s}</span>
                        ))}
                        {(user.skillsToTeach || []).length > 2 && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-semibold rounded-full">+{user.skillsToTeach.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.isSuspended ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                        {user.isSuspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleInspect(user)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
                          View
                        </button>
                        <div className="relative">
                          <button onClick={() => setActiveMenuId(activeMenuId === user._id ? null : user._id)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
                            <MoreVertical className="w-4 h-4 text-slate-400" />
                          </button>
                          <AnimatePresence>
                            {activeMenuId === user._id && (
                              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                // Drops up for bottom items, down for the rest
                                className={`absolute right-0 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden ${
                                  isLastItems ? 'bottom-full mb-1' : 'top-full mt-1'
                                }`}>
                                {user.isSuspended ? (
                                  <button onClick={() => handleActivate(user._id)}
                                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer">
                                    <CheckCircle className="w-3.5 h-3.5" /> Activate
                                  </button>
                                ) : (
                                  <button onClick={() => handleSuspend(user._id)}
                                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer">
                                    <AlertTriangle className="w-3.5 h-3.5" /> Suspend
                                  </button>
                                )}
                                <button onClick={() => handleDelete(user._id)}
                                  className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100 cursor-pointer">
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards Grid - Mobile View */}
      <div className="block md:hidden space-y-4">
        {paginated.map(user => (
          <motion.div key={user._id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3 relative"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1 font-sans">
                <p className="font-bold text-slate-800 text-sm truncate">{user.name}</p>
                <p className="text-slate-400 text-xs truncate">{user.email}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${user.isSuspended ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                {user.isSuspended ? 'Suspended' : 'Active'}
              </span>
            </div>
            
            {user.college && (
              <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100/50">
                <span className="font-semibold text-slate-400 block text-[9px] uppercase tracking-wider">College</span>
                {user.college}
              </div>
            )}

            {user.skillsToTeach && user.skillsToTeach.length > 0 && (
              <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100/50">
                <span className="font-semibold text-slate-400 block text-[9px] uppercase tracking-wider">Skills</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.skillsToTeach.slice(0, 3).map(s => (
                    <span key={s} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[9px] font-semibold rounded-full">{s}</span>
                  ))}
                  {user.skillsToTeach.length > 3 && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-semibold rounded-full">+{user.skillsToTeach.length - 3}</span>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
              <button onClick={() => handleInspect(user)}
                className="px-4 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer">
                View Details
              </button>
              
              <div className="flex gap-2">
                {user.isSuspended ? (
                  <button onClick={() => handleActivate(user._id)}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition-colors cursor-pointer">
                    Activate
                  </button>
                ) : (
                  <button onClick={() => handleSuspend(user._id)}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-lg transition-colors cursor-pointer">
                    Suspend
                  </button>
                )}
                <button onClick={() => handleDelete(user._id)}
                  className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination - Full Width Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <span className="text-xs text-slate-400">
            Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors cursor-pointer">
              Prev
            </button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors cursor-pointer">
              Next
            </button>
          </div>
        </div>
      )}

      {/* Inspect Drawer */}
      <AnimatePresence>
        {inspectUser && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }}
              onClick={() => { setInspectUser(null); setIsEditing(false); }}
              className="fixed inset-0 bg-black z-30" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-40 overflow-y-auto">
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-lg">User Profile</h3>
                  <button onClick={() => { setInspectUser(null); setIsEditing(false); }}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                {/* Avatar + name */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                    {inspectUser.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    {isEditing ? (
                      <input value={editName} onChange={e => setEditName(e.target.value)}
                        className="font-bold text-slate-800 border-b border-indigo-300 focus:outline-none bg-transparent w-full" />
                    ) : (
                      <p className="font-bold text-slate-800">{inspectUser.name}</p>
                    )}
                    <p className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" /> {inspectUser.email}
                    </p>
                    <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${inspectUser.isSuspended ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
                      {inspectUser.isSuspended ? 'Suspended' : 'Active'}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  {/* Role Permissions Checkbox */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role & Permissions</label>
                    {isEditing ? (
                      <div className="mt-1">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={editIsAdmin}
                            disabled={inspectUser._id === authUser?.id || inspectUser._id === authUser?._id}
                            onChange={(e) => setEditIsAdmin(e.target.checked)}
                            className="w-4 h-4 accent-indigo-600 rounded cursor-pointer disabled:opacity-50"
                          />
                          <span className="text-xs font-semibold text-slate-700">Administrator Access</span>
                        </label>
                        {(inspectUser._id === authUser?.id || inspectUser._id === authUser?._id) && (
                          <p className="text-[10px] text-amber-600 font-medium mt-1">You cannot remove your own admin access.</p>
                        )}
                      </div>
                    ) : (
                      <div className="mt-0.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${inspectUser.isAdmin ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                          {inspectUser.isAdmin ? 'Administrator' : 'Standard Student'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">College</label>
                    {isEditing ? (
                      <input value={editCollege} onChange={e => setEditCollege(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-300" />
                    ) : (
                      <p className="text-slate-700 text-sm mt-0.5">{inspectUser.college || '—'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bio</label>
                    {isEditing ? (
                      <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={3}
                        className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-300 resize-none" />
                    ) : (
                      <p className="text-slate-700 text-sm mt-0.5">{inspectUser.bio || '—'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skills Teaching</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(inspectUser.skillsToTeach || []).map(s => (
                        <span key={s} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-semibold rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skills Learning</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(inspectUser.skillsToLearn || []).map(s => (
                        <span key={s} className="px-2 py-0.5 bg-cyan-50 text-cyan-700 text-[10px] font-semibold rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>

                  {inspectDetails && (
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <button
                        onClick={() => setActiveDetailSection(activeDetailSection === 'connections' ? null : 'connections')}
                        className={`p-3 text-center border rounded-xl cursor-pointer transition-all ${activeDetailSection === 'connections' ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-slate-50 border-slate-100 hover:bg-slate-100/70'}`}
                      >
                        <Share2 className={`w-4 h-4 mx-auto mb-1 ${activeDetailSection === 'connections' ? 'text-indigo-600 animate-pulse' : 'text-cyan-500'}`} />
                        <p className="text-lg font-bold text-slate-800">{inspectDetails.user?.connections?.length || 0}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">Connections</p>
                      </button>
                      
                      <button
                        onClick={() => setActiveDetailSection(activeDetailSection === 'teams' ? null : 'teams')}
                        className={`p-3 text-center border rounded-xl cursor-pointer transition-all ${activeDetailSection === 'teams' ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-slate-50 border-slate-100 hover:bg-slate-100/70'}`}
                      >
                        <Layers className={`w-4 h-4 mx-auto mb-1 ${activeDetailSection === 'teams' ? 'text-indigo-600 animate-pulse' : 'text-indigo-500'}`} />
                        <p className="text-lg font-bold text-slate-800">{inspectDetails.teams?.length || 0}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">Teams</p>
                      </button>

                      <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                        <MessageSquare className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                        <p className="text-lg font-bold text-slate-800">{inspectDetails.messageCount || 0}</p>
                        <p className="text-[10px] text-slate-400">Messages</p>
                      </div>
                    </div>
                  )}

                  {/* Populated lists breakdown */}
                  {inspectDetails && activeDetailSection && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-3 mt-3 animate-fade-in">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          {activeDetailSection === 'connections' ? 'User Connections' : 'Enrolled Teams'}
                        </h4>
                        <button 
                          onClick={() => setActiveDetailSection(null)}
                          className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                      
                      {activeDetailSection === 'connections' && (
                        <div className="max-h-48 overflow-y-auto space-y-2">
                          {(inspectDetails.user?.connections || []).length === 0 ? (
                            <p className="text-xs text-slate-400 italic">No connections found.</p>
                          ) : (
                            inspectDetails.user.connections.map(c => (
                              <div key={c._id || c.id} className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-slate-100">
                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-[10px]">
                                  {c.name?.[0]?.toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold text-slate-700 truncate">{c.name}</p>
                                  <p className="text-[10px] text-slate-400 truncate">{c.college || 'No University Listed'}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                      
                      {activeDetailSection === 'teams' && (
                        <div className="max-h-48 overflow-y-auto space-y-2">
                          {(inspectDetails.teams || []).length === 0 ? (
                            <p className="text-xs text-slate-400 italic">Not enrolled in any teams.</p>
                          ) : (
                            inspectDetails.teams.map(t => (
                              <div key={t._id || t.id} className="p-2 bg-white rounded-lg border border-slate-100 space-y-1">
                                <div className="flex justify-between items-start gap-2">
                                  <span className="font-bold text-xs text-slate-700 block truncate">{t.name}</span>
                                  <span className="text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-black shrink-0 uppercase">{t.status}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium">Hackathon: {t.hackathonName} • Owner: {t.owner?.name || 'Unknown'}</p>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {inspectUser.githubUrl && (
                    <a href={inspectUser.githubUrl} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 transition-colors">
                      <Github className="w-4 h-4" /> {inspectUser.githubUrl}
                    </a>
                  )}
                  {inspectUser.linkedinUrl && (
                    <a href={inspectUser.linkedinUrl} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 transition-colors">
                      <Linkedin className="w-4 h-4" /> {inspectUser.linkedinUrl}
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button onClick={handleSaveEdit} disabled={actionLoading}
                        className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50">
                        {actionLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button onClick={() => setIsEditing(false)}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-colors">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setIsEditing(true)}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                      <Edit className="w-3.5 h-3.5" /> Edit Profile
                    </button>
                  )}

                  {inspectUser.isSuspended ? (
                    <button onClick={() => handleActivate(inspectUser._id)} disabled={actionLoading}
                      className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5" /> Activate Account
                    </button>
                  ) : (
                    <button onClick={() => handleSuspend(inspectUser._id)} disabled={actionLoading}
                      className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                      <UserMinus className="w-3.5 h-3.5" /> Suspend Account
                    </button>
                  )}

                  <button onClick={() => handleDelete(inspectUser._id)} disabled={actionLoading}
                    className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                    <Trash2 className="w-3.5 h-3.5" /> Delete User
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}