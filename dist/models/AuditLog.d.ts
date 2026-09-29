import mongoose, { Document } from 'mongoose';
export interface IAuditLog extends Document {
    timestamp: Date;
    userId?: mongoose.Types.ObjectId;
    userName: string;
    userRole: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    details?: string;
    ipAddress?: string;
    userAgent?: string;
}
export declare const AuditLog: mongoose.Model<IAuditLog, {}, {}, {}, mongoose.Document<unknown, {}, IAuditLog, {}, {}> & IAuditLog & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
