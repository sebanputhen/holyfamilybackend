import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare function getAnnouncements(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function createAnnouncement(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function updateAnnouncement(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function deleteAnnouncement(req: AuthenticatedRequest, res: Response): Promise<void>;
