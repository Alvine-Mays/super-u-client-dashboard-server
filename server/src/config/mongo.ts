import mongoose from 'mongoose';
import { env } from './env';
import { log, error } from './logger';

export async function connectMongo(maxRetries = 5): Promise<void> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      await mongoose.connect(env.mongoUri);
      log('MongoDB connected');
      return;
    } catch (err) {
      attempt++;
      error(`MongoDB connection failed (attempt ${attempt}/${maxRetries})`, err);
      await new Promise((r) => setTimeout(r, 1000 * Math.min(10, attempt * 2)));
    }
  }
  throw new Error('MongoDB connection failed after retries');
}
