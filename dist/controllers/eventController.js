"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = getEvents;
exports.getEventById = getEventById;
exports.createEvent = createEvent;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;
const Event_1 = require("../models/Event");
const response_1 = require("../utils/response");
const auditService_1 = require("../services/auditService");
async function getEvents(req, res) {
    try {
        const { category, status, upcoming, search } = req.query;
        const query = {};
        if (category)
            query.category = category;
        if (status)
            query.status = status;
        if (upcoming === 'true') {
            query.date = { $gte: new Date(new Date().setHours(0, 0, 0, 0)) };
        }
        if (search) {
            const regex = new RegExp(search, 'i');
            query.$or = [{ title: regex }, { description: regex }, { venue: regex }];
        }
        const events = await Event_1.Event.find(query).sort({ date: 1, startTime: 1 });
        (0, response_1.sendSuccess)(res, events, 'Parish events retrieved');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_EVENTS_FAILED', 500);
    }
}
async function getEventById(req, res) {
    try {
        const { id } = req.params;
        const event = await Event_1.Event.findById(id);
        if (!event) {
            (0, response_1.sendError)(res, 'Event not found', 'NOT_FOUND', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, event, 'Event details retrieved');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_EVENT_FAILED', 500);
    }
}
async function createEvent(req, res) {
    try {
        const { title, description, date, startTime, endTime, venue, organizer, category } = req.body;
        if (!title || !description || !date || !startTime || !endTime || !venue || !organizer || !category) {
            (0, response_1.sendError)(res, 'All required event fields must be provided', 'BAD_REQUEST', 400);
            return;
        }
        const event = await Event_1.Event.create(req.body);
        await (0, auditService_1.logAudit)(req, 'Created Event', 'Event', event._id.toString(), `Title: ${event.title}, Date: ${event.date}`);
        (0, response_1.sendSuccess)(res, event, 'Parish event created successfully', 201);
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'CREATE_EVENT_FAILED', 500);
    }
}
async function updateEvent(req, res) {
    try {
        const { id } = req.params;
        const event = await Event_1.Event.findById(id);
        if (!event) {
            (0, response_1.sendError)(res, 'Event not found', 'NOT_FOUND', 404);
            return;
        }
        Object.assign(event, req.body);
        await event.save();
        await (0, auditService_1.logAudit)(req, 'Updated Event', 'Event', event._id.toString(), `Title: ${event.title}`);
        (0, response_1.sendSuccess)(res, event, 'Event updated successfully');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'UPDATE_EVENT_FAILED', 500);
    }
}
async function deleteEvent(req, res) {
    try {
        const { id } = req.params;
        const event = await Event_1.Event.findById(id);
        if (!event) {
            (0, response_1.sendError)(res, 'Event not found', 'NOT_FOUND', 404);
            return;
        }
        await Event_1.Event.findByIdAndDelete(id);
        await (0, auditService_1.logAudit)(req, 'Deleted Event', 'Event', id, `Title: ${event.title}`);
        (0, response_1.sendSuccess)(res, null, 'Event deleted');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'DELETE_EVENT_FAILED', 500);
    }
}
