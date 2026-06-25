import express from 'express';
import { getMessages, sendMessage } from '../controllers/messageController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:userId', protect, getMessages);
router.post('/:userId', protect, sendMessage);

export default router;