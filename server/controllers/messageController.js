import Message from '../models/Message.js';

// GET /api/messages/:userId — fetch conversation history + mark received messages as read
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ]
    }).sort({ createdAt: 1 });

    // Mark all messages sent by the partner to the current user as read
    await Message.updateMany(
      { sender: req.params.userId, receiver: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/messages/:userId — send a new message
export const sendMessage = async (req, res) => {
  try {
    const message = await Message.create({
      sender: req.user.id,
      receiver: req.params.userId,
      content: req.body.content
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/messages/unread-count — total unread messages for current user + last message timestamp
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user.id,
      isRead: false,
    });

    // Get the most recent unread message for its timestamp
    const lastUnread = await Message.findOne({
      receiver: req.user.id,
      isRead: false,
    }).sort({ createdAt: -1 }).select('createdAt');

    res.json({
      count,
      lastMessageAt: lastUnread ? lastUnread.createdAt : null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};