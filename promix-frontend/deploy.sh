#!/bin/bash
set -e

echo "🚀 ProMix Frontend Deploy Başlıyor..."

cd /var/www/promix-frontend

git pull origin main

npm ci --production=false

npm run build

pm2 restart promix-frontend || pm2 start npm --name "promix-frontend" -- start

echo "✅ Frontend deploy tamamlandı!"
