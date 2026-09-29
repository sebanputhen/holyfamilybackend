import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare function getKoottaymas(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getKoottaymaById(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getKoottaymaDashboard(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function createKoottayma(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function updateKoottayma(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function deleteKoottayma(req: AuthenticatedRequest, res: Response): Promise<void>;
