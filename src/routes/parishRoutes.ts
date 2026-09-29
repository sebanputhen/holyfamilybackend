import { Router } from 'express';
import { getParish, updateParish } from '../controllers/parishController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../models/Role';

const router = Router();

router.get('/', getParish);
router.put('/', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), updateParish);

export default router;
