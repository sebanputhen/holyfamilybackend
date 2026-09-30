"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const environment_1 = require("./config/environment");
const database_1 = require("./config/database");
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const response_1 = require("./utils/response");
const app = (0, express_1.default)();
// Security HTTP headers
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
// CORS configuration
app.use((0, cors_1.default)({
    origin: environment_1.config.corsOrigin === '*' ? true : environment_1.config.corsOrigin,
    credentials: true,
}));
// Rate limiting (100 requests per 15 minutes per IP for general endpoints)
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: {
        success: false,
        message: 'Too many requests from this IP address, please try again after 15 minutes',
        code: 'RATE_LIMIT_EXCEEDED',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);
// Logging
if (environment_1.config.env !== 'test') {
    app.use((0, morgan_1.default)('dev'));
}
// Body parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Static uploads directory
app.use('/uploads', express_1.default.static(path_1.default.resolve(__dirname, '../uploads')));
// Health check endpoint
app.get('/api/health', (req, res) => {
    const isDbConnected = mongoose_1.default.connection.readyState === 1;
    res.status(200).json({
        status: 'online',
        timestamp: new Date().toISOString(),
        service: 'Catholic Forane Parish Management API',
        version: '1.0.0',
        database: isDbConnected ? 'connected' : 'disconnected',
        isCloudDbConfigured: !environment_1.config.mongoUri.includes('127.0.0.1'),
    });
});
// Ensure database connection for all /api/v1 routes (critical for Vercel Serverless)
app.use('/api/v1', async (req, res, next) => {
    try {
        await (0, database_1.connectDB)();
        next();
    }
    catch (err) {
        console.error('Database connection failed in serverless request:', err.message);
        return res.status(503).json({
            success: false,
            message: 'Database connection failed. Please ensure MONGODB_URI is set to a valid MongoDB Atlas connection string in your Vercel Project Settings.',
            code: 'DATABASE_CONNECTION_ERROR',
            error: err.message,
        });
    }
});
// Mount versioned REST API
app.use('/api/v1', routes_1.default);
// 404 Handler
app.use((req, res) => {
    (0, response_1.sendError)(res, `Cannot ${req.method} ${req.originalUrl}`, 'ENDPOINT_NOT_FOUND', 404);
});
// Global Error Handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
