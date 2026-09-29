"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFamiliesDirectory = getFamiliesDirectory;
exports.getFamilyById = getFamilyById;
exports.createFamily = createFamily;
exports.updateFamily = updateFamily;
exports.deleteFamily = deleteFamily;
const Family_1 = require("../models/Family");
const Person_1 = require("../models/Person");
const Koottayma_1 = require("../models/Koottayma");
const response_1 = require("../utils/response");
const privacyService_1 = require("../services/privacyService");
const auditService_1 = require("../services/auditService");
const Role_1 = require("../models/Role");
async function getFamiliesDirectory(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = (req.query.search || '').trim();
        const koottaymaId = req.query.koottaymaId;
        const status = req.query.status;
        const sortField = req.query.sort || 'houseName';
        const sortOrder = req.query.order === 'desc' ? -1 : 1;
        const query = {};
        // Koottayma Leader boundary: Leaders only view families in their assigned Koottayma if requested or by default
        if (req.user?.role === Role_1.UserRole.KOOTTAYMA_LEADER && req.user?.assignedKoottayma) {
            query.koottaymaId = req.user.assignedKoottayma;
        }
        else if (koottaymaId) {
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
        const total = await Family_1.Family.countDocuments(query);
        const families = await Family_1.Family.find(query)
            .sort({ [sortField]: sortOrder })
            .skip((page - 1) * limit)
            .limit(limit);
        // Apply privacy masking for directory
        const sanitized = families
            .map((fam) => (0, privacyService_1.sanitizeFamily)(fam, req.user))
            .filter((fam) => fam !== null);
        (0, response_1.sendSuccess)(res, sanitized, 'Families directory retrieved successfully', 200, {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit) || 1,
        });
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_FAMILIES_FAILED', 500);
    }
}
async function getFamilyById(req, res) {
    try {
        const { id } = req.params;
        const family = await Family_1.Family.findById(id);
        if (!family) {
            (0, response_1.sendError)(res, 'Family record not found', 'NOT_FOUND', 404);
            return;
        }
        // Role check: if Koottayma Leader, can only view if family is in their assigned Koottayma
        if (req.user?.role === Role_1.UserRole.KOOTTAYMA_LEADER &&
            req.user.assignedKoottayma?.toString() !== family.koottaymaId?.toString()) {
            (0, response_1.sendError)(res, 'You are not authorized to view families outside your Koottayma', 'FORBIDDEN', 403);
            return;
        }
        // Fetch family members
        const members = await Person_1.Person.find({ familyId: family._id });
        const sanitizedMembers = members.map((m) => (0, privacyService_1.sanitizePerson)(m, req.user));
        const sanitizedFam = (0, privacyService_1.sanitizeFamily)(family, req.user);
        if (!sanitizedFam) {
            (0, response_1.sendError)(res, 'This family is private or opted out of directory', 'FORBIDDEN', 403);
            return;
        }
        sanitizedFam.members = sanitizedMembers;
        (0, response_1.sendSuccess)(res, sanitizedFam, 'Family details retrieved');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_FAMILY_FAILED', 500);
    }
}
async function createFamily(req, res) {
    try {
        const { houseName, familyName, headOfFamily, phone1, koottaymaId, address } = req.body;
        if (!houseName || !familyName || !headOfFamily || !phone1 || !koottaymaId || !address) {
            (0, response_1.sendError)(res, 'House name, family name, head of family, phone, address, and Koottayma are required', 'BAD_REQUEST', 400);
            return;
        }
        const koottayma = await Koottayma_1.Koottayma.findById(koottaymaId);
        if (!koottayma) {
            (0, response_1.sendError)(res, 'Invalid Koottayma selected', 'BAD_REQUEST', 400);
            return;
        }
        // Generate unique Family ID if not provided
        let familyId = req.body.familyId;
        if (!familyId) {
            const count = await Family_1.Family.countDocuments();
            familyId = `FAM-${1000 + count + 1}`;
        }
        const family = await Family_1.Family.create({
            ...req.body,
            familyId,
            koottaymaName: koottayma.name,
        });
        await (0, auditService_1.logAudit)(req, 'Created Family', 'Family', family._id.toString(), `Family ID: ${family.familyId}, House: ${family.houseName}`);
        (0, response_1.sendSuccess)(res, family, 'Family created successfully', 201);
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'CREATE_FAMILY_FAILED', 500);
    }
}
async function updateFamily(req, res) {
    try {
        const { id } = req.params;
        const family = await Family_1.Family.findById(id);
        if (!family) {
            (0, response_1.sendError)(res, 'Family not found', 'NOT_FOUND', 404);
            return;
        }
        if (req.body.koottaymaId && req.body.koottaymaId !== family.koottaymaId.toString()) {
            const koottayma = await Koottayma_1.Koottayma.findById(req.body.koottaymaId);
            if (koottayma) {
                req.body.koottaymaName = koottayma.name;
            }
        }
        Object.assign(family, req.body);
        await family.save();
        await (0, auditService_1.logAudit)(req, 'Updated Family', 'Family', family._id.toString(), `Family ID: ${family.familyId}, House: ${family.houseName}`);
        (0, response_1.sendSuccess)(res, family, 'Family updated successfully');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'UPDATE_FAMILY_FAILED', 500);
    }
}
async function deleteFamily(req, res) {
    try {
        const { id } = req.params;
        const family = await Family_1.Family.findById(id);
        if (!family) {
            (0, response_1.sendError)(res, 'Family not found', 'NOT_FOUND', 404);
            return;
        }
        await Family_1.Family.findByIdAndDelete(id);
        await Person_1.Person.deleteMany({ familyId: id });
        await (0, auditService_1.logAudit)(req, 'Deleted Family', 'Family', id, `Deleted Family ID: ${family.familyId} (${family.houseName})`);
        (0, response_1.sendSuccess)(res, null, 'Family and associated members deleted successfully');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'DELETE_FAMILY_FAILED', 500);
    }
}
