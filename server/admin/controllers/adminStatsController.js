import User from '../../models/User.js';
import Team from '../../models/Team.js';
import Message from '../../models/Message.js';

export const getStats = async (req, res) => {
  try {
    const [totalUsers, totalTeams, totalMessages, suspendedUsers] = await Promise.all([
      User.countDocuments(),
      Team.countDocuments(),
      Message.countDocuments(),
      User.countDocuments({ isSuspended: true }),
    ]);

    const users = await User.find().select('connections');
    const totalConnections = Math.floor(
      users.reduce((acc, u) => acc + (u.connections?.length || 0), 0) / 2
    );

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const messagesToday = await Message.countDocuments({
      createdAt: { $gte: todayStart }
    });

    const activeTeams = await Team.countDocuments({ status: 'open' });

    // user growth last 12 months
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const from = new Date();
      from.setMonth(from.getMonth() - i);
      from.setDate(1);
      from.setHours(0, 0, 0, 0);
      const to = new Date(from);
      to.setMonth(to.getMonth() + 1);
      const count = await User.countDocuments({
        createdAt: { $gte: from, $lt: to }
      });
      months.push({
        month: from.toLocaleString('default', { month: 'short' }),
        count
      });
    }

    res.json({
      totalUsers,
      totalTeams,
      totalMessages,
      totalConnections,
      messagesToday,
      activeTeams,
      suspendedUsers,
      userGrowth: months
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};