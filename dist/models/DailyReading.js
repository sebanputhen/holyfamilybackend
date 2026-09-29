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
exports.DailyReading = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const DailyReadingSchema = new mongoose_1.Schema({
    date: { type: String, required: true, unique: true, index: true },
    feastOfTheDay: {
        en: { type: String, default: '' },
        ml: { type: String, default: '' },
    },
    saintOfTheDay: {
        en: { type: String, default: '' },
        ml: { type: String, default: '' },
    },
    firstReading: {
        reference: { type: String, required: true },
        text: {
            en: { type: String, required: true },
            ml: { type: String, required: true },
        },
    },
    psalm: {
        reference: { type: String, required: true },
        text: {
            en: { type: String, required: true },
            ml: { type: String, required: true },
        },
        response: {
            en: { type: String, required: true },
            ml: { type: String, required: true },
        },
    },
    secondReading: {
        reference: { type: String, default: '' },
        text: {
            en: { type: String, default: '' },
            ml: { type: String, default: '' },
        },
    },
    gospel: {
        reference: { type: String, required: true },
        text: {
            en: { type: String, required: true },
            ml: { type: String, required: true },
        },
    },
    prayerOfTheDay: {
        en: { type: String, default: '' },
        ml: { type: String, default: '' },
    },
    parishPrayer: {
        en: { type: String, default: '' },
        ml: { type: String, default: '' },
    },
    specialPrayers: [
        {
            title: { en: String, ml: String },
            text: { en: String, ml: String },
        },
    ],
}, { timestamps: true });
exports.DailyReading = mongoose_1.default.model('DailyReading', DailyReadingSchema);
