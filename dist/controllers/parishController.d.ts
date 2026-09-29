import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare function getParish(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function updateParish(req: AuthenticatedRequest, res: Response): Promise<void>;
