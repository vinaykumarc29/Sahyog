import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext.jsx';
import api from '../api/axios.js';
import { SkillTag, OpenToLearnBadge } from '../components/BadgesAndTags';
import { Code2, BriefcaseBusiness, ExternalLink, BookOpen, MapPin, Sparkles, Settings, ArrowLeft, MessageSquare, Calendar } from 'lucide-react';

export const ProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser, users: allUsers, teams: allTeams, reloadWorkspace } = useWorkspace();
    const viewingUser = allUsers.find(u => u.id === id) || (currentUser.id === id ? currentUser : null);
    const onBackToDashboard = () => navigate('/dashboard');
    const onInitiateChat = () => navigate('/chat');
    const onEditProfileTrigger = () => navigate('/profile/edit');
    const onToggleConnection = async (targetUserId) => {
        const targetId = targetUserId || viewingUser.id;
        if (targetId !== currentUser.id) {
            if ((currentUser.connections || []).includes(targetId)) {
                await api.delete(`/api/users/connect/${targetId}`);
            } else {
                await api.post(`/api/users/connect/${targetId}`);
            }
        }
        await reloadWorkspace();
    };
    if (!viewingUser) { navigate('/dashboard'); return null; }
    const isSelf = viewingUser.id === currentUser.id;
    // Retrieve full details of connections
    const connectedUsers = (allUsers || []).filter(u => (viewingUser.connections || []).includes(u.id));
    // Determine connection status
    const isConnected = (currentUser.connections || []).includes(viewingUser.id);
    const hasRequested = (currentUser.sentRequests || []).includes(viewingUser.id);
    const isIncomingRequest = (currentUser.pendingRequests || []).includes(viewingUser.id);
    // Teams the viewed user is part of
    const sharedTeams = (allTeams || []).filter(t => (t.members || []).includes(viewingUser.id));
    // Member since date
    const memberSince = viewingUser.createdAt
        ? new Date(viewingUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : null;

    return (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 font-sans pb-24 lg:pb-8">

            {/* Back button if viewing someone else */}
            {!isSelf && onBackToDashboard && (
                <button onClick={onBackToDashboard} className="inline-flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-primary-indigo transition-all py-1">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Match Hub</span>
                </button>
            )}

            {/* 1. Header Hero Banner */}
            <div className="bg-white rounded-[32px] border border-outline-custom/30 shadow-card overflow-hidden">

                {/* Cover banner */}
                <div className="h-44 bg-gradient-to-r from-primary-indigo via-indigo-500 to-accent-cyan relative">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                    {viewingUser.isOpenToLearnAnything && (
                        <div className="absolute top-4 right-4">
                            <OpenToLearnBadge />
                        </div>
                    )}
                </div>

                {/* Profile identity strip */}
                <div className="px-6 lg:px-8 pb-8 relative">
                    {/* Avatar */}
                    <div className="absolute top-[-56px] left-6 lg:left-8">
                        <img src={viewingUser.avatar} alt={viewingUser.name} className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg bg-white" />
                    </div>

                    <div className="pt-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-1.5">
                            <h1 className="text-2xl lg:text-3xl font-extrabold text-text-primary tracking-tight font-display">
                                {viewingUser.name}
                            </h1>
                            <p className="text-text-secondary text-xs font-semibold flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-primary-indigo" />
                                <span>{viewingUser.college}</span>
                            </p>
                            {memberSince && (
                                <p className="text-text-secondary text-xs font-semibold flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-primary-indigo" />
                                    <span>Member since {memberSince}</span>
                                </p>
                            )}
                            <p className="text-text-secondary text-sm max-w-2xl font-medium mt-2 leading-relaxed">
                                {viewingUser.bio}
                            </p>
                        </div>

                        {/* Action panel */}
                        <div className="flex flex-wrap gap-2.5 shrink-0">
                            {console.log(viewingUser.linkedin , viewingUser.github)}
                            {viewingUser.github && (
                                <Link to={viewingUser.github} target="_blank" rel="noreferrer" className="p-3 bg-sahyog-bg hover:bg-slate-100 rounded-2xl border border-outline-custom/25 text-text-secondary hover:text-text-primary transition-all">
                                    <Code2 className="w-4 h-4" />
                                </Link>
                            )}
                            {viewingUser.linkedin && (
                                <Link to={viewingUser.linkedin} target="_blank" rel="noreferrer" className="p-3 bg-sahyog-bg hover:bg-slate-100 rounded-2xl border border-outline-custom/25 text-text-secondary hover:text-text-primary transition-all">
                                    <BriefcaseBusiness className="w-4 h-4" />
                                </Link>
                            )}

                            {isSelf ? (
                                <button onClick={onEditProfileTrigger} className="flex items-center gap-2 px-5 py-3 bg-primary-indigo hover:bg-indigo-600 text-white rounded-full text-xs font-bold shadow-md shadow-primary-indigo/10 transition-all">
                                    <Settings className="w-4 h-4" />
                                    <span>Customize Profile</span>
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    {onInitiateChat && (
                                        <button onClick={() => onInitiateChat(viewingUser.id)} className="p-3 bg-primary-indigo/5 hover:bg-primary-indigo/10 text-primary-indigo rounded-2xl border border-primary-indigo/10 transition-colors">
                                            <MessageSquare className="w-4 h-4" />
                                        </button>
                                    )}
                                    {onToggleConnection && (
                                        <button
                                            onClick={() => onToggleConnection(viewingUser.id)}
                                            className={`px-5 py-3 rounded-full text-xs font-bold shadow-md transition-all ${isConnected
                                                ? 'bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600 border border-slate-200'
                                                : hasRequested
                                                    ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                                    : isIncomingRequest
                                                        ? 'bg-success-custom text-white'
                                                        : 'gradient-cta text-white shadow-primary-indigo/15'}`}
                                        >
                                            {isConnected ? 'Disconnect' : hasRequested ? 'Request Sent' : isIncomingRequest ? 'Accept Request' : 'Send Invite'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left: Skills + Connections */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Skills */}
                    <div className="bg-white p-6 rounded-[32px] border border-outline-custom/30 shadow-card space-y-5">
                        <h3 className="text-xs font-black text-text-primary uppercase tracking-wider pb-2 border-b border-outline-custom/10">Synergy Blueprint</h3>

                        <div className="space-y-3.5">
                            <p className="text-[10px] font-black text-text-secondary uppercase tracking-wider flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-primary-indigo" />
                                <span>Can Teach (Expertise):</span>
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {(viewingUser.skillsToTeach || []).length > 0
                                    ? (viewingUser.skillsToTeach || []).map(s => <SkillTag key={s} name={s} />)
                                    : <span className="text-xs text-text-secondary/60 italic">No skills listed yet</span>}
                            </div>
                        </div>

                        <div className="space-y-3.5 pt-2">
                            <p className="text-[10px] font-black text-text-secondary uppercase tracking-wider flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5 text-secondary-cyan" />
                                <span>Wants to Learn:</span>
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {(viewingUser.skillsToLearn || []).length > 0
                                    ? (viewingUser.skillsToLearn || []).map(s => <SkillTag key={s} name={s} />)
                                    : <span className="text-xs text-text-secondary/60 italic">No learning targets listed</span>}
                            </div>
                        </div>

                        {viewingUser.isOpenToLearnAnything && (
                            <div className="pt-2">
                                <OpenToLearnBadge />
                            </div>
                        )}
                    </div>

                    {/* Connections */}
                    <div className="bg-white p-6 rounded-[32px] border border-outline-custom/30 shadow-card space-y-4">
                        <h3 className="text-xs font-black text-text-primary uppercase tracking-wider pb-2 border-b border-outline-custom/10">
                            Connections ({(viewingUser.connections || []).length})
                        </h3>
                        {connectedUsers.length === 0 ? (
                            <p className="text-xs text-text-secondary/70 italic text-center py-4">No connected campus peers yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {connectedUsers.map(user => (
                                    <div key={user.id} className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                                            <div>
                                                <p className="text-xs font-bold text-text-primary">{user.name}</p>
                                                <p className="text-[9px] text-text-secondary truncate max-w-[150px]">{user.college}</p>
                                            </div>
                                        </div>
                                        {isSelf && (
                                            <button
                                                onClick={() => onToggleConnection(user.id)}
                                                className="text-[10px] font-bold text-red-500 hover:text-red-700 hover:underline px-2.5 py-1 bg-red-50 hover:bg-red-100 rounded-lg transition-colors shrink-0"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Teams + Bio expanded */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Teams this user is in */}
                    <div className="bg-white p-6 rounded-[32px] border border-outline-custom/30 shadow-card space-y-5">
                        <h3 className="text-xs font-black text-text-primary uppercase tracking-wider pb-2 border-b border-outline-custom/10">Active Hackathon Squads</h3>
                        {sharedTeams.length === 0 ? (
                            <p className="text-xs text-text-secondary/60 italic py-6 text-center">Not a member of any hackathon team yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {sharedTeams.map(team => (
                                    <div key={team.id} className="p-5 rounded-2xl bg-[#FCF8FF]/40 border border-outline-custom/15 space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-black text-text-primary">{team.name}</h4>
                                            <span className="text-[9px] bg-primary-indigo/10 text-primary-indigo px-2 py-0.5 rounded-full font-bold">{team.hackathonName}</span>
                                        </div>
                                        <p className="text-xs text-text-secondary font-medium leading-relaxed">{team.tagline || team.description}</p>
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {(team.requiredSkills || []).map(tag => (
                                                <span key={tag} className="text-[9px] bg-white border border-outline-custom/25 px-2.5 py-0.5 rounded-full font-semibold text-text-secondary">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* About / Extended Bio */}
                    <div className="bg-white p-6 rounded-[32px] border border-outline-custom/30 shadow-card space-y-5">
                        <h3 className="text-xs font-black text-text-primary uppercase tracking-wider pb-2 border-b border-outline-custom/10">About</h3>
                        {viewingUser.bio ? (
                            <p className="text-sm text-text-secondary leading-relaxed font-medium">{viewingUser.bio}</p>
                        ) : (
                            <p className="text-xs text-text-secondary/60 italic py-4 text-center">No bio written yet.</p>
                        )}
                        <div className="flex flex-wrap gap-3 pt-2">
                            {viewingUser.github && (
                                <a href={viewingUser.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-primary-indigo transition-colors">
                                    <Code2 className="w-4 h-4" />
                                    <span>GitHub</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                            {viewingUser.linkedin && (
                                <a href={viewingUser.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-primary-indigo transition-colors">
                                    <BriefcaseBusiness className="w-4 h-4" />
                                    <span>LinkedIn</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
