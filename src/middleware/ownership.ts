import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { UserRole } from '../models/Role';
import { sendError } from '../utils/response';

/**
 * Ensures that if the user is a Koottayma Leader, they can only access resources
 * that belong strictly to their assigned Koottayma unit.
 * Admin and Super Admin bypass this restriction.
 */
export function verifyKoottaymaOwnership(koottaymaIdParamName: string = 'id') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const user = req.user;
    if (!user) {
      sendError(res, 'Authentication required', 'UNAUTHORIZED', 401);
      return;
    }

    // Super Admin and Admin have parish-wide oversight
    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) {
      return next();
    }

    const requestedKoottaymaId =
      req.params[koottaymaIdParamName] ||
      req.body.koottaymaId ||
      req.query.koottaymaId;

    if (user.role === UserRole.KOOTTAYMA_LEADER) {
      if (!user.assignedKoottayma) {
        sendError(
          res,
          'You are not assigned to any Koottayma unit',
          'FORBIDDEN',
          403
        );
        return;
      }

      if (
        requestedKoottaymaId &&
        user.assignedKoottayma.toString() !== requestedKoottaymaId.toString()
      ) {
        sendError(
          res,
          'Access denied: You are only authorized to access your assigned Koottayma',
          'FORBIDDEN',
          403
        );
        return;
      }
    }

    next();
  };
}
