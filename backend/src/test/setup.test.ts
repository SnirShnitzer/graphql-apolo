import 'reflect-metadata';
import { TestDataSource } from './setup';
import { User } from '../entities/User';
import { City } from '../entities/City';

describe('Backend Setup Tests', () => {
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
    expect(TestDataSource).toBeDefined();
    expect(TestDataSource.options.type).toBe('postgres');
    expect(TestDataSource.options.entities).toContain(User);
    expect(TestDataSource.options.entities).toContain(City);
  });

  test('should connect to test database', async () => {
    expect(TestDataSource.isInitialized).toBe(true);
    
    // Test that we can query the database
    const cityRepository = TestDataSource.getRepository(City);
    const cities = await cityRepository.find();
    
    expect(cities.length).toBeGreaterThan(0);
    expect(cities.some(city => city.name === 'TEL_AVIV')).toBe(true);
  });
}); 