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
exports.Parish = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ParishSchema = new mongoose_1.Schema({
    name: { type: String, required: true, default: "St. Mary's Forane Church" },
    logoUrl: { type: String, default: '/assets/parish-logo.png' },
    patronSaint: { type: String, required: true, default: 'Mother Mary (Our Lady of Assumption)' },
    diocese: { type: String, required: true, default: 'Archdiocese of Ernakulam-Angamaly' },
    forane: { type: String, required: true, default: 'Forane of St. Mary' },
    address: { type: String, required: true, default: 'Main Road, Kadavanthra, Kochi, Kerala 682020' },
    establishedYear: { type: Number, required: true, default: 1894 },
    parishFeast: { type: String, required: true, default: 'Feast of the Assumption (August 15)' },
    currentParishPriest: {
        name: { type: String, required: true, default: 'Very Rev. Fr. Joseph Pulivelil' },
        phone: { type: String, default: '+91 94471 23456' },
        photoUrl: { type: String, default: '/assets/priests/fr_joseph.jpg' },
        serviceStartDate: { type: Date, default: new Date('2022-05-15') },
    },
    assistantPriests: [
        {
            name: { type: String, default: 'Rev. Fr. Mathew Vadakkedath' },
            phone: { type: String, default: '+91 94472 34567' },
            photoUrl: { type: String, default: '/assets/priests/fr_mathew.jpg' },
            serviceStartDate: { type: Date, default: new Date('2024-05-10') },
        },
    ],
    totalFamiliesCount: { type: Number, default: 350 },
    totalParishionersCount: { type: Number, default: 1420 },
    totalKoottaymasCount: { type: Number, default: 8 },
    institutions: [
        {
            name: { type: String, default: "St. Mary's Higher Secondary School" },
            type: { type: String, default: 'School' },
            description: { type: String, default: 'Co-educational aided school since 1952' },
        },
        {
            name: { type: String, default: 'Nirmala Bhavan Convent (CMC)' },
            type: { type: String, default: 'Convent' },
            description: { type: String, default: 'Sisters of the Congregation of Mother of Carmel' },
        },
        {
            name: { type: String, default: 'Karuna Dispensary & Day Care' },
            type: { type: String, default: 'Healthcare' },
            description: { type: String, default: 'Charitable dispensary serving the underprivileged' },
        },
    ],
    officeInfo: {
        phone: { type: String, default: '+91 484 2200112' },
        email: { type: String, default: 'office@stmarysforane.org' },
        officeHours: { type: String, default: 'Tue - Sun: 9:00 AM - 1:00 PM, 4:00 PM - 7:00 PM (Monday Closed)' },
        address: { type: String, default: 'St. Mary Forane Church Road, Kadavanthra, Kochi 682020' },
        mapLocation: {
            latitude: { type: Number, default: 9.9674 },
            longitude: { type: Number, default: 76.2996 },
            googleMapsUrl: { type: String, default: 'https://maps.google.com/?q=9.9674,76.2996' },
        },
        website: { type: String, default: 'https://stmarysforane.org' },
        socialMedia: {
            facebook: { type: String, default: 'https://facebook.com/stmarysforane' },
            youtube: { type: String, default: 'https://youtube.com/@stmarysforanekochi' },
            instagram: { type: String, default: 'https://instagram.com/stmarysforane' },
            whatsapp: { type: String, default: '+919447123456' },
        },
    },
    welcomeMessage: {
        en: {
            type: String,
            default: 'Welcome to St. Mary\'s Forane Church community! A sacred spiritual home united in prayer, love, and service.',
        },
        ml: {
            type: String,
            default: 'വിശുദ്ധ മറിയത്തിന്റെ ഫൊറോന ദേവാലയത്തിലേക്ക് ഏവർക്കും സ്വാഗതം! പ്രാർത്ഥനയിലും സ്നേഹത്തിലും ഐക്യപ്പെട്ട സഭാ സമൂഹം.',
        },
    },
}, { timestamps: true });
exports.Parish = mongoose_1.default.model('Parish', ParishSchema);
