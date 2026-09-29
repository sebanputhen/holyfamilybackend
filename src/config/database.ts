import mongoose from 'mongoose';
import { config } from './environment';

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  const mongoOptions: mongoose.ConnectOptions = {
    serverSelectionTimeoutMS: 5000,
  };

  try {
    console.log(`Connecting to MongoDB at ${config.mongoUri}...`);
    await mongoose.connect(config.mongoUri, mongoOptions);
    isConnected = true;
    console.log('MongoDB connected successfully.');
  } catch (err: any) {
    console.warn(`Standard MongoDB connection failed: ${err.message}. Initializing in-memory fallback...`);
    try {
      // Dynamic import of mongodb-memory-server if available
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      console.log(`Connecting to In-Memory MongoDB at ${memoryUri}...`);
      await mongoose.connect(memoryUri);
      isConnected = true;
      console.log('In-Memory MongoDB connected successfully.');
    } catch (fallbackErr: any) {
      console.error('All MongoDB connection attempts failed:', fallbackErr.message);
      throw fallbackErr;
    }
  }
}

export async function disconnectDB(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  console.log('MongoDB disconnected.');
}
