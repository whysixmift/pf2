#!/bin/bash
echo "=========================================="
echo "📊 Portfolio Services Status"
echo "=========================================="
docker compose ps
echo "------------------------------------------"
echo "🏥 Application Health Check:"
curl -s http://127.0.0.1:3000/health || echo "❌ Health check endpoint unavailable"
echo ""
echo "=========================================="
