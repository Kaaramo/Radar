#!/usr/bin/env bash
# Backup quotidien Postgres RADAR.
# Usage : ./infra/scripts/backup.sh
set -euo pipefail

STAMP=$(date +%Y%m%d-%H%M%S)
OUT_DIR="${BACKUP_DIR:-/var/backups/radar}"
mkdir -p "$OUT_DIR"

docker exec radar-postgres pg_dump -U radar -F c radar > "$OUT_DIR/radar-$STAMP.dump"
echo "[backup] OK -> $OUT_DIR/radar-$STAMP.dump"

# Garde les 14 derniers jours
find "$OUT_DIR" -name 'radar-*.dump' -mtime +14 -delete
