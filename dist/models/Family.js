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
exports.Family = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const FamilySchema = new mongoose_1.Schema({
    familyId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    houseName: { type: String, required: true, trim: true },
    familyName: { type: String, required: true, trim: true },
    headOfFamily: { type: String, required: true, trim: true },
    headPersonId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Person', default: null },
    address: { type: String, required: true },
    area: { type: String, default: '' },
    city: { type: String, default: 'Kochi' },
    district: { type: String, default: 'Ernakulam' },
    state: { type: String, default: 'Kerala' },
    pincode: { type: String, default: '682020' },
    phone1: { type: String, required: true, trim: true },
    phone2: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true, lowercase: true },
    koottaymaId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Koottayma', required: true },
    koottaymaName: { type: String, required: true },
    parish: { type: String, default: "St. Mary's Forane Church" },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Transferred', 'Deceased / Historical', 'Other'],
        default: 'Active',
    },
    notes: { type: String, default: '' },
    privacy: {
        isPhone1Visible: { type: Boolean, default: true },
        isPhone2Visible: { type: Boolean, default: true },
        isEmailVisible: { type: Boolean, default: false },
        isAddressVisible: { type: Boolean, default: true },
        optOutOfDirectory: { type: Boolean, default: false },
    },
}, { timestamps: true });
FamilySchema.index({ houseName: 'text', headOfFamily: 'text', familyName: 'text', phone1: 'text' });
exports.Family = mongoose_1.default.model('Family', FamilySchema);
