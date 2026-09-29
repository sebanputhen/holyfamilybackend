import { Router } from 'express';
import {
  getPriests,
  getPriestById,
  createPriest,
  updatePriest,
  deletePriest,
} from '../controllers/priestController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../models/Role';

const router = Router();

router.get('/', getPriests);
router.get('/:id', getPriestById);

router.post('/', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), createPriest);
router.put('/:id', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), updatePriest);
router.delete('/:id', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), deletePriest);

export default router;
