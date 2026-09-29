"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrayerMeetings = getPrayerMeetings;
exports.createPrayerMeeting = createPrayerMeeting;
exports.updatePrayerMeeting = updatePrayerMeeting;
exports.deletePrayerMeeting = deletePrayerMeeting;
const PrayerMeeting_1 = require("../models/PrayerMeeting");
const Koottayma_1 = require("../models/Koottayma");
const response_1 = require("../utils/response");
const auditService_1 = require("../services/auditService");
const Role_1 = require("../models/Role");
async function getPrayerMeetings(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const koottaymaId = req.query.koottaymaId;
        const status = req.query.status;
        const query = {};
        if (req.user?.role === Role_1.UserRole.KOOTTAYMA_LEADER && req.user?.assignedKoottayma) {
            query.koottaymaId = req.user.assignedKoottayma;
        }
        else if (koottaymaId) {
            query.koottaymaId = koottaymaId;
        }
        if (status)
            query.status = status;
        const total = await PrayerMeeting_1.PrayerMeeting.countDocuments(query);
        const meetings = await PrayerMeeting_1.PrayerMeeting.find(query)
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        (0, response_1.sendSuccess)(res, meetings, 'Prayer meetings retrieved', 200, {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit) || 1,
        });
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_PRAYER_MEETINGS_FAILED', 500);
    }
}
async function createPrayerMeeting(req, res) {
    try {
        const { koottaymaId, date, time, venue, hostFamily, leader } = req.body;
        if (!koottaymaId || !date || !time || !venue || !hostFamily || !leader) {
            (0, response_1.sendError)(res, 'Koottayma, date, time, venue, host family, and leader are required', 'BAD_REQUEST', 400);
            return;
        }
        if (req.user?.role === Role_1.UserRole.KOOTTAYMA_LEADER &&
            req.user.assignedKoottayma?.toString() !== koottaymaId) {
            (0, response_1.sendError)(res, 'You can only schedule prayer meetings for your assigned Koottayma', 'FORBIDDEN', 403);
            return;
        }
        const koottayma = await Koottayma_1.Koottayma.findById(koottaymaId);
        if (!koottayma) {
            (0, response_1.sendError)(res, 'Selected Koottayma does not exist', 'BAD_REQUEST', 400);
            return;
        }
        const meeting = await PrayerMeeting_1.PrayerMeeting.create({
            ...req.body,
            koottaymaName: koottayma.name,
            submittedBy: req.user?._id,
            approvedBy: req.user?.role === Role_1.UserRole.ADMIN || req.user?.role === Role_1.UserRole.SUPER_ADMIN ? req.user._id : null,
        });
        await (0, auditService_1.logAudit)(req, 'Created Prayer Meeting', 'PrayerMeeting', meeting._id.toString(), `Koottayma: ${koottayma.name}, Date: ${meeting.date}`);
        (0, response_1.sendSuccess)(res, meeting, 'Prayer meeting scheduled successfully', 201);
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'CREATE_PRAYER_MEETING_FAILED', 500);
    }
}
async function updatePrayerMeeting(req, res) {
    try {
        const { id } = req.params;
        const meeting = await PrayerMeeting_1.PrayerMeeting.findById(id);
        if (!meeting) {
            (0, response_1.sendError)(res, 'Prayer meeting not found', 'NOT_FOUND', 404);
            return;
        }
        if (req.user?.role === Role_1.UserRole.KOOTTAYMA_LEADER &&
            req.user.assignedKoottayma?.toString() !== meeting.koottaymaId.toString()) {
            (0, response_1.sendError)(res, 'Access denied: You can only update prayer meetings for your assigned Koottayma', 'FORBIDDEN', 403);
            return;
        }
        Object.assign(meeting, req.body);
        await meeting.save();
        await (0, auditService_1.logAudit)(req, 'Updated Prayer Meeting', 'PrayerMeeting', meeting._id.toString(), `Status: ${meeting.status}`);
        (0, response_1.sendSuccess)(res, meeting, 'Prayer meeting updated');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'UPDATE_PRAYER_MEETING_FAILED', 500);
    }
}
async function deletePrayerMeeting(req, res) {
    try {
        const { id } = req.params;
        const meeting = await PrayerMeeting_1.PrayerMeeting.findById(id);
        if (!meeting) {
            (0, response_1.sendError)(res, 'Prayer meeting not found', 'NOT_FOUND', 404);
            return;
        }
        await PrayerMeeting_1.PrayerMeeting.findByIdAndDelete(id);
        await (0, auditService_1.logAudit)(req, 'Deleted Prayer Meeting', 'PrayerMeeting', id, `Koottayma: ${meeting.koottaymaName}`);
        (0, response_1.sendSuccess)(res, null, 'Prayer meeting deleted');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'DELETE_PRAYER_MEETING_FAILED', 500);
    }
}
