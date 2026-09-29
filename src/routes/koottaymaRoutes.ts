import { Router } from 'express';
import {
  getKoottaymas,
  getKoottaymaById,
  getKoottaymaDashboard,
  createKoottayma,
  updateKoottayma,
  deleteKoottayma,
} from '../controllers/koottaymaController';
import { authenticate, optionalAuthenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { verifyKoottaymaOwnership } from '../middleware/ownership';
import { UserRole } from '../models/Role';

const router = Router();

router.get('/', optionalAuthenticate, getKoottaymas);
router.get('/dashboard/:id?', authenticate, verifyKoottaymaOwnership('id'), getKoottaymaDashboard);
router.get('/:id', authenticate, verifyKoottaymaOwnership('id'), getKoottaymaById);

// Admin & Super Admin only
router.post('/', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), createKoottayma);
router.put('/:id', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), updateKoottayma);
router.delete('/:id', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), deleteKoottayma);

export default router;
