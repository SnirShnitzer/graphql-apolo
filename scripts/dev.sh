#!/bin/bash

# Development mode script for Moonshot User Management Service
# This script starts all services with development configuration

echo "🚀 Starting Moonshot services in DEVELOPMENT mode..."
echo "📋 Features enabled:"
echo "   ✅ Apollo Studio GraphQL Playground"
echo "   ✅ GraphQL Introspection"
echo "   ✅ Debug logging"
echo "   ✅ Development CORS settings"
echo ""

# Start services with development configuration
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d

echo ""
echo "🎯 Services started! Access points:"
echo "   🌐 Frontend:           http://localhost:3000"
echo "   🔧 GraphQL Playground: http://localhost:4000/graphql"
echo "   💚 Backend Health:     http://localhost:4000/health"
echo "   🗄️  Database:          localhost:5432"
echo ""
echo "📊 Check status: docker-compose ps"
echo "📝 View logs:    docker-compose logs -f [service-name]"
echo "🛑 Stop:         docker-compose down" 