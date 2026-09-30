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
exports.connectDB = connectDB;
exports.disconnectDB = disconnectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const environment_1 = require("./environment");
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}
async function connectDB() {
    if (cached.conn && mongoose_1.default.connection.readyState === 1) {
        return cached.conn;
    }
    if (!cached.promise) {
        const mongoOptions = {
            serverSelectionTimeoutMS: 5000,
            bufferCommands: false, // Prevents 10s hang in serverless environments
        };
        const maskedUri = environment_1.config.mongoUri.replace(/:([^:@]{4})[^:@]*@/, ':****@');
        console.log(`Connecting to MongoDB at ${maskedUri}...`);
        cached.promise = mongoose_1.default
            .connect(environment_1.config.mongoUri, mongoOptions)
            .then((m) => {
            console.log('MongoDB connected successfully.');
            return m;
        })
            .catch(async (err) => {
            console.warn(`Standard MongoDB connection failed: ${err.message}.`);
            if (environment_1.config.env === 'development' || environment_1.config.env === 'test') {
                console.warn('Initializing in-memory fallback for development/test...');
                try {
                    const { MongoMemoryServer } = await Promise.resolve().then(() => __importStar(require('mongodb-memory-server')));
                    const mongod = await MongoMemoryServer.create();
                    const memoryUri = mongod.getUri();
                    console.log(`Connecting to In-Memory MongoDB at ${memoryUri}...`);
                    return await mongoose_1.default.connect(memoryUri, { bufferCommands: false });
                }
                catch (fallbackErr) {
                    console.error('In-memory MongoDB fallback failed:', fallbackErr.message);
                    throw err;
                }
            }
            throw err;
        });
    }
    try {
        cached.conn = await cached.promise;
    }
    catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}
async function disconnectDB() {
    if (!cached.conn)
        return;
    await mongoose_1.default.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('MongoDB disconnected.');
}
