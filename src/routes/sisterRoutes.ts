import { Router } from 'express';
import {
  getSisters,
  getSisterById,
  createSister,
  updateSister,
  deleteSister,
} from '../controllers/sisterController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../models/Role';

const router = Router();

router.get('/', getSisters);
router.get('/:id', getSisterById);

router.post('/', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), createSister);
router.put('/:id', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), updateSister);
router.delete('/:id', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), deleteSister);

export default router;
