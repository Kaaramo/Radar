#!/usr/bin/env bash
# Deploy RADAR sur serveur self-hosted.
# Usage : ./infra/scripts/deploy.sh [host]
set -euo pipefail

HOST="${1:-radar.example.com}"

echo "[deploy] Pull dernière version sur $HOST"
ssh "$HOST" "cd /opt/radar && git pull"

echo "[deploy] Rebuild + restart agent"
ssh "$HOST" "cd /opt/radar && docker compose -f infra/docker/docker-compose.prod.yml up -d --build agent"

echo "[deploy] Apply migrations"
ssh "$HOST" "cd /opt/radar && docker compose -f infra/docker/docker-compose.prod.yml exec agent pnpm --filter @radar/database migrate:deploy"

echo "[deploy] OK"
