import { gql } from '@apollo/client';

/**
 * GraphQL queries and mutations for the user management frontend
 */

// Fragment for user fields to avoid repetition
export const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    firstName
    lastName
    birthDate
    city
    createdAt
    updatedAt
  }
`;

// Query to get all users
export const GET_USERS = gql`
  ${USER_FRAGMENT}
  query GetUsers {
    users {
      ...UserFields
    }
  }
`;

// Query to get a specific user by ID
export const GET_USER = gql`
  ${USER_FRAGMENT}
  query GetUser($id: ID!) {
    user(id: $id) {
      ...UserFields
    }
  }
`;

// Mutation to create a new user
export const CREATE_USER = gql`
  ${USER_FRAGMENT}
  mutation CreateUser($data: CreateUserInput!) {
    createUser(data: $data) {
      ...UserFields
    }
  }
`;

// Mutation to update an existing user
export const UPDATE_USER = gql`
  ${USER_FRAGMENT}
  mutation UpdateUser($id: ID!, $data: UpdateUserInput!) {
    updateUser(id: $id, data: $data) {
      ...UserFields
    }
  }
`;

// Mutation to delete a user
export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

// Health check query
export const HEALTH_CHECK = gql`
  query HealthCheck {
    health
  }
`; 