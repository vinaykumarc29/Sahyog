import React, { useState } from 'react';
import { MatchScoreBadge, OpenToLearnBadge } from '../components/BadgesAndTags';
import { Search, Sparkles, UserPlus, Check, MapPin, SlidersHorizontal } from 'lucide-react';
export const MatchesPage = ({ currentUser, allUsers, onConnectTrigger, onViewProfile }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCollege, setSelectedCollege] = useState('All');
    const [onlyOpenToLearnAll, setOnlyOpenToLearnAll] = useState(false);
    // Dynamically build college list from allUsers
    const colleges = ['All', ...Array.from(new Set((allUsers || []).map(u => u.college).filter(Boolean)))];
    // Match calculation — use server score if available, else compute client-side
    const computeUserMatch = (user) => {
        // If server already computed a score, use it
        if (typeof user._serverScore === 'number') {
            const teachOverlap = (user.skillsToTeach || []).filter(s => (currentUser.skillsToLearn || []).includes(s));
            const learnOverlap = (user.skillsToLearn || []).filter(s => (currentUser.skillsToTeach || []).includes(s));
            // Normalise server score to a percentage-like display value (1 overlap = ~15%)
            const displayScore = Math.min(50 + user._serverScore * 15, 99);
            return { score: displayScore, teachOverlap, learnOverlap };
        }
        const teachToLearnOverlap = (user.skillsToTeach || []).filter(s => (currentUser.skillsToLearn || []).includes(s));
        const learnToTeachOverlap = (user.skillsToLearn || []).filter(s => (currentUser.skillsToTeach || []).includes(s));
        const totalOverlapCount = teachToLearnOverlap.length + learnToTeachOverlap.length;
        let score = 50;
        if (totalOverlapCount > 0) score += Math.min(totalOverlapCount * 12, 45);
        if (user.college === currentUser.college) score += 5;
        return { score, teachOverlap: teachToLearnOverlap, learnOverlap: learnToTeachOverlap };
    };

    // Filter peers
    const peers = allUsers.filter(u => u.id !== currentUser.id);
    const filteredPeers = peers.map(user => {
        const matchAnalysis = computeUserMatch(user);
        return {
            ...user,
            match: matchAnalysis
        };
    }).filter(user => {
        // Filter by text search
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.skillsToTeach.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
            user.skillsToLearn.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
        // Filter by college
        const matchesCollege = selectedCollege === 'All' || user.college === selectedCollege;
        // Filter by open to learn any status
        const matchesOpenAll = !onlyOpenToLearnAll || user.isOpenToLearnAnything;
        return matchesSearch && matchesCollege && matchesOpenAll;
    }).sort((a, b) => b.match.score - a.match.score); // sort by highest match percentage!
    return (<div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 font-sans pb-24 lg:pb-8 space-y-8">
      
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-custom/15 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary font-display flex items-center gap-2">
            <Sparkles className="text-primary-indigo w-6 h-6 animate-pulse"/>
            <span>Collegiate Skill Synergy Matrix</span>
          </h1>
          <p className="text-text-secondary text-xs mt-0.5 font-medium">Instantly discover peers whose academic goals align perfectly with your expertise</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Filters Sidebar */}
        <div className="lg:col-span-3 space-y-6 bg-white p-6 rounded-3xl border border-outline-custom/30 shadow-sm">
          <h3 className="text-xs font-black text-text-primary uppercase tracking-wider pb-2 border-b border-outline-custom/10 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-primary-indigo"/>
            <span>Refine Search Matrix</span>
          </h3>

          {/* Search Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Search Keywords</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary"/>
              <input type="text" placeholder="Search skills, names..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-3.5 py-2.5 bg-sahyog-bg rounded-xl border border-outline-custom/40 focus:outline-none focus:ring-1 focus:ring-primary-indigo text-xs text-text-primary"/>
            </div>
          </div>

          {/* College Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Filter by College</label>
            <select value={selectedCollege} onChange={(e) => setSelectedCollege(e.target.value)} className="w-full px-3.5 py-2.5 bg-sahyog-bg rounded-xl border border-outline-custom/40 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-indigo cursor-pointer">
              {colleges.map(c => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>

          {/* Toggle: Open to learn anything */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Open to Learn Anything Only</span>
            <input type="checkbox" checked={onlyOpenToLearnAll} onChange={(e) => setOnlyOpenToLearnAll(e.target.checked)} className="w-4 h-4 text-primary-indigo focus:ring-primary-indigo border-outline-custom rounded cursor-pointer"/>
          </div>
        </div>

        {/* Matches Grid */}
        <div className="lg:col-span-9 space-y-6">
          
          {filteredPeers.length === 0 ? (<div className="bg-white p-12 rounded-[32px] border border-outline-custom/30 text-center space-y-4">
              <p className="text-3xl">🔍</p>
              <h4 className="text-base font-bold text-text-primary">No Matching Peers Found</h4>
              <p className="text-text-secondary text-xs max-w-sm mx-auto">Try widening your search tags, filtering for "All Colleges", or toggling off specific filters.</p>
            </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPeers.map((user) => {
                const isConnected = currentUser.connections.includes(user.id);
                const isSent = currentUser.sentRequests.includes(user.id);
                return (<div key={user.id} className="bg-white p-6 rounded-[32px] border border-outline-custom/30 hover:border-primary-indigo/35 transition-all shadow-card flex flex-col justify-between space-y-5">
                    
                    {/* Top Identity Block */}
                    <div className="space-y-4">
                      
                      {/* Avatar, name, college, match score */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover border border-outline-custom/25"/>
                          <div>
                            <h4 className="text-xs font-black text-text-primary flex items-center gap-1.5">
                              {user.name}
                            </h4>
                            <p className="text-[10px] text-text-secondary flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-primary-indigo"/>
                              <span>{user.college}</span>
                            </p>
                          </div>
                        </div>
                        <MatchScoreBadge score={user.match.score}/>
                      </div>

                      <p className="text-xs text-text-secondary leading-relaxed font-medium line-clamp-2">
                        {user.bio}
                      </p>

                      {user.isOpenToLearnAnything && (<div>
                          <OpenToLearnBadge />
                        </div>)}

                      {/* Skill Overlap Visualizer section */}
                      <div className="space-y-3 bg-sahyog-bg/40 p-4 rounded-2xl border border-outline-custom/10">
                        
                        {/* They teach what you learn */}
                        {user.match.teachOverlap.length > 0 && (<div className="space-y-1">
                            <p className="text-[9px] font-black text-success-custom uppercase tracking-wider flex items-center gap-1">
                              <span>✓</span>
                              <span>They can teach what you seek:</span>
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {user.match.teachOverlap.map(s => (<span key={s} className="text-[9px] font-bold bg-emerald-50 text-success-custom px-2 py-0.5 rounded-full border border-emerald-100">
                                  {s}
                                </span>))}
                            </div>
                          </div>)}

                        {/* You teach what they learn */}
                        {user.match.learnOverlap.length > 0 && (<div className="space-y-1">
                            <p className="text-[9px] font-black text-primary-indigo uppercase tracking-wider flex items-center gap-1">
                              <span>✓</span>
                              <span>They seek what you can teach:</span>
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {user.match.learnOverlap.map(s => (<span key={s} className="text-[9px] font-bold bg-indigo-50 text-primary-indigo px-2 py-0.5 rounded-full border border-primary-indigo/5">
                                  {s}
                                </span>))}
                            </div>
                          </div>)}

                        {user.match.teachOverlap.length === 0 && user.match.learnOverlap.length === 0 && (<p className="text-[10px] text-text-secondary/80 italic font-semibold">General academic peer matching</p>)}

                      </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-between items-center pt-4 border-t border-outline-custom/10">
                      <button onClick={() => onViewProfile(user.id)} className="text-[11px] font-extrabold text-text-secondary hover:text-primary-indigo hover:underline">
                        View Full Portfolio
                      </button>

                      <button
                        onClick={() => !isConnected && !isSent && onConnectTrigger(user.id)}
                        disabled={isConnected || isSent}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-wider uppercase shadow-sm transition-all flex items-center gap-1.5 ${isConnected
                          ? 'bg-slate-100 text-slate-700 cursor-not-allowed'
                          : isSent
                              ? 'bg-amber-50 text-amber-700 border border-amber-200 cursor-not-allowed'
                              : 'bg-primary-indigo text-white hover:bg-indigo-600'}`}
                      >
                        {isConnected ? (<>
                            <Check className="w-3 h-3 stroke-[3]"/>
                            <span>Connected</span>
                          </>) : isSent ? (<span>Pending Request</span>) : (<>
                            <UserPlus className="w-3.5 h-3.5"/>
                            <span>Connect Synergy</span>
                          </>)}
                      </button>
                    </div>

                  </div>);
            })}
            </div>)}

        </div>

      </div>

    </div>);
};
