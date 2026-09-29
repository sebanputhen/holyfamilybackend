import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { UserRole } from '../models/Role';
export declare function requireRole(...allowedRoles: UserRole[]): (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare function requirePermission(...requiredPermissions: string[]): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
