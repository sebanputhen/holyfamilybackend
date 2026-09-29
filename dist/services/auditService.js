"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAudit = logAudit;
const AuditLog_1 = require("../models/AuditLog");
async function logAudit(req, action, resourceType, resourceId = '', details = '', overrideUser) {
    try {
        const user = overrideUser || req?.user;
        const ipAddress = req?.headers['x-forwarded-for']?.toString() ||
            req?.socket?.remoteAddress ||
            '';
        const userAgent = req?.headers['user-agent'] || '';
        await AuditLog_1.AuditLog.create({
            timestamp: new Date(),
            userId: user?._id || user?.id || null,
            userName: user?.name || 'System / Anonymous',
            userRole: user?.role || 'Guest',
            action,
            resourceType,
            resourceId,
            details,
            ipAddress,
            userAgent,
        });
    }
    catch (err) {
        console.error('Failed to write audit log:', err.message);
    }
}
