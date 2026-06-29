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

    const io = req.app.get('io');
    io.to(req.params.userId).emit('receiveMessage', message);

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

// GET /api/messages/conversations — fetch latest message details for all unique chat partners
export const getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ]
    }).sort({ createdAt: -1 });

    const conversations = [];
    const seenPartners = new Set();

    messages.forEach(msg => {
      const partnerId = msg.sender.toString() === req.user.id
        ? msg.receiver.toString()
        : msg.sender.toString();

      if (!seenPartners.has(partnerId)) {
        seenPartners.add(partnerId);
        conversations.push({
          partnerId,
          lastMessageAt: msg.createdAt,
          lastMessageContent: msg.content,
          sender: msg.sender.toString(),
        });
      }
    });

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};