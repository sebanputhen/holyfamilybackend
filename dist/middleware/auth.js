"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.optionalAuthenticate = optionalAuthenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../config/environment");
const User_1 = require("../models/User");
const response_1 = require("../utils/response");
async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            (0, response_1.sendError)(res, 'Authentication token required', 'UNAUTHORIZED', 401);
            return;
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            (0, response_1.sendError)(res, 'Invalid authorization format', 'UNAUTHORIZED', 401);
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, environment_1.config.jwtSecret);
        const user = await User_1.User.findById(decoded.id);
        if (!user) {
            (0, response_1.sendError)(res, 'User no longer exists', 'UNAUTHORIZED', 401);
            return;
        }
        if (!user.isActive) {
            (0, response_1.sendError)(res, 'Your user account is deactivated. Please contact Parish Office.', 'FORBIDDEN', 403);
            return;
        }
        req.user = user;
        next();
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            (0, response_1.sendError)(res, 'Token has expired. Please refresh your session or log in again.', 'TOKEN_EXPIRED', 401);
            return;
        }
        (0, response_1.sendError)(res, 'Invalid authentication token', 'UNAUTHORIZED', 401);
    }
}
// Optional authentication middleware (for public endpoints where logged in users get more fields)
async function optionalAuthenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }
    const token = authHeader.split(' ')[1];
    if (!token)
        return next();
    try {
        const decoded = jsonwebtoken_1.default.verify(token, environment_1.config.jwtSecret);
        const user = await User_1.User.findById(decoded.id);
        if (user && user.isActive) {
            req.user = user;
        }
    }
    catch (err) {
        // ignore token errors for optional auth
    }
    next();
}
