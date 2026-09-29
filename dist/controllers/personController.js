"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPersons = getPersons;
exports.getPersonById = getPersonById;
exports.createPerson = createPerson;
exports.updatePerson = updatePerson;
exports.deletePerson = deletePerson;
const Person_1 = require("../models/Person");
const Family_1 = require("../models/Family");
const response_1 = require("../utils/response");
const privacyService_1 = require("../services/privacyService");
const auditService_1 = require("../services/auditService");
const Role_1 = require("../models/Role");
async function getPersons(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 25;
        const familyId = req.query.familyId;
        const koottaymaId = req.query.koottaymaId;
        const search = (req.query.search || '').trim();
        const query = {};
        if (familyId)
            query.familyId = familyId;
        if (koottaymaId)
            query.koottaymaId = koottaymaId;
        if (req.user?.role === Role_1.UserRole.KOOTTAYMA_LEADER && req.user?.assignedKoottayma) {
            query.koottaymaId = req.user.assignedKoottayma;
        }
        if (search) {
            const regex = new RegExp(search, 'i');
            query.$or = [{ name: regex }, { baptismName: regex }, { phone: regex }];
        }
        const total = await Person_1.Person.countDocuments(query);
        const persons = await Person_1.Person.find(query)
            .sort({ name: 1 })
            .skip((page - 1) * limit)
            .limit(limit);
        const sanitized = persons.map((p) => (0, privacyService_1.sanitizePerson)(p, req.user));
        (0, response_1.sendSuccess)(res, sanitized, 'Parishioners retrieved successfully', 200, {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit) || 1,
        });
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_PERSONS_FAILED', 500);
    }
}
async function getPersonById(req, res) {
    try {
        const { id } = req.params;
        const person = await Person_1.Person.findById(id);
        if (!person) {
            (0, response_1.sendError)(res, 'Parishioner not found', 'NOT_FOUND', 404);
            return;
        }
        if (req.user?.role === Role_1.UserRole.KOOTTAYMA_LEADER &&
            req.user.assignedKoottayma?.toString() !== person.koottaymaId?.toString()) {
            (0, response_1.sendError)(res, 'Access denied to parishioners outside your Koottayma', 'FORBIDDEN', 403);
            return;
        }
        (0, response_1.sendSuccess)(res, (0, privacyService_1.sanitizePerson)(person, req.user), 'Parishioner details retrieved');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_PERSON_FAILED', 500);
    }
}
async function createPerson(req, res) {
    try {
        const { name, gender, relationship, familyId } = req.body;
        if (!name || !gender || !relationship || !familyId) {
            (0, response_1.sendError)(res, 'Name, gender, relationship, and family are required', 'BAD_REQUEST', 400);
            return;
        }
        const family = await Family_1.Family.findById(familyId);
        if (!family) {
            (0, response_1.sendError)(res, 'Associated family not found', 'BAD_REQUEST', 400);
            return;
        }
        const person = await Person_1.Person.create({
            ...req.body,
            familyName: family.familyName,
            koottaymaId: family.koottaymaId,
        });
        if (relationship === 'Head' && !family.headPersonId) {
            family.headPersonId = person._id;
            family.headOfFamily = person.name;
            await family.save();
        }
        await (0, auditService_1.logAudit)(req, 'Created Parishioner', 'Person', person._id.toString(), `Name: ${person.name}, Family: ${family.houseName}`);
        (0, response_1.sendSuccess)(res, person, 'Parishioner registered successfully', 201);
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'CREATE_PERSON_FAILED', 500);
    }
}
async function updatePerson(req, res) {
    try {
        const { id } = req.params;
        const person = await Person_1.Person.findById(id);
        if (!person) {
            (0, response_1.sendError)(res, 'Parishioner not found', 'NOT_FOUND', 404);
            return;
        }
        Object.assign(person, req.body);
        await person.save();
        await (0, auditService_1.logAudit)(req, 'Updated Parishioner', 'Person', person._id.toString(), `Name: ${person.name}`);
        (0, response_1.sendSuccess)(res, person, 'Parishioner details updated');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'UPDATE_PERSON_FAILED', 500);
    }
}
async function deletePerson(req, res) {
    try {
        const { id } = req.params;
        const person = await Person_1.Person.findById(id);
        if (!person) {
            (0, response_1.sendError)(res, 'Parishioner not found', 'NOT_FOUND', 404);
            return;
        }
        await Person_1.Person.findByIdAndDelete(id);
        await (0, auditService_1.logAudit)(req, 'Deleted Parishioner', 'Person', id, `Deleted: ${person.name}`);
        (0, response_1.sendSuccess)(res, null, 'Parishioner deleted successfully');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'DELETE_PERSON_FAILED', 500);
    }
}
