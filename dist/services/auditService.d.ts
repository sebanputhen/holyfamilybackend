import { Request } from 'express';
export declare function logAudit(req: Request | null, action: string, resourceType: string, resourceId?: string, details?: string, overrideUser?: {
    id: any;
    name: string;
    role: string;
}): Promise<void>;
