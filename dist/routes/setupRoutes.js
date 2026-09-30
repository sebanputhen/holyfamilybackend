"use strict";
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
router.get('/seed', handleSeed);
router.post('/seed', handleSeed);
exports.default = router;
