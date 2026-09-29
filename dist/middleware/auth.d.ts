import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';
export interface AuthenticatedRequest extends Request {
    user?: IUser;
}
export declare function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
export declare function optionalAuthenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
