import jwt from 'jsonwebtoken';
import User from '../../models/User.js';

const adminProtect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (!user.isAdmin) return res.status(403).json({ message: 'Admin access only' });
    if (user.isSuspended) return res.status(403).json({ message: 'Account suspended' });
    req.user = { id: user._id.toString(), isAdmin: true };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default adminProtect;