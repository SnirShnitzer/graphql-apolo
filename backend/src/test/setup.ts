import 'reflect-metadata';
import '@jest/globals';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { City } from '../entities/City';
import { InitialSchema1709123456789 } from '../migrations/1709123456789-InitialSchema';

// Create a separate test DataSource
const TestDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'moonshot_test_db',
  synchronize: true, // Use synchronize for tests to avoid migration issues
  logging: false, // Disable logging in tests
  entities: [User, City],
  dropSchema: true, // Drop schema before each test run
});

// Global setup before all tests
beforeAll(async () => {
  try {
    // Initialize test database connection
    await TestDataSource.initialize();
    console.log('✅ Test database connection established');
    
    // Seed test cities
    const cityRepository = TestDataSource.getRepository(City);
    const cities = ['TEL_AVIV', 'JERUSALEM', 'HAIFA', 'BEER_SHEVA', 'NETANYA'];
    
    for (const cityName of cities) {
      const city = new City(cityName);
      await cityRepository.save(city);
    }
  } catch (error) {
    console.error('❌ Test database connection failed:', error);
    throw error;
  }
});

// Global teardown after all tests
afterAll(async () => {
  try {
    // Close database connection
    if (TestDataSource.isInitialized) {
      await TestDataSource.destroy();
      console.log('✅ Test database connection closed');
    }
  } catch (error) {
    console.error('❌ Error closing test database connection:', error);
  }
});

// Export test DataSource for use in tests
export { TestDataSource }; 