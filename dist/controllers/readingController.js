"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReading = getReading;
exports.upsertReading = upsertReading;
const DailyReading_1 = require("../models/DailyReading");
const response_1 = require("../utils/response");
const auditService_1 = require("../services/auditService");
async function getReading(req, res) {
    try {
        const dateParam = req.query.date || new Date().toISOString().split('T')[0];
        let reading = await DailyReading_1.DailyReading.findOne({ date: dateParam });
        // Fallback if specific date reading is not yet seeded: return closest or create sample liturgical reading
        if (!reading) {
            reading = await DailyReading_1.DailyReading.findOne().sort({ date: -1 });
        }
        (0, response_1.sendSuccess)(res, reading, 'Daily reading retrieved');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_READING_FAILED', 500);
    }
}
async function upsertReading(req, res) {
    try {
        const { date, firstReading, psalm, gospel } = req.body;
        if (!date || !firstReading || !psalm || !gospel) {
            (0, response_1.sendError)(res, 'Date, first reading, psalm, and gospel are required', 'BAD_REQUEST', 400);
            return;
        }
        const reading = await DailyReading_1.DailyReading.findOneAndUpdate({ date }, { $set: req.body }, { new: true, upsert: true });
        await (0, auditService_1.logAudit)(req, 'Saved Daily Reading', 'DailyReading', reading._id.toString(), `Date: ${reading.date}`);
        (0, response_1.sendSuccess)(res, reading, 'Daily reading saved successfully');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'SAVE_READING_FAILED', 500);
    }
}
