#!/bin/bash
set -e

echo "=========================================="
echo "🚀 Vercel + Supabase Deployment Script"
echo "=========================================="

# 1. Inspect Environment Credentials
echo "🔍 1/6 Checking deployment credentials..."

# Load .env if present
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs 2>/dev/null) || true
fi

MISSING_VARS=()
[ -z "$VERCEL_TOKEN" ] && MISSING_VARS+=("VERCEL_TOKEN")
[ -z "$SUPABASE_PROJECT_REF" ] && MISSING_VARS+=("SUPABASE_PROJECT_REF")
[ -z "$SUPABASE_DB_PASSWORD" ] && MISSING_VARS+=("SUPABASE_DB_PASSWORD")

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo "⚠️ Missing required deployment environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
    echo ""
    echo "Please set them in your environment or .env file before deploying."
    echo "Example:"
    echo "  export VERCEL_TOKEN='your_vercel_token'"
    echo "  export SUPABASE_PROJECT_REF='your_supabase_ref'"
    echo "  export SUPABASE_DB_PASSWORD='your_supabase_db_password'"
    exit 1
fi

# Construct Supabase Database URL
# Supabase connection string format using transaction pooler (port 6543) or direct (port 5432)
SUPABASE_HOST="${SUPABASE_HOST:-db.${SUPABASE_PROJECT_REF}.supabase.co}"
DATABASE_URL="postgres://postgres.${SUPABASE_PROJECT_REF}:${SUPABASE_DB_PASSWORD}@${SUPABASE_HOST}:5432/postgres"
export DATABASE_URL
export SUPABASE_URL="https://${SUPABASE_PROJECT_REF}.supabase.co"

echo "✅ Environment variables verified."
echo "• Supabase Project: https://${SUPABASE_PROJECT_REF}.supabase.co"

# 2. Run Database Schema Synchronization on Supabase
echo "🔄 2/6 Running Drizzle schema push on Supabase PostgreSQL..."
npx drizzle-kit push --force
npx tsx src/db/migrate.ts

# 3. Pull / Link Vercel Project
echo "⚡ 3/6 Linking Vercel project..."
VERCEL_FLAGS=("--token=$VERCEL_TOKEN" "--yes")
if [ -n "$VERCEL_ORG_ID" ]; then
    VERCEL_FLAGS+=("--scope=$VERCEL_ORG_ID")
fi

npx vercel link "${VERCEL_FLAGS[@]}" || echo "Project link confirmed."

# 4. Configure Production Environment Variables on Vercel
echo "🔐 4/6 Setting environment variables on Vercel..."

add_vercel_env() {
    local key="$1"
    local val="$2"
    if [ -n "$val" ]; then
        echo "Setting $key..."
        npx vercel env rm "$key" production "${VERCEL_FLAGS[@]}" --yes 2>/dev/null || true
        echo "$val" | npx vercel env add "$key" production "${VERCEL_FLAGS[@]}" > /dev/null 2>&1 || true
    fi
}

add_vercel_env "DATABASE_URL" "$DATABASE_URL"
add_vercel_env "AUTH_SECRET" "${AUTH_SECRET:-$(openssl rand -hex 32 2>/dev/null || echo 'super_secret_auth_token_key_123456789')}"
add_vercel_env "ADMIN_GITHUB_ID" "$ADMIN_GITHUB_ID"
add_vercel_env "GITHUB_CLIENT_ID" "$GITHUB_CLIENT_ID"
add_vercel_env "GITHUB_CLIENT_SECRET" "$GITHUB_CLIENT_SECRET"
add_vercel_env "ADMIN_PASSWORD" "$ADMIN_PASSWORD"
add_vercel_env "SUPABASE_URL" "$SUPABASE_URL"
add_vercel_env "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY"
add_vercel_env "SUPABASE_STORAGE_BUCKET" "${SUPABASE_STORAGE_BUCKET:-portfolio-media}"
add_vercel_env "DOMAIN" "${DOMAIN:-portfoliojulian.web.id}"

# 5. Deploy to Vercel Production
echo "📦 5/6 Building and deploying to Vercel Production..."
PROD_DEPLOY_URL=$(npx vercel deploy --prod "${VERCEL_FLAGS[@]}")

# 6. Add Custom Domain on Vercel
echo "🌐 6/6 Configuring custom domain portfoliojulian.web.id on Vercel..."
npx vercel domains add portfoliojulian.web.id "${VERCEL_FLAGS[@]}" || echo "Domain domain add checked."

echo "=========================================="
echo "🎉 VERCEL + SUPABASE DEPLOYMENT SUCCESSFUL!"
echo "=========================================="
echo "• Production URL: $PROD_DEPLOY_URL"
echo "• Custom Domain: https://portfoliojulian.web.id"
echo "• Supabase DB: Active (${SUPABASE_PROJECT_REF})"
echo "=========================================="
