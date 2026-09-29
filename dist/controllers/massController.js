"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMassSchedules = getMassSchedules;
exports.createMassSchedule = createMassSchedule;
exports.updateMassSchedule = updateMassSchedule;
exports.deleteMassSchedule = deleteMassSchedule;
const MassSchedule_1 = require("../models/MassSchedule");
const response_1 = require("../utils/response");
const auditService_1 = require("../services/auditService");
async function getMassSchedules(req, res) {
    try {
        const { day, serviceType, language, view } = req.query;
        const query = { status: 'Active' };
        if (serviceType)
            query.serviceType = serviceType;
        if (language)
            query.language = language;
        if (view === 'today') {
            const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
            query.$or = [{ dayOfWeek: todayDay }, { dayOfWeek: 'Daily' }];
        }
        else if (view === 'tomorrow') {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowDay = tomorrow.toLocaleDateString('en-US', { weekday: 'long' });
            query.$or = [{ dayOfWeek: tomorrowDay }, { dayOfWeek: 'Daily' }];
        }
        else if (day) {
            query.$or = [{ dayOfWeek: day }, { dayOfWeek: 'Daily' }];
        }
        const schedules = await MassSchedule_1.MassSchedule.find(query).sort({ time: 1 });
        (0, response_1.sendSuccess)(res, schedules, 'Mass and service schedules retrieved');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_MASS_SCHEDULES_FAILED', 500);
    }
}
async function createMassSchedule(req, res) {
    try {
        const { serviceType, dayOfWeek, time } = req.body;
        if (!serviceType || !dayOfWeek || !time) {
            (0, response_1.sendError)(res, 'Service type, day of week, and time are required', 'BAD_REQUEST', 400);
            return;
        }
        const schedule = await MassSchedule_1.MassSchedule.create(req.body);
        await (0, auditService_1.logAudit)(req, 'Created Mass Schedule', 'MassSchedule', schedule._id.toString(), `${schedule.serviceType} at ${schedule.time} on ${schedule.dayOfWeek}`);
        (0, response_1.sendSuccess)(res, schedule, 'Mass schedule created successfully', 201);
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'CREATE_MASS_FAILED', 500);
    }
}
async function updateMassSchedule(req, res) {
    try {
        const { id } = req.params;
        const schedule = await MassSchedule_1.MassSchedule.findById(id);
        if (!schedule) {
            (0, response_1.sendError)(res, 'Schedule not found', 'NOT_FOUND', 404);
            return;
        }
        Object.assign(schedule, req.body);
        await schedule.save();
        await (0, auditService_1.logAudit)(req, 'Updated Mass Schedule', 'MassSchedule', schedule._id.toString(), `Updated ${schedule.serviceType}`);
        (0, response_1.sendSuccess)(res, schedule, 'Mass schedule updated');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'UPDATE_MASS_FAILED', 500);
    }
}
async function deleteMassSchedule(req, res) {
    try {
        const { id } = req.params;
        const schedule = await MassSchedule_1.MassSchedule.findById(id);
        if (!schedule) {
            (0, response_1.sendError)(res, 'Schedule not found', 'NOT_FOUND', 404);
            return;
        }
        await MassSchedule_1.MassSchedule.findByIdAndDelete(id);
        await (0, auditService_1.logAudit)(req, 'Deleted Mass Schedule', 'MassSchedule', id, `Deleted ${schedule.serviceType}`);
        (0, response_1.sendSuccess)(res, null, 'Schedule deleted');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'DELETE_MASS_FAILED', 500);
    }
}
