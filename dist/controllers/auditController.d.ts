import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare function getAuditLogs(req: AuthenticatedRequest, res: Response): Promise<void>;
