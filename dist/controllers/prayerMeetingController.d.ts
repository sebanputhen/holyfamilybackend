import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare function getPrayerMeetings(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function createPrayerMeeting(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function updatePrayerMeeting(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function deletePrayerMeeting(req: AuthenticatedRequest, res: Response): Promise<void>;
