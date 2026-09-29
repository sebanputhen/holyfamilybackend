import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare function login(req: Request, res: Response): Promise<void>;
export declare function refreshToken(req: Request, res: Response): Promise<void>;
export declare function logout(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getMe(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function forgotPassword(req: Request, res: Response): Promise<void>;
