import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, TrendingUp, Users, BookOpen, X } from 'lucide-react';
import { getSkillStatsApi, getAdminUsersApi } from '../api/adminApi.js';

export default function SkillManagement() {
  const [skills, setSkills] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('total');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [inspectTab, setInspectTab] = useState('Teachers');

  useEffect(() => {
    Promise.all([getSkillStatsApi(), getAdminUsersApi()])
      .then(([statsRes, usersRes]) => {
        setSkills(statsRes.data);
        setUsers(usersRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = skills
    .filter(s => s.skill.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b[sortBy] - a[sortBy]);

  const maxTotal = Math.max(...skills.map(s => s.total)) || 1;

  const teachersList = selectedSkill 
    ? users.filter(u => (u.skillsToTeach || []).some(s => s.toLowerCase().trim() === selectedSkill.toLowerCase().trim()))
    : [];

  const learnersList = selectedSkill 
    ? users.filter(u => (u.skillsToLearn || []).some(s => s.toLowerCase().trim() === selectedSkill.toLowerCase().trim()))
    : [];

  if (loading) return <div className="flex items-center justify-center h-64 text-sm text-slate-400">Loading skills...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Skill Analytics</h1>
          <p className="text-slate-400 text-sm mt-0.5">{skills.length} unique skills across the platform</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Most Taught</p>
          <p className="text-xl font-bold text-indigo-600 mt-1">{skills[0]?.skill || '—'}</p>
          <p className="text-xs text-slate-400 mt-0.5">{skills[0]?.teaches || 0} students teaching</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Most Wanted</p>
          <p className="text-xl font-bold text-cyan-600 mt-1">
            {[...skills].sort((a, b) => b.learns - a.learns)[0]?.skill || '—'}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {[...skills].sort((a, b) => b.learns - a.learns)[0]?.learns || 0} students learning
          </p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Total Unique Skills</p>
          <p className="text-xl font-bold text-slate-800 mt-1">{skills.length}</p>
          <p className="text-xs text-slate-400 mt-0.5">across all user profiles</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search skills..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
          <option value="total">Sort by Total</option>
          <option value="teaches">Sort by Teaching</option>
          <option value="learns">Sort by Learning</option>
        </select>
      </div>

      {/* Skill List */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 grid grid-cols-12 gap-4">
          <span className="col-span-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Skill</span>
          <span className="col-span-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Teaching</span>
          <span className="col-span-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Learning</span>
          <span className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</span>
        </div>
        <div className="divide-y divide-slate-50">
          {filtered.map((item, i) => {
            const barWidth = (item.total / maxTotal) * 100;
             return (
              <motion.div key={item.skill}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => { setSelectedSkill(item.skill); setInspectTab('Teachers'); }}
                className="px-5 py-4 grid grid-cols-12 gap-4 items-center hover:bg-slate-50/70 transition-colors cursor-pointer group">
                <div className="col-span-4">
                  <p className="font-semibold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{item.skill}</p>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5">
                    <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-1.5 rounded-full transition-all"
                      style={{ width: `${barWidth}%` }} />
                  </div>
                </div>
                <div className="col-span-3 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                  <span className="text-sm font-semibold text-slate-700">{item.teaches}</span>
                  <span className="text-xs text-slate-400">students</span>
                </div>
                <div className="col-span-3 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span className="text-sm font-semibold text-slate-700">{item.learns}</span>
                  <span className="text-xs text-slate-400">students</span>
                </div>
                <div className="col-span-2">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
                    {item.total}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Drawer Detail Overlay */}
      <AnimatePresence>
        {selectedSkill && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedSkill(null)}
              className="fixed inset-0 bg-black z-30" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-40 overflow-y-auto font-sans">
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">Skill Details</span>
                    <h3 className="font-bold text-slate-800 text-lg mt-1">{selectedSkill}</h3>
                  </div>
                  <button onClick={() => setSelectedSkill(null)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Tabs for Teachers and Learners */}
                <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                  <button
                    onClick={() => setInspectTab('Teachers')}
                    className={`flex-1 py-2 px-3 text-center text-xs font-bold rounded-lg cursor-pointer transition-all ${inspectTab === 'Teachers' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Teachers ({teachersList.length})
                  </button>
                  <button
                    onClick={() => setInspectTab('Learners')}
                    className={`flex-1 py-2 px-3 text-center text-xs font-bold rounded-lg cursor-pointer transition-all ${inspectTab === 'Learners' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Learners ({learnersList.length})
                  </button>
                </div>

                {/* Student List */}
                <div className="space-y-2 max-h-[65vh] overflow-y-auto">
                  {inspectTab === 'Teachers' ? (
                    teachersList.length === 0 ? (
                      <p className="text-sm text-slate-400 italic text-center py-8">No students are currently teaching this skill.</p>
                    ) : (
                      teachersList.map(u => (
                        <div key={u._id || u.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase shrink-0">
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-800 truncate">{u.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{u.college || 'No University Listed'}</p>
                          </div>
                        </div>
                      ))
                    )
                  ) : (
                    learnersList.length === 0 ? (
                      <p className="text-sm text-slate-400 italic text-center py-8">No students are currently learning this skill.</p>
                    ) : (
                      learnersList.map(u => (
                        <div key={u._id || u.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                          <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold text-xs uppercase shrink-0">
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-800 truncate">{u.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{u.college || 'No University Listed'}</p>
                          </div>
                        </div>
                      ))
                    )
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}