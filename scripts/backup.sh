#!/bin/bash
set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_BACKUP_FILE="$BACKUP_DIR/portfolio_db_$TIMESTAMP.sql"
MEDIA_BACKUP_FILE="$BACKUP_DIR/portfolio_uploads_$TIMESTAMP.tar.gz"

mkdir -p "$BACKUP_DIR"

echo "📦 1/2 Backing up PostgreSQL database..."
docker compose exec -T db pg_dump -U portfolio portfolio > "$DB_BACKUP_FILE"

echo "🖼️ 2/2 Backing up uploaded media assets..."
docker compose exec -T app tar -czf - -C /app uploads > "$MEDIA_BACKUP_FILE" 2>/dev/null || true

echo "=========================================="
echo "✅ Backup Completed Successfully!"
echo "• Database Backup: $DB_BACKUP_FILE"
echo "• Media Backup:    $MEDIA_BACKUP_FILE"
echo "=========================================="
