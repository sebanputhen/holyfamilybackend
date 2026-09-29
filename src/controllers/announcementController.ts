import { Request, Response } from 'express';
import { Announcement } from '../models/Announcement';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAudit } from '../services/auditService';
import { UserRole } from '../models/Role';

export async function getAnnouncements(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { priority, category } = req.query;
    const query: any = { isActive: true };

    if (priority) query.priority = priority;
    if (category) query.category = category;

    // Filter by target audience based on user role
    if (!req.user || req.user.role === UserRole.PARISHIONER) {
      query.$or = [{ targetAudience: 'All' }, { targetAudience: 'Parishioners' }];
    } else if (req.user.role === UserRole.KOOTTAYMA_LEADER) {
      query.$or = [
        { targetAudience: 'All' },
        { targetAudience: 'Parishioners' },
        { targetAudience: 'Koottayma Leaders' },
        { targetKoottaymaId: req.user.assignedKoottayma },
      ];
    }
    // Admins and Super Admins see all announcements

    const announcements = await Announcement.find(query).sort({
      isPinned: -1,
      priority: -1,
      publishedDate: -1,
    });

    sendSuccess(res, announcements, 'Parish announcements retrieved');
  } catch (err: any) {
    sendError(res, err.message, 'GET_ANNOUNCEMENTS_FAILED', 500);
  }
}

export async function createAnnouncement(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { title, content, priority, targetAudience } = req.body;
    if (!title || !content) {
      sendError(res, 'Title and content are required', 'BAD_REQUEST', 400);
      return;
    }

    const announcement = await Announcement.create(req.body);

    await logAudit(
      req,
      'Created Announcement',
      'Announcement',
      announcement._id.toString(),
      `Title: ${announcement.title}, Priority: ${announcement.priority}`
    );

    sendSuccess(res, announcement, 'Announcement published successfully', 201);
  } catch (err: any) {
    sendError(res, err.message, 'CREATE_ANNOUNCEMENT_FAILED', 500);
  }
}

export async function updateAnnouncement(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findById(id);

    if (!announcement) {
      sendError(res, 'Announcement not found', 'NOT_FOUND', 404);
      return;
    }

    Object.assign(announcement, req.body);
    await announcement.save();

    await logAudit(
      req,
      'Updated Announcement',
      'Announcement',
      announcement._id.toString(),
      `Title: ${announcement.title}`
    );

    sendSuccess(res, announcement, 'Announcement updated successfully');
  } catch (err: any) {
    sendError(res, err.message, 'UPDATE_ANNOUNCEMENT_FAILED', 500);
  }
}

export async function deleteAnnouncement(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findById(id);

    if (!announcement) {
      sendError(res, 'Announcement not found', 'NOT_FOUND', 404);
      return;
    }

    await Announcement.findByIdAndDelete(id);

    await logAudit(
      req,
      'Deleted Announcement',
      'Announcement',
      id,
      `Title: ${announcement.title}`
    );

    sendSuccess(res, null, 'Announcement deleted');
  } catch (err: any) {
    sendError(res, err.message, 'DELETE_ANNOUNCEMENT_FAILED', 500);
  }
}
