import User from '../models/User.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, college, bio, skillsToTeach, skillsToLearn, openToLearnAll, githubUrl, linkedinUrl } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, college, bio, skillsToTeach, skillsToLearn, openToLearnAll, githubUrl, linkedinUrl },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const allUsers = await User.find({ _id: { $ne: req.user.id } }).select('-password');

    const matches = allUsers.map(u => {
      const iCanTeachThem = u.openToLearnAll
        ? currentUser.skillsToTeach.length
        : currentUser.skillsToTeach.filter(s => u.skillsToLearn.includes(s)).length;

      const theyCanTeachMe = currentUser.openToLearnAll
        ? u.skillsToTeach.length
        : u.skillsToTeach.filter(s => currentUser.skillsToLearn.includes(s)).length;

      return { user: u, score: iCanTeachThem + theyCanTeachMe };
    })
    .filter(m => m.score > 0)
    .sort((a, b) => b.score - a.score);

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendConnectionRequest = async (req, res) => {
  try {
    const receiver = await User.findById(req.params.id);
    if (!receiver) return res.status(404).json({ message: 'User not found' });
    
    // Check if trying to connect with self
    if (req.user.id === req.params.id)
      return res.status(400).json({ message: 'Cannot send connection request to yourself' });
      
    // Check if already connected
    if (receiver.connections.includes(req.user.id))
      return res.status(400).json({ message: 'Already connected with this user' });

    if (receiver.pendingRequests.includes(req.user.id))
      return res.status(400).json({ message: 'Request already sent' });
      
    receiver.pendingRequests.push(req.user.id);
    await receiver.save();
    res.json({ message: 'Request sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const acceptConnection = async (req, res) => {
  try {
    const me = await User.findById(req.user.id);
    const requester = await User.findById(req.params.id);
    if (!me.pendingRequests.includes(req.params.id))
      return res.status(400).json({ message: 'No request found' });
    // remove from pending, add to connections both sides
    me.pendingRequests = me.pendingRequests.filter(id => id.toString() !== req.params.id);
    me.connections.push(req.params.id);
    requester.connections.push(req.user.id);
    await me.save();
    await requester.save();
    res.json({ message: 'Connection accepted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
