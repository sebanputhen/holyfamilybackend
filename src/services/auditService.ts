import { Request } from 'express';
import { AuditLog } from '../models/AuditLog';

export async function logAudit(
  req: Request | null,
  action: string,
  resourceType: string,
  resourceId: string = '',
  details: string = '',
  overrideUser?: { id: any; name: string; role: string }
): Promise<void> {
  try {
    const user = overrideUser || (req as any)?.user;
    const ipAddress =
      req?.headers['x-forwarded-for']?.toString() ||
      req?.socket?.remoteAddress ||
      '';
    const userAgent = req?.headers['user-agent'] || '';

    await AuditLog.create({
      timestamp: new Date(),
      userId: user?._id || user?.id || null,
      userName: user?.name || 'System / Anonymous',
      userRole: user?.role || 'Guest',
      action,
      resourceType,
      resourceId,
      details,
      ipAddress,
      userAgent,
    });
  } catch (err: any) {
    console.error('Failed to write audit log:', err.message);
  }
}
