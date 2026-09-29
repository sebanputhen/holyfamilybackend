import { Response } from 'express';
import { AuditLog } from '../models/AuditLog';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export async function getAuditLogs(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 30;
    const resourceType = req.query.resourceType as string;
    const action = req.query.action as string;
    const userName = req.query.userName as string;

    const query: any = {};
    if (resourceType) query.resourceType = resourceType;
    if (action) query.action = new RegExp(action, 'i');
    if (userName) query.userName = new RegExp(userName, 'i');

    const total = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    sendSuccess(res, logs, 'Audit logs retrieved', 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (err: any) {
    sendError(res, err.message, 'GET_AUDIT_LOGS_FAILED', 500);
  }
}
