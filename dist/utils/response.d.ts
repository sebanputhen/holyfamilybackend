import { Response } from 'express';
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export declare function sendSuccess<T>(res: Response, data: T, message?: string, statusCode?: number, pagination?: PaginationMeta): Response<any, Record<string, any>>;
export declare function sendError(res: Response, message?: string, code?: string, statusCode?: number, errors?: any): Response<any, Record<string, any>>;
