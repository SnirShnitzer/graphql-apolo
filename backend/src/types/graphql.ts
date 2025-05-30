/**
 * GraphQL type definitions for the user management service
 * Includes all types, enums, inputs, queries, and mutations
 */
export const typeDefs = `
  # City enum representing the available Israeli cities
  enum CityEnum {
    TEL_AVIV
    JERUSALEM
    HAIFA
    BEER_SHEVA
    NETANYA
  }

  # User type representing a user in the system
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    birthDate: String!
    city: CityEnum!
    createdAt: String!
    updatedAt: String!
  }

  # Input type for creating a new user
  input CreateUserInput {
    firstName: String!
    lastName: String!
    birthDate: String!
    city: CityEnum!
  }

  # Input type for updating an existing user
  input UpdateUserInput {
    firstName: String
    lastName: String
    birthDate: String
    city: CityEnum
  }

  # Query operations
  type Query {
    # Get all users
    users: [User!]!
    
    # Get a specific user by ID
    user(id: ID!): User
    
    # Health check endpoint
    health: String!
  }

  # Mutation operations
  type Mutation {
    # Create a new user
    createUser(data: CreateUserInput!): User!
    
    # Update an existing user
    updateUser(id: ID!, data: UpdateUserInput!): User!
    
    # Delete a user by ID
    deleteUser(id: ID!): Boolean!
  }
`;

/**
 * TypeScript interfaces for type safety
 */
export interface UserType {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  city: CityEnum;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  birthDate: string;
  city: CityEnum;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  city?: CityEnum;
}

export enum CityEnum {
  TEL_AVIV = 'TEL_AVIV',
  JERUSALEM = 'JERUSALEM',
  HAIFA = 'HAIFA',
  BEER_SHEVA = 'BEER_SHEVA',
  NETANYA = 'NETANYA'
}

/**
 * GraphQL context interface
 */
export interface GraphQLContext {
  // Add any context properties here (e.g., user authentication, request info)
  req: any;
  res: any;
} 