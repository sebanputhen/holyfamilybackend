"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSisters = getSisters;
exports.getSisterById = getSisterById;
exports.createSister = createSister;
exports.updateSister = updateSister;
exports.deleteSister = deleteSister;
const ReligiousSister_1 = require("../models/ReligiousSister");
const response_1 = require("../utils/response");
const auditService_1 = require("../services/auditService");
async function getSisters(req, res) {
    try {
        const sisters = await ReligiousSister_1.ReligiousSister.find().sort({ order: 1, professionDate: -1, name: 1 });
        (0, response_1.sendSuccess)(res, sisters, 'Religious sisters retrieved successfully');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_SISTERS_FAILED', 500);
    }
}
async function getSisterById(req, res) {
    try {
        const { id } = req.params;
        const sister = await ReligiousSister_1.ReligiousSister.findById(id);
        if (!sister) {
            (0, response_1.sendError)(res, 'Religious sister record not found', 'NOT_FOUND', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, sister, 'Religious sister details retrieved');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_SISTER_FAILED', 500);
    }
}
async function createSister(req, res) {
    try {
        const { name, religiousCongregation, currentMinistry } = req.body;
        if (!name || !religiousCongregation || !currentMinistry) {
            (0, response_1.sendError)(res, 'Name, congregation, and ministry are required', 'BAD_REQUEST', 400);
            return;
        }
        const sister = await ReligiousSister_1.ReligiousSister.create(req.body);
        await (0, auditService_1.logAudit)(req, 'Created Sister Record', 'ReligiousSister', sister._id.toString(), `Name: ${sister.name}, Congregation: ${sister.religiousCongregation}`);
        (0, response_1.sendSuccess)(res, sister, 'Religious sister record created', 201);
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'CREATE_SISTER_FAILED', 500);
    }
}
async function updateSister(req, res) {
    try {
        const { id } = req.params;
        const sister = await ReligiousSister_1.ReligiousSister.findById(id);
        if (!sister) {
            (0, response_1.sendError)(res, 'Record not found', 'NOT_FOUND', 404);
            return;
        }
        Object.assign(sister, req.body);
        await sister.save();
        await (0, auditService_1.logAudit)(req, 'Updated Sister Record', 'ReligiousSister', sister._id.toString(), `Name: ${sister.name}`);
        (0, response_1.sendSuccess)(res, sister, 'Record updated successfully');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'UPDATE_SISTER_FAILED', 500);
    }
}
async function deleteSister(req, res) {
    try {
        const { id } = req.params;
        const sister = await ReligiousSister_1.ReligiousSister.findById(id);
        if (!sister) {
            (0, response_1.sendError)(res, 'Record not found', 'NOT_FOUND', 404);
            return;
        }
        await ReligiousSister_1.ReligiousSister.findByIdAndDelete(id);
        await (0, auditService_1.logAudit)(req, 'Deleted Sister Record', 'ReligiousSister', id, `Name: ${sister.name}`);
        (0, response_1.sendSuccess)(res, null, 'Record deleted');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'DELETE_SISTER_FAILED', 500);
    }
}
