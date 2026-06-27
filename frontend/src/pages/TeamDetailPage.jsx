import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext.jsx';
import { useTeam } from '../hooks/useTeam.js';
import api from '../api/axios.js';
import { approveApplicantApi, rejectApplicantApi } from '../api/teamApi.js';
import { Users, Trash2, UserMinus, Calendar, ArrowLeft, AlertCircle, Send, UserCheck } from 'lucide-react';

export const TeamDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser, users: allUsers, reloadWorkspace } = useWorkspace();
    const { team, loading, error, refetch } = useTeam(id);
    const [showApplyPanel, setShowApplyPanel] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [applyError, setApplyError] = useState('');

    if (loading) return <div className="min-h-screen grid place-items-center text-xs text-text-secondary">Loading team...</div>;
    if (error || !team) {
        // use useEffect for navigation side-effect to avoid impure render, or just return null and let wrapper handle error
        return <div className="min-h-screen grid place-items-center text-xs text-red-500">Team not found or error occurred.</div>;
    }

    const onBack = () => navigate('/teams');
    const onApplySubmit = async (message) => { await api.post(`/api/teams/${id}/apply`, { message }); await refetch(); };
    const onHandleApplication = async (applicantUserId, action) => {
        if (action === 'approved') await approveApplicantApi(id, applicantUserId);
        else if (action === 'rejected') await rejectApplicantApi(id, applicantUserId);
        await refetch(); 
    };

    const onDeleteTeam = async () => {
        if (!window.confirm('Delete this team permanently?')) return;
        await api.delete(`/api/teams/${id}`);
        navigate('/teams');
        await reloadWorkspace();
    };

   const onRemoveMember = async (memberId) => {
    if (!window.confirm('Remove this member?')) return;
    await api.delete(`/api/teams/${id}/members/${memberId}`);
    await refetch();          // update TeamDetailPage
    reloadWorkspace();        // update TeamFinder in background — no await needed
};

    const isOwner = team.ownerId === currentUser.id;
    const isMember = (team.members || []).includes(currentUser.id);

    // Find actual user models for current members
    const memberUsers = (allUsers || []).filter(u => (team.members || []).includes(u.id));
    const ownerUser = (allUsers || []).find(u => u.id === team.ownerId);

    // Check if current user has already applied
    // app.userId is the backend field (not applicantId)
   const existingApplication = (team.applications || []).find(app => {
    const appUserId = String(app.applicantId || app.userId?._id || app.userId);
    return appUserId === String(currentUser.id) && app.status === 'pending';
});

    // Format event date
    const formattedDate = team.eventDate
        ? new Date(team.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'TBA';

  const handleApply = async (e) => {
    e.preventDefault();
    if (!coverLetter.trim()) return;
    setApplyError('');
    try {
        await onApplySubmit(coverLetter.trim());
        await refetch(); // add this — updates existingApplication immediately
        setCoverLetter('');
        setShowApplyPanel(false);
    } catch (err) {
        setApplyError(err.message || 'Failed to submit application');
    }
};

    return (
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 font-sans pb-24 lg:pb-8 space-y-8">

            {/* Back button */}
            <button onClick={onBack} className="inline-flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-primary-indigo transition-all py-1">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Team Finder</span>
            </button>

            {/* Hero Header */}
            <div className="bg-gradient-to-br from-indigo-900 to-[#1B1B23] p-8 lg:p-10 rounded-[32px] text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-accent-cyan/15 blur-[100px] rounded-full" />

                <div className="relative z-10 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black bg-white/10 text-accent-cyan px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {team.hackathonName}
                        </span>
                        <span className="text-[10px] font-black bg-white/5 text-white/80 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formattedDate}</span>
                        </span>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${team.status === 'full' ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                            {team.status === 'full' ? 'Full Squad' : 'Open Positions'}
                        </span>
                    </div>

                    <h1 className="text-2xl lg:text-3xl font-extrabold font-display">{team.name}</h1>
                    <p className="text-white/80 text-sm max-w-xl italic font-semibold">"{team.tagline}"</p>

                    <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-white/75">
                            <Users className="w-4 h-4 text-accent-cyan" />
                            <span>{(team.members || []).length} / {team.maxSize} Members joined</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left: Description + Members */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Project Brief */}
                    <div className="bg-white p-6 lg:p-8 rounded-[32px] border border-outline-custom/30 shadow-card space-y-4">
                        <h3 className="text-xs font-black text-text-primary uppercase tracking-wider pb-2 border-b border-outline-custom/10">Project Brief</h3>
                        <p className="text-xs text-text-secondary leading-relaxed font-medium">
                            {team.description || 'No description provided.'}
                        </p>
                    </div>

                    {/* Active Members */}
                    <div className="bg-white p-6 lg:p-8 rounded-[32px] border border-outline-custom/30 shadow-card space-y-5">
                        <h3 className="text-xs font-black text-text-primary uppercase tracking-wider pb-2 border-b border-outline-custom/10">Active Hackers</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {memberUsers.length > 0 ? memberUsers.map(member => {
                                const isLeader = member.id === team.ownerId;
                                return (
                                    <div key={member.id} className="p-4 rounded-2xl bg-sahyog-bg/50 border border-outline-custom/15 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-primary-indigo/10" />
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-text-primary flex items-center gap-1">
                                                    <span>{member.name}</span>
                                                    {isLeader && <span className="text-[8px] bg-primary-indigo/10 text-primary-indigo px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider">FOUNDER</span>}
                                                </p>
                                                <p className="text-[9px] text-text-secondary truncate">{member.college}</p>
                                            </div>
                                        </div>
                                        {/* owner can remove non-owner members */}
                                        {isOwner && !isLeader && (
                                            <button onClick={() => onRemoveMember(member.id)}
                                                className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
                                                <UserMinus className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                );
                            }) : (
                                <p className="text-xs text-text-secondary/60 italic col-span-2 text-center py-4">Member details loading...</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Recruitment panel */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Recruitment Status */}
                    <div className="bg-white p-6 rounded-[32px] border border-outline-custom/30 shadow-card space-y-5">
                        <h3 className="text-xs font-black text-text-primary uppercase tracking-wider pb-2 border-b border-outline-custom/10">Recruitment Status</h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1.5">Required Skills:</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {(team.requiredSkills || []).map(s => (
                                        <span key={s} className="text-[9px] bg-sahyog-bg text-text-secondary px-2.5 py-1 rounded-full border border-outline-custom/20 font-semibold">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Apply button */}
                            {!isMember && !existingApplication && !showApplyPanel && team.status !== 'full' && (
                                <button onClick={() => setShowApplyPanel(true)} className="w-full py-3.5 gradient-cta text-white text-xs font-black rounded-full shadow-lg shadow-primary-indigo/25 flex items-center justify-center gap-2 hover:scale-[1.01] transition-all">
                                    <Send className="w-4 h-4" />
                                    <span>Submit Joint Application</span>
                                </button>
                            )}

                            {team.status === 'full' && !isMember && (
                                <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-xs font-semibold">
                                    This squad is currently full. Check back later!
                                </div>
                            )}

                            {existingApplication && (
                                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-2xl border border-yellow-200 text-xs font-semibold flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0 text-yellow-600 mt-0.5" />
                                    <div>
                                        <p className="font-bold">Application Pending</p>
                                        <p className="text-[10px] text-yellow-700/90 mt-0.5">Your pitch has been transmitted to {ownerUser?.name || 'the team leader'}. Check chats for follow-ups.</p>
                                    </div>
                                </div>
                            )}

                            {isMember && (
                                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
                                    <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>You are a validated member of this squad!</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Apply Panel */}
                    {showApplyPanel && (
                        <div className="bg-white p-6 rounded-[32px] border border-primary-indigo/20 shadow-2xl space-y-4">
                            <h4 className="text-xs font-black text-text-primary uppercase">Draft Pitch Letter</h4>
                            {applyError && (
                                <p className="text-xs text-red-600 font-semibold bg-red-50 p-3 rounded-xl">{applyError}</p>
                            )}
                            <form onSubmit={handleApply} className="space-y-3.5">
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Tell the founder what you can contribute, past projects you built, or why you are excited to collaborate..."
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    className="w-full p-3.5 bg-sahyog-bg text-xs text-text-primary rounded-2xl border border-outline-custom/45 focus:outline-none focus:ring-1 focus:ring-primary-indigo resize-none"
                                />
                                <div className="flex gap-2 justify-end">
                                    <button type="button" onClick={() => { setShowApplyPanel(false); setApplyError(''); }} className="px-3.5 py-2 text-xs font-bold text-text-secondary hover:text-text-primary">
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-4 py-2 bg-primary-indigo hover:bg-indigo-600 text-white text-xs font-bold rounded-xl">
                                        Send Pitch
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Owner: Application Review */}
                    {isOwner && (
                        <div className="bg-white p-6 rounded-[32px] border border-outline-custom/30 shadow-card space-y-4">
                            <h3 className="text-xs font-black text-text-primary uppercase tracking-wider pb-2 border-b border-outline-custom/10">
                                Incoming Pitches ({(team.applications || []).filter(a => a.status === 'pending').length})
                            </h3>

                            {(team.applications || []).filter(a => a.status === 'pending').length === 0 ? (
                                <p className="text-xs text-text-secondary/70 italic text-center py-4">No pending applications at present.</p>
                            ) : (
                                <div className="space-y-3.5">
                                    {(team.applications || []).filter(a => a.status === 'pending').map((app) => {
                                        // Backend stores userId; normalizeTeam maps to applicantId
                                        const applicantId = app.applicantId || app.userId?._id || app.userId;
                                        const applicant = (allUsers || []).find(u => u.id === applicantId || u._id === applicantId);
                                        if (!applicant) return null;
                                        const appId = app._id || app.id;
                                        return (
                                            <div key={appId} className="p-4 rounded-2xl bg-sahyog-bg/60 border border-outline-custom/15 space-y-3 text-xs">
                                                <div className="flex items-center gap-2.5">
                                                    <img src={applicant.avatar} alt={applicant.name} className="w-8 h-8 rounded-full object-cover" />
                                                    <div>
                                                        <p className="font-bold text-text-primary">{applicant.name}</p>
                                                        <p className="text-[9px] text-text-secondary">{applicant.college}</p>
                                                    </div>
                                                </div>

                                                <p className="text-text-secondary leading-snug bg-white p-2.5 rounded-xl border border-outline-custom/5 italic">
                                                    "{app.message || app.coverLetter || 'No message provided.'}"
                                                </p>

                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => onHandleApplication(applicantId, 'rejected')}
                                                        className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-lg text-[10px] font-black tracking-wide transition-colors"
                                                    >
                                                        Decline
                                                    </button>
                                                    <button
                                                        onClick={() => onHandleApplication(applicantId, 'approved')}
                                                        className="px-3.5 py-1.5 bg-primary-indigo hover:bg-indigo-600 text-white rounded-lg text-[10px] font-black tracking-wide transition-colors"
                                                    >
                                                        Accept
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            {isOwner && (
                                <div className="pt-4 border-t border-outline-custom/10">
                                    <button onClick={onDeleteTeam}
                                        className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-black rounded-xl flex items-center justify-center gap-2 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Delete Team</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
