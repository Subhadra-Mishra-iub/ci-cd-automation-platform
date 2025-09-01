import mongoose from 'mongoose';
import { redisClient } from '@/config/redis';

// Increase timeout for all tests
jest.setTimeout(30000);

// Setup before all tests
beforeAll(async () => {
  // Connect to test database
  const testMongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/ci-cd-test';
  await mongoose.connect(testMongoUri);
  
  // Connect to test Redis
  await redisClient.connect();
});

// Cleanup after each test
afterEach(async () => {
  // Clear all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
  
  // Clear Redis cache
  await redisClient.flushAll();
});

// Cleanup after all tests
afterAll(async () => {
  // Close database connection
  await mongoose.connection.close();
  
  // Close Redis connection
  await redisClient.disconnect();
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
