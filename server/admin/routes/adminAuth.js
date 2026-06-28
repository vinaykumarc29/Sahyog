import express from 'express';
import { adminLogin, adminGetMe } from '../controllers/adminAuthController.js';
import adminProtect from '../middleware/adminMiddleware.js';

const router = express.Router();
router.post('/login', adminLogin);
router.get('/me', adminProtect, adminGetMe);
export default router;