#!/bin/bash
set -e

echo "==================================="
echo "🚀 Portfolio Deployment Script"
echo "==================================="

# 1. Environment Checks
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker compose &> /dev/null && ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# 2. Check for .env file
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ .env created. Please update it with your real secrets when possible."
    else
        echo "DATABASE_URL=postgres://portfolio:portfolio_secure_pass@db:5432/portfolio" > .env
        echo "JWT_SECRET=super_secret_temporary_key_replace_me" >> .env
        echo "✅ basic .env created."
    fi
fi

# 3. Build and Start Services
echo "📦 Building and starting containers..."
docker compose up --build -d

echo "⏳ Waiting for database to become healthy..."
sleep 5

# 4. Run Migrations (Assuming there's a migrate script in package.json)
echo "🔄 Running database migrations..."
# In this setup, we assume we might need to run Drizzle migrations inside the container
docker compose exec -T app npm run db:push || echo "⚠️ Warning: Database push might have failed or not configured."

echo "✅ Deployment complete!"
echo "🌐 Application should be running at http://localhost:3000"
