import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => 
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      gender,
      college,
      bio,
      avatarUrl,
      skillsToTeach,
      skillsToLearn,
      openToLearnAll,
      githubUrl,
      linkedinUrl,
    } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ 
  name, email, password: hashed, gender, college, bio, avatarUrl,
  skillsToTeach, skillsToLearn, openToLearnAll, githubUrl, linkedinUrl
});
    const safeUser = user.toObject();
    delete safeUser.password;
    res.status(201).json({ token: generateToken(user._id), user: safeUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    if (user.isSuspended) {
      return res.status(403).json({ message: 'Your account has been suspended. Please contact support.' });
    }

    const safeUser = user.toObject();
    delete safeUser.password;
    res.json({ token: generateToken(user._id), user: safeUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isSuspended) {
      return res.status(403).json({ message: 'Your account has been suspended. Please contact support.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
