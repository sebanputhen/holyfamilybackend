import { Response } from 'express';
import { Person } from '../models/Person';
import { Family } from '../models/Family';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { sanitizePerson } from '../services/privacyService';
import { logAudit } from '../services/auditService';
import { UserRole } from '../models/Role';

export async function getPersons(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 25;
    const familyId = req.query.familyId as string;
    const koottaymaId = req.query.koottaymaId as string;
    const search = (req.query.search as string || '').trim();

    const query: any = {};

    if (familyId) query.familyId = familyId;
    if (koottaymaId) query.koottaymaId = koottaymaId;

    if (req.user?.role === UserRole.KOOTTAYMA_LEADER && req.user?.assignedKoottayma) {
      query.koottaymaId = req.user.assignedKoottayma;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ name: regex }, { baptismName: regex }, { phone: regex }];
    }

    const total = await Person.countDocuments(query);
    const persons = await Person.find(query)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const sanitized = persons.map((p) => sanitizePerson(p, req.user));

    sendSuccess(res, sanitized, 'Parishioners retrieved successfully', 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (err: any) {
    sendError(res, err.message, 'GET_PERSONS_FAILED', 500);
  }
}

export async function getPersonById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const person = await Person.findById(id);

    if (!person) {
      sendError(res, 'Parishioner not found', 'NOT_FOUND', 404);
      return;
    }

    if (
      req.user?.role === UserRole.KOOTTAYMA_LEADER &&
      req.user.assignedKoottayma?.toString() !== person.koottaymaId?.toString()
    ) {
      sendError(res, 'Access denied to parishioners outside your Koottayma', 'FORBIDDEN', 403);
      return;
    }

    sendSuccess(res, sanitizePerson(person, req.user), 'Parishioner details retrieved');
  } catch (err: any) {
    sendError(res, err.message, 'GET_PERSON_FAILED', 500);
  }
}

export async function createPerson(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { name, gender, relationship, familyId } = req.body;
    if (!name || !gender || !relationship || !familyId) {
      sendError(res, 'Name, gender, relationship, and family are required', 'BAD_REQUEST', 400);
      return;
    }

    const family = await Family.findById(familyId);
    if (!family) {
      sendError(res, 'Associated family not found', 'BAD_REQUEST', 400);
      return;
    }

    const person = await Person.create({
      ...req.body,
      familyName: family.familyName,
      koottaymaId: family.koottaymaId,
    });

    if (relationship === 'Head' && !family.headPersonId) {
      family.headPersonId = person._id as any;
      family.headOfFamily = person.name;
      await family.save();
    }

    await logAudit(
      req,
      'Created Parishioner',
      'Person',
      person._id.toString(),
      `Name: ${person.name}, Family: ${family.houseName}`
    );

    sendSuccess(res, person, 'Parishioner registered successfully', 201);
  } catch (err: any) {
    sendError(res, err.message, 'CREATE_PERSON_FAILED', 500);
  }
}

export async function updatePerson(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const person = await Person.findById(id);

    if (!person) {
      sendError(res, 'Parishioner not found', 'NOT_FOUND', 404);
      return;
    }

    Object.assign(person, req.body);
    await person.save();

    await logAudit(
      req,
      'Updated Parishioner',
      'Person',
      person._id.toString(),
      `Name: ${person.name}`
    );

    sendSuccess(res, person, 'Parishioner details updated');
  } catch (err: any) {
    sendError(res, err.message, 'UPDATE_PERSON_FAILED', 500);
  }
}

export async function deletePerson(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const person = await Person.findById(id);

    if (!person) {
      sendError(res, 'Parishioner not found', 'NOT_FOUND', 404);
      return;
    }

    await Person.findByIdAndDelete(id);

    await logAudit(
      req,
      'Deleted Parishioner',
      'Person',
      id,
      `Deleted: ${person.name}`
    );

    sendSuccess(res, null, 'Parishioner deleted successfully');
  } catch (err: any) {
    sendError(res, err.message, 'DELETE_PERSON_FAILED', 500);
  }
}
