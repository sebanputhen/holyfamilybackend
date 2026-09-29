"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrganizations = getOrganizations;
exports.getOrganizationById = getOrganizationById;
exports.createOrganization = createOrganization;
exports.updateOrganization = updateOrganization;
exports.deleteOrganization = deleteOrganization;
const Organization_1 = require("../models/Organization");
const response_1 = require("../utils/response");
const auditService_1 = require("../services/auditService");
async function getOrganizations(req, res) {
    try {
        const orgs = await Organization_1.Organization.find({ status: 'Active' }).sort({ name: 1 });
        (0, response_1.sendSuccess)(res, orgs, 'Parish ministries and organizations retrieved');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_ORGS_FAILED', 500);
    }
}
async function getOrganizationById(req, res) {
    try {
        const { id } = req.params;
        const org = await Organization_1.Organization.findById(id);
        if (!org) {
            (0, response_1.sendError)(res, 'Organization not found', 'NOT_FOUND', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, org, 'Organization details retrieved');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_ORG_FAILED', 500);
    }
}
async function createOrganization(req, res) {
    try {
        const { name, description, leader } = req.body;
        if (!name || !description || !leader) {
            (0, response_1.sendError)(res, 'Name, description, and leader are required', 'BAD_REQUEST', 400);
            return;
        }
        const org = await Organization_1.Organization.create(req.body);
        await (0, auditService_1.logAudit)(req, 'Created Organization', 'Organization', org._id.toString(), `Name: ${org.name}`);
        (0, response_1.sendSuccess)(res, org, 'Organization created successfully', 201);
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'CREATE_ORG_FAILED', 500);
    }
}
async function updateOrganization(req, res) {
    try {
        const { id } = req.params;
        const org = await Organization_1.Organization.findById(id);
        if (!org) {
            (0, response_1.sendError)(res, 'Organization not found', 'NOT_FOUND', 404);
            return;
        }
        Object.assign(org, req.body);
        await org.save();
        await (0, auditService_1.logAudit)(req, 'Updated Organization', 'Organization', org._id.toString(), `Name: ${org.name}`);
        (0, response_1.sendSuccess)(res, org, 'Organization updated successfully');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'UPDATE_ORG_FAILED', 500);
    }
}
async function deleteOrganization(req, res) {
    try {
        const { id } = req.params;
        const org = await Organization_1.Organization.findById(id);
        if (!org) {
            (0, response_1.sendError)(res, 'Organization not found', 'NOT_FOUND', 404);
            return;
        }
        await Organization_1.Organization.findByIdAndDelete(id);
        await (0, auditService_1.logAudit)(req, 'Deleted Organization', 'Organization', id, `Name: ${org.name}`);
        (0, response_1.sendSuccess)(res, null, 'Organization deleted');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'DELETE_ORG_FAILED', 500);
    }
}
