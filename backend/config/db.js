import mongoose from 'mongoose';
import { setMongoConnected } from '../services/storage.service.js';

export async function connectDB() {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.log('[Database] MONGODB_URI not provided in .env. Initializing in-memory demo store...');
    setMongoConnected(false);
    return;
  }

  try {
    console.log('[Database] Connecting to MongoDB Atlas/Instance...');
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 4000 // 4 sec timeout
    });
    console.log('[Database] Successfully connected to MongoDB!');
    setMongoConnected(true);
  } catch (error) {
    console.warn(`[Database] Could not connect to MongoDB (${error.message}). Falling back to local in-memory demo data mode.`);
    setMongoConnected(false);
  }
}
