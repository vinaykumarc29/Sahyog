import { useState } from 'react';
import { Search, Users, Layers } from 'lucide-react';
import { adminSearchApi } from '../api/adminApi.js';

export default function AdminSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], teams: [] });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await adminSearchApi(query.trim());
      setResults(res.data);
      setSearched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900">Global Search</h1>
        <p className="text-slate-400 text-sm mt-0.5">Search users, teams across the platform</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search by name, email, college, team..."
            value={query} onChange={e => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <button type="submit" disabled={loading}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {searched && (
        <div className="space-y-6">
          {/* Users */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-indigo-500" />
              Users ({results.users.length})
            </h3>
            {results.users.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No users found</p>
            ) : (
              <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                {results.users.map(user => (
                  <div key={user._id} className="flex items-center gap-4 px-5 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm">{user.name}</p>
                      <p className="text-slate-400 text-xs">{user.email} · {user.college}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${user.isSuspended ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
                      {user.isSuspended ? 'Suspended' : 'Active'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Teams */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-cyan-500" />
              Teams ({results.teams.length})
            </h3>
            {results.teams.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No teams found</p>
            ) : (
              <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                {results.teams.map(team => (
                  <div key={team._id} className="flex items-center gap-4 px-5 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold text-sm shrink-0">
                      {team.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm">{team.name}</p>
                      <p className="text-slate-400 text-xs">{team.hackathonName} · Owner: {team.owner?.name}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${team.status === 'full' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
                      {team.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}