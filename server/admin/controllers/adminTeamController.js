import Team from '../../models/Team.js';
import User from '../../models/User.js';

export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('owner', 'name email college')
      .populate('members', 'name college avatarUrl')
      .sort({ createdAt: -1 });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('owner', 'name email college')
      .populate('members', 'name college avatarUrl')
      .populate('applications.userId', 'name college');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeMemberAdmin = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (team.owner.toString() === req.params.userId)
      return res.status(400).json({ message: 'Cannot remove team owner' });
    team.members = team.members.filter(m => m.toString() !== req.params.userId);
    if (team.status === 'full') team.status = 'open';
    await team.save();
    res.json({ message: 'Member removed', team });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const closeTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { status: 'full' },
      { new: true }
    );
    res.json({ message: 'Team closed', team });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};