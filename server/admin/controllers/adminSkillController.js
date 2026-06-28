import User from '../../models/User.js';

export const getSkillStats = async (req, res) => {
  try {
    const users = await User.find().select('skillsToTeach skillsToLearn');
    const teachMap = {};
    const learnMap = {};

    users.forEach(u => {
      (u.skillsToTeach || []).forEach(s => {
        const key = s.trim();
        teachMap[key] = (teachMap[key] || 0) + 1;
      });
      (u.skillsToLearn || []).forEach(s => {
        const key = s.trim();
        learnMap[key] = (learnMap[key] || 0) + 1;
      });
    });

    const allSkills = new Set([
      ...Object.keys(teachMap),
      ...Object.keys(learnMap)
    ]);

    const skills = Array.from(allSkills).map(skill => ({
      skill,
      teaches: teachMap[skill] || 0,
      learns: learnMap[skill] || 0,
      total: (teachMap[skill] || 0) + (learnMap[skill] || 0)
    })).sort((a, b) => b.total - a.total);

    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adminSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Query required' });
    const regex = new RegExp(q, 'i');

    const [users, teams] = await Promise.all([
      User.find({
        $or: [{ name: regex }, { email: regex }, { college: regex }]
      }).select('-password').limit(10),
      Team.find({
        $or: [{ name: regex }, { hackathonName: regex }]
      }).populate('owner', 'name').limit(10)
    ]);

    res.json({ users, teams });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};