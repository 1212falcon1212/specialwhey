#!/bin/bash
set -e

echo "🚀 ProMix Backend Deploy Başlıyor..."

cd /var/www/promix-backend

php artisan down --retry=60

git pull origin main

composer install --no-dev --optimize-autoloader --no-interaction

php artisan migrate --force

php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

php artisan queue:restart

php artisan scout:import "App\Models\Ingredient" 2>/dev/null || true

php artisan up

echo "✅ Backend deploy tamamlandı!"
