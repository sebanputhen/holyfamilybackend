import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare function getFamiliesDirectory(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getFamilyById(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function createFamily(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function updateFamily(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function deleteFamily(req: AuthenticatedRequest, res: Response): Promise<void>;
