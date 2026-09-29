"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const environment_1 = require("./config/environment");
const database_1 = require("./config/database");
const User_1 = require("./models/User");
const seed_1 = require("./seeds/seed");
async function bootstrap() {
    try {
        await (0, database_1.connectDB)();
        // Check if initial users exist, if not run seed automatically
        const userCount = await User_1.User.countDocuments();
        if (userCount === 0) {
            console.log('No users found in database. Initializing default parish demo data...');
            await (0, seed_1.runSeed)();
        }
        const server = app_1.default.listen(environment_1.config.port, () => {
            console.log(`=======================================================`);
            console.log(`Catholic Forane Parish Management API Server Started`);
            console.log(`Port:        ${environment_1.config.port}`);
            console.log(`Environment: ${environment_1.config.env}`);
            console.log(`API Base:    http://localhost:${environment_1.config.port}/api/v1`);
            console.log(`Health:      http://localhost:${environment_1.config.port}/api/health`);
            console.log(`=======================================================`);
        });
        const shutdown = async () => {
            console.log('Shutting down server gracefully...');
            server.close(() => {
                console.log('HTTP server closed.');
                process.exit(0);
            });
        };
        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    }
    catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
}
bootstrap();
