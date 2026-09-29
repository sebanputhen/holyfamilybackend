import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../models/Role';

const router = Router();

router.get('/', getSettings);
router.put('/', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), updateSettings);

export default router;
