#!/bin/bash
echo "📋 Fetching production container logs..."
docker compose logs -f --tail=100
