import { Request, Response } from 'express';
import { ParishHistory } from '../models/ParishHistory';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAudit } from '../services/auditService';

export async function getHistoryTimeline(req: Request, res: Response): Promise<void> {
  try {
    const timeline = await ParishHistory.find().sort({ year: 1, order: 1 });
    sendSuccess(res, timeline, 'Parish history timeline retrieved');
  } catch (err: any) {
    sendError(res, err.message, 'GET_HISTORY_FAILED', 500);
  }
}

export async function createMilestone(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { year, event, description } = req.body;
    if (!year || !event || !description) {
      sendError(res, 'Year, event, and description are required', 'BAD_REQUEST', 400);
      return;
    }

    const milestone = await ParishHistory.create(req.body);

    await logAudit(
      req,
      'Added Parish History Milestone',
      'ParishHistory',
      milestone._id.toString(),
      `Year: ${milestone.year}, Event: ${milestone.event}`
    );

    sendSuccess(res, milestone, 'Historical milestone added', 201);
  } catch (err: any) {
    sendError(res, err.message, 'CREATE_MILESTONE_FAILED', 500);
  }
}

export async function updateMilestone(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const milestone = await ParishHistory.findById(id);

    if (!milestone) {
      sendError(res, 'Milestone not found', 'NOT_FOUND', 404);
      return;
    }

    Object.assign(milestone, req.body);
    await milestone.save();

    await logAudit(
      req,
      'Updated Parish History Milestone',
      'ParishHistory',
      milestone._id.toString(),
      `Year: ${milestone.year}`
    );

    sendSuccess(res, milestone, 'Milestone updated');
  } catch (err: any) {
    sendError(res, err.message, 'UPDATE_MILESTONE_FAILED', 500);
  }
}

export async function deleteMilestone(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const milestone = await ParishHistory.findById(id);

    if (!milestone) {
      sendError(res, 'Milestone not found', 'NOT_FOUND', 404);
      return;
    }

    await ParishHistory.findByIdAndDelete(id);

    await logAudit(
      req,
      'Deleted Parish History Milestone',
      'ParishHistory',
      id,
      `Event: ${milestone.event}`
    );

    sendSuccess(res, null, 'Milestone deleted');
  } catch (err: any) {
    sendError(res, err.message, 'DELETE_MILESTONE_FAILED', 500);
  }
}
