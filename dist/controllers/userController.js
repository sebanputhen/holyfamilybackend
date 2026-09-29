"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.getUserMetrics = getUserMetrics;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const Role_1 = require("../models/Role");
const response_1 = require("../utils/response");
const auditService_1 = require("../services/auditService");
async function getUsers(req, res) {
    try {
        const { role, isActive, search } = req.query;
        const query = {};
        if (role)
            query.role = role;
        if (isActive !== undefined)
            query.isActive = isActive === 'true';
        if (search) {
            const regex = new RegExp(search, 'i');
            query.$or = [{ name: regex }, { phone: regex }, { email: regex }];
        }
        const users = await User_1.User.find(query)
            .select('-password -refreshTokens')
            .populate('assignedKoottayma', 'name number')
            .sort({ createdAt: -1 });
        (0, response_1.sendSuccess)(res, users, 'Users retrieved successfully');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_USERS_FAILED', 500);
    }
}
async function getUserMetrics(req, res) {
    try {
        const totalUsers = await User_1.User.countDocuments();
        const parishioners = await User_1.User.countDocuments({ role: Role_1.UserRole.PARISHIONER });
        const koottaymaLeaders = await User_1.User.countDocuments({ role: Role_1.UserRole.KOOTTAYMA_LEADER });
        const admins = await User_1.User.countDocuments({ role: Role_1.UserRole.ADMIN });
        const superAdmins = await User_1.User.countDocuments({ role: Role_1.UserRole.SUPER_ADMIN });
        const activeUsers = await User_1.User.countDocuments({ isActive: true });
        const inactiveUsers = await User_1.User.countDocuments({ isActive: false });
        (0, response_1.sendSuccess)(res, {
            totalUsers,
            parishioners,
            koottaymaLeaders,
            admins,
            superAdmins,
            activeUsers,
            inactiveUsers,
        }, 'User metrics retrieved');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_USER_METRICS_FAILED', 500);
    }
}
async function createUser(req, res) {
    try {
        const { name, phone, email, password, role, assignedKoottayma } = req.body;
        if (!name || !phone || !password || !role) {
            (0, response_1.sendError)(res, 'Name, phone, password, and role are required', 'BAD_REQUEST', 400);
            return;
        }
        const existing = await User_1.User.findOne({ phone });
        if (existing) {
            (0, response_1.sendError)(res, 'A user with this mobile phone number already exists', 'BAD_REQUEST', 400);
            return;
        }
        const user = await User_1.User.create({
            name,
            phone,
            email,
            password,
            role,
            assignedKoottayma: assignedKoottayma || null,
            isActive: true,
        });
        await (0, auditService_1.logAudit)(req, 'Created User Account', 'User', user._id.toString(), `Name: ${user.name}, Role: ${user.role}`);
        const sanitized = user.toObject();
        delete sanitized.password;
        delete sanitized.refreshTokens;
        (0, response_1.sendSuccess)(res, sanitized, 'User created successfully', 201);
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'CREATE_USER_FAILED', 500);
    }
}
async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const user = await User_1.User.findById(id);
        if (!user) {
            (0, response_1.sendError)(res, 'User not found', 'NOT_FOUND', 404);
            return;
        }
        const allowedUpdates = ['name', 'phone', 'email', 'role', 'isActive', 'assignedKoottayma'];
        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });
        if (req.body.password) {
            const salt = await bcryptjs_1.default.genSalt(10);
            user.password = await bcryptjs_1.default.hash(req.body.password, salt);
        }
        await user.save();
        await (0, auditService_1.logAudit)(req, 'Updated User Account', 'User', user._id.toString(), `Role: ${user.role}, Active: ${user.isActive}`);
        const sanitized = user.toObject();
        delete sanitized.password;
        delete sanitized.refreshTokens;
        (0, response_1.sendSuccess)(res, sanitized, 'User updated successfully');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'UPDATE_USER_FAILED', 500);
    }
}
async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        const user = await User_1.User.findById(id);
        if (!user) {
            (0, response_1.sendError)(res, 'User not found', 'NOT_FOUND', 404);
            return;
        }
        // Protect Super Admin from deleting themselves
        if (user._id.toString() === req.user?._id?.toString()) {
            (0, response_1.sendError)(res, 'You cannot delete your own Super Admin account', 'FORBIDDEN', 403);
            return;
        }
        await User_1.User.findByIdAndDelete(id);
        await (0, auditService_1.logAudit)(req, 'Deleted User Account', 'User', id, `User: ${user.name} (${user.phone})`);
        (0, response_1.sendSuccess)(res, null, 'User deleted successfully');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'DELETE_USER_FAILED', 500);
    }
}
