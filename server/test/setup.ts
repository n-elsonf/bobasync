// src/tests/setup.ts
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.test' });
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { beforeAll, afterAll, jest } from '@jest/globals';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Load test environment variables
  dotenv.config({ path: '.env.test' });

  // Create an in-memory MongoDB server for testing
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect to the in-memory database
  await mongoose.connect(mongoUri);

  // Set up any test environment variables needed for auth
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.JWT_EXPIRES_IN = '1h';
  process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
});

afterAll(async () => {
  // Disconnect and stop the in-memory database
  await mongoose.disconnect();
  await mongoServer.stop();
  
  // Clear all mocks
  jest.clearAllMocks();
  
  // Reset environment variables
  process.env.JWT_SECRET = undefined;
  process.env.JWT_EXPIRES_IN = undefined;
  process.env.GOOGLE_CLIENT_ID = undefined;
});