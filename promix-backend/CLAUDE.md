# CLAUDE.md - ProMix Backend (Laravel)

## Proje Özeti
ProMix, kullanıcıların kendi protein karışımlarını bileşen bazlı oluşturup satın aldığı e-ticaret platformunun backend API'sidir. Laravel 11, MySQL, Redis, Meilisearch kullanır.

## Komutlar

### Geliştirme
```bash
php artisan serve                    # API sunucusu başlat
php artisan queue:work               # Queue worker başlat
php artisan migrate                  # Migration çalıştır
php artisan migrate:fresh --seed     # DB sıfırla ve seed et
php artisan db:seed                  # Seeder çalıştır
php artisan tinker                   # REPL
```

### Test & Kalite
```bash
php artisan test                     # Tüm testler
php artisan test --filter=IngredientTest  # Tek test
./vendor/bin/pint                    # Kod formatlama (Laravel Pint)
./vendor/bin/pint --test             # Format kontrolü (dry-run)
```

### Cache & Optimizasyon
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan cache:clear
php artisan config:clear
```

### Meilisearch
```bash
php artisan scout:import "App\Models\Ingredient"
php artisan scout:flush "App\Models\Ingredient"
```

## Mimari Kurallar

### Katmanlı Yapı
```
Request → Controller → FormRequest (validation) → Service → Repository → Model
Response ← Controller ← ApiResource ← Service
```

- **Controller:** Sadece request/response orchestration. İş mantığı YASAK.
- **Service:** Tüm iş mantığı burada. Birden fazla repository kullanabilir.
- **Repository:** Sadece veritabanı sorguları. Eloquent query'leri sadece burada.
- **Model:** İlişkiler, scope'lar, accessor/mutator'lar, cast'ler.
- **FormRequest:** Tüm validation kuralları. Controller'da `$request->validate()` YASAK.
- **ApiResource:** Response formatlama. Controller'da array döndürme YASAK.
- **Enum:** String-backed enum'lar. Hardcoded string değerler YASAK.

### API Response Formatı
Her response bu yapıda olmalı:
```php
// Başarılı
return response()->json([
    'success' => true,
    'data' => $resource,
    'message' => 'İşlem başarılı'
]);

// Hata
return response()->json([
    'success' => false,
    'message' => 'Hata mesajı',
    'errors' => $errors
], 422);

// Pagination
return response()->json([
    'success' => true,
    'data' => $resource,
    'meta' => [
        'current_page' => $paginated->currentPage(),
        'last_page' => $paginated->lastPage(),
        'per_page' => $paginated->perPage(),
        'total' => $paginated->total(),
    ]
]);
```

### Naming Conventions
| Şey | Format | Örnek |
|-----|--------|-------|
| Model | PascalCase, tekil | `Ingredient`, `MixerTemplate` |
| Migration | snake_case | `create_ingredients_table` |
| Controller | PascalCase + Controller | `IngredientController` |
| Service | PascalCase + Service | `IngredientService` |
| Repository | PascalCase + Repository | `IngredientRepository` |
| FormRequest | PascalCase + Request | `StoreIngredientRequest` |
| Resource | PascalCase + Resource | `IngredientResource` |
| Enum | PascalCase | `OrderStatus`, `PaymentMethod` |
| Route | kebab-case | `/api/admin/mixer-templates` |
| DB tablo | snake_case, çoğul | `ingredients`, `mixer_templates` |
| DB kolon | snake_case | `unit_amount`, `is_active` |

### Önemli Kurallar
1. **N+1 sorgu YASAK.** Her zaman eager loading kullan: `with()`, `load()`
2. **$guarded kullanma.** Her modelde `$fillable` tanımla
3. **Raw SQL YASAK** (özel durumlar hariç). Eloquent veya Query Builder kullan
4. **Hardcoded değerler YASAK.** Config veya Enum kullan
5. **try-catch sadece bilinçli kullan.** Global exception handler var
6. **Soft delete:** ingredients, categories, orders, coupons, pages, banners modellerinde kullan
7. **Validation mesajları Türkçe.** `lang/tr/validation.php` kullan
8. **Queue:** E-posta, bildirim gibi ağır işler queue'ya at
9. **Redis prefix:** `promix:` kullan, diğer projelerle çakışmasın

### Dizin Yapısı
```
app/
├── Enums/
│   ├── OrderStatus.php
│   ├── PaymentStatus.php
│   ├── PaymentMethod.php
│   ├── UserRole.php
│   └── IngredientUnit.php
├── Http/
│   ├── Controllers/
│   │   └── Api/
│   │       ├── Admin/
│   │       └── Storefront/
│   ├── Middleware/
│   │   └── AdminMiddleware.php
│   ├── Requests/
│   │   ├── Admin/
│   │   └── Storefront/
│   └── Resources/
│       ├── Admin/
│       └── Storefront/
├── Models/
├── Repositories/
├── Services/
└── Exceptions/
    └── Handler.php
```

## Mevcut Durum
Yeni proje - Faz 1'den başlanacak.

## Sık Yapılan Hatalar & Çözümler
- Meilisearch bağlantı hatası: `SCOUT_DRIVER=meilisearch` ve Meilisearch servisinin çalıştığından emin ol
- Redis bağlantı: `REDIS_CLIENT=phpredis` ve php-redis extension kurulu olmalı
- CORS hatası: `config/cors.php` → `allowed_origins` frontend URL'sini ekle
- Sanctum token: `SANCTUM_STATEFUL_DOMAINS` frontend domain'ini ekle
