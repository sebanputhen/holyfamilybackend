import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare function getMassSchedules(req: Request, res: Response): Promise<void>;
export declare function createMassSchedule(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function updateMassSchedule(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function deleteMassSchedule(req: AuthenticatedRequest, res: Response): Promise<void>;
