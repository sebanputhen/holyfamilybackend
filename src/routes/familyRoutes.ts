import { Router } from 'express';
import {
  getFamiliesDirectory,
  getFamilyById,
  createFamily,
  updateFamily,
  deleteFamily,
} from '../controllers/familyController';
import { authenticate, optionalAuthenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../models/Role';

const router = Router();

// Directory access (with privacy filters based on role or guest)
router.get('/', optionalAuthenticate, getFamiliesDirectory);
router.get('/:id', optionalAuthenticate, getFamilyById);

// Admin & Super Admin CRUD
router.post('/', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), createFamily);
router.put('/:id', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), updateFamily);
router.delete('/:id', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), deleteFamily);

export default router;
