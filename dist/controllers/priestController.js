"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPriests = getPriests;
exports.getPriestById = getPriestById;
exports.createPriest = createPriest;
exports.updatePriest = updatePriest;
exports.deletePriest = deletePriest;
const Priest_1 = require("../models/Priest");
const response_1 = require("../utils/response");
const auditService_1 = require("../services/auditService");
async function getPriests(req, res) {
    try {
        const { category } = req.query;
        const query = {};
        if (category)
            query.category = category;
        const priests = await Priest_1.Priest.find(query).sort({ order: 1, serviceStartDate: -1, createdAt: 1 });
        (0, response_1.sendSuccess)(res, priests, 'Priests retrieved successfully');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_PRIESTS_FAILED', 500);
    }
}
async function getPriestById(req, res) {
    try {
        const { id } = req.params;
        const priest = await Priest_1.Priest.findById(id);
        if (!priest) {
            (0, response_1.sendError)(res, 'Priest record not found', 'NOT_FOUND', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, priest, 'Priest details retrieved');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_PRIEST_FAILED', 500);
    }
}
async function createPriest(req, res) {
    try {
        const { name, designation, category } = req.body;
        if (!name || !designation || !category) {
            (0, response_1.sendError)(res, 'Name, designation, and category are required', 'BAD_REQUEST', 400);
            return;
        }
        const priest = await Priest_1.Priest.create(req.body);
        await (0, auditService_1.logAudit)(req, 'Created Priest Record', 'Priest', priest._id.toString(), `Name: ${priest.name}, Category: ${priest.category}`);
        (0, response_1.sendSuccess)(res, priest, 'Priest record created', 201);
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'CREATE_PRIEST_FAILED', 500);
    }
}
async function updatePriest(req, res) {
    try {
        const { id } = req.params;
        const priest = await Priest_1.Priest.findById(id);
        if (!priest) {
            (0, response_1.sendError)(res, 'Priest not found', 'NOT_FOUND', 404);
            return;
        }
        Object.assign(priest, req.body);
        await priest.save();
        await (0, auditService_1.logAudit)(req, 'Updated Priest Record', 'Priest', priest._id.toString(), `Name: ${priest.name}`);
        (0, response_1.sendSuccess)(res, priest, 'Priest record updated');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'UPDATE_PRIEST_FAILED', 500);
    }
}
async function deletePriest(req, res) {
    try {
        const { id } = req.params;
        const priest = await Priest_1.Priest.findById(id);
        if (!priest) {
            (0, response_1.sendError)(res, 'Priest not found', 'NOT_FOUND', 404);
            return;
        }
        await Priest_1.Priest.findByIdAndDelete(id);
        await (0, auditService_1.logAudit)(req, 'Deleted Priest Record', 'Priest', id, `Name: ${priest.name}`);
        (0, response_1.sendSuccess)(res, null, 'Priest record deleted');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'DELETE_PRIEST_FAILED', 500);
    }
}
