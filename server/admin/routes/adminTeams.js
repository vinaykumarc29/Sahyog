import express from 'express';
import adminProtect from '../middleware/adminMiddleware.js';
import { getAllTeams, getTeamById, deleteTeam, removeMemberAdmin, closeTeam } from '../controllers/adminTeamController.js';

const router = express.Router();
router.use(adminProtect);
router.get('/', getAllTeams);
router.get('/:id', getTeamById);
router.delete('/:id', deleteTeam);
router.delete('/:id/members/:userId', removeMemberAdmin);
router.put('/:id/close', closeTeam);
export default router;