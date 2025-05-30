import 'reflect-metadata';
import { AppDataSource } from '../database/config';
import { User } from '../entities/User';
import { City } from '../entities/City';

describe('Backend Setup Tests', () => {
  beforeAll(async () => {
    // Mock environment variables for testing
    process.env.DATABASE_HOST = 'localhost';
    process.env.DATABASE_PORT = '5432';
    process.env.DATABASE_USERNAME = 'postgres';
    process.env.DATABASE_PASSWORD = 'password';
    process.env.DATABASE_NAME = 'moonshot_test_db';
    process.env.NODE_ENV = 'test';
  });

  test('should create User entity instance', () => {
    const user = new User('John', 'Doe', new Date('1990-01-01'), 1);
    
    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.cityId).toBe(1);
    expect(user.birthDate).toEqual(new Date('1990-01-01'));
  });

  test('should create City entity instance', () => {
    const city = new City('TEL_AVIV');
    
    expect(city.name).toBe('TEL_AVIV');
  });

  test('should have proper TypeORM configuration', () => {
    expect(AppDataSource).toBeDefined();
    expect(AppDataSource.options.type).toBe('postgres');
    expect(AppDataSource.options.entities).toContain(User);
    expect(AppDataSource.options.entities).toContain(City);
  });
}); 