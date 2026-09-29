"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = getAuditLogs;
const AuditLog_1 = require("../models/AuditLog");
const response_1 = require("../utils/response");
async function getAuditLogs(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 30;
        const resourceType = req.query.resourceType;
        const action = req.query.action;
        const userName = req.query.userName;
        const query = {};
        if (resourceType)
            query.resourceType = resourceType;
        if (action)
            query.action = new RegExp(action, 'i');
        if (userName)
            query.userName = new RegExp(userName, 'i');
        const total = await AuditLog_1.AuditLog.countDocuments(query);
        const logs = await AuditLog_1.AuditLog.find(query)
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        (0, response_1.sendSuccess)(res, logs, 'Audit logs retrieved', 200, {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit) || 1,
        });
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_AUDIT_LOGS_FAILED', 500);
    }
}
