"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.refreshToken = refreshToken;
exports.logout = logout;
exports.getMe = getMe;
exports.forgotPassword = forgotPassword;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const environment_1 = require("../config/environment");
const response_1 = require("../utils/response");
const auditService_1 = require("../services/auditService");
function generateTokens(user) {
    const accessToken = jsonwebtoken_1.default.sign({ id: user._id, role: user.role, name: user.name }, environment_1.config.jwtSecret, { expiresIn: environment_1.config.jwtExpiresIn });
    const refreshToken = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, environment_1.config.jwtRefreshSecret, { expiresIn: environment_1.config.jwtRefreshExpiresIn });
    return { accessToken, refreshToken };
}
async function login(req, res) {
    try {
        const { loginIdentifier, password } = req.body;
        if (!loginIdentifier || !password) {
            (0, response_1.sendError)(res, 'Mobile number or email and password are required', 'BAD_REQUEST', 400);
            return;
        }
        const trimmedIdentifier = loginIdentifier.trim().toLowerCase();
        const user = await User_1.User.findOne({
            $or: [
                { phone: trimmedIdentifier },
                { email: trimmedIdentifier },
            ],
        }).populate('assignedKoottayma', 'name number');
        if (!user) {
            await (0, auditService_1.logAudit)(req, 'Failed Login Attempt', 'User', '', `Identifier: ${trimmedIdentifier}`);
            (0, response_1.sendError)(res, 'Invalid credentials provided', 'UNAUTHORIZED', 401);
            return;
        }
        if (!user.isActive) {
            (0, response_1.sendError)(res, 'This account is deactivated. Please contact Parish Office.', 'FORBIDDEN', 403);
            return;
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            await (0, auditService_1.logAudit)(req, 'Failed Login - Bad Password', 'User', user._id.toString(), `Identifier: ${trimmedIdentifier}`);
            (0, response_1.sendError)(res, 'Invalid credentials provided', 'UNAUTHORIZED', 401);
            return;
        }
        const { accessToken, refreshToken } = generateTokens(user);
        user.refreshTokens.push(refreshToken);
        user.lastLogin = new Date();
        await user.save();
        await (0, auditService_1.logAudit)(req, 'User Login Success', 'User', user._id.toString(), `Logged in with role ${user.role}`);
        (0, response_1.sendSuccess)(res, {
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                role: user.role,
                assignedKoottayma: user.assignedKoottayma,
                familyId: user.familyId,
                personId: user.personId,
            },
            accessToken,
            refreshToken,
        }, 'Login successful');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'LOGIN_FAILED', 500);
    }
}
async function refreshToken(req, res) {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            (0, response_1.sendError)(res, 'Refresh token required', 'BAD_REQUEST', 400);
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, environment_1.config.jwtRefreshSecret);
        const user = await User_1.User.findById(decoded.id);
        if (!user || !user.isActive || !user.refreshTokens.includes(refreshToken)) {
            (0, response_1.sendError)(res, 'Invalid or revoked refresh token', 'UNAUTHORIZED', 401);
            return;
        }
        const tokens = generateTokens(user);
        // Replace old refresh token with new one
        user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
        user.refreshTokens.push(tokens.refreshToken);
        await user.save();
        (0, response_1.sendSuccess)(res, tokens, 'Token refreshed successfully');
    }
    catch (err) {
        (0, response_1.sendError)(res, 'Token refresh failed', 'UNAUTHORIZED', 401);
    }
}
async function logout(req, res) {
    try {
        const { refreshToken } = req.body;
        if (req.user && refreshToken) {
            req.user.refreshTokens = req.user.refreshTokens.filter((t) => t !== refreshToken);
            await req.user.save();
        }
        if (req.user) {
            await (0, auditService_1.logAudit)(req, 'User Logout', 'User', req.user._id.toString());
        }
        (0, response_1.sendSuccess)(res, null, 'Logged out successfully');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'LOGOUT_FAILED', 500);
    }
}
async function getMe(req, res) {
    try {
        const user = await User_1.User.findById(req.user._id)
            .populate('assignedKoottayma')
            .populate('familyId')
            .populate('personId');
        (0, response_1.sendSuccess)(res, user, 'Current user profile retrieved');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_ME_FAILED', 500);
    }
}
async function forgotPassword(req, res) {
    try {
        const { phoneOrEmail } = req.body;
        const user = await User_1.User.findOne({
            $or: [{ phone: phoneOrEmail }, { email: phoneOrEmail }],
        });
        if (!user) {
            // Return success anyway to avoid user enumeration
            (0, response_1.sendSuccess)(res, null, 'If this account exists, password recovery instructions have been sent.');
            return;
        }
        await (0, auditService_1.logAudit)(req, 'Password Reset Requested', 'User', user._id.toString());
        (0, response_1.sendSuccess)(res, null, 'If this account exists, password recovery instructions have been sent.');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'FORGOT_PASSWORD_ERROR', 500);
    }
}
