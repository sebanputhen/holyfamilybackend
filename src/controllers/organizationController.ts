import { Request, Response } from 'express';
import { Organization } from '../models/Organization';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAudit } from '../services/auditService';

export async function getOrganizations(req: Request, res: Response): Promise<void> {
  try {
    const orgs = await Organization.find({ status: 'Active' }).sort({ name: 1 });
    sendSuccess(res, orgs, 'Parish ministries and organizations retrieved');
  } catch (err: any) {
    sendError(res, err.message, 'GET_ORGS_FAILED', 500);
  }
}

export async function getOrganizationById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const org = await Organization.findById(id);
    if (!org) {
      sendError(res, 'Organization not found', 'NOT_FOUND', 404);
      return;
    }
    sendSuccess(res, org, 'Organization details retrieved');
  } catch (err: any) {
    sendError(res, err.message, 'GET_ORG_FAILED', 500);
  }
}

export async function createOrganization(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { name, description, leader } = req.body;
    if (!name || !description || !leader) {
      sendError(res, 'Name, description, and leader are required', 'BAD_REQUEST', 400);
      return;
    }

    const org = await Organization.create(req.body);

    await logAudit(
      req,
      'Created Organization',
      'Organization',
      org._id.toString(),
      `Name: ${org.name}`
    );

    sendSuccess(res, org, 'Organization created successfully', 201);
  } catch (err: any) {
    sendError(res, err.message, 'CREATE_ORG_FAILED', 500);
  }
}

export async function updateOrganization(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const org = await Organization.findById(id);
    if (!org) {
      sendError(res, 'Organization not found', 'NOT_FOUND', 404);
      return;
    }

    Object.assign(org, req.body);
    await org.save();

    await logAudit(
      req,
      'Updated Organization',
      'Organization',
      org._id.toString(),
      `Name: ${org.name}`
    );

    sendSuccess(res, org, 'Organization updated successfully');
  } catch (err: any) {
    sendError(res, err.message, 'UPDATE_ORG_FAILED', 500);
  }
}

export async function deleteOrganization(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const org = await Organization.findById(id);
    if (!org) {
      sendError(res, 'Organization not found', 'NOT_FOUND', 404);
      return;
    }

    await Organization.findByIdAndDelete(id);

    await logAudit(
      req,
      'Deleted Organization',
      'Organization',
      id,
      `Name: ${org.name}`
    );

    sendSuccess(res, null, 'Organization deleted');
  } catch (err: any) {
    sendError(res, err.message, 'DELETE_ORG_FAILED', 500);
  }
}
