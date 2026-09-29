"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistoryTimeline = getHistoryTimeline;
exports.createMilestone = createMilestone;
exports.updateMilestone = updateMilestone;
exports.deleteMilestone = deleteMilestone;
const ParishHistory_1 = require("../models/ParishHistory");
const response_1 = require("../utils/response");
const auditService_1 = require("../services/auditService");
async function getHistoryTimeline(req, res) {
    try {
        const timeline = await ParishHistory_1.ParishHistory.find().sort({ year: 1, order: 1 });
        (0, response_1.sendSuccess)(res, timeline, 'Parish history timeline retrieved');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_HISTORY_FAILED', 500);
    }
}
async function createMilestone(req, res) {
    try {
        const { year, event, description } = req.body;
        if (!year || !event || !description) {
            (0, response_1.sendError)(res, 'Year, event, and description are required', 'BAD_REQUEST', 400);
            return;
        }
        const milestone = await ParishHistory_1.ParishHistory.create(req.body);
        await (0, auditService_1.logAudit)(req, 'Added Parish History Milestone', 'ParishHistory', milestone._id.toString(), `Year: ${milestone.year}, Event: ${milestone.event}`);
        (0, response_1.sendSuccess)(res, milestone, 'Historical milestone added', 201);
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'CREATE_MILESTONE_FAILED', 500);
    }
}
async function updateMilestone(req, res) {
    try {
        const { id } = req.params;
        const milestone = await ParishHistory_1.ParishHistory.findById(id);
        if (!milestone) {
            (0, response_1.sendError)(res, 'Milestone not found', 'NOT_FOUND', 404);
            return;
        }
        Object.assign(milestone, req.body);
        await milestone.save();
        await (0, auditService_1.logAudit)(req, 'Updated Parish History Milestone', 'ParishHistory', milestone._id.toString(), `Year: ${milestone.year}`);
        (0, response_1.sendSuccess)(res, milestone, 'Milestone updated');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'UPDATE_MILESTONE_FAILED', 500);
    }
}
async function deleteMilestone(req, res) {
    try {
        const { id } = req.params;
        const milestone = await ParishHistory_1.ParishHistory.findById(id);
        if (!milestone) {
            (0, response_1.sendError)(res, 'Milestone not found', 'NOT_FOUND', 404);
            return;
        }
        await ParishHistory_1.ParishHistory.findByIdAndDelete(id);
        await (0, auditService_1.logAudit)(req, 'Deleted Parish History Milestone', 'ParishHistory', id, `Event: ${milestone.event}`);
        (0, response_1.sendSuccess)(res, null, 'Milestone deleted');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'DELETE_MILESTONE_FAILED', 500);
    }
}
