import { AppDataSource } from '../database/config';
import { User } from '../entities/User';
import { City } from '../entities/City';
import { CreateUserInput, UpdateUserInput, CityEnum, GraphQLContext } from '../types/graphql';
import { validate } from 'class-validator';
import { GraphQLError } from 'graphql';

/**
 * GraphQL resolvers for user operations
 * Handles all CRUD operations with proper validation and error handling
 */
export const userResolvers = {
  Query: {
    /**
     * Get all users with their associated city information
     */
    users: async (): Promise<User[]> => {
      try {
        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find({
          relations: ['city'],
          order: { createdAt: 'DESC' }
        });
        return users;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw new GraphQLError('Failed to fetch users', {
          extensions: { code: 'INTERNAL_ERROR' }
        });
      }
    },

    /**
     * Get a specific user by ID
     */
    user: async (_: any, { id }: { id: string }): Promise<User | null> => {
      try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
          where: { id: parseInt(id) },
          relations: ['city']
        });

        if (!user) {
          throw new GraphQLError(`User with ID ${id} not found`, {
            extensions: { code: 'NOT_FOUND' }
          });
        }

        return user;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        console.error('Error fetching user:', error);
        throw new GraphQLError('Failed to fetch user', {
          extensions: { code: 'INTERNAL_ERROR' }
        });
      }
    },

    /**
     * Health check endpoint
     */
    health: (): string => {
      return 'Server is running and healthy!';
    }
  },

  Mutation: {
    /**
     * Create a new user with validation
     */
    createUser: async (_: any, { data }: { data: CreateUserInput }): Promise<User> => {
      try {
        const userRepository = AppDataSource.getRepository(User);
        const cityRepository = AppDataSource.getRepository(City);

        // Validate birth date string format before conversion
        const birthDateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!birthDateRegex.test(data.birthDate)) {
          throw new GraphQLError('Birth date must be in YYYY-MM-DD format', {
            extensions: { code: 'VALIDATION_ERROR' }
          });
        }

        // Convert and validate birth date
        const birthDate = new Date(data.birthDate);
        if (isNaN(birthDate.getTime())) {
          throw new GraphQLError('Birth date must be a valid date', {
            extensions: { code: 'VALIDATION_ERROR' }
          });
        }

        // Check if birth date is not in the future
        if (birthDate > new Date()) {
          throw new GraphQLError('Birth date cannot be in the future', {
            extensions: { code: 'VALIDATION_ERROR' }
          });
        }

        // Find the city by name
        const city = await cityRepository.findOne({
          where: { name: data.city }
        });

        if (!city) {
          throw new GraphQLError(`City ${data.city} not found`, {
            extensions: { code: 'INVALID_INPUT' }
          });
        }

        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(data.birthDate)) {
          throw new GraphQLError('Birth date must be in YYYY-MM-DD format', {
            extensions: { code: 'VALIDATION_ERROR' }
          });
        }

        // Create new user instance with validated date
        const user = new User(
          data.firstName,
          data.lastName,
          birthDate,
          city.id
        );

        // Validate the user data (excluding birth date since we already validated it)
        const errors = await validate(user, { skipMissingProperties: true });
        if (errors.length > 0) {
          const errorMessages = errors
            .filter(error => error.property !== 'birthDate') // Skip birth date validation
            .map((error: any) => 
              Object.values(error.constraints || {}).join(', ')
            ).join('; ');
          
          if (errorMessages) {
            throw new GraphQLError(`Validation failed: ${errorMessages}`, {
              extensions: { code: 'VALIDATION_ERROR' }
            });
          }
        }

        // Save the user
        const savedUser = await userRepository.save(user);
        
        // Return user with city relation
        return await userRepository.findOne({
          where: { id: savedUser.id },
          relations: ['city']
        }) as User;

      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        console.error('Error creating user:', error);
        throw new GraphQLError('Failed to create user', {
          extensions: { code: 'INTERNAL_ERROR' }
        });
      }
    },

    /**
     * Update an existing user
     */
    updateUser: async (_: any, { id, data }: { id: string; data: UpdateUserInput }): Promise<User> => {
      try {
        const userRepository = AppDataSource.getRepository(User);
        const cityRepository = AppDataSource.getRepository(City);

        // Find the existing user
        const user = await userRepository.findOne({
          where: { id: parseInt(id) },
          relations: ['city']
        });

        if (!user) {
          throw new GraphQLError(`User with ID ${id} not found`, {
            extensions: { code: 'NOT_FOUND' }
          });
        }

        // Update fields if provided
        if (data.firstName !== undefined) user.firstName = data.firstName;
        if (data.lastName !== undefined) user.lastName = data.lastName;
        
        if (data.birthDate !== undefined) {
          // Validate birth date string format before conversion
          const birthDateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!birthDateRegex.test(data.birthDate)) {
            throw new GraphQLError('Birth date must be in YYYY-MM-DD format', {
              extensions: { code: 'VALIDATION_ERROR' }
            });
          }

          // Convert and validate birth date
          const birthDate = new Date(data.birthDate);
          if (isNaN(birthDate.getTime())) {
            throw new GraphQLError('Birth date must be a valid date', {
              extensions: { code: 'VALIDATION_ERROR' }
            });
          }

          // Check if birth date is not in the future
          if (birthDate > new Date()) {
            throw new GraphQLError('Birth date cannot be in the future', {
              extensions: { code: 'VALIDATION_ERROR' }
            });
          }

          user.birthDate = birthDate;
        }
        
        if (data.city !== undefined) {
          const city = await cityRepository.findOne({
            where: { name: data.city }
          });

          if (!city) {
            throw new GraphQLError(`City ${data.city} not found`, {
              extensions: { code: 'INVALID_INPUT' }
            });
          }

          user.cityId = city.id;
        }

        // Validate the updated user data (excluding birth date since we already validated it)
        const errors = await validate(user, { skipMissingProperties: true });
        if (errors.length > 0) {
          const errorMessages = errors
            .filter(error => error.property !== 'birthDate') // Skip birth date validation
            .map((error: any) => 
              Object.values(error.constraints || {}).join(', ')
            ).join('; ');
          
          if (errorMessages) {
            throw new GraphQLError(`Validation failed: ${errorMessages}`, {
              extensions: { code: 'VALIDATION_ERROR' }
            });
          }
        }

        // Save the updated user
        await userRepository.save(user);
        
        // Return updated user with city relation
        return await userRepository.findOne({
          where: { id: user.id },
          relations: ['city']
        }) as User;

      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        console.error('Error updating user:', error);
        throw new GraphQLError('Failed to update user', {
          extensions: { code: 'INTERNAL_ERROR' }
        });
      }
    },

    /**
     * Delete a user by ID
     */
    deleteUser: async (_: any, { id }: { id: string }): Promise<boolean> => {
      try {
        const userRepository = AppDataSource.getRepository(User);

        // Check if user exists
        const user = await userRepository.findOne({
          where: { id: parseInt(id) }
        });

        if (!user) {
          throw new GraphQLError(`User with ID ${id} not found`, {
            extensions: { code: 'NOT_FOUND' }
          });
        }

        // Delete the user
        await userRepository.remove(user);
        return true;

      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        console.error('Error deleting user:', error);
        throw new GraphQLError('Failed to delete user', {
          extensions: { code: 'INTERNAL_ERROR' }
        });
      }
    }
  },

  /**
   * Field resolvers for custom formatting
   */
  User: {
    // Format birth date as ISO string
    birthDate: (user: User): string => {
      if (!user.birthDate) {
        throw new Error('Birth date is required');
      }
      return user.birthDate.toISOString().split('T')[0] || '';
    },

    // Format created date as ISO string
    createdAt: (user: User): string => {
      return user.createdAt.toISOString();
    },

    // Format updated date as ISO string
    updatedAt: (user: User): string => {
      return user.updatedAt.toISOString();
    },

    // Return city enum value
    city: (user: User): CityEnum => {
      return user.city.name as CityEnum;
    }
  }
}; 