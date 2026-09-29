import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../models/Role';

const router = Router();

// Strictly Super Admin restricted
router.get('/', authenticate, requireRole(UserRole.SUPER_ADMIN), getAuditLogs);

export default router;
