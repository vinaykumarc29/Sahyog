import express from 'express';
import { getTeams, getTeamById, createTeam, applyToTeam, approveApplication } from '../controllers/teamController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getTeams);
router.get('/:id', protect, getTeamById);
router.post('/', protect, createTeam);
router.post('/:id/apply', protect, applyToTeam);
router.put('/:id/approve/:userId', protect, approveApplication);

export default router;