# Moonshot User Management Microservice

A scalable, production-ready user management microservice built with TypeScript, GraphQL, and PostgreSQL.

## 🚀 Tech Stack

- **Backend**: TypeScript, Node.js, Apollo Server 4, GraphQL
- **Database**: PostgreSQL with TypeORM
- **Frontend**: React.js with Apollo Client
- **Containerization**: Docker & Docker Compose
- **UI Framework**: Material-UI (MUI)

## 📁 Project Structure

```
moonshot-user-service/
├── backend/
│   ├── src/
│   │   ├── entities/          # TypeORM entities
│   │   ├── resolvers/         # GraphQL resolvers
│   │   ├── types/            # GraphQL type definitions
│   │   ├── database/         # Database configuration
│   │   ├── utils/            # Utility functions
│   │   └── index.ts          # Application entry point
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── graphql/         # GraphQL queries/mutations
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx
│   ├── package.json
│   └── public/
├── docker-compose.yml
└── README.md
```

## 🗄️ Database Schema

### Users Table
- `id` - Primary key (auto-increment)
- `first_name` - String (required)
- `last_name` - String (required)
- `birth_date` - Timestamp (required)
- `city` - Foreign key to cities table (required)
- `created_at` - Timestamp (auto-generated)
- `updated_at` - Timestamp (auto-updated)

### Cities Table
- `id` - Primary key (auto-increment)
- `name` - String (unique)

## 🔧 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)

### Using Docker (Recommended)

1. **Clone and navigate to the project:**
   ```bash
   cd moonshot-user-service
   ```

2. **Start all services:**
   ```bash
   docker-compose up --build
   ```

3. **Access the applications:**
   - Frontend: http://localhost:3000
   - GraphQL Playground: http://localhost:4000/graphql
   - PostgreSQL: localhost:5432

### Local Development

1. **Start PostgreSQL:**
   ```bash
   docker-compose up postgres
   ```

2. **Backend setup:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Frontend setup:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 🔍 GraphQL API

### Types
```graphql
enum CityEnum {
  TEL_AVIV
  JERUSALEM
  HAIFA
  BEER_SHEVA
  NETANYA
}

type User {
  id: ID!
  firstName: String!
  lastName: String!
  birthDate: String!
  city: CityEnum!
  createdAt: String!
  updatedAt: String!
}
```

### Queries
```graphql
# Get all users
query GetUsers {
  users {
    id
    firstName
    lastName
    birthDate
    city
    createdAt
    updatedAt
  }
}

# Get user by ID
query GetUser($id: ID!) {
  user(id: $id) {
    id
    firstName
    lastName
    birthDate
    city
    createdAt
    updatedAt
  }
}
```

### Mutations
```graphql
# Create user
mutation CreateUser($data: CreateUserInput!) {
  createUser(data: $data) {
    id
    firstName
    lastName
    birthDate
    city
    createdAt
    updatedAt
  }
}

# Update user
mutation UpdateUser($id: ID!, $data: UpdateUserInput!) {
  updateUser(id: $id, data: $data) {
    id
    firstName
    lastName
    birthDate
    city
    updatedAt
  }
}

# Delete user
mutation DeleteUser($id: ID!) {
  deleteUser(id: $id)
}
```

## 🌍 Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=moonshot_db

# Application
PORT=4000
NODE_ENV=development

# Optional: AWS SNS (for future notifications)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

## 🏗️ Architecture Decisions

### Backend Architecture
- **Apollo Server 4**: Latest version with improved performance and TypeScript support
- **TypeORM**: Robust ORM with excellent TypeScript integration
- **Class Validator**: Input validation and sanitization
- **Graceful Shutdown**: Proper cleanup of database connections

### Frontend Architecture
- **Apollo Client**: Efficient GraphQL client with caching
- **Material-UI**: Modern, accessible UI components
- **TypeScript**: Type safety throughout the application

### Database Design
- **Normalized Schema**: Separate cities table for data integrity
- **Proper Indexing**: Optimized queries on frequently accessed fields
- **Timestamps**: Automatic tracking of creation and updates

## 🔒 Security Features

- Input validation and sanitization
- SQL injection prevention through TypeORM
- Environment-based configuration
- Error handling without sensitive data exposure

## 📊 Performance Optimizations

- Database connection pooling
- GraphQL query optimization
- Proper database indexing
- Efficient React rendering with Apollo Client cache

## 🧪 Testing

Run tests for the backend:
```bash
cd backend
npm test
```

## 🚀 Production Deployment

### Docker Production Build
```bash
# Use the production script
./scripts/prod.sh

# Or manually:
docker-compose up --build -d
```

### Health Checks
- Backend health: `GET /health`
- Database connectivity check included

## 📝 API Documentation

Visit the GraphQL Playground at `http://localhost:4000/graphql` for interactive API documentation and testing.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Ensure PostgreSQL is running
   - Check environment variables
   - Verify network connectivity

2. **Port Already in Use**
   - Change PORT in environment variables
   - Kill existing processes: `lsof -ti:4000 | xargs kill`

3. **Docker Issues**
   - Clean up containers: `docker-compose down -v`
   - Rebuild images: `docker-compose build --no-cache`

## 📞 Support

For questions or issues, please create an issue in the repository or contact the development team. 