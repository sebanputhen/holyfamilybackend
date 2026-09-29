import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  timestamp: Date;
  userId?: mongoose.Types.ObjectId;
  userName: string;
  userRole: string;
  action: string; // e.g., 'User Login', 'Updated Family', 'Created Event', etc.
  resourceType: string; // 'Family', 'User', 'Person', 'Event', 'Announcement', 'Koottayma', etc.
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    timestamp: { type: Date, default: Date.now, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    userName: { type: String, required: true },
    userRole: { type: String, required: true },
    action: { type: String, required: true },
    resourceType: { type: String, required: true },
    resourceId: { type: String, default: '' },
    details: { type: String, default: '' },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: false }
);

AuditLogSchema.index({ timestamp: -1, resourceType: 1, action: 1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
