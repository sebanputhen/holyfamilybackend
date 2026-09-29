import { Router } from 'express';
import { getReading, upsertReading } from '../controllers/readingController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../models/Role';

const router = Router();

router.get('/', getReading);
router.post('/', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), upsertReading);

export default router;
