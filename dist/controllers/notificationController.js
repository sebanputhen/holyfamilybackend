"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotifications = getNotifications;
exports.sendNotification = sendNotification;
exports.markAsRead = markAsRead;
const Notification_1 = require("../models/Notification");
const response_1 = require("../utils/response");
const auditService_1 = require("../services/auditService");
const Role_1 = require("../models/Role");
async function getNotifications(req, res) {
    try {
        const userId = req.user?._id;
        const query = {
            $or: [
                { targetAudience: 'All' },
                { targetUserId: userId },
            ],
        };
        if (req.user?.role === Role_1.UserRole.KOOTTAYMA_LEADER && req.user?.assignedKoottayma) {
            query.$or.push({ targetKoottaymaId: req.user.assignedKoottayma });
            query.$or.push({ targetAudience: 'Koottayma Leaders' });
        }
        const notifications = await Notification_1.Notification.find(query).sort({ createdAt: -1 }).limit(50);
        (0, response_1.sendSuccess)(res, notifications, 'Notifications retrieved');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_NOTIFICATIONS_FAILED', 500);
    }
}
async function sendNotification(req, res) {
    try {
        const { title, message, category, targetAudience, targetKoottaymaId } = req.body;
        if (!title || !message) {
            (0, response_1.sendError)(res, 'Title and message are required', 'BAD_REQUEST', 400);
            return;
        }
        const notification = await Notification_1.Notification.create({
            title,
            message,
            category: category || 'Announcement',
            targetAudience: targetAudience || 'All',
            targetKoottaymaId: targetKoottaymaId || null,
            sentBy: req.user?._id,
            sentAt: new Date(),
            status: 'Sent',
        });
        await (0, auditService_1.logAudit)(req, 'Sent Notification', 'Notification', notification._id.toString(), `Title: ${notification.title}, Audience: ${notification.targetAudience}`);
        (0, response_1.sendSuccess)(res, notification, 'Notification dispatched successfully', 201);
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'SEND_NOTIFICATION_FAILED', 500);
    }
}
async function markAsRead(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?._id;
        if (id === 'all') {
            await Notification_1.Notification.updateMany({ readBy: { $ne: userId } }, { $addToSet: { readBy: userId } });
            (0, response_1.sendSuccess)(res, null, 'All notifications marked as read');
            return;
        }
        const notification = await Notification_1.Notification.findById(id);
        if (!notification) {
            (0, response_1.sendError)(res, 'Notification not found', 'NOT_FOUND', 404);
            return;
        }
        if (!notification.readBy.some((r) => r.toString() === userId?.toString())) {
            notification.readBy.push(userId);
            await notification.save();
        }
        (0, response_1.sendSuccess)(res, notification, 'Notification marked as read');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'MARK_READ_FAILED', 500);
    }
}
