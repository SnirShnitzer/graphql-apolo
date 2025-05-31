# 🚀 Moonshot User Management Microservice - Startup Guide

This guide will help you get the complete user management microservice up and running quickly.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Docker & Docker Compose** (recommended for easiest setup)
- **Node.js 18+** (for local development)
- **PostgreSQL** (if running locally without Docker)

## 🐳 Quick Start with Docker (Recommended)

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd moonshot-user-service
```

### 2. Start All Services
```bash
# Start all services (PostgreSQL, Backend, Frontend, Load Balancer)
docker-compose up --build

# Or run in background
docker-compose up --build -d
```

### 3. Access the Applications
- **Frontend UI**: http://localhost:3000
- **GraphQL Playground**: http://localhost:4000/graphql
- **Backend Health Check**: http://localhost:4000/health
- **PostgreSQL**: localhost:5432

### 4. Stop Services
```bash
docker-compose down

# Remove volumes (clears database)
docker-compose down -v
```

## 💻 Local Development Setup

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

4. **Start PostgreSQL (using Docker):**
   ```bash
   docker run --name moonshot-postgres \
     -e POSTGRES_DB=moonshot_db \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=password \
     -p 5432:5432 \
     -d postgres:alpine
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The backend will be available at http://localhost:4000

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The frontend will be available at http://localhost:3000

## 🧪 Testing the Application

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Manual Testing

1. **Health Check:**
   ```bash
   curl http://localhost:4000/health
   ```

2. **GraphQL Query (Get Users):**
   ```bash
   curl -X POST http://localhost:4000/graphql \
     -H "Content-Type: application/json" \
     -d '{"query": "{ users { id firstName lastName city } }"}'
   ```

3. **Create User via GraphQL:**
   ```bash
   curl -X POST http://localhost:4000/graphql \
     -H "Content-Type: application/json" \
     -d '{
       "query": "mutation CreateUser($data: CreateUserInput!) { createUser(data: $data) { id firstName lastName city } }",
       "variables": {
         "data": {
           "firstName": "John",
           "lastName": "Doe",
           "birthDate": "1990-01-01",
           "city": "TEL_AVIV"
         }
       }
     }'
   ```

## 🎯 Using the Frontend Application

### Main Features

1. **View Users**: The main page displays all users in a table format
2. **Add User**: Click "Add User" button to create a new user
3. **Edit User**: Click the edit icon next to any user
4. **Delete User**: Click the delete icon and confirm deletion

### User Form Fields

- **First Name**: Required, minimum 2 characters
- **Last Name**: Required, minimum 2 characters
- **Birth Date**: Required, cannot be in the future
- **City**: Required, select from predefined Israeli cities:
  - Tel Aviv
  - Jerusalem
  - Haifa
  - Beer Sheva
  - Netanya

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=moonshot_db
PORT=4000
NODE_ENV=development
```

**Frontend:**
```env
REACT_APP_GRAPHQL_URL=http://localhost:4000/graphql
```

### Database Schema

The application automatically creates the following tables:

**users:**
- id (Primary Key)
- first_name (VARCHAR)
- last_name (VARCHAR)
- birth_date (TIMESTAMP)
- city_id (Foreign Key)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**cities:**
- id (Primary Key)
- name (VARCHAR, Unique)

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use:**
   ```bash
   # Kill process on port 4000
   lsof -ti:4000 | xargs kill
   
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill
   ```

2. **Database Connection Failed:**
   - Ensure PostgreSQL is running
   - Check environment variables
   - Verify database credentials

3. **Docker Issues:**
   ```bash
   # Clean up containers and volumes
   docker-compose down -v
   
   # Rebuild images
   docker-compose build --no-cache
   
   # Check logs
   docker-compose logs backend-1
   docker-compose logs frontend
   ```

4. **Frontend Build Issues:**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

### Logs and Debugging

**View Docker logs:**
```bash
docker-compose logs -f backend-1
docker-compose logs -f frontend
docker-compose logs -f postgres
```

**Backend logs location:**
- Console output shows all GraphQL operations
- Database connection status
- Error messages with stack traces

## 📊 Performance & Monitoring

### Health Checks

- **Backend**: http://localhost:4000/health
- **Frontend**: http://localhost:3000/health (when using Docker)

### Load Balancing

The Docker setup includes:
- 2 backend instances (backend-1, backend-2)
- Nginx load balancer
- Automatic failover between instances

### Database Performance

- Connection pooling configured
- Indexes on frequently queried fields
- Optimized queries with relations

## 🚀 Production Deployment

### Docker Production Build
```bash
docker-compose -f docker-compose.prod.yml up --build
```

### Environment Setup
- Set `NODE_ENV=production`
- Use secure database credentials
- Configure proper CORS origins
- Set up SSL/TLS certificates

## 📝 API Documentation

Visit http://localhost:4000/graphql for interactive GraphQL Playground with:
- Schema documentation
- Query/mutation examples
- Real-time testing interface

## 🤝 Development Workflow

1. **Make changes** to backend or frontend code
2. **Test locally** using development servers
3. **Run tests** to ensure functionality
4. **Build Docker images** for production testing
5. **Deploy** using Docker Compose

## 📞 Support

For issues or questions:
1. Check this startup guide
2. Review application logs
3. Check the main README.md for detailed documentation
4. Create an issue in the repository

---

**Happy coding! 🎉** 