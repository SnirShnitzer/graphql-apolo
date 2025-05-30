import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { City } from '../entities/City';

/**
 * Database configuration for TypeORM
 * Uses environment variables for connection settings
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'moonshot_db',
  synchronize: process.env.NODE_ENV === 'development', // Only in development
  logging: process.env.NODE_ENV === 'development',
  entities: [User, City],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
  // Connection pool settings for performance
  extra: {
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
  },
});

/**
 * Initialize database connection
 * Creates tables and seeds initial data if needed
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established successfully');
    
    // Seed initial cities if they don't exist
    await seedCities();
  } catch (error) {
    console.error('❌ Error during database initialization:', error);
    throw error;
  }
};

/**
 * Seed initial cities data
 * Creates the predefined Israeli cities if they don't exist
 */
const seedCities = async (): Promise<void> => {
  const cityRepository = AppDataSource.getRepository(City);
  
  const cities = [
    'TEL_AVIV',
    'JERUSALEM', 
    'HAIFA',
    'BEER_SHEVA',
    'NETANYA'
  ];

  for (const cityName of cities) {
    const existingCity = await cityRepository.findOne({ 
      where: { name: cityName } 
    });
    
    if (!existingCity) {
      const city = new City(cityName);
      await cityRepository.save(city);
      console.log(`🏙️  Seeded city: ${cityName}`);
    }
  }
};

/**
 * Close database connection gracefully
 */
export const closeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.destroy();
    console.log('✅ Database connection closed successfully');
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
  }
}; 