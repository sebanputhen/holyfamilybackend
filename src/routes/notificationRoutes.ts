import { Router } from 'express';
import {
  getNotifications,
  sendNotification,
  markAsRead,
} from '../controllers/notificationController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../models/Role';

const router = Router();

router.get('/', authenticate, getNotifications);
router.post('/read/:id', authenticate, markAsRead);

router.post(
  '/',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  sendNotification
);

export default router;
