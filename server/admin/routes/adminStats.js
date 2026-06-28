import express from 'express';
import adminProtect from '../middleware/adminMiddleware.js';
import { getStats } from '../controllers/adminStatsController.js';

const router = express.Router();
router.get('/', adminProtect, getStats);
export default router;