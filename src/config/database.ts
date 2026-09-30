import mongoose from 'mongoose';
import { config } from './environment';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoOptions: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false, // Prevents 10s hang in serverless environments
    };

    const maskedUri = config.mongoUri.replace(/:([^:@]{4})[^:@]*@/, ':****@');
    console.log(`Connecting to MongoDB at ${maskedUri}...`);

    cached.promise = mongoose
      .connect(config.mongoUri, mongoOptions)
      .then((m) => {
        console.log('MongoDB connected successfully.');
        return m;
      })
      .catch(async (err: any) => {
        console.warn(`Standard MongoDB connection failed: ${err.message}.`);
        if (config.env === 'development' || config.env === 'test') {
          console.warn('Initializing in-memory fallback for development/test...');
          try {
            const { MongoMemoryServer } = await import('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const memoryUri = mongod.getUri();
            console.log(`Connecting to In-Memory MongoDB at ${memoryUri}...`);
            return await mongoose.connect(memoryUri, { bufferCommands: false });
          } catch (fallbackErr: any) {
            console.error('In-memory MongoDB fallback failed:', fallbackErr.message);
            throw err;
          }
        }
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export async function disconnectDB(): Promise<void> {
  if (!cached.conn) return;
  await mongoose.disconnect();
  cached.conn = null;
  cached.promise = null;
  console.log('MongoDB disconnected.');
}
