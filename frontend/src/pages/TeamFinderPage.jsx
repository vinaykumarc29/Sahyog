import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext.jsx';
import { Search, Plus, Users, SlidersHorizontal } from 'lucide-react';

export const TeamFinderPage = () => {
    const navigate = useNavigate();
    const { teams: allTeams, currentUser } = useWorkspace();
    const onViewTeamDetail = (id) => navigate(`/teams/${id}`);
    const onNavigateToCreateTeam = () => navigate('/teams/create');

    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    const filteredTeams = allTeams.filter(team => {
        const matchesSearch =
            team.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.tagline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.requiredSkills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesFilter =
            activeFilter === 'all' ? true :
            activeFilter === 'pending' ? (team.applications || []).some(a =>
                String(a.applicantId || a.userId?._id || a.userId) === String(currentUser.id) &&
                a.status === 'pending'
            ) :
            activeFilter === 'mine' ? (
                String(team.ownerId) === String(currentUser.id) ||
                (team.members || []).map(String).includes(String(currentUser.id))
            ) : true;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 font-sans pb-24 lg:pb-8 space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-outline-custom/15 pb-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-text-primary font-display flex items-center gap-2">
                        <Users className="text-primary-indigo w-6 h-6"/>
                        <span>Hackathon Squad Finder</span>
                    </h1>
                    <p className="text-text-secondary text-xs mt-0.5 font-medium">Discover open positions inside highly motivated hackathon squads</p>
                </div>
                <button onClick={onNavigateToCreateTeam} className="gradient-cta text-white px-5 py-3 rounded-full text-xs font-black shadow-lg shadow-primary-indigo/20 flex items-center gap-2 hover:scale-[1.02] transition-transform">
                    <Plus className="w-4 h-4 stroke-[3]"/>
                    <span>Publish New Squad</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Sidebar */}
                <div className="lg:col-span-3 space-y-6 bg-white p-6 rounded-3xl border border-outline-custom/30 shadow-sm">
                    <h3 className="text-xs font-black text-text-primary uppercase tracking-wider pb-2 border-b border-outline-custom/10 flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-primary-indigo"/>
                        <span>Refine Search</span>
                    </h3>

                    {/* Search */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary"/>
                            <input
                                type="text"
                                placeholder="Search skills, team names..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-3.5 py-2.5 bg-sahyog-bg rounded-xl border border-outline-custom/40 focus:outline-none focus:ring-1 focus:ring-primary-indigo text-xs text-text-primary"
                            />
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Filter Teams</label>
                        {[
                            { key: 'all', label: 'All Teams' },
                            { key: 'pending', label: 'My Applications' },
                            { key: 'mine', label: 'My Teams' },
                        ].map(f => (
                            <button key={f.key} onClick={() => setActiveFilter(f.key)}
                                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors
                                    ${activeFilter === f.key
                                        ? 'bg-primary-indigo text-white'
                                        : 'bg-sahyog-bg text-text-secondary hover:bg-primary-indigo/10'
                                    }`}>
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Teams Grid */}
                <div className="lg:col-span-9 space-y-6">
                    {filteredTeams.length === 0 ? (
                        <div className="bg-white p-12 rounded-[32px] border border-outline-custom/30 text-center space-y-4">
                            <p className="text-3xl">🧩</p>
                            <h4 className="text-base font-bold text-text-primary">No Teams Found</h4>
                            <p className="text-text-secondary text-xs max-w-sm mx-auto">
                                {activeFilter === 'pending' ? 'You have no pending applications.' :
                                 activeFilter === 'mine' ? "You haven't created or joined any teams yet." :
                                 'Be the first to create a squad!'}
                            </p>
                            {activeFilter === 'all' && (
                                <button onClick={onNavigateToCreateTeam} className="mt-2 px-5 py-2.5 bg-primary-indigo text-white text-xs font-bold rounded-full shadow-md">
                                    Create Team Now
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredTeams.map((team) => {
                                const isFull = team.members.length >= team.maxSize;
                                const isOwner = String(team.ownerId) === String(currentUser.id);
                                const isMember = (team.members || []).map(String).includes(String(currentUser.id));
                                const hasPending = (team.applications || []).some(a =>
                                    String(a.applicantId || a.userId?._id || a.userId) === String(currentUser.id) &&
                                    a.status === 'pending'
                                );

                                return (
                                    <div key={team.id} className="bg-white p-6 rounded-[32px] border border-outline-custom/30 hover:border-primary-indigo/35 transition-all shadow-card flex flex-col justify-between space-y-5">

                                        <div className="space-y-4">
                                            {/* Tags row */}
                                            <div className="flex flex-wrap justify-between items-start gap-2">
                                                <span className="text-[9px] font-black bg-primary-indigo/5 text-primary-indigo px-2.5 py-1 rounded-full border border-primary-indigo/10 uppercase tracking-widest">
                                                    {team.hackathonName}
                                                </span>
                                                <div className="flex gap-1.5 flex-wrap justify-end">
                                                    {isOwner && (
                                                        <span className="text-[9px] font-black bg-indigo-50 text-primary-indigo px-2 py-1 rounded-full border border-primary-indigo/20 uppercase">
                                                            Owner
                                                        </span>
                                                    )}
                                                    {isMember && !isOwner && (
                                                        <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full border border-emerald-100 uppercase">
                                                            Member
                                                        </span>
                                                    )}
                                                    {hasPending && (
                                                        <span className="text-[9px] font-black bg-yellow-50 text-yellow-600 px-2 py-1 rounded-full border border-yellow-100 uppercase">
                                                            Applied
                                                        </span>
                                                    )}
                                                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${isFull ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-success-custom border border-emerald-100'}`}>
                                                        {isFull ? 'Full' : 'Open'}
                                                    </span>
                                                </div>
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

                                            {/* Skills */}
                                            <div className="space-y-2">
                                                <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Required Skills:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {team.requiredSkills.map(skill => (
                                                        <span key={skill} className="text-[9px] bg-sahyog-bg text-text-primary px-2 py-0.5 rounded-full border border-outline-custom/15 font-semibold">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex justify-between items-center pt-4 border-t border-outline-custom/10">
                                            <div className="flex items-center gap-1.5 text-text-secondary text-xs font-semibold">
                                                <Users className="w-4 h-4 text-primary-indigo"/>
                                                <span>{team.members.length} / {team.maxSize} Joined</span>
                                            </div>
                                            <button onClick={() => onViewTeamDetail(team.id)} className="px-4 py-2.5 bg-primary-indigo hover:bg-indigo-600 text-white rounded-xl text-[10px] font-black tracking-wider uppercase transition-all shadow-md shadow-primary-indigo/5">
                                                Inspect Squad
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};