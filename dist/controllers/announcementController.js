"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnnouncements = getAnnouncements;
exports.createAnnouncement = createAnnouncement;
exports.updateAnnouncement = updateAnnouncement;
exports.deleteAnnouncement = deleteAnnouncement;
const Announcement_1 = require("../models/Announcement");
const response_1 = require("../utils/response");
const auditService_1 = require("../services/auditService");
const Role_1 = require("../models/Role");
async function getAnnouncements(req, res) {
    try {
        const { priority, category } = req.query;
        const query = { isActive: true };
        if (priority)
            query.priority = priority;
        if (category)
            query.category = category;
        // Filter by target audience based on user role
        if (!req.user || req.user.role === Role_1.UserRole.PARISHIONER) {
            query.$or = [{ targetAudience: 'All' }, { targetAudience: 'Parishioners' }];
        }
        else if (req.user.role === Role_1.UserRole.KOOTTAYMA_LEADER) {
            query.$or = [
                { targetAudience: 'All' },
                { targetAudience: 'Parishioners' },
                { targetAudience: 'Koottayma Leaders' },
                { targetKoottaymaId: req.user.assignedKoottayma },
            ];
        }
        // Admins and Super Admins see all announcements
        const announcements = await Announcement_1.Announcement.find(query).sort({
            isPinned: -1,
            priority: -1,
            publishedDate: -1,
        });
        (0, response_1.sendSuccess)(res, announcements, 'Parish announcements retrieved');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_ANNOUNCEMENTS_FAILED', 500);
    }
}
async function createAnnouncement(req, res) {
    try {
        const { title, content, priority, targetAudience } = req.body;
        if (!title || !content) {
            (0, response_1.sendError)(res, 'Title and content are required', 'BAD_REQUEST', 400);
            return;
        }
        const announcement = await Announcement_1.Announcement.create(req.body);
        await (0, auditService_1.logAudit)(req, 'Created Announcement', 'Announcement', announcement._id.toString(), `Title: ${announcement.title}, Priority: ${announcement.priority}`);
        (0, response_1.sendSuccess)(res, announcement, 'Announcement published successfully', 201);
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'CREATE_ANNOUNCEMENT_FAILED', 500);
    }
}
async function updateAnnouncement(req, res) {
    try {
        const { id } = req.params;
        const announcement = await Announcement_1.Announcement.findById(id);
        if (!announcement) {
            (0, response_1.sendError)(res, 'Announcement not found', 'NOT_FOUND', 404);
            return;
        }
        Object.assign(announcement, req.body);
        await announcement.save();
        await (0, auditService_1.logAudit)(req, 'Updated Announcement', 'Announcement', announcement._id.toString(), `Title: ${announcement.title}`);
        (0, response_1.sendSuccess)(res, announcement, 'Announcement updated successfully');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'UPDATE_ANNOUNCEMENT_FAILED', 500);
    }
}
async function deleteAnnouncement(req, res) {
    try {
        const { id } = req.params;
        const announcement = await Announcement_1.Announcement.findById(id);
        if (!announcement) {
            (0, response_1.sendError)(res, 'Announcement not found', 'NOT_FOUND', 404);
            return;
        }
        await Announcement_1.Announcement.findByIdAndDelete(id);
        await (0, auditService_1.logAudit)(req, 'Deleted Announcement', 'Announcement', id, `Title: ${announcement.title}`);
        (0, response_1.sendSuccess)(res, null, 'Announcement deleted');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'DELETE_ANNOUNCEMENT_FAILED', 500);
    }
}
