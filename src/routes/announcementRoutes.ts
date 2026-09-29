import { Router } from 'express';
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcementController';
import { authenticate, optionalAuthenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../models/Role';

const router = Router();

router.get('/', optionalAuthenticate, getAnnouncements);

router.post('/', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), createAnnouncement);
router.put('/:id', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), updateAnnouncement);
router.delete('/:id', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), deleteAnnouncement);

export default router;
