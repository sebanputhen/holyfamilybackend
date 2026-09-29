"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setting = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const SettingSchema = new mongoose_1.Schema({
    key: { type: String, required: true, unique: true, default: 'global_settings' },
    general: {
        parishName: { type: String, default: "St. Mary's Forane Church" },
        defaultLanguage: { type: String, enum: ['en', 'ml'], default: 'en' },
        timeZone: { type: String, default: 'Asia/Kolkata' },
        contactEmail: { type: String, default: 'office@stmarysforane.org' },
        contactPhone: { type: String, default: '+91 484 2200112' },
    },
    privacy: {
        directoryOptOutAllowed: { type: Boolean, default: true },
        defaultPhoneVisible: { type: Boolean, default: true },
        defaultEmailVisible: { type: Boolean, default: false },
        defaultAddressVisible: { type: Boolean, default: true },
        defaultDobVisible: { type: Boolean, default: false },
    },
    notifications: {
        pushNotificationsEnabled: { type: Boolean, default: true },
        eventRemindersEnabled: { type: Boolean, default: true },
        massRemindersEnabled: { type: Boolean, default: true },
        prayerMeetingRemindersEnabled: { type: Boolean, default: true },
    },
    security: {
        sessionTimeoutMinutes: { type: Number, default: 60 },
        maxLoginAttempts: { type: Number, default: 5 },
        passwordMinLength: { type: Number, default: 6 },
        requireOtp: { type: Boolean, default: false },
    },
    application: {
        maintenanceMode: { type: Boolean, default: false },
        maintenanceMessage: { type: String, default: 'System is temporarily under scheduled maintenance.' },
        appVersion: { type: String, default: '1.0.0' },
        minSupportedVersion: { type: String, default: '1.0.0' },
    },
}, { timestamps: true });
exports.Setting = mongoose_1.default.model('Setting', SettingSchema);
