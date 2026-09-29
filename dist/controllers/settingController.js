"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettings = getSettings;
exports.updateSettings = updateSettings;
const Setting_1 = require("../models/Setting");
const response_1 = require("../utils/response");
const auditService_1 = require("../services/auditService");
async function getSettings(req, res) {
    try {
        let settings = await Setting_1.Setting.findOne({ key: 'global_settings' });
        if (!settings) {
            settings = await Setting_1.Setting.create({ key: 'global_settings' });
        }
        (0, response_1.sendSuccess)(res, settings, 'Parish settings retrieved');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'GET_SETTINGS_FAILED', 500);
    }
}
async function updateSettings(req, res) {
    try {
        let settings = await Setting_1.Setting.findOne({ key: 'global_settings' });
        if (!settings) {
            settings = new Setting_1.Setting({ key: 'global_settings', ...req.body });
        }
        else {
            if (req.body.general)
                settings.general = { ...settings.general, ...req.body.general };
            if (req.body.privacy)
                settings.privacy = { ...settings.privacy, ...req.body.privacy };
            if (req.body.notifications)
                settings.notifications = { ...settings.notifications, ...req.body.notifications };
            if (req.body.security)
                settings.security = { ...settings.security, ...req.body.security };
            if (req.body.application)
                settings.application = { ...settings.application, ...req.body.application };
        }
        await settings.save();
        await (0, auditService_1.logAudit)(req, 'Updated System Settings', 'Setting', settings._id.toString(), 'Admin updated configuration');
        (0, response_1.sendSuccess)(res, settings, 'Parish settings updated successfully');
    }
    catch (err) {
        (0, response_1.sendError)(res, err.message, 'UPDATE_SETTINGS_FAILED', 500);
    }
}
