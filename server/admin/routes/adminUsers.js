import express from 'express';
import adminProtect from '../middleware/adminMiddleware.js';
import { getAllUsers, getUserById, suspendUser, activateUser, deleteUser, editUser } from '../controllers/adminUserController.js';

const router = express.Router();
router.use(adminProtect);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id/suspend', suspendUser);
router.put('/:id/activate', activateUser);
router.put('/:id/edit', editUser);
router.delete('/:id', deleteUser);
export default router;