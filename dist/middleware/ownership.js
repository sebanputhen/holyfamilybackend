"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyKoottaymaOwnership = verifyKoottaymaOwnership;
const Role_1 = require("../models/Role");
const response_1 = require("../utils/response");
/**
 * Ensures that if the user is a Koottayma Leader, they can only access resources
 * that belong strictly to their assigned Koottayma unit.
 * Admin and Super Admin bypass this restriction.
 */
function verifyKoottaymaOwnership(koottaymaIdParamName = 'id') {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            (0, response_1.sendError)(res, 'Authentication required', 'UNAUTHORIZED', 401);
            return;
        }
        // Super Admin and Admin have parish-wide oversight
        if (user.role === Role_1.UserRole.SUPER_ADMIN || user.role === Role_1.UserRole.ADMIN) {
            return next();
        }
        const requestedKoottaymaId = req.params[koottaymaIdParamName] ||
            req.body.koottaymaId ||
            req.query.koottaymaId;
        if (user.role === Role_1.UserRole.KOOTTAYMA_LEADER) {
            if (!user.assignedKoottayma) {
                (0, response_1.sendError)(res, 'You are not assigned to any Koottayma unit', 'FORBIDDEN', 403);
                return;
            }
            if (requestedKoottaymaId &&
                user.assignedKoottayma.toString() !== requestedKoottaymaId.toString()) {
                (0, response_1.sendError)(res, 'Access denied: You are only authorized to access your assigned Koottayma', 'FORBIDDEN', 403);
                return;
            }
        }
        next();
    };
}
