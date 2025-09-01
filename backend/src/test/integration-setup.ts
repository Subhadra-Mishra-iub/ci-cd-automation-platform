import mongoose from 'mongoose';
import { redisClient } from '@/config/redis';

// Increase timeout for integration tests
jest.setTimeout(60000);

// Setup before all integration tests
beforeAll(async () => {
  // Connect to test database
  const testMongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/ci-cd-integration-test';
  await mongoose.connect(testMongoUri);
  
  // Connect to test Redis
  await redisClient.connect();
});

// Cleanup after each integration test
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

// Cleanup after all integration tests
afterAll(async () => {
  // Close database connection
  await mongoose.connection.close();
  
  // Close Redis connection
  await redisClient.disconnect();
});
