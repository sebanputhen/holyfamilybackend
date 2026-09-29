import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare function getSettings(req: Request, res: Response): Promise<void>;
export declare function updateSettings(req: AuthenticatedRequest, res: Response): Promise<void>;
