import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare function getHistoryTimeline(req: Request, res: Response): Promise<void>;
export declare function createMilestone(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function updateMilestone(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function deleteMilestone(req: AuthenticatedRequest, res: Response): Promise<void>;
