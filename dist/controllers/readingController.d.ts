import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare function getReading(req: Request, res: Response): Promise<void>;
export declare function upsertReading(req: AuthenticatedRequest, res: Response): Promise<void>;
