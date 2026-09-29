import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare function getOrganizations(req: Request, res: Response): Promise<void>;
export declare function getOrganizationById(req: Request, res: Response): Promise<void>;
export declare function createOrganization(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function updateOrganization(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function deleteOrganization(req: AuthenticatedRequest, res: Response): Promise<void>;
