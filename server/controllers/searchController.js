import User from '../models/User.js';

export const search = async (req, res) => {
  try {
    const { q, type } = req.query;
    if (!q) return res.status(400).json({ message: 'Query required' });
    const regex = new RegExp(q, 'i');
    let users;
    if (type === 'skills') {
      users = await User.find({
        $or: [{ skillsToTeach: regex }, { skillsToLearn: regex }]
      }).select('-password');
    } else {
      users = await User.find({ name: regex }).select('-password');
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};