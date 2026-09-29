import { Router } from 'express';
import {
  getHistoryTimeline,
  createMilestone,
  updateMilestone,
  deleteMilestone,
} from '../controllers/historyController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../models/Role';

const router = Router();

router.get('/', getHistoryTimeline);

router.post('/', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), createMilestone);
router.put('/:id', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), updateMilestone);
router.delete('/:id', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), deleteMilestone);

export default router;
