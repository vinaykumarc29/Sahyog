const fallbackAvatar =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';

export const normalizeUser = (user = {}) => {
  const id = user._id || user.id;
  return {
    ...user,
    id,
    _id: id,
    avatar: user.avatarUrl || user.avatar || fallbackAvatar,
    github: user.githubUrl || user.github || '',
    linkedin: user.linkedinUrl || user.linkedin || '',
    skillsToTeach: user.skillsToTeach || [],
    skillsToLearn: user.skillsToLearn || [],
    connections: (user.connections || []).map(item => item._id || item.id || item.toString()),
    pendingRequests: (user.pendingRequests || []).map(item => item._id || item.id || item.toString()),
    sentRequests: (user.sentRequests || []).map(item => item._id || item.id || item.toString()),
    isOpenToLearnAnything: Boolean(user.openToLearnAll ?? user.isOpenToLearnAnything),
  };
};

export const normalizeTeam = (team = {}) => {
  const id = team._id || team.id;
  const ownerId = team.owner?._id || team.owner?.id || team.owner;
  return {
    ...team,
    id,
    _id: id,
    name: team.name || team.hackathonName || 'Untitled Squad',
    tagline: team.tagline || team.theme || 'Open hackathon collaboration',
    ownerId: ownerId?.toString?.() || ownerId,
    hackathonDate: team.eventDate || team.hackathonDate || null, // alias for display
    eventDate: team.eventDate || null,
    members: (team.members || []).map(item => item._id || item.id || item.toString()),
    applications: (team.applications || []).map(app => ({
      ...app,
      id: app._id || app.id,
      // Map userId (backend field) -> applicantId (frontend convention)
      applicantId: app.applicantId || app.userId?._id?.toString() || app.userId?.toString?.() || app.userId,
    })),
    requiredSkills: team.requiredSkills || [],
    description: team.description || '',
    status: team.status || 'open',
  };
};
