import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { UserRole, Role } from '../models/Role';
import { sendError } from '../utils/response';

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required', 'UNAUTHORIZED', 401);
      return;
    }

    // Super Admin has access to everything
    if (req.user.role === UserRole.SUPER_ADMIN) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(
        res,
        'You do not have permission to perform this action',
        'FORBIDDEN',
        403
      );
      return;
    }

    next();
  };
}

export function requirePermission(...requiredPermissions: string[]) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      sendError(res, 'Authentication required', 'UNAUTHORIZED', 401);
      return;
    }

    if (req.user.role === UserRole.SUPER_ADMIN) {
      return next();
    }

    try {
      const roleDoc = await Role.findOne({ name: req.user.role });
      if (!roleDoc) {
        sendError(res, 'Role not configured in system', 'FORBIDDEN', 403);
        return;
      }

      const hasAll = requiredPermissions.every((perm) =>
        roleDoc.permissions.includes(perm) || roleDoc.permissions.includes('*')
      );

      if (!hasAll) {
        sendError(
          res,
          'Insufficient permissions for this operation',
          'FORBIDDEN',
          403
        );
        return;
      }

      next();
    } catch (err: any) {
      sendError(res, 'Permission verification failed', 'SERVER_ERROR', 500);
    }
  };
}
