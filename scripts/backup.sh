#!/bin/bash
set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/portfolio_db_$TIMESTAMP.sql"

mkdir -p "$BACKUP_DIR"

echo "📦 Backing up portfolio database..."
docker compose exec -T db pg_dump -U portfolio portfolio > "$BACKUP_FILE"

echo "✅ Backup completed: $BACKUP_FILE"
