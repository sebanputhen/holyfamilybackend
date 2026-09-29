import { Response } from 'express';
import { Koottayma } from '../models/Koottayma';
import { Family } from '../models/Family';
import { Person } from '../models/Person';
import { PrayerMeeting } from '../models/PrayerMeeting';
import { Announcement } from '../models/Announcement';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAudit } from '../services/auditService';
import { UserRole } from '../models/Role';
import { sanitizeFamily, sanitizePerson } from '../services/privacyService';

export async function getKoottaymas(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const query: any = {};
    if (req.user?.role === UserRole.KOOTTAYMA_LEADER && req.user?.assignedKoottayma) {
      query._id = req.user.assignedKoottayma;
    }

    const koottaymas = await Koottayma.find(query).sort({ number: 1 });
    sendSuccess(res, koottaymas, 'Koottaymas retrieved successfully');
  } catch (err: any) {
    sendError(res, err.message, 'GET_KOOTTAYMAS_FAILED', 500);
  }
}

export async function getKoottaymaById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (
      req.user?.role === UserRole.KOOTTAYMA_LEADER &&
      req.user.assignedKoottayma?.toString() !== id
    ) {
      sendError(res, 'Access denied: You are only authorized to access your assigned Koottayma', 'FORBIDDEN', 403);
      return;
    }

    const koottayma = await Koottayma.findById(id);
    if (!koottayma) {
      sendError(res, 'Koottayma not found', 'NOT_FOUND', 404);
      return;
    }

    sendSuccess(res, koottayma, 'Koottayma retrieved');
  } catch (err: any) {
    sendError(res, err.message, 'GET_KOOTTAYMA_FAILED', 500);
  }
}

export async function getKoottaymaDashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id || req.user?.assignedKoottayma?.toString();

    if (!id) {
      sendError(res, 'Koottayma ID is required', 'BAD_REQUEST', 400);
      return;
    }

    if (
      req.user?.role === UserRole.KOOTTAYMA_LEADER &&
      req.user.assignedKoottayma?.toString() !== id
    ) {
      sendError(res, 'Access denied: You are only authorized to access your assigned Koottayma', 'FORBIDDEN', 403);
      return;
    }

    const koottayma = await Koottayma.findById(id);
    if (!koottayma) {
      sendError(res, 'Koottayma not found', 'NOT_FOUND', 404);
      return;
    }

    const totalFamilies = await Family.countDocuments({ koottaymaId: id });
    const totalMembers = await Person.countDocuments({ koottaymaId: id });
    const upcomingMeetings = await PrayerMeeting.find({
      koottaymaId: id,
      date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }).sort({ date: 1 }).limit(5);

    const announcements = await Announcement.find({
      isActive: true,
      $or: [
        { targetAudience: 'All' },
        { targetAudience: 'Koottayma Leaders' },
        { targetKoottaymaId: id },
      ],
    }).sort({ priority: -1, publishedDate: -1 }).limit(5);

    const families = await Family.find({ koottaymaId: id }).limit(10);
    const sanitizedFamilies = families.map((f) => sanitizeFamily(f, req.user));

    const dashboard = {
      koottayma,
      totalFamilies,
      totalMembers,
      upcomingMeetings,
      announcements,
      families: sanitizedFamilies,
    };

    sendSuccess(res, dashboard, 'Koottayma dashboard data retrieved');
  } catch (err: any) {
    sendError(res, err.message, 'GET_DASHBOARD_FAILED', 500);
  }
}

export async function createKoottayma(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { name, number, patronSaint, leader, leaderPhone } = req.body;
    if (!name || !number || !patronSaint || !leader || !leaderPhone) {
      sendError(res, 'Name, number, patron saint, leader and phone are required', 'BAD_REQUEST', 400);
      return;
    }

    const koottayma = await Koottayma.create(req.body);

    await logAudit(
      req,
      'Created Koottayma',
      'Koottayma',
      koottayma._id.toString(),
      `Unit: ${koottayma.name} (#${koottayma.number})`
    );

    sendSuccess(res, koottayma, 'Koottayma created successfully', 201);
  } catch (err: any) {
    sendError(res, err.message, 'CREATE_KOOTTAYMA_FAILED', 500);
  }
}

export async function updateKoottayma(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const koottayma = await Koottayma.findById(id);

    if (!koottayma) {
      sendError(res, 'Koottayma not found', 'NOT_FOUND', 404);
      return;
    }

    Object.assign(koottayma, req.body);
    await koottayma.save();

    await logAudit(
      req,
      'Updated Koottayma',
      'Koottayma',
      koottayma._id.toString(),
      `Unit: ${koottayma.name}`
    );

    sendSuccess(res, koottayma, 'Koottayma updated successfully');
  } catch (err: any) {
    sendError(res, err.message, 'UPDATE_KOOTTAYMA_FAILED', 500);
  }
}

export async function deleteKoottayma(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const koottayma = await Koottayma.findById(id);

    if (!koottayma) {
      sendError(res, 'Koottayma not found', 'NOT_FOUND', 404);
      return;
    }

    await Koottayma.findByIdAndDelete(id);

    await logAudit(
      req,
      'Deleted Koottayma',
      'Koottayma',
      id,
      `Unit: ${koottayma.name}`
    );

    sendSuccess(res, null, 'Koottayma deleted successfully');
  } catch (err: any) {
    sendError(res, err.message, 'DELETE_KOOTTAYMA_FAILED', 500);
  }
}
