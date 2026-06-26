import Team from '../models/Team.js';

export const getTeams = async (req, res) => {
  try {
    const teams = await Team.find({ status: 'open' }).populate('owner', 'name college');
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('owner', 'name college')
      .populate('members', 'name college avatarUrl');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createTeam = async (req, res) => {
  try {
    const { name, tagline, hackathonName, theme, eventDate, description, requiredSkills, maxSize } = req.body;
    const team = await Team.create({
      name, tagline, hackathonName, theme, eventDate, description,
      requiredSkills, maxSize,
      owner: req.user.id,
      members: [req.user.id]
    });
    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const applyToTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (team.status === 'full') return res.status(400).json({ message: 'Team is full' });
    
    // Check if user is owner or already a member
    if (team.owner.toString() === req.user.id)
      return res.status(400).json({ message: 'You are the owner of this team' });
    if (team.members.includes(req.user.id))
      return res.status(400).json({ message: 'Already a member of this team' });

    const alreadyApplied = team.applications.find(a => a.userId.toString() === req.user.id);
    if (alreadyApplied) return res.status(400).json({ message: 'Already applied' });
    
    team.applications.push({ userId: req.user.id, message: req.body.message || '' });
    await team.save();
    res.json({ message: 'Application sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const approveApplication = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (team.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });
      
    const application = team.applications.find(a => a.userId.toString() === req.params.userId);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    
    if (application.status === 'approved' || team.members.includes(req.params.userId)) {
      return res.status(400).json({ message: 'User is already a member or application is already approved' });
    }

    application.status = 'approved';
    team.members.push(req.params.userId);
    if (team.members.length >= team.maxSize) team.status = 'full';
    await team.save();
    res.json({ message: 'Member approved', team });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
