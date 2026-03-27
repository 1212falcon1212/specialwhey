#!/bin/bash
set -e
LOGFILE="/var/log/promix-deploy.log"
echo "=== Deploy started at $(date) ===" >> "$LOGFILE"
bash /var/www/promix/promix-backend/deploy.sh
bash /var/www/promix/promix-frontend/deploy.sh
echo "=== Deploy completed at $(date) ===" >> "$LOGFILE"
