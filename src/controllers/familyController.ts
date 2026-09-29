import { Response } from 'express';
import { Family } from '../models/Family';
import { Person } from '../models/Person';
import { Koottayma } from '../models/Koottayma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { sanitizeFamily, sanitizePerson } from '../services/privacyService';
import { logAudit } from '../services/auditService';
import { UserRole } from '../models/Role';

export async function getFamiliesDirectory(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = (req.query.search as string || '').trim();
    const koottaymaId = req.query.koottaymaId as string;
    const status = req.query.status as string;
    const sortField = (req.query.sort as string) || 'houseName';
    const sortOrder = req.query.order === 'desc' ? -1 : 1;

    const query: any = {};

    // Koottayma Leader boundary: Leaders only view families in their assigned Koottayma if requested or by default
    if (req.user?.role === UserRole.KOOTTAYMA_LEADER && req.user?.assignedKoottayma) {
      query.koottaymaId = req.user.assignedKoottayma;
    } else if (koottaymaId) {
      query.koottaymaId = koottaymaId;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { houseName: regex },
        { headOfFamily: regex },
        { familyName: regex },
        { koottaymaName: regex },
        { phone1: regex },
        { phone2: regex },
      ];
    }

    const total = await Family.countDocuments(query);
    const families = await Family.find(query)
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    // Apply privacy masking for directory
    const sanitized = families
      .map((fam) => sanitizeFamily(fam, req.user))
      .filter((fam) => fam !== null);

    sendSuccess(
      res,
      sanitized,
      'Families directory retrieved successfully',
      200,
      {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      }
    );
  } catch (err: any) {
    sendError(res, err.message, 'GET_FAMILIES_FAILED', 500);
  }
}

export async function getFamilyById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const family = await Family.findById(id);

    if (!family) {
      sendError(res, 'Family record not found', 'NOT_FOUND', 404);
      return;
    }

    // Role check: if Koottayma Leader, can only view if family is in their assigned Koottayma
    if (
      req.user?.role === UserRole.KOOTTAYMA_LEADER &&
      req.user.assignedKoottayma?.toString() !== family.koottaymaId?.toString()
    ) {
      sendError(res, 'You are not authorized to view families outside your Koottayma', 'FORBIDDEN', 403);
      return;
    }

    // Fetch family members
    const members = await Person.find({ familyId: family._id });
    const sanitizedMembers = members.map((m) => sanitizePerson(m, req.user));

    const sanitizedFam = sanitizeFamily(family, req.user);
    if (!sanitizedFam) {
      sendError(res, 'This family is private or opted out of directory', 'FORBIDDEN', 403);
      return;
    }

    sanitizedFam.members = sanitizedMembers;

    sendSuccess(res, sanitizedFam, 'Family details retrieved');
  } catch (err: any) {
    sendError(res, err.message, 'GET_FAMILY_FAILED', 500);
  }
}

export async function createFamily(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { houseName, familyName, headOfFamily, phone1, koottaymaId, address } = req.body;

    if (!houseName || !familyName || !headOfFamily || !phone1 || !koottaymaId || !address) {
      sendError(res, 'House name, family name, head of family, phone, address, and Koottayma are required', 'BAD_REQUEST', 400);
      return;
    }

    const koottayma = await Koottayma.findById(koottaymaId);
    if (!koottayma) {
      sendError(res, 'Invalid Koottayma selected', 'BAD_REQUEST', 400);
      return;
    }

    // Generate unique Family ID if not provided
    let familyId = req.body.familyId;
    if (!familyId) {
      const count = await Family.countDocuments();
      familyId = `FAM-${1000 + count + 1}`;
    }

    const family = await Family.create({
      ...req.body,
      familyId,
      koottaymaName: koottayma.name,
    });

    await logAudit(
      req,
      'Created Family',
      'Family',
      family._id.toString(),
      `Family ID: ${family.familyId}, House: ${family.houseName}`
    );

    sendSuccess(res, family, 'Family created successfully', 201);
  } catch (err: any) {
    sendError(res, err.message, 'CREATE_FAMILY_FAILED', 500);
  }
}

export async function updateFamily(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const family = await Family.findById(id);

    if (!family) {
      sendError(res, 'Family not found', 'NOT_FOUND', 404);
      return;
    }

    if (req.body.koottaymaId && req.body.koottaymaId !== family.koottaymaId.toString()) {
      const koottayma = await Koottayma.findById(req.body.koottaymaId);
      if (koottayma) {
        req.body.koottaymaName = koottayma.name;
      }
    }

    Object.assign(family, req.body);
    await family.save();

    await logAudit(
      req,
      'Updated Family',
      'Family',
      family._id.toString(),
      `Family ID: ${family.familyId}, House: ${family.houseName}`
    );

    sendSuccess(res, family, 'Family updated successfully');
  } catch (err: any) {
    sendError(res, err.message, 'UPDATE_FAMILY_FAILED', 500);
  }
}

export async function deleteFamily(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const family = await Family.findById(id);

    if (!family) {
      sendError(res, 'Family not found', 'NOT_FOUND', 404);
      return;
    }

    await Family.findByIdAndDelete(id);
    await Person.deleteMany({ familyId: id });

    await logAudit(
      req,
      'Deleted Family',
      'Family',
      id,
      `Deleted Family ID: ${family.familyId} (${family.houseName})`
    );

    sendSuccess(res, null, 'Family and associated members deleted successfully');
  } catch (err: any) {
    sendError(res, err.message, 'DELETE_FAMILY_FAILED', 500);
  }
}
