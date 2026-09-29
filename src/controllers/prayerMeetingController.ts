import { Response } from 'express';
import { PrayerMeeting } from '../models/PrayerMeeting';
import { Koottayma } from '../models/Koottayma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAudit } from '../services/auditService';
import { UserRole } from '../models/Role';

export async function getPrayerMeetings(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const koottaymaId = req.query.koottaymaId as string;
    const status = req.query.status as string;

    const query: any = {};

    if (req.user?.role === UserRole.KOOTTAYMA_LEADER && req.user?.assignedKoottayma) {
      query.koottaymaId = req.user.assignedKoottayma;
    } else if (koottaymaId) {
      query.koottaymaId = koottaymaId;
    }

    if (status) query.status = status;

    const total = await PrayerMeeting.countDocuments(query);
    const meetings = await PrayerMeeting.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    sendSuccess(res, meetings, 'Prayer meetings retrieved', 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (err: any) {
    sendError(res, err.message, 'GET_PRAYER_MEETINGS_FAILED', 500);
  }
}

export async function createPrayerMeeting(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { koottaymaId, date, time, venue, hostFamily, leader } = req.body;
    if (!koottaymaId || !date || !time || !venue || !hostFamily || !leader) {
      sendError(res, 'Koottayma, date, time, venue, host family, and leader are required', 'BAD_REQUEST', 400);
      return;
    }

    if (
      req.user?.role === UserRole.KOOTTAYMA_LEADER &&
      req.user.assignedKoottayma?.toString() !== koottaymaId
    ) {
      sendError(res, 'You can only schedule prayer meetings for your assigned Koottayma', 'FORBIDDEN', 403);
      return;
    }

    const koottayma = await Koottayma.findById(koottaymaId);
    if (!koottayma) {
      sendError(res, 'Selected Koottayma does not exist', 'BAD_REQUEST', 400);
      return;
    }

    const meeting = await PrayerMeeting.create({
      ...req.body,
      koottaymaName: koottayma.name,
      submittedBy: req.user?._id,
      approvedBy: req.user?.role === UserRole.ADMIN || req.user?.role === UserRole.SUPER_ADMIN ? req.user._id : null,
    });

    await logAudit(
      req,
      'Created Prayer Meeting',
      'PrayerMeeting',
      meeting._id.toString(),
      `Koottayma: ${koottayma.name}, Date: ${meeting.date}`
    );

    sendSuccess(res, meeting, 'Prayer meeting scheduled successfully', 201);
  } catch (err: any) {
    sendError(res, err.message, 'CREATE_PRAYER_MEETING_FAILED', 500);
  }
}

export async function updatePrayerMeeting(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const meeting = await PrayerMeeting.findById(id);

    if (!meeting) {
      sendError(res, 'Prayer meeting not found', 'NOT_FOUND', 404);
      return;
    }

    if (
      req.user?.role === UserRole.KOOTTAYMA_LEADER &&
      req.user.assignedKoottayma?.toString() !== meeting.koottaymaId.toString()
    ) {
      sendError(res, 'Access denied: You can only update prayer meetings for your assigned Koottayma', 'FORBIDDEN', 403);
      return;
    }

    Object.assign(meeting, req.body);
    await meeting.save();

    await logAudit(
      req,
      'Updated Prayer Meeting',
      'PrayerMeeting',
      meeting._id.toString(),
      `Status: ${meeting.status}`
    );

    sendSuccess(res, meeting, 'Prayer meeting updated');
  } catch (err: any) {
    sendError(res, err.message, 'UPDATE_PRAYER_MEETING_FAILED', 500);
  }
}

export async function deletePrayerMeeting(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const meeting = await PrayerMeeting.findById(id);

    if (!meeting) {
      sendError(res, 'Prayer meeting not found', 'NOT_FOUND', 404);
      return;
    }

    await PrayerMeeting.findByIdAndDelete(id);

    await logAudit(
      req,
      'Deleted Prayer Meeting',
      'PrayerMeeting',
      id,
      `Koottayma: ${meeting.koottaymaName}`
    );

    sendSuccess(res, null, 'Prayer meeting deleted');
  } catch (err: any) {
    sendError(res, err.message, 'DELETE_PRAYER_MEETING_FAILED', 500);
  }
}
