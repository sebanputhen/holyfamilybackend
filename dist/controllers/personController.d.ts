import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare function getPersons(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getPersonById(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function createPerson(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function updatePerson(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function deletePerson(req: AuthenticatedRequest, res: Response): Promise<void>;
