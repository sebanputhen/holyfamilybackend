import { Router } from 'express';
import {
  getUsers,
  getUserMetrics,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../models/Role';

const router = Router();

// Strictly Super Admin restricted
router.use(authenticate, requireRole(UserRole.SUPER_ADMIN));

router.get('/', getUsers);
router.get('/metrics', getUserMetrics);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
