"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKoottaymas = getKoottaymas;
exports.getKoottaymaById = getKoottaymaById;
exports.getKoottaymaDashboard = getKoottaymaDashboard;
exports.createKoottayma = createKoottayma;
exports.updateKoottayma = updateKoottayma;
exports.deleteKoottayma = deleteKoottayma;
const Koottayma_1 = require("../models/Koottayma");
const Family_1 = require("../models/Family");
const Person_1 = require("../models/Person");
const PrayerMeeting_1 = require("../models/PrayerMeeting");
const Announcement_1 = require("../models/Announcement");
const response_1 = require("../utils/response");
const auditService_1 = require("../services/auditService");
const Role_1 = require("../models/Role");
const privacyService_1 = require("../services/privacyService");
async function getKoottaymas(req, res) {
    try {
        const query = {};
        if (req.user?.role === Role_1.UserRole.KOOTTAYMA_LEADER && req.user?.assignedKoottayma) {
            query._id = req.user.assignedKoottayma;
        }
        const koottaymas = await Koottayma_1.Koottayma.find(query).sort({ number: 1 });
        (0, response_1.sendSuccess)(res, koottaymas, 'Koottaymas retrieved successfully');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_KOOTTAYMAS_FAILED', 500);
    }
}
async function getKoottaymaById(req, res) {
    try {
        const { id } = req.params;
        if (req.user?.role === Role_1.UserRole.KOOTTAYMA_LEADER &&
            req.user.assignedKoottayma?.toString() !== id) {
            (0, response_1.sendError)(res, 'Access denied: You are only authorized to access your assigned Koottayma', 'FORBIDDEN', 403);
            return;
        }
        const koottayma = await Koottayma_1.Koottayma.findById(id);
        if (!koottayma) {
            (0, response_1.sendError)(res, 'Koottayma not found', 'NOT_FOUND', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, koottayma, 'Koottayma retrieved');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_KOOTTAYMA_FAILED', 500);
    }
}
async function getKoottaymaDashboard(req, res) {
    try {
        const id = req.params.id || req.user?.assignedKoottayma?.toString();
        if (!id) {
            (0, response_1.sendError)(res, 'Koottayma ID is required', 'BAD_REQUEST', 400);
            return;
        }
        if (req.user?.role === Role_1.UserRole.KOOTTAYMA_LEADER &&
            req.user.assignedKoottayma?.toString() !== id) {
            (0, response_1.sendError)(res, 'Access denied: You are only authorized to access your assigned Koottayma', 'FORBIDDEN', 403);
            return;
        }
        const koottayma = await Koottayma_1.Koottayma.findById(id);
        if (!koottayma) {
            (0, response_1.sendError)(res, 'Koottayma not found', 'NOT_FOUND', 404);
            return;
        }
        const totalFamilies = await Family_1.Family.countDocuments({ koottaymaId: id });
        const totalMembers = await Person_1.Person.countDocuments({ koottaymaId: id });
        const upcomingMeetings = await PrayerMeeting_1.PrayerMeeting.find({
            koottaymaId: id,
            date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        }).sort({ date: 1 }).limit(5);
        const announcements = await Announcement_1.Announcement.find({
            isActive: true,
            $or: [
                { targetAudience: 'All' },
                { targetAudience: 'Koottayma Leaders' },
                { targetKoottaymaId: id },
            ],
        }).sort({ priority: -1, publishedDate: -1 }).limit(5);
        const families = await Family_1.Family.find({ koottaymaId: id }).limit(10);
        const sanitizedFamilies = families.map((f) => (0, privacyService_1.sanitizeFamily)(f, req.user));
        const dashboard = {
            koottayma,
            totalFamilies,
            totalMembers,
            upcomingMeetings,
            announcements,
            families: sanitizedFamilies,
        };
        (0, response_1.sendSuccess)(res, dashboard, 'Koottayma dashboard data retrieved');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_DASHBOARD_FAILED', 500);
    }
}
async function createKoottayma(req, res) {
    try {
        const { name, number, patronSaint, leader, leaderPhone } = req.body;
        if (!name || !number || !patronSaint || !leader || !leaderPhone) {
            (0, response_1.sendError)(res, 'Name, number, patron saint, leader and phone are required', 'BAD_REQUEST', 400);
            return;
        }
        const koottayma = await Koottayma_1.Koottayma.create(req.body);
        await (0, auditService_1.logAudit)(req, 'Created Koottayma', 'Koottayma', koottayma._id.toString(), `Unit: ${koottayma.name} (#${koottayma.number})`);
        (0, response_1.sendSuccess)(res, koottayma, 'Koottayma created successfully', 201);
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'CREATE_KOOTTAYMA_FAILED', 500);
    }
}
async function updateKoottayma(req, res) {
    try {
        const { id } = req.params;
        const koottayma = await Koottayma_1.Koottayma.findById(id);
        if (!koottayma) {
            (0, response_1.sendError)(res, 'Koottayma not found', 'NOT_FOUND', 404);
            return;
        }
        Object.assign(koottayma, req.body);
        await koottayma.save();
        await (0, auditService_1.logAudit)(req, 'Updated Koottayma', 'Koottayma', koottayma._id.toString(), `Unit: ${koottayma.name}`);
        (0, response_1.sendSuccess)(res, koottayma, 'Koottayma updated successfully');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'UPDATE_KOOTTAYMA_FAILED', 500);
    }
}
async function deleteKoottayma(req, res) {
    try {
        const { id } = req.params;
        const koottayma = await Koottayma_1.Koottayma.findById(id);
        if (!koottayma) {
            (0, response_1.sendError)(res, 'Koottayma not found', 'NOT_FOUND', 404);
            return;
        }
        await Koottayma_1.Koottayma.findByIdAndDelete(id);
        await (0, auditService_1.logAudit)(req, 'Deleted Koottayma', 'Koottayma', id, `Unit: ${koottayma.name}`);
        (0, response_1.sendSuccess)(res, null, 'Koottayma deleted successfully');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'DELETE_KOOTTAYMA_FAILED', 500);
    }
}
