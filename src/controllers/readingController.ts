import { Request, Response } from 'express';
import { DailyReading } from '../models/DailyReading';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAudit } from '../services/auditService';

export async function getReading(req: Request, res: Response): Promise<void> {
  try {
    const dateParam = (req.query.date as string) || new Date().toISOString().split('T')[0];
    let reading = await DailyReading.findOne({ date: dateParam });

    // Fallback if specific date reading is not yet seeded: return closest or create sample liturgical reading
    if (!reading) {
      reading = await DailyReading.findOne().sort({ date: -1 });
    }

    sendSuccess(res, reading, 'Daily reading retrieved');
  } catch (err: any) {
    sendError(res, err.message, 'GET_READING_FAILED', 500);
  }
}

export async function upsertReading(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { date, firstReading, psalm, gospel } = req.body;
    if (!date || !firstReading || !psalm || !gospel) {
      sendError(res, 'Date, first reading, psalm, and gospel are required', 'BAD_REQUEST', 400);
      return;
    }

    const reading = await DailyReading.findOneAndUpdate(
      { date },
      { $set: req.body },
      { new: true, upsert: true }
    );

    await logAudit(
      req,
      'Saved Daily Reading',
      'DailyReading',
      reading._id.toString(),
      `Date: ${reading.date}`
    );

    sendSuccess(res, reading, 'Daily reading saved successfully');
  } catch (err: any) {
    sendError(res, err.message, 'SAVE_READING_FAILED', 500);
  }
}
