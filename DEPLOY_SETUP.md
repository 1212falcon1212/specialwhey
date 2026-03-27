# Deploy & Kurulum Rehberi - ProMix

## Backend Deploy Script

```bash
#!/bin/bash
# promix-backend/deploy.sh
# GitHub Webhook ile tetiklenir

set -e

echo "🚀 ProMix Backend Deploy Başlıyor..."

cd /var/www/promix-backend

# Maintenance mode
php artisan down --retry=60

# Git pull
git pull origin main

# Composer install
composer install --no-dev --optimize-autoloader --no-interaction

# Migration
php artisan migrate --force

# Cache temizle ve yeniden oluştur
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Queue worker restart
php artisan queue:restart

# Meilisearch index güncelle
php artisan scout:import "App\Models\Ingredient" 2>/dev/null || true

# Maintenance mode kaldır
php artisan up

echo "✅ Backend deploy tamamlandı!"
```

## Frontend Deploy Script

```bash
#!/bin/bash
# promix-frontend/deploy.sh
# GitHub Webhook ile tetiklenir

set -e

echo "🚀 ProMix Frontend Deploy Başlıyor..."

cd /var/www/promix-frontend

# Git pull
git pull origin main

# Dependencies
npm ci --production=false

# Build
npm run build

# PM2 restart
pm2 restart promix-frontend || pm2 start npm --name "promix-frontend" -- start

echo "✅ Frontend deploy tamamlandı!"
```

## GitHub Webhook Handler

```bash
#!/bin/bash
# /var/www/webhook-handler.sh
# Basit bir PHP veya Node.js webhook listener ile çağrılır

REPO_NAME=$1

if [ "$REPO_NAME" = "promix-backend" ]; then
    bash /var/www/promix-backend/deploy.sh >> /var/log/promix-backend-deploy.log 2>&1
elif [ "$REPO_NAME" = "promix-frontend" ]; then
    bash /var/www/promix-frontend/deploy.sh >> /var/log/promix-frontend-deploy.log 2>&1
fi
```

## Webhook Listener (Minimal PHP)

```php
<?php
// /var/www/webhook.php
// Nginx'te ayrı bir location ile serve edilir

$secret = getenv('WEBHOOK_SECRET');
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';

// Signature doğrula
$expected = 'sha256=' . hash_hmac('sha256', $payload, $secret);
if (!hash_equals($expected, $signature)) {
    http_response_code(403);
    exit('Invalid signature');
}

$data = json_decode($payload, true);
$repo = $data['repository']['name'] ?? '';

if (in_array($repo, ['promix-backend', 'promix-frontend'])) {
    exec("bash /var/www/webhook-handler.sh {$repo} > /dev/null 2>&1 &");
}

http_response_code(200);
echo 'OK';
```

---

## İlk Kurulum Adımları

### 1. Backend Kurulum

```bash
# Laravel projesi oluştur
composer create-project laravel/laravel promix-backend
cd promix-backend

# Gerekli paketler
composer require laravel/sanctum
composer require laravel/scout
composer require meilisearch/meilisearch-php http-interop/http-factory-guzzle
composer require predis/predis

# Dev paketler
composer require --dev laravel/pint

# .env düzenle
# DB, Redis, Meilisearch, CORS ayarları

# Sanctum kurulum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Claude Code dosyaları
mkdir -p .claude
# CLAUDE.md ve hooks.json dosyalarını yerleştir
```

### 2. Frontend Kurulum

```bash
# Next.js projesi oluştur
npx create-next-app@latest promix-frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd promix-frontend

# Shadcn/ui kurulum
npx shadcn@latest init

# Gerekli paketler
npm install zustand axios swr
npm install @tanstack/react-table
npm install react-hook-form @hookform/resolvers zod
npm install lucide-react
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image
npm install framer-motion
npm install swiper

# PWA
npm install @serwist/next serwist

# Dev paketler
npm install -D prettier prettier-plugin-tailwindcss

# Claude Code dosyaları
mkdir -p .claude
# CLAUDE.md ve hooks.json dosyalarını yerleştir

# Shadcn temel bileşenler
npx shadcn@latest add button input label card dialog \
  select sheet tabs badge separator skeleton \
  dropdown-menu avatar toast sonner switch \
  textarea checkbox radio-group form table \
  alert-dialog popover command scroll-area
```

### 3. Dizin Yapılarını Oluştur

```bash
# Frontend dizin yapısı
cd promix-frontend/src
mkdir -p components/{ui,storefront,admin,shared}
mkdir -p components/storefront/{mixer,cart,checkout}
mkdir -p components/admin/form-fields
mkdir -p lib/validations
mkdir -p hooks
mkdir -p stores
mkdir -p types
mkdir -p styles

# Backend dizin yapısı
cd promix-backend/app
mkdir -p Enums
mkdir -p Http/Controllers/Api/{Admin,Storefront}
mkdir -p Http/Requests/{Admin,Storefront}
mkdir -p Http/Resources/{Admin,Storefront}
mkdir -p Services
mkdir -p Repositories
```

---

## Sunucu Gereksinimleri

| Yazılım | Minimum Versiyon |
|---------|------------------|
| PHP | 8.2+ |
| Node.js | 20+ |
| MySQL | 8.0+ |
| Redis | 7+ |
| Meilisearch | 1.6+ |
| Nginx | Latest |
| PM2 | Latest |
| Composer | 2.x |
| Git | 2.x |

## Nginx Konfigürasyon Notları

- Backend: `api.promix.com.tr` → PHP-FPM
- Frontend: `promix.com.tr` → PM2 (localhost:3000)
- Webhook: `webhook.promix.com.tr` → PHP
- SSL: Let's Encrypt / Certbot
- Gzip: Açık
- Static asset cache: 30 gün
