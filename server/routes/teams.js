import express from 'express';
import { getTeams, getTeamById, createTeam, applyToTeam, approveApplication, deleteTeam, removeMember ,rejectApplication} from '../controllers/teamController.js';import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getTeams);
router.get('/:id', protect, getTeamById);
router.post('/', protect, createTeam);
router.post('/:id/apply', protect, applyToTeam);
router.put('/:id/approve/:userId', protect, approveApplication);
router.put('/:id/reject/:userId', protect, rejectApplication);
router.delete('/:id', protect, deleteTeam);
router.delete('/:id/members/:userId', protect, removeMember);

export default router;