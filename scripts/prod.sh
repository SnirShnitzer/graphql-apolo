#!/bin/bash

# Production mode script for Moonshot User Management Service
# This script starts all services with production configuration

echo "🚀 Starting Moonshot services in PRODUCTION mode..."
echo "📋 Features enabled:"
echo "   🔒 Security optimized"
echo "   🚫 Introspection disabled"
echo "   📊 Production logging"
echo "   🛡️  Production CORS settings"
echo ""

# Start services with production configuration
docker-compose up --build -d

echo ""
echo "🎯 Services started! Access points:"
echo "   🌐 Frontend:       http://localhost:3000"
echo "   🔧 GraphQL API:    http://localhost:4000/graphql"
echo "   💚 Backend Health: http://localhost:4000/health"
echo "   🗄️  Database:      localhost:5432"
echo ""
echo "📊 Check status: docker-compose ps"
echo "📝 View logs:    docker-compose logs -f [service-name]"
echo "🛑 Stop:         docker-compose down" 