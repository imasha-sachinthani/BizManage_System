#!/bin/bash
# Development startup script for BizManage ERP

# Check if .env file exists
if [ ! -f "../.env" ]; then
    echo "❌ .env file not found. Please create it from .env.example"
    exit 1
fi

# Check if Docker services are running
echo "🔍 Checking Docker services..."
if ! docker-compose ps | grep -q "postgres.*Up"; then
    echo "🐳 Starting PostgreSQL..."
    cd .. && docker-compose up -d postgres
fi

if ! docker-compose ps | grep -q "redis.*Up"; then
    echo "🐳 Starting Redis..."
    cd .. && docker-compose up -d redis
fi

if ! docker-compose ps | grep -q "minio.*Up"; then
    echo "🐳 Starting MinIO..."
    cd .. && docker-compose up -d minio
fi

echo "✅ Docker services are running"

# Set environment variables
export DATABASE_URL="postgresql://bizmanage_user:bizmanage_pass_2024@localhost:5433/bizmanage_erp"
export NODE_ENV=development

# Start the development server
echo "🚀 Starting BizManage ERP Backend..."
echo "📍 Server will be available at: http://localhost:3000"
echo "🏥 Health check: http://localhost:3000/health"
echo "📚 API documentation: http://localhost:3000/api"
echo ""
echo "💡 Press Ctrl+C to stop the server"
echo ""

npm run dev