import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext.jsx';
import api from '../api/axios.js';
import { MatchScoreBadge, OpenToLearnBadge } from '../components/BadgesAndTags';
export const SearchResultsPage = ({ searchQuery }) => {
    const navigate = useNavigate();
    const { currentUser, users: allUsers, teams: allTeams, reloadWorkspace } = useWorkspace();
    const onConnectTrigger = async (id) => { await api.post(`/api/users/connect/${id}`); await reloadWorkspace(); };
    const onViewProfile = (id) => navigate(`/profile/${id}`);
    const onViewTeam = (id) => navigate(`/teams/${id}`);
    const [activeTab, setActiveTab] = useState('users');
    const query = searchQuery.toLowerCase();
    // Search filter
    const matchedUsers = allUsers.filter(u => u.id !== currentUser.id && (u.name.toLowerCase().includes(query) ||
        u.college.toLowerCase().includes(query) ||
        u.skillsToTeach.some(s => s.toLowerCase().includes(query)) ||
        u.skillsToLearn.some(s => s.toLowerCase().includes(query))));
    const matchedTeams = allTeams.filter(t => t.name.toLowerCase().includes(query) ||
        t.tagline.toLowerCase().includes(query) ||
        t.requiredSkills.some(s => s.toLowerCase().includes(query)) ||
        t.hackathonName.toLowerCase().includes(query));
    // Suggestions
    const relatedSuggestions = ['Next.js', 'PyTorch', 'Rust', 'Tailwind CSS', 'Figma'];
    return (<div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 font-sans pb-24 lg:pb-8 space-y-8">
      
      {/* Analytics info header */}
      <div className="border-b border-outline-custom/15 pb-5">
        <h1 className="text-xl font-extrabold text-text-primary font-display">
          Search Matrix Results
        </h1>
        <p className="text-text-secondary text-xs mt-1 font-medium">
          We located <b>{matchedUsers.length}</b> matched students and <b>{matchedTeams.length}</b> teams for key term <span className="text-primary-indigo font-bold italic">"{searchQuery || 'Everyone'}"</span>
        </p>
      </div>

      {/* Suggested skill chips */}
      <div className="flex flex-wrap items-center gap-2.5 bg-sahyog-bg/40 p-3.5 rounded-2xl border border-outline-custom/10">
        <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Alternative tags:</span>
        {relatedSuggestions.map(term => (<span key={term} className="text-[10px] font-bold bg-white px-2.5 py-1 rounded-full text-text-secondary border border-outline-custom/15 hover:text-primary-indigo hover:border-primary-indigo/30 cursor-pointer">
            {term}
          </span>))}
      </div>

      {/* Segmented Search Tabs */}
      <div className="flex border-b border-outline-custom/15 gap-4">
        <button onClick={() => setActiveTab('users')} className={`pb-3 text-xs font-bold tracking-wide relative ${activeTab === 'users' ? 'text-primary-indigo' : 'text-text-secondary'}`}>
          <span>Matched Campus Users ({matchedUsers.length})</span>
          {activeTab === 'users' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-indigo rounded-full"/>}
        </button>

        <button onClick={() => setActiveTab('teams')} className={`pb-3 text-xs font-bold tracking-wide relative ${activeTab === 'teams' ? 'text-primary-indigo' : 'text-text-secondary'}`}>
          <span>Hackathon Squads ({matchedTeams.length})</span>
          {activeTab === 'teams' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-indigo rounded-full"/>}
        </button>
      </div>

      {/* Search results listing container */}
      <div className="space-y-6">
        
        {/* USERS RESULT VIEW */}
        {activeTab === 'users' && (matchedUsers.length === 0 ? (<div className="bg-white p-12 rounded-[32px] border border-outline-custom/25 text-center">
              <p className="text-2xl">👤</p>
              <h4 className="text-xs font-bold text-text-primary mt-2">No Matching Student Portfolios</h4>
              <p className="text-text-secondary text-[11px] mt-1">Try seeking simple technology names such as "React" or "Python".</p>
            </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedUsers.map((user) => {
                const isConnected = currentUser.connections.includes(user.id);
                const isSent = (currentUser.sentRequests || []).includes(user.id);
                return (<div key={user.id} className="bg-white p-5 rounded-[32px] border border-outline-custom/30 hover:border-primary-indigo/35 transition-all shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover"/>
                        <MatchScoreBadge score={84}/>
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-text-primary">{user.name}</h4>
                        <p className="text-[10px] text-text-secondary truncate mt-0.5">{user.college}</p>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-normal line-clamp-2">{user.bio}</p>
                      {user.isOpenToLearnAnything && <OpenToLearnBadge />}
                    </div>

                    <div className="flex justify-between items-center pt-3.5 border-t border-outline-custom/10">
                      <button onClick={() => onViewProfile(user.id)} className="text-[10px] font-black text-text-secondary hover:text-primary-indigo">
                        See Portfolio
                      </button>
                      <button
                        onClick={() => !isConnected && !isSent && onConnectTrigger(user.id)}
                        disabled={isConnected || isSent}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${isConnected
                          ? 'bg-slate-100 text-slate-700 cursor-not-allowed border border-slate-200'
                          : isSent
                              ? 'bg-amber-50 text-amber-700 border border-amber-200 cursor-not-allowed'
                              : 'bg-primary-indigo/5 text-primary-indigo hover:bg-primary-indigo/10'}`}
                      >
                        {isConnected ? 'Connected' : isSent ? 'Request Sent' : 'Send Invite'}
                      </button>
                    </div>
                  </div>);
            })}
            </div>))}

        {/* TEAMS RESULT VIEW */}
        {activeTab === 'teams' && (matchedTeams.length === 0 ? (<div className="bg-white p-12 rounded-[32px] border border-outline-custom/25 text-center">
              <p className="text-2xl">👥</p>
              <h4 className="text-xs font-bold text-text-primary mt-2">No Matching Squad Profiles</h4>
              <p className="text-text-secondary text-[11px] mt-1">Try seeking theme keywords like "Healthcare" or "AI".</p>
            </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matchedTeams.map((team) => (<div key={team.id} className="bg-white p-5 rounded-[32px] border border-outline-custom/30 hover:border-primary-indigo/35 transition-all shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[9px] font-black text-primary-indigo bg-primary-indigo/5 px-2 py-0.5 rounded-full">
                        {team.hackathonName}
                      </span>
                      <span className="text-[9px] font-bold text-text-secondary">
                        {team.members.length}/{team.maxSize} Full
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-text-primary">{team.name}</h4>
                      <p className="text-[10px] text-text-secondary italic mt-0.5">"{team.tagline}"</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {team.requiredSkills.map(s => (<span key={s} className="text-[9px] bg-sahyog-bg text-text-secondary px-2 py-0.5 rounded-full border">
                          {s}
                        </span>))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-3 border-t border-outline-custom/10">
                    <button onClick={() => onViewTeam(team.id)} className="px-4 py-2 bg-primary-indigo text-white rounded-xl text-[10px] font-black uppercase">
                      Inspect Team
                    </button>
                  </div>
                </div>))}
            </div>))}

      </div>

    </div>);
};
