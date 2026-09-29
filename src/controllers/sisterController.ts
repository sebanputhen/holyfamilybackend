import { Request, Response } from 'express';
import { ReligiousSister } from '../models/ReligiousSister';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAudit } from '../services/auditService';

export async function getSisters(req: Request, res: Response): Promise<void> {
  try {
    const sisters = await ReligiousSister.find().sort({ order: 1, professionDate: -1, name: 1 });
    sendSuccess(res, sisters, 'Religious sisters retrieved successfully');
  } catch (err: any) {
    sendError(res, err.message, 'GET_SISTERS_FAILED', 500);
  }
}

export async function getSisterById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const sister = await ReligiousSister.findById(id);
    if (!sister) {
      sendError(res, 'Religious sister record not found', 'NOT_FOUND', 404);
      return;
    }
    sendSuccess(res, sister, 'Religious sister details retrieved');
  } catch (err: any) {
    sendError(res, err.message, 'GET_SISTER_FAILED', 500);
  }
}

export async function createSister(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { name, religiousCongregation, currentMinistry } = req.body;
    if (!name || !religiousCongregation || !currentMinistry) {
      sendError(res, 'Name, congregation, and ministry are required', 'BAD_REQUEST', 400);
      return;
    }

    const sister = await ReligiousSister.create(req.body);

    await logAudit(
      req,
      'Created Sister Record',
      'ReligiousSister',
      sister._id.toString(),
      `Name: ${sister.name}, Congregation: ${sister.religiousCongregation}`
    );

    sendSuccess(res, sister, 'Religious sister record created', 201);
  } catch (err: any) {
    sendError(res, err.message, 'CREATE_SISTER_FAILED', 500);
  }
}

export async function updateSister(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const sister = await ReligiousSister.findById(id);
    if (!sister) {
      sendError(res, 'Record not found', 'NOT_FOUND', 404);
      return;
    }

    Object.assign(sister, req.body);
    await sister.save();

    await logAudit(
      req,
      'Updated Sister Record',
      'ReligiousSister',
      sister._id.toString(),
      `Name: ${sister.name}`
    );

    sendSuccess(res, sister, 'Record updated successfully');
  } catch (err: any) {
    sendError(res, err.message, 'UPDATE_SISTER_FAILED', 500);
  }
}

export async function deleteSister(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const sister = await ReligiousSister.findById(id);
    if (!sister) {
      sendError(res, 'Record not found', 'NOT_FOUND', 404);
      return;
    }

    await ReligiousSister.findByIdAndDelete(id);

    await logAudit(
      req,
      'Deleted Sister Record',
      'ReligiousSister',
      id,
      `Name: ${sister.name}`
    );

    sendSuccess(res, null, 'Record deleted');
  } catch (err: any) {
    sendError(res, err.message, 'DELETE_SISTER_FAILED', 500);
  }
}
