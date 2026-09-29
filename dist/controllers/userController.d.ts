import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare function getUsers(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getUserMetrics(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function createUser(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function updateUser(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function deleteUser(req: AuthenticatedRequest, res: Response): Promise<void>;
