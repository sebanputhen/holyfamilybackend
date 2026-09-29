import { Router } from 'express';
import {
  getPrayerMeetings,
  createPrayerMeeting,
  updatePrayerMeeting,
  deletePrayerMeeting,
} from '../controllers/prayerMeetingController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../models/Role';

const router = Router();

router.get('/', authenticate, getPrayerMeetings);

// Koottayma Leader, Admin, Super Admin can create/submit prayer meetings
router.post(
  '/',
  authenticate,
  requireRole(UserRole.KOOTTAYMA_LEADER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  createPrayerMeeting
);

router.put(
  '/:id',
  authenticate,
  requireRole(UserRole.KOOTTAYMA_LEADER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  updatePrayerMeeting
);

// Admin & Super Admin only can delete prayer meetings
router.delete(
  '/:id',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  deletePrayerMeeting
);

export default router;
