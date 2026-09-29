import { Request, Response } from 'express';
import { MassSchedule } from '../models/MassSchedule';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAudit } from '../services/auditService';

export async function getMassSchedules(req: Request, res: Response): Promise<void> {
  try {
    const { day, serviceType, language, view } = req.query;
    const query: any = { status: 'Active' };

    if (serviceType) query.serviceType = serviceType;
    if (language) query.language = language;

    if (view === 'today') {
      const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      query.$or = [{ dayOfWeek: todayDay }, { dayOfWeek: 'Daily' }];
    } else if (view === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDay = tomorrow.toLocaleDateString('en-US', { weekday: 'long' });
      query.$or = [{ dayOfWeek: tomorrowDay }, { dayOfWeek: 'Daily' }];
    } else if (day) {
      query.$or = [{ dayOfWeek: day }, { dayOfWeek: 'Daily' }];
    }

    const schedules = await MassSchedule.find(query).sort({ time: 1 });
    sendSuccess(res, schedules, 'Mass and service schedules retrieved');
  } catch (err: any) {
    sendError(res, err.message, 'GET_MASS_SCHEDULES_FAILED', 500);
  }
}

export async function createMassSchedule(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { serviceType, dayOfWeek, time } = req.body;
    if (!serviceType || !dayOfWeek || !time) {
      sendError(res, 'Service type, day of week, and time are required', 'BAD_REQUEST', 400);
      return;
    }

    const schedule = await MassSchedule.create(req.body);

    await logAudit(
      req,
      'Created Mass Schedule',
      'MassSchedule',
      schedule._id.toString(),
      `${schedule.serviceType} at ${schedule.time} on ${schedule.dayOfWeek}`
    );

    sendSuccess(res, schedule, 'Mass schedule created successfully', 201);
  } catch (err: any) {
    sendError(res, err.message, 'CREATE_MASS_FAILED', 500);
  }
}

export async function updateMassSchedule(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const schedule = await MassSchedule.findById(id);

    if (!schedule) {
      sendError(res, 'Schedule not found', 'NOT_FOUND', 404);
      return;
    }

    Object.assign(schedule, req.body);
    await schedule.save();

    await logAudit(
      req,
      'Updated Mass Schedule',
      'MassSchedule',
      schedule._id.toString(),
      `Updated ${schedule.serviceType}`
    );

    sendSuccess(res, schedule, 'Mass schedule updated');
  } catch (err: any) {
    sendError(res, err.message, 'UPDATE_MASS_FAILED', 500);
  }
}

export async function deleteMassSchedule(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const schedule = await MassSchedule.findById(id);

    if (!schedule) {
      sendError(res, 'Schedule not found', 'NOT_FOUND', 404);
      return;
    }

    await MassSchedule.findByIdAndDelete(id);

    await logAudit(
      req,
      'Deleted Mass Schedule',
      'MassSchedule',
      id,
      `Deleted ${schedule.serviceType}`
    );

    sendSuccess(res, null, 'Schedule deleted');
  } catch (err: any) {
    sendError(res, err.message, 'DELETE_MASS_FAILED', 500);
  }
}
