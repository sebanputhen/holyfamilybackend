import { Request, Response } from 'express';
import { Priest } from '../models/Priest';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAudit } from '../services/auditService';

export async function getPriests(req: Request, res: Response): Promise<void> {
  try {
    const { category } = req.query;
    const query: any = {};
    if (category) query.category = category;

    const priests = await Priest.find(query).sort({ order: 1, serviceStartDate: -1, createdAt: 1 });
    sendSuccess(res, priests, 'Priests retrieved successfully');
  } catch (err: any) {
    sendError(res, err.message, 'GET_PRIESTS_FAILED', 500);
  }
}

export async function getPriestById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const priest = await Priest.findById(id);
    if (!priest) {
      sendError(res, 'Priest record not found', 'NOT_FOUND', 404);
      return;
    }
    sendSuccess(res, priest, 'Priest details retrieved');
  } catch (err: any) {
    sendError(res, err.message, 'GET_PRIEST_FAILED', 500);
  }
}

export async function createPriest(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { name, designation, category } = req.body;
    if (!name || !designation || !category) {
      sendError(res, 'Name, designation, and category are required', 'BAD_REQUEST', 400);
      return;
    }

    const priest = await Priest.create(req.body);

    await logAudit(
      req,
      'Created Priest Record',
      'Priest',
      priest._id.toString(),
      `Name: ${priest.name}, Category: ${priest.category}`
    );

    sendSuccess(res, priest, 'Priest record created', 201);
  } catch (err: any) {
    sendError(res, err.message, 'CREATE_PRIEST_FAILED', 500);
  }
}

export async function updatePriest(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const priest = await Priest.findById(id);
    if (!priest) {
      sendError(res, 'Priest not found', 'NOT_FOUND', 404);
      return;
    }

    Object.assign(priest, req.body);
    await priest.save();

    await logAudit(
      req,
      'Updated Priest Record',
      'Priest',
      priest._id.toString(),
      `Name: ${priest.name}`
    );

    sendSuccess(res, priest, 'Priest record updated');
  } catch (err: any) {
    sendError(res, err.message, 'UPDATE_PRIEST_FAILED', 500);
  }
}

export async function deletePriest(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const priest = await Priest.findById(id);
    if (!priest) {
      sendError(res, 'Priest not found', 'NOT_FOUND', 404);
      return;
    }

    await Priest.findByIdAndDelete(id);

    await logAudit(
      req,
      'Deleted Priest Record',
      'Priest',
      id,
      `Name: ${priest.name}`
    );

    sendSuccess(res, null, 'Priest record deleted');
  } catch (err: any) {
    sendError(res, err.message, 'DELETE_PRIEST_FAILED', 500);
  }
}
