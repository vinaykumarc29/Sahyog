import express from 'express';
import adminProtect from '../middleware/adminMiddleware.js';
import { getSkillStats, adminSearch } from '../controllers/adminSkillController.js';

const router = express.Router();
router.use(adminProtect);
router.get('/', getSkillStats);
router.get('/search', adminSearch);
export default router;