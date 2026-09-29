import { Router } from 'express';
import {
  getPersons,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson,
} from '../controllers/personController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../models/Role';

const router = Router();

router.get('/', authenticate, getPersons);
router.get('/:id', authenticate, getPersonById);

router.post('/', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), createPerson);
router.put('/:id', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), updatePerson);
router.delete('/:id', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), deletePerson);

export default router;
