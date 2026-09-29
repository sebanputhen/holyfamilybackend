import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare function getPriests(req: Request, res: Response): Promise<void>;
export declare function getPriestById(req: Request, res: Response): Promise<void>;
export declare function createPriest(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function updatePriest(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function deletePriest(req: AuthenticatedRequest, res: Response): Promise<void>;
