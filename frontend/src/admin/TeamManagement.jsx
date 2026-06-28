import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Users, Trash2, X, UserMinus, AlertCircle, BookOpen } from 'lucide-react';
import {
  getAdminTeamsApi, deleteTeamAdminApi,
  removeMemberAdminApi, closeTeamApi
} from '../api/adminApi.js';

export default function TeamManagement() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = async () => {
    try {
      const res = await getAdminTeamsApi();
      setTeams(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team permanently?')) return;
    setActionLoading(true);
    try {
      await deleteTeamAdminApi(id);
      await load();
      if (selectedTeam?._id === id) setSelectedTeam(null);
    } finally { setActionLoading(false); }
  };

  const handleRemoveMember = async (teamId, userId) => {
    if (!window.confirm('Remove this member?')) return;
    setActionLoading(true);
    try {
      await removeMemberAdminApi(teamId, userId);
      await load();
      // refresh selected team
      const updated = teams.find(t => t._id === teamId);
      if (updated) setSelectedTeam(updated);
    } finally { setActionLoading(false); }
  };

  const handleClose = async (id) => {
    setActionLoading(true);
    try {
      await closeTeamApi(id);
      await load();
    } finally { setActionLoading(false); }
  };

  const filtered = teams.filter(t => {
    const matchSearch = t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.hackathonName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.requiredSkills || []).some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus = filterStatus === 'All' ? true : t.status === filterStatus.toLowerCase();
    return matchSearch && matchStatus;
  });

  if (loading) return <div className="flex items-center justify-center h-64 text-sm text-slate-400">Loading teams...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team Management</h1>
          <p className="text-slate-400 text-sm mt-0.5">{teams.length} total teams on platform</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search teams, hackathons, skills..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
          <option value="All">All Status</option>
          <option value="Open">Open</option>
          <option value="Full">Full</option>
        </select>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(team => {
          const isFull = team.status === 'full';
          return (
            <motion.div key={team._id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full uppercase tracking-widest">
                    {team.hackathonName}
                  </span>
                  <h3 className="font-bold text-slate-800 mt-2">{team.name}</h3>
                  <p className="text-slate-400 text-xs mt-0.5 italic">{team.tagline}</p>
                </div>
                <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase shrink-0 ${isFull ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
                  {isFull ? 'Full' : 'Open'}
                </span>
              </div>

              <div className="flex flex-wrap gap-1">
                {(team.requiredSkills || []).map(s => (
                  <span key={s} className="text-[9px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full border border-slate-100 font-semibold">{s}</span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  {(team.members || []).length}/{team.maxSize}
                  {team.owner && <span className="text-slate-400">· {team.owner.name}</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedTeam(team)}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors">
                    Manage
                  </button>
                  <button onClick={() => handleDelete(team._id)} disabled={actionLoading}
                    className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Team Drawer */}
      <AnimatePresence>
        {selectedTeam && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedTeam(null)}
              className="fixed inset-0 bg-black z-30" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-40 overflow-y-auto">
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-lg">Team Details</h3>
                  <button onClick={() => setSelectedTeam(null)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <p className="font-bold text-slate-800">{selectedTeam.name}</p>
                  <p className="text-xs text-slate-500 italic">{selectedTeam.tagline}</p>
                  <p className="text-xs text-slate-400">{selectedTeam.hackathonName}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{selectedTeam.description}</p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {(selectedTeam.requiredSkills || []).map(s => (
                      <span key={s} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-semibold rounded-full">{s}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Members ({(selectedTeam.members || []).length}/{selectedTeam.maxSize})
                  </p>
                  <div className="space-y-2">
                    {(selectedTeam.members || []).map(member => {
                      const isOwner = member._id === selectedTeam.owner?._id;
                      return (
                        <div key={member._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                              {member.name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                                {member.name}
                                {isOwner && <span className="text-[9px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-black">OWNER</span>}
                              </p>
                              <p className="text-[10px] text-slate-400">{member.college}</p>
                            </div>
                          </div>
                          {!isOwner && (
                            <button onClick={() => handleRemoveMember(selectedTeam._id, member._id)} disabled={actionLoading}
                              className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
                              <UserMinus className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {selectedTeam.status !== 'full' && (
                    <button onClick={() => handleClose(selectedTeam._id)} disabled={actionLoading}
                      className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5" /> Close Team (Mark Full)
                    </button>
                  )}
                  <button onClick={() => handleDelete(selectedTeam._id)} disabled={actionLoading}
                    className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                    <Trash2 className="w-3.5 h-3.5" /> Delete Team
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