import { Request, Response } from 'express';
import { Event } from '../models/Event';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAudit } from '../services/auditService';

export async function getEvents(req: Request, res: Response): Promise<void> {
  try {
    const { category, status, upcoming, search } = req.query;
    const query: any = {};

    if (category) query.category = category;
    if (status) query.status = status;

    if (upcoming === 'true') {
      query.date = { $gte: new Date(new Date().setHours(0, 0, 0, 0)) };
    }

    if (search) {
      const regex = new RegExp(search as string, 'i');
      query.$or = [{ title: regex }, { description: regex }, { venue: regex }];
    }

    const events = await Event.find(query).sort({ date: 1, startTime: 1 });
    sendSuccess(res, events, 'Parish events retrieved');
  } catch (err: any) {
    sendError(res, err.message, 'GET_EVENTS_FAILED', 500);
  }
}

export async function getEventById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      sendError(res, 'Event not found', 'NOT_FOUND', 404);
      return;
    }

    sendSuccess(res, event, 'Event details retrieved');
  } catch (err: any) {
    sendError(res, err.message, 'GET_EVENT_FAILED', 500);
  }
}

export async function createEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { title, description, date, startTime, endTime, venue, organizer, category } = req.body;
    if (!title || !description || !date || !startTime || !endTime || !venue || !organizer || !category) {
      sendError(res, 'All required event fields must be provided', 'BAD_REQUEST', 400);
      return;
    }

    const event = await Event.create(req.body);

    await logAudit(
      req,
      'Created Event',
      'Event',
      event._id.toString(),
      `Title: ${event.title}, Date: ${event.date}`
    );

    sendSuccess(res, event, 'Parish event created successfully', 201);
  } catch (err: any) {
    sendError(res, err.message, 'CREATE_EVENT_FAILED', 500);
  }
}

export async function updateEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      sendError(res, 'Event not found', 'NOT_FOUND', 404);
      return;
    }

    Object.assign(event, req.body);
    await event.save();

    await logAudit(
      req,
      'Updated Event',
      'Event',
      event._id.toString(),
      `Title: ${event.title}`
    );

    sendSuccess(res, event, 'Event updated successfully');
  } catch (err: any) {
    sendError(res, err.message, 'UPDATE_EVENT_FAILED', 500);
  }
}

export async function deleteEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      sendError(res, 'Event not found', 'NOT_FOUND', 404);
      return;
    }

    await Event.findByIdAndDelete(id);

    await logAudit(
      req,
      'Deleted Event',
      'Event',
      id,
      `Title: ${event.title}`
    );

    sendSuccess(res, null, 'Event deleted');
  } catch (err: any) {
    sendError(res, err.message, 'DELETE_EVENT_FAILED', 500);
  }
}
