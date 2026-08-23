#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: ./scripts/restore.sh <path_to_backup.sql>"
  exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Backup file not found: $BACKUP_FILE"
  exit 1
fi

echo "⚠️ WARNING: This will overwrite the current database."
read -p "Are you sure you want to proceed? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Restore cancelled."
  exit 1
fi

echo "🔄 Restoring database from $BACKUP_FILE..."
# Drop and recreate schema to ensure clean restore (or just run psql)
cat "$BACKUP_FILE" | docker compose exec -T db psql -U portfolio -d portfolio

echo "✅ Restore completed successfully."
