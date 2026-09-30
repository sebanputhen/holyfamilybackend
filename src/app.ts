import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import mongoose from 'mongoose';
import { config } from './config/environment';
import { connectDB } from './config/database';
import apiRoutes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { sendError } from './utils/response';

const app: Application = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
app.use(
  cors({
    origin: config.corsOrigin === '*' ? true : config.corsOrigin,
    credentials: true,
  })
);

// Rate limiting (100 requests per 15 minutes per IP for general endpoints)
const limiter = rateLimit({
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
if (config.env !== 'test') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Catholic Forane Parish Management API',
    version: '1.0.0',
    database: isDbConnected ? 'connected' : 'disconnected',
    isCloudDbConfigured: !config.mongoUri.includes('127.0.0.1'),
  });
});

// Ensure database connection for all /api/v1 routes (critical for Vercel Serverless)
app.use('/api/v1', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (err: any) {
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
app.use('/api/v1', apiRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  sendError(res, `Cannot ${req.method} ${req.originalUrl}`, 'ENDPOINT_NOT_FOUND', 404);
});

// Global Error Handler
app.use(errorHandler);

export default app;
