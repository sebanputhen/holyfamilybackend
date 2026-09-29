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
exports.PrayerMeeting = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PrayerMeetingSchema = new mongoose_1.Schema({
    koottaymaId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Koottayma', required: true },
    koottaymaName: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    hostFamily: { type: String, required: true },
    hostFamilyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Family', default: null },
    leader: { type: String, required: true },
    theme: { type: String, default: 'Living in Christ & Family Unity' },
    bibleReading: { type: String, default: 'Psalm 128: 1-6' },
    prayerIntention: { type: String, default: 'For parish unity and all suffering sick members' },
    notes: { type: String, default: '' },
    attendanceCount: { type: Number, default: 0 },
    attendeeNames: [{ type: String }],
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'],
        default: 'Scheduled',
    },
    submittedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    approvedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });
exports.PrayerMeeting = mongoose_1.default.model('PrayerMeeting', PrayerMeetingSchema);
