import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare function getAlbums(req: Request, res: Response): Promise<void>;
export declare function getAlbumById(req: Request, res: Response): Promise<void>;
export declare function createAlbum(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function addItemToAlbum(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function deleteAlbum(req: AuthenticatedRequest, res: Response): Promise<void>;
