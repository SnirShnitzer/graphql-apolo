# Apollo Studio GraphQL Playground

This guide explains how to use Apollo Studio's GraphQL Playground interface for development and testing.

## 🚀 Quick Start

### Development Mode (Apollo Studio Enabled)
```bash
# Start services in development mode
./scripts/dev.sh

# Or manually:
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
```

### Production Mode (Apollo Studio Disabled)
```bash
# Start services in production mode
./scripts/prod.sh

# Or manually:
docker-compose up --build -d
```

## 🎯 Accessing Apollo Studio

Once running in development mode, visit: **http://localhost:4000/graphql**

You should see the Apollo Studio GraphQL Playground interface instead of the basic landing page.

## 🔧 Features Available in Development Mode

### ✅ GraphQL Introspection
- Full schema exploration
- Auto-completion
- Documentation browsing

### ✅ Interactive Query Builder
- Drag-and-drop query building
- Real-time validation
- Query history

### ✅ Example Queries

**Health Check:**
```graphql
query {
  health
}
```

**Get All Users:**
```graphql
query {
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
```

**Get Specific User:**
```graphql
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

**Create User:**
```graphql
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
```

**Variables for Create User:**
```json
{
  "data": {
    "firstName": "John",
    "lastName": "Doe",
    "birthDate": "1990-01-01",
    "city": "TEL_AVIV"
  }
}
```

**Update User:**
```graphql
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
```

**Delete User:**
```graphql
mutation DeleteUser($id: ID!) {
  deleteUser(id: $id)
}
```

## 🏗️ Architecture

```
Browser → Apollo Studio → Backend Load Balancer → Backend Replicas (2x) → PostgreSQL
```

## 🔒 Security Notes

- **Development Mode**: Introspection enabled, Apollo Studio accessible
- **Production Mode**: Introspection disabled, basic landing page only
- Always use production mode for deployed environments

## 🛠️ Troubleshooting

### Apollo Studio Not Loading?
1. Ensure you're running in development mode
2. Check backend logs: `docker-compose logs backend-1`
3. Verify environment: Should show `🌍 Environment: development`

### CORS Issues?
- Frontend uses proxy route `/graphql` (no CORS issues)
- Direct backend access at `:4000/graphql` may have CORS restrictions

### Can't See Schema?
- Introspection must be enabled (development mode only)
- Check that `NODE_ENV=development` in backend containers

## 📊 Monitoring

**Check Service Status:**
```bash
docker-compose ps
```

**View Logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend-1
```

**Stop Services:**
```bash
docker-compose down
``` 