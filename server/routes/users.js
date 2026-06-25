import express from 'express';
import { getUser, updateProfile, getMatches, sendConnectionRequest, acceptConnection } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/matches', protect, getMatches);
router.get('/:id', protect, getUser);
router.put('/profile', protect, updateProfile);
router.post('/connect/:id', protect, sendConnectionRequest);
router.put('/connect/:id/accept', protect, acceptConnection);

export default router;