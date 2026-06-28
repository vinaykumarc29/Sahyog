import User from '../../models/User.js';
import Team from '../../models/Team.js';
import Message from '../../models/Message.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('connections', 'name college avatarUrl')
      .populate('pendingRequests', 'name college');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const teams = await Team.find({ members: req.params.id })
      .populate('owner', 'name');
    const messageCount = await Message.countDocuments({
      $or: [{ sender: req.params.id }, { receiver: req.params.id }]
    });

    res.json({ user, teams, messageCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isAdmin) return res.status(403).json({ message: 'Cannot suspend admin' });
    user.isSuspended = true;
    await user.save();
    res.json({ message: 'User suspended', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const activateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isSuspended: false },
      { new: true }
    ).select('-password');
    res.json({ message: 'User activated', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isAdmin) return res.status(403).json({ message: 'Cannot delete admin' });

    await User.updateMany({}, {
      $pull: {
        connections: req.params.id,
        pendingRequests: req.params.id,
        sentRequests: req.params.id
      }
    });
    await Team.deleteMany({ owner: req.params.id });
    await Team.updateMany(
      { members: req.params.id },
      { $pull: { members: req.params.id } }
    );
    await Message.deleteMany({
      $or: [{ sender: req.params.id }, { receiver: req.params.id }]
    });
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editUser = async (req, res) => {
  try {
    const { name, college, bio, skillsToTeach, skillsToLearn, isAdmin } = req.body;
    
    let updateFields = { name, college, bio, skillsToTeach, skillsToLearn };
    if (isAdmin !== undefined) {
      if (req.params.id === req.user.id && isAdmin === false) {
        return res.status(400).json({ message: 'You cannot remove your own administrator access.' });
      }
      updateFields.isAdmin = isAdmin;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};