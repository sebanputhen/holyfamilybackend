import { Router } from 'express';
import {
  getMassSchedules,
  createMassSchedule,
  updateMassSchedule,
  deleteMassSchedule,
} from '../controllers/massController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../models/Role';

const router = Router();

router.get('/', getMassSchedules);

router.post('/', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), createMassSchedule);
router.put('/:id', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), updateMassSchedule);
router.delete('/:id', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), deleteMassSchedule);

export default router;
