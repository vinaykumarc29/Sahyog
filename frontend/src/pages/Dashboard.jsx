import React from 'react';
import { TRENDING_SKILLS } from '../data';
import { StatCard, MatchScoreBadge, OpenToLearnBadge } from '../components/BadgesAndTags';
import { Compass, Users, Sparkles, MessageSquare, Plus, ArrowRight, UserPlus, Check, Flame } from 'lucide-react';
export const Dashboard = ({ currentUser, allUsers, allTeams, notifications, activePosts, setActiveTab, onAcceptConnection, onRejectConnection, onTriggerCreateTeam }) => {
    // Calculate some analytics
    const connectionCount = currentUser.connections.length;
    const requestsCount = currentUser.pendingRequests.length;
    const matchPercentageAverage = 94; // static aesthetic display
    // Filter out current user and already connected users for recommendations
    const recommendedUsers = allUsers
        .filter(u => u.id !== currentUser.id && !currentUser.connections.includes(u.id))
        .slice(0, 3);
    // Filter suggested teams based on required skills overlap
    const suggestedTeams = allTeams.slice(0, 2);
    // Filter incoming connection requests
    const incomingRequests = allUsers.filter(u => currentUser.pendingRequests.includes(u.id));
    return (<div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 font-sans pb-24 lg:pb-8">
      
      {/* 1. Welcome Header Section */}
      <div className="bg-gradient-to-br from-primary-indigo/90 via-indigo-900 to-[#1B1B23] p-8 lg:p-10 rounded-[32px] text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-accent-cyan/15 blur-[80px]"/>
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 blur-[50px]"/>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-accent-cyan uppercase tracking-wider">
              <Flame className="w-4 h-4 animate-bounce"/>
              <span>Campus Synergy Level: Gold</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold font-display leading-tight">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="text-white/70 text-sm max-w-xl">
              You are currently synced with <b>{currentUser.college}</b>. There are 14 new peer matches and 3 hackathons starting this week!
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={onTriggerCreateTeam} className="flex items-center gap-2 px-5 py-3 bg-white text-primary-indigo rounded-full text-xs font-extrabold shadow-lg hover:scale-[1.02] transition-transform">
              <Plus className="w-4 h-4 text-primary-indigo stroke-[3]"/>
              <span>Assemble Squad</span>
            </button>
            <button onClick={() => setActiveTab('matches')} className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-teal-500 to-success-custom text-white rounded-full text-xs font-extrabold shadow-lg hover:scale-[1.02] transition-transform">
              <Sparkles className="w-4 h-4"/>
              <span>Review Match Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Statistical Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users className="w-5.5 h-5.5"/>} label="Active Connections" value={connectionCount} change="+2 connected this week"/>
        <StatCard icon={<Sparkles className="w-5.5 h-5.5"/>} label="Overlap Match Level" value={`${matchPercentageAverage}%`} change="Top 5% on campus"/>
        <StatCard icon={<Compass className="w-5.5 h-5.5"/>} label="Team Collaborations" value={allTeams.filter(t => t.members.includes(currentUser.id)).length} change="1 application pending"/>
        <StatCard icon={<MessageSquare className="w-5.5 h-5.5"/>} label="Unread Messages" value={3} change="Last message 4m ago" isPositive={false}/>
      </div>

      {/* 3. Grid Structure for Main Dashboard widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Recommendations & Teams */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Connection Requests Banner (if any) */}
          {incomingRequests.length > 0 && (<div className="bg-gradient-to-r from-[#FCF8FF] to-indigo-50/50 p-6 rounded-3xl border border-primary-indigo/15 shadow-sm">
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                <UserPlus className="w-4.5 h-4.5 text-primary-indigo"/>
                <span>Pending Connection Invites ({incomingRequests.length})</span>
              </h4>
              <div className="space-y-3.5">
                {incomingRequests.map(user => (<div key={user.id} className="bg-white p-4 rounded-2xl border border-outline-custom/15 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-full object-cover border border-primary-indigo/10"/>
                      <div>
                        <h5 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                          {user.name}
                          {user.isOpenToLearnAnything && <OpenToLearnBadge />}
                        </h5>
                        <p className="text-[10px] text-text-secondary">{user.college}</p>
                        <p className="text-[10px] text-text-secondary/70 mt-1 truncate max-w-[320px]">Can Teach: <b>{user.skillsToTeach.slice(0, 3).join(', ')}</b></p>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                      <button onClick={() => onRejectConnection(user.id)} className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl text-xs font-bold transition-all">
                        Decline
                      </button>
                      <button onClick={() => onAcceptConnection(user.id)} className="px-4 py-2 bg-primary-indigo hover:bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-primary-indigo/10 transition-all flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 stroke-[3]"/>
                        <span>Accept Invite</span>
                      </button>
                    </div>
                  </div>))}
              </div>
            </div>)}

          {/* Suggested Collaborators Widget */}
          <div className="bg-white p-6 rounded-[32px] border border-outline-custom/30 shadow-card space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-outline-custom/10">
              <div>
                <h3 className="text-lg font-extrabold text-text-primary font-display">Recommended Peer Matches</h3>
                <p className="text-text-secondary text-xs mt-0.5 font-medium">Students looking to learn what you teach (or vice-versa)</p>
              </div>
              <button onClick={() => setActiveTab('matches')} className="text-xs font-bold text-primary-indigo hover:underline flex items-center gap-1">
                <span>View Grid</span>
                <ArrowRight className="w-3.5 h-3.5"/>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recommendedUsers.map((user) => {
            // Compute skill overlaps for UI matching indicator
            const teachOverlap = user.skillsToTeach.filter(s => currentUser.skillsToLearn.includes(s));
            const learnOverlap = user.skillsToLearn.filter(s => currentUser.skillsToTeach.includes(s));
            const score = teachOverlap.length > 0 ? 88 : 72; // simulated high-fidelity match scores
            return (<div key={user.id} className="bg-[#FCF8FF]/80 p-5 rounded-3xl border border-outline-custom/15 flex flex-col justify-between hover:border-primary-indigo/25 transition-all shadow-sm">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"/>
                        <MatchScoreBadge score={score}/>
                      </div>

                      <div>
                        <h4 className="text-xs font-black text-text-primary truncate">{user.name}</h4>
                        <p className="text-[10px] text-text-secondary truncate mt-0.5">{user.college}</p>
                      </div>

                      <div className="space-y-1.5">
                        <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Offers to Teach:</p>
                        <div className="flex flex-wrap gap-1">
                          {user.skillsToTeach.slice(0, 3).map(skill => (<span key={skill} className="text-[9px] font-bold bg-white text-primary-indigo px-2 py-0.5 rounded-full border border-primary-indigo/5">
                              {skill}
                            </span>))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-outline-custom/10 flex items-center justify-between gap-2">
                      <button onClick={() => setActiveTab(`profile-${user.id}`)} className="text-[10px] font-bold text-text-secondary hover:text-primary-indigo hover:underline">
                        View Portfolio
                      </button>
                      <button onClick={() => onAcceptConnection(user.id)} className="p-1.5 bg-primary-indigo hover:bg-indigo-600 text-white rounded-full transition-transform hover:scale-105">
                        <UserPlus className="w-3.5 h-3.5"/>
                      </button>
                    </div>
                  </div>);
        })}
            </div>
          </div>

          {/* Suggested Hackathon Teams */}
          <div className="bg-white p-6 rounded-[32px] border border-outline-custom/30 shadow-card space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-outline-custom/10">
              <div>
                <h3 className="text-lg font-extrabold text-text-primary font-display">Squads Seeking Your Skills</h3>
                <p className="text-text-secondary text-xs mt-0.5 font-medium">Forming groups targeting Tailwind CSS, React, or Figma</p>
              </div>
              <button onClick={() => setActiveTab('teams')} className="text-xs font-bold text-primary-indigo hover:underline flex items-center gap-1">
                <span>Browse Teams</span>
                <ArrowRight className="w-3.5 h-3.5"/>
              </button>
            </div>

            <div className="space-y-4">
              {suggestedTeams.map((team) => (<div key={team.id} className="p-5 rounded-2xl bg-[#FCF8FF]/50 border border-outline-custom/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-primary-indigo/20 transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-text-primary">{team.name}</span>
                      <span className="text-[9px] bg-primary-indigo/10 text-primary-indigo px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        {team.hackathonName}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary font-medium max-w-xl">{team.tagline}</p>
                    <div className="flex flex-wrap gap-1">
                      {team.requiredSkills.map(skill => (<span key={skill} className="text-[9px] bg-white text-text-secondary px-2 py-0.5 rounded-full border border-outline-custom/25 font-semibold">
                          {skill}
                        </span>))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto justify-end border-t md:border-t-0 border-outline-custom/10 pt-4 md:pt-0">
                    <span className="text-[10px] font-bold text-text-secondary">
                      {team.members.length}/{team.maxSize} members
                    </span>
                    <button onClick={() => setActiveTab(`team-${team.id}`)} className="px-4 py-2 bg-white hover:bg-slate-50 border border-outline-custom/30 text-text-primary font-bold text-xs rounded-xl shadow-sm transition-all">
                      Join Squad
                    </button>
                  </div>
                </div>))}
            </div>
          </div>

        </div>

        {/* Right Column: Mini widgets (Popular Skills, Hackathons, Feed overview) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Quick Shortcuts */}
          <div className="bg-white p-6 rounded-[32px] border border-outline-custom/30 shadow-card space-y-4">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider pb-1 border-b border-outline-custom/10">Quick Actions</h4>
            <div className="grid grid-cols-1 gap-3">
              <button onClick={onTriggerCreateTeam} className="p-3.5 bg-primary-indigo/5 hover:bg-primary-indigo/10 rounded-2xl flex flex-col items-center gap-2 text-center group transition-colors">
                <Plus className="w-5 h-5 text-primary-indigo"/>
                <span className="text-[10px] font-black text-text-primary">Create Team</span>
              </button>
            </div>
          </div>

          {/* Campus Skill Pool Index */}
          <div className="bg-white p-6 rounded-[32px] border border-outline-custom/30 shadow-card space-y-4">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider pb-1 border-b border-outline-custom/10">Top Campus Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {TRENDING_SKILLS.slice(0, 8).map(skill => (<span key={skill} className="px-2.5 py-1 bg-sahyog-bg text-text-secondary text-[10px] font-bold rounded-full border border-outline-custom/10">
                  {skill}
                </span>))}
            </div>
          </div>

        </div>

      </div>

    </div>);
};
