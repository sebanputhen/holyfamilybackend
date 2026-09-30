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
exports.Koottayma = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const KoottaymaSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    nameMl: { type: String, default: '' },
    number: { type: mongoose_1.Schema.Types.Mixed, required: true, unique: true },
    unitCode: { type: String, default: '' },
    patronSaint: { type: String, required: true },
    feastDate: { type: String, default: '' },
    location: { type: String, default: '' },
    zone: { type: String, default: '' },
    totalHouses: { type: Number, default: 0 },
    leader: { type: String, required: true },
    leaderPhone: { type: String, required: true },
    assistantLeader: { type: String, default: '' },
    assistantLeaderPhone: { type: String, default: '' },
    meetingLocation: { type: String, default: 'Rotating Family Residences' },
    meetingDay: { type: String, default: 'Sunday' },
    meetingTime: { type: String, default: '05:00 PM' },
    description: { type: String, default: '' },
    assignedLeaderUserId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });
exports.Koottayma = mongoose_1.default.model('Koottayma', KoottaymaSchema);
