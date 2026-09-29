import { Router } from 'express';
import { getDashboardAnalytics } from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../models/Role';

const router = Router();

router.get(
  '/dashboard',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  getDashboardAnalytics
);

export default router;
