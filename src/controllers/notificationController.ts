import { Response } from 'express';
import { Notification } from '../models/Notification';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAudit } from '../services/auditService';
import { UserRole } from '../models/Role';

export async function getNotifications(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?._id;
    const query: any = {
      $or: [
        { targetAudience: 'All' },
        { targetUserId: userId },
      ],
    };

    if (req.user?.role === UserRole.KOOTTAYMA_LEADER && req.user?.assignedKoottayma) {
      query.$or.push({ targetKoottaymaId: req.user.assignedKoottayma });
      query.$or.push({ targetAudience: 'Koottayma Leaders' });
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50);
    sendSuccess(res, notifications, 'Notifications retrieved');
  } catch (err: any) {
    sendError(res, err.message, 'GET_NOTIFICATIONS_FAILED', 500);
  }
}

export async function sendNotification(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { title, message, category, targetAudience, targetKoottaymaId } = req.body;
    if (!title || !message) {
      sendError(res, 'Title and message are required', 'BAD_REQUEST', 400);
      return;
    }

    const notification = await Notification.create({
      title,
      message,
      category: category || 'Announcement',
      targetAudience: targetAudience || 'All',
      targetKoottaymaId: targetKoottaymaId || null,
      sentBy: req.user?._id,
      sentAt: new Date(),
      status: 'Sent',
    });

    await logAudit(
      req,
      'Sent Notification',
      'Notification',
      notification._id.toString(),
      `Title: ${notification.title}, Audience: ${notification.targetAudience}`
    );

    sendSuccess(res, notification, 'Notification dispatched successfully', 201);
  } catch (err: any) {
    sendError(res, err.message, 'SEND_NOTIFICATION_FAILED', 500);
  }
}

export async function markAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (id === 'all') {
      await Notification.updateMany(
        { readBy: { $ne: userId } },
        { $addToSet: { readBy: userId } }
      );
      sendSuccess(res, null, 'All notifications marked as read');
      return;
    }

    const notification = await Notification.findById(id);
    if (!notification) {
      sendError(res, 'Notification not found', 'NOT_FOUND', 404);
      return;
    }

    if (!notification.readBy.some((r) => r.toString() === userId?.toString())) {
      notification.readBy.push(userId as any);
      await notification.save();
    }

    sendSuccess(res, notification, 'Notification marked as read');
  } catch (err: any) {
    sendError(res, err.message, 'MARK_READ_FAILED', 500);
  }
}
