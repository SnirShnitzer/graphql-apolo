import 'reflect-metadata';
import '@jest/globals';
import { AppDataSource } from '../database/config';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_HOST = 'localhost';
process.env.DATABASE_PORT = '5432';
process.env.DATABASE_USERNAME = 'postgres';
process.env.DATABASE_PASSWORD = 'postgres';
process.env.DATABASE_NAME = 'moonshot_test_db';

// Global setup before all tests
beforeAll(async () => {
  try {
    // Initialize test database connection
    await AppDataSource.initialize();
    console.log('✅ Test database connection established');
  } catch (error) {
    console.error('❌ Test database connection failed:', error);
    throw error;
  }
});

// Global teardown after all tests
afterAll(async () => {
  try {
    // Close database connection
    await AppDataSource.destroy();
    console.log('✅ Test database connection closed');
  } catch (error) {
    console.error('❌ Error closing test database connection:', error);
  }
}); 