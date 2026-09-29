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
exports.ParishHistory = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ParishHistorySchema = new mongoose_1.Schema({
    year: { type: Number, required: true },
    event: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    photos: [{ type: String }],
    category: {
        type: String,
        enum: ['Establishment', 'Milestone', 'Development', 'Historical Event', 'Personality'],
        default: 'Milestone',
    },
    importantPersonalities: [{ type: String }],
    documents: [
        {
            title: { type: String, required: true },
            url: { type: String, required: true },
        },
    ],
    order: { type: Number, default: 0 },
}, { timestamps: true });
ParishHistorySchema.index({ year: 1, order: 1 });
exports.ParishHistory = mongoose_1.default.model('ParishHistory', ParishHistorySchema);
