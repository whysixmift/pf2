#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: ./scripts/restore.sh <path_to_backup.sql>"
  exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Error: Backup file not found at $BACKUP_FILE"
  exit 1
fi

echo "⚠️  WARNING: Destructive Operation!"
echo "This will replace all tables and data in the PostgreSQL database with content from:"
echo "👉 $BACKUP_FILE"
read -p "Type 'RESTORE' to confirm: " CONFIRMATION

if [ "$CONFIRMATION" != "RESTORE" ]; then
  echo "Restore cancelled."
  exit 0
fi

echo "🔄 Restoring database from $BACKUP_FILE..."
cat "$BACKUP_FILE" | docker compose exec -T db psql -U portfolio -d portfolio

echo "✅ Database restored successfully."
