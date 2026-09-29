"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
exports.requirePermission = requirePermission;
const Role_1 = require("../models/Role");
const response_1 = require("../utils/response");
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            (0, response_1.sendError)(res, 'Authentication required', 'UNAUTHORIZED', 401);
            return;
        }
        // Super Admin has access to everything
        if (req.user.role === Role_1.UserRole.SUPER_ADMIN) {
            return next();
        }
        if (!allowedRoles.includes(req.user.role)) {
            (0, response_1.sendError)(res, 'You do not have permission to perform this action', 'FORBIDDEN', 403);
            return;
        }
        next();
    };
}
function requirePermission(...requiredPermissions) {
    return async (req, res, next) => {
        if (!req.user) {
            (0, response_1.sendError)(res, 'Authentication required', 'UNAUTHORIZED', 401);
            return;
        }
        if (req.user.role === Role_1.UserRole.SUPER_ADMIN) {
            return next();
        }
        try {
            const roleDoc = await Role_1.Role.findOne({ name: req.user.role });
            if (!roleDoc) {
                (0, response_1.sendError)(res, 'Role not configured in system', 'FORBIDDEN', 403);
                return;
            }
            const hasAll = requiredPermissions.every((perm) => roleDoc.permissions.includes(perm) || roleDoc.permissions.includes('*'));
            if (!hasAll) {
                (0, response_1.sendError)(res, 'Insufficient permissions for this operation', 'FORBIDDEN', 403);
                return;
            }
            next();
        }
        catch (err) {
            (0, response_1.sendError)(res, 'Permission verification failed', 'SERVER_ERROR', 500);
        }
    };
}
