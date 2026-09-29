import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare function getSisters(req: Request, res: Response): Promise<void>;
export declare function getSisterById(req: Request, res: Response): Promise<void>;
export declare function createSister(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function updateSister(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function deleteSister(req: AuthenticatedRequest, res: Response): Promise<void>;
