import express from 'express';
import { getMessages, sendMessage, getUnreadCount } from '../controllers/messageController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// IMPORTANT: /unread-count must be defined BEFORE /:userId to avoid being swallowed by the wildcard
router.get('/unread-count', protect, getUnreadCount);
router.get('/:userId', protect, getMessages);
router.post('/:userId', protect, sendMessage);

export default router;