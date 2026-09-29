import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
/**
 * Ensures that if the user is a Koottayma Leader, they can only access resources
 * that belong strictly to their assigned Koottayma unit.
 * Admin and Super Admin bypass this restriction.
 */
export declare function verifyKoottaymaOwnership(koottaymaIdParamName?: string): (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
