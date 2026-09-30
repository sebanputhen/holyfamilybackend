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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../models/User");
const Family_1 = require("../models/Family");
const Koottayma_1 = require("../models/Koottayma");
const Parish_1 = require("../models/Parish");
const seed_1 = require("../seeds/seed");
const response_1 = require("../utils/response");
const router = (0, express_1.Router)();
// GET /api/v1/setup/status - Inspect database health, collections, and record counts
router.get('/status', async (req, res) => {
    try {
        const isConnected = mongoose_1.default.connection.readyState === 1;
        let counts = {
            families: 0,
            koottaymas: 0,
            users: 0,
            parishes: 0,
        };
        if (isConnected) {
            const [fCount, kCount, uCount, pCount] = await Promise.all([
                Family_1.Family.countDocuments().catch(() => 0),
                Koottayma_1.Koottayma.countDocuments().catch(() => 0),
                User_1.User.countDocuments().catch(() => 0),
                Parish_1.Parish.countDocuments().catch(() => 0),
            ]);
            counts = {
                families: fCount,
                koottaymas: kCount,
                users: uCount,
                parishes: pCount,
            };
        }
        return (0, response_1.sendSuccess)(res, {
            database: isConnected ? 'connected' : 'disconnected',
            readyState: mongoose_1.default.connection.readyState,
            counts,
            isSeeded: counts.families >= 1000,
            instructions: counts.families < 1000
                ? 'Database is connected but directory is empty. Call POST or GET /api/v1/setup/seed to seed 1,173 families & 55 Koottaymas.'
                : 'Database is fully populated and production ready.',
        }, 'Database setup status retrieved');
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message, 'SETUP_STATUS_FAILED', 500);
    }
});
// GET & POST /api/v1/setup/seed - One-click seed for cloud deployments (Vercel / MongoDB Atlas)
const handleSeed = async (req, res) => {
    try {
        const userCount = await User_1.User.countDocuments();
        const familyCount = await Family_1.Family.countDocuments();
        // Allow seed if database is empty or force parameter provided
        const force = req.query.force === 'true' || req.body?.force === true;
        if (userCount > 0 && familyCount >= 1000 && !force) {
            return (0, response_1.sendSuccess)(res, {
                families: familyCount,
                users: userCount,
                message: 'Database is already seeded with authentic parish directory. Use ?force=true to re-seed.',
            }, 'Database already seeded');
        }
        console.log('--- Triggering Web/Serverless Database Seeding ---');
        await (0, seed_1.runSeed)();
        const newFamilyCount = await Family_1.Family.countDocuments();
        const newKoottaymaCount = await Koottayma_1.Koottayma.countDocuments();
        const newUserCount = await User_1.User.countDocuments();
        return (0, response_1.sendSuccess)(res, {
            families: newFamilyCount,
            koottaymas: newKoottaymaCount,
            users: newUserCount,
            sampleLogins: {
                superadmin: 'phone: +919800000001 | password: Password@123',
                admin: 'phone: +919800000002 | password: Password@123',
                leader: 'phone: +919800000003 | password: Password@123',
                parishioner: 'phone: +919800000004 | password: Password@123',
            },
        }, 'Catholic Forane Parish database seeded successfully with 1,173 families across 55 Koottaymas!');
    }
    catch (error) {
        console.error('Web/Serverless Seed Failed:', error);
        return (0, response_1.sendError)(res, `Seeding failed: ${error.message}`, 'SEED_FAILED', 500);
    }
};
// GET & POST /api/v1/setup/seed-koottaymas - Fast 55-unit metadata sync (under 2 seconds)
const handleSeedKoottaymas = async (req, res) => {
    try {
        const { AUTHENTIC_KOOTTAYMAS } = await Promise.resolve().then(() => __importStar(require('../seeds/koottaymaDirectoryData')));
        console.log('--- Fast-Syncing 55 Authentic Koottaymas ---');
        const updatedUnits = [];
        for (const [unitCode, meta] of Object.entries(AUTHENTIC_KOOTTAYMAS)) {
            const doc = await Koottayma_1.Koottayma.findOneAndUpdate({ number: unitCode }, {
                $set: {
                    name: meta.nameEn,
                    nameMl: meta.nameMl,
                    number: unitCode,
                    unitCode: unitCode,
                    patronSaint: meta.patronSaint,
                    feastDate: meta.feastDate,
                    location: meta.location,
                    zone: meta.zone,
                    totalHouses: meta.totalHouses,
                    description: `${meta.zone} • ${meta.location} • Feast: ${meta.feastDate}`,
                    meetingLocation: meta.location || 'Rotating Family Residences',
                    meetingDay: 'Sunday',
                    meetingTime: '05:00 PM',
                    status: 'Active',
                },
                $setOnInsert: {
                    leader: 'Unit Coordinator',
                    leaderPhone: '+91 98000 00000',
                },
            }, { upsert: true, new: true });
            updatedUnits.push({
                unit: unitCode,
                name: doc.name,
                nameMl: doc.nameMl,
                patronSaint: doc.patronSaint,
                zone: doc.zone,
                location: doc.location,
                feastDate: doc.feastDate,
                houses: doc.totalHouses,
            });
        }
        // Update family records with new authentic Koottayma names
        const koottaymaDocs = await Koottayma_1.Koottayma.find({});
        const bulkFamilyOps = koottaymaDocs.map((k) => ({
            updateMany: {
                filter: { koottaymaId: k._id },
                update: { $set: { koottaymaName: k.name } },
            },
        }));
        if (bulkFamilyOps.length > 0) {
            await Family_1.Family.bulkWrite(bulkFamilyOps);
        }
        return (0, response_1.sendSuccess)(res, {
            count: updatedUnits.length,
            units: updatedUnits,
        }, 'All 55 authentic Koottaymas successfully updated with Malayalam names, patron saints, feast dates, and biblical zones!');
    }
    catch (error) {
        console.error('Koottayma Seed Failed:', error);
        return (0, response_1.sendError)(res, `Koottayma fast seed failed: ${error.message}`, 'SEED_KOOTTAYMAS_FAILED', 500);
    }
};
router.get('/seed', handleSeed);
router.post('/seed', handleSeed);
router.get('/seed-koottaymas', handleSeedKoottaymas);
router.post('/seed-koottaymas', handleSeedKoottaymas);
exports.default = router;
