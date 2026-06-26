import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext.jsx';
import { Search, Plus, Users, SlidersHorizontal } from 'lucide-react';
export const TeamFinderPage = () => {
    const navigate = useNavigate();
    const { teams: allTeams } = useWorkspace();
    const onViewTeamDetail = (id) => navigate(`/teams/${id}`);
    const onNavigateToCreateTeam = () => navigate('/teams/create');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedHackathon, setSelectedHackathon] = useState('All');
    const [onlyOpenPositions, setOnlyOpenPositions] = useState(false);
    const hackathons = ['All', 'TreeHacks 2026', 'MIT Web3 Hackathon', 'Stanford HackHLTH', 'CalHacks 13.0'];
    const filteredTeams = allTeams.filter(team => {
        const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.requiredSkills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesHackathon = selectedHackathon === 'All' || team.hackathonName === selectedHackathon;
        const isOpen = !onlyOpenPositions || team.members.length < team.maxSize;
        return matchesSearch && matchesHackathon && isOpen;
    });
    return (<div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 font-sans pb-24 lg:pb-8 space-y-8">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-outline-custom/15 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary font-display flex items-center gap-2">
            <Users className="text-primary-indigo w-6 h-6"/>
            <span>Hackathon Squad Finder</span>
          </h1>
          <p className="text-text-secondary text-xs mt-0.5 font-medium">Discover open positions inside highly motivated hackathon squads</p>
        </div>
        <button onClick={onNavigateToCreateTeam} className="gradient-cta text-white px-5.5 py-3 rounded-full text-xs font-black shadow-lg shadow-primary-indigo/20 flex items-center gap-2 hover:scale-[1.02] transition-transform">
          <Plus className="w-4.5 h-4.5 stroke-[3]"/>
          <span>Publish New Squad</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Filters Sidebar */}
        <div className="lg:col-span-3 space-y-6 bg-white p-6 rounded-3xl border border-outline-custom/30 shadow-sm">
          <h3 className="text-xs font-black text-text-primary uppercase tracking-wider pb-2 border-b border-outline-custom/10 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-primary-indigo"/>
            <span>Refine Team Search</span>
          </h3>

          {/* Search */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Search Keywords</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary"/>
              <input type="text" placeholder="Search skills, themes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-3.5 py-2.5 bg-sahyog-bg rounded-xl border border-outline-custom/40 focus:outline-none focus:ring-1 focus:ring-primary-indigo text-xs text-text-primary"/>
            </div>
          </div>

          {/* Hackathon Selection */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Hackathon Venue</label>
            <select value={selectedHackathon} onChange={(e) => setSelectedHackathon(e.target.value)} className="w-full px-3.5 py-2.5 bg-sahyog-bg rounded-xl border border-outline-custom/40 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-indigo cursor-pointer">
              {hackathons.map(h => (<option key={h} value={h}>{h}</option>))}
            </select>
          </div>

          {/* Toggle: Open positions only */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Show Open Teams Only</span>
            <input type="checkbox" checked={onlyOpenPositions} onChange={(e) => setOnlyOpenPositions(e.target.checked)} className="w-4 h-4 text-primary-indigo focus:ring-primary-indigo border-outline-custom rounded cursor-pointer"/>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="lg:col-span-9 space-y-6">
          
          {filteredTeams.length === 0 ? (<div className="bg-white p-12 rounded-[32px] border border-outline-custom/30 text-center space-y-4">
              <p className="text-3xl">🧩</p>
              <h4 className="text-base font-bold text-text-primary">No Teams Found</h4>
              <p className="text-text-secondary text-xs max-w-sm mx-auto">Be the first on campus to create a squad for this event!</p>
              <button onClick={onNavigateToCreateTeam} className="mt-2.5 px-5.5 py-2.5 bg-primary-indigo text-white text-xs font-bold rounded-full shadow-md">
                Create Team Now
              </button>
            </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTeams.map((team) => {
                const isFull = team.members.length >= team.maxSize;
                return (<div key={team.id} className="bg-white p-6 rounded-[32px] border border-outline-custom/30 hover:border-primary-indigo/35 transition-all shadow-card flex flex-col justify-between space-y-5">
                    
                    <div className="space-y-4">
                      
                      {/* Hackathon and status tags */}
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-[9px] font-black bg-primary-indigo/5 text-primary-indigo px-2.5 py-1 rounded-full border border-primary-indigo/10 uppercase tracking-widest">
                          {team.hackathonName}
                        </span>
                        
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${isFull ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-success-custom border border-emerald-100'}`}>
                          {isFull ? 'Full Squad' : 'Open Positions'}
                        </span>
                      </div>

                      {/* Name & tagline */}
                      <div>
                        <h3 className="text-sm font-extrabold text-text-primary font-display">{team.name}</h3>
                        <p className="text-text-secondary text-xs mt-1 font-semibold italic">{team.tagline}</p>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                        {team.description}
                      </p>

                      {/* Requirements */}
                      <div className="space-y-2">
                        <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Target Skills Required:</p>
                        <div className="flex flex-wrap gap-1">
                          {team.requiredSkills.map(skill => (<span key={skill} className="text-[9px] bg-sahyog-bg text-text-primary px-2 py-0.5 rounded-full border border-outline-custom/15 font-semibold">
                              {skill}
                            </span>))}
                        </div>
                      </div>

                    </div>

                    {/* Footer / Actions */}
                    <div className="flex justify-between items-center pt-4 border-t border-outline-custom/10">
                      
                      {/* Member occupancy */}
                      <div className="flex items-center gap-1.5 text-text-secondary text-xs font-semibold">
                        <Users className="w-4 h-4 text-primary-indigo"/>
                        <span>{team.members.length} / {team.maxSize} Joined</span>
                      </div>

                      <button onClick={() => onViewTeamDetail(team.id)} className="px-4.5 py-2.5 bg-primary-indigo hover:bg-indigo-600 text-white rounded-xl text-[10px] font-black tracking-wider uppercase transition-all shadow-md shadow-primary-indigo/5">
                        Inspect Squad
                      </button>

                    </div>

                  </div>);
            })}
            </div>)}

        </div>

      </div>

    </div>);
};
