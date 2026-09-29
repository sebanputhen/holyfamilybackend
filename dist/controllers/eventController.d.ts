import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare function getEvents(req: Request, res: Response): Promise<void>;
export declare function getEventById(req: Request, res: Response): Promise<void>;
export declare function createEvent(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function updateEvent(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function deleteEvent(req: AuthenticatedRequest, res: Response): Promise<void>;
