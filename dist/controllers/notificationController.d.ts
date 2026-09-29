import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare function getNotifications(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function sendNotification(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function markAsRead(req: AuthenticatedRequest, res: Response): Promise<void>;
