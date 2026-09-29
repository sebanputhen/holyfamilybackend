import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare function globalSearch(req: AuthenticatedRequest, res: Response): Promise<void>;
