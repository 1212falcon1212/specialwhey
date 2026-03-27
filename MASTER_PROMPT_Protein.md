# ProMix - Kişiselleştirilmiş Protein Tozu E-Ticaret Platformu
## Master Prompt & Proje Yol Haritası

---

## 1. PROJE TANIMI

ProMix, kullanıcıların kendi protein karışımlarını bileşen bazlı oluşturup satın alabileceği bir e-ticaret platformudur. Kullanıcılar protein miktarı, aroma, glutamin, BCAA, karbonhidrat gibi bileşenleri ayrı ayrı seçerek kendi formüllerini oluşturur. Ürünler karışım halinde değil, bileşenler ayrı ayrı bir paket içinde gönderilir. Kullanıcı karışımı kendi yapar. Bileşenler ayrı ürün olarak da satılabilir.

---

## 2. TEKNİK MİMARİ

### 2.1 Tech Stack

| Katman | Teknoloji | Versiyon |
|--------|-----------|----------|
| Backend API | Laravel | 11.x |
| Frontend (Site + Admin) | Next.js | 16.x (App Router) |
| Veritabanı | MySQL | 8.x |
| Arama Motoru | Meilisearch | Latest |
| Cache & Queue | Redis | Latest |
| UI Bileşenleri | Shadcn/ui + Tailwind CSS | Latest |
| Ödeme | PayTR | Havale/EFT |
| PWA | next-pwa veya @serwist/next | Latest |

### 2.2 Proje Yapısı (Monorepo Değil, Ayrı Repolar)

```
promix-backend/          ← Laravel API
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   ├── Requests/
│   │   ├── Resources/
│   │   └── Middleware/
│   ├── Models/
│   ├── Services/
│   ├── Repositories/
│   ├── Enums/
│   └── Events/
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
├── routes/
│   └── api.php
├── config/
├── deploy.sh
└── CLAUDE.md

promix-frontend/         ← Next.js 16 (Site + Admin)
├── src/
│   ├── app/
│   │   ├── (storefront)/      ← Müşteri tarafı
│   │   │   ├── page.tsx
│   │   │   ├── urunler/
│   │   │   ├── proteinini-olustur/
│   │   │   ├── sepet/
│   │   │   ├── odeme/
│   │   │   ├── hesabim/
│   │   │   ├── hakkimizda/
│   │   │   ├── iletisim/
│   │   │   ├── sikca-sorulan-sorular/
│   │   │   └── layout.tsx
│   │   ├── (admin)/           ← Admin paneli
│   │   │   ├── admin/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── urunler/
│   │   │   │   ├── bilesenler/
│   │   │   │   ├── siparisler/
│   │   │   │   ├── musteriler/
│   │   │   │   ├── icerik/
│   │   │   │   ├── ayarlar/
│   │   │   │   └── layout.tsx
│   │   │   └── giris/
│   │   ├── layout.tsx
│   │   └── manifest.ts        ← PWA manifest
│   ├── components/
│   │   ├── ui/                ← Shadcn bileşenleri
│   │   ├── storefront/        ← Site bileşenleri
│   │   ├── admin/             ← Admin bileşenleri
│   │   └── shared/            ← Ortak bileşenler
│   ├── lib/
│   │   ├── api.ts             ← API client (axios/fetch wrapper)
│   │   ├── auth.ts            ← Auth helpers
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── hooks/
│   ├── stores/                ← Zustand state management
│   ├── types/
│   └── styles/
├── public/
│   ├── icons/                 ← PWA ikonları
│   └── images/
├── deploy.sh
└── CLAUDE.md
```

### 2.3 Veritabanı Şeması (Temel Tablolar)

```
users
├── id, name, email, password, phone, role (admin/customer)
├── email_verified_at, remember_token
└── timestamps, soft_deletes

addresses
├── id, user_id (FK), title, full_name, phone
├── city, district, neighborhood, address_line, zip_code
├── is_default (boolean)
└── timestamps

categories
├── id, parent_id (nullable, self-ref), name, slug
├── description, image, sort_order, is_active
└── timestamps, soft_deletes

ingredients (bileşenler - asıl ürünler)
├── id, category_id (FK), name, slug
├── description, short_description
├── image, gallery (JSON)
├── base_price (decimal 10,2 - birim fiyat)
├── unit (enum: gram, ml, adet)
├── unit_amount (her paketin miktarı, ör: 500g)
├── stock_quantity, sku
├── nutritional_info (JSON - besin değerleri)
├── is_active, is_featured, sort_order
├── meta_title, meta_description
└── timestamps, soft_deletes

ingredient_options (bileşen seçenekleri - ör: farklı gramajlar)
├── id, ingredient_id (FK)
├── label (ör: "250g", "500g", "1kg")
├── amount (decimal - miktar)
├── price (decimal 10,2)
├── stock_quantity
├── is_default, sort_order
└── timestamps

mixer_templates (hazır karışım şablonları)
├── id, name, slug, description
├── image, is_active, is_featured, sort_order
├── meta_title, meta_description
└── timestamps, soft_deletes

mixer_template_items (şablon bileşenleri)
├── id, mixer_template_id (FK), ingredient_id (FK)
├── ingredient_option_id (FK, nullable)
├── is_required (boolean), sort_order
└── timestamps

orders
├── id, user_id (FK, nullable - misafir sipariş)
├── order_number (unique, ör: PM-2024-00001)
├── status (enum: pending, paid, preparing, shipped, delivered, cancelled)
├── payment_method (enum: havale)
├── payment_status (enum: pending, confirmed, failed)
├── subtotal, discount_amount, total (decimal 10,2)
├── currency (default: TRY)
├── notes (müşteri notu)
├── admin_notes
└── timestamps, soft_deletes

order_items
├── id, order_id (FK)
├── type (enum: ingredient, mixer)
├── ingredient_id (FK, nullable)
├── ingredient_option_id (FK, nullable)
├── mixer_snapshot (JSON - mixer seçimlerinin snapshot'ı)
├── quantity, unit_price, total_price
└── timestamps

order_addresses
├── id, order_id (FK), type (enum: billing, shipping)
├── full_name, phone, city, district, address_line, zip_code
└── timestamps

payments
├── id, order_id (FK)
├── payment_method, transaction_id
├── amount (decimal 10,2), currency
├── status (enum: pending, success, failed)
├── provider_response (JSON)
├── paid_at (timestamp, nullable)
└── timestamps

coupons
├── id, code (unique), type (enum: percentage, fixed)
├── value (decimal), min_order_amount
├── usage_limit, used_count
├── starts_at, expires_at, is_active
└── timestamps, soft_deletes

pages (statik sayfalar)
├── id, title, slug, content (longText)
├── meta_title, meta_description
├── is_active, sort_order
└── timestamps, soft_deletes

settings (key-value site ayarları)
├── id, group (ör: general, payment, contact)
├── key (unique), value (text), type (string/boolean/json)
└── timestamps

media (genel medya yönetimi)
├── id, model_type, model_id (polymorphic)
├── collection, filename, path, mime_type, size
├── sort_order
└── timestamps

banners (anasayfa slider/banner)
├── id, title, subtitle, image, mobile_image
├── link, button_text
├── is_active, sort_order, starts_at, expires_at
└── timestamps, soft_deletes
```

### 2.4 API Endpoint Yapısı

```
# AUTH
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/me

# STOREFRONT - PUBLIC
GET    /api/categories
GET    /api/categories/{slug}
GET    /api/ingredients                     ← Tüm bileşenler (filtrelenebilir)
GET    /api/ingredients/{slug}              ← Bileşen detay
GET    /api/mixer/templates                 ← Hazır şablonlar
GET    /api/mixer/templates/{slug}          ← Şablon detay
GET    /api/mixer/calculate-price           ← Fiyat hesapla (POST body ile)
GET    /api/pages/{slug}                    ← Statik sayfa
GET    /api/banners                         ← Aktif bannerlar
GET    /api/search?q=                       ← Meilisearch arama
GET    /api/settings/public                 ← Public ayarlar

# STOREFRONT - AUTH REQUIRED
GET    /api/account/profile
PUT    /api/account/profile
PUT    /api/account/password
GET    /api/account/addresses
POST   /api/account/addresses
PUT    /api/account/addresses/{id}
DELETE /api/account/addresses/{id}
GET    /api/account/orders
GET    /api/account/orders/{orderNumber}

# CART & CHECKOUT
POST   /api/cart/add
PUT    /api/cart/update
DELETE /api/cart/remove/{id}
GET    /api/cart
POST   /api/cart/apply-coupon
DELETE /api/cart/remove-coupon
POST   /api/checkout
POST   /api/checkout/payment-callback       ← PayTR callback

# ADMIN (admin middleware)
GET    /api/admin/dashboard/stats

# Admin - Ürünler & Bileşenler
GET    /api/admin/categories
POST   /api/admin/categories
PUT    /api/admin/categories/{id}
DELETE /api/admin/categories/{id}
GET    /api/admin/ingredients
POST   /api/admin/ingredients
GET    /api/admin/ingredients/{id}
PUT    /api/admin/ingredients/{id}
DELETE /api/admin/ingredients/{id}

# Admin - Mixer Şablonları
GET    /api/admin/mixer-templates
POST   /api/admin/mixer-templates
GET    /api/admin/mixer-templates/{id}
PUT    /api/admin/mixer-templates/{id}
DELETE /api/admin/mixer-templates/{id}

# Admin - Siparişler
GET    /api/admin/orders
GET    /api/admin/orders/{id}
PUT    /api/admin/orders/{id}/status
PUT    /api/admin/orders/{id}/payment-status

# Admin - Müşteriler
GET    /api/admin/customers
GET    /api/admin/customers/{id}

# Admin - İçerik
GET    /api/admin/pages
POST   /api/admin/pages
PUT    /api/admin/pages/{id}
DELETE /api/admin/pages/{id}
GET    /api/admin/banners
POST   /api/admin/banners
PUT    /api/admin/banners/{id}
DELETE /api/admin/banners/{id}

# Admin - Kuponlar
GET    /api/admin/coupons
POST   /api/admin/coupons
PUT    /api/admin/coupons/{id}
DELETE /api/admin/coupons/{id}

# Admin - Ayarlar
GET    /api/admin/settings
PUT    /api/admin/settings
POST   /api/admin/media/upload
DELETE /api/admin/media/{id}
```

---

## 3. TEMEL ÖZELLİKLER

### 3.1 Protein Oluşturucu (Mixer)

Bu projenin kalbi. Kullanıcı adım adım protein karışımını oluşturur:

**Adım 1 - Protein Bazı Seç:** Whey Protein, Whey Isolate, Kazein, Bitkisel Protein vb. Her birinin farklı gramajları ve fiyatları var.

**Adım 2 - Aroma Seç:** Çikolata, Vanilya, Çilek, Muz, Aromasız vb. Aroma da ayrı bir bileşen ve fiyatı var.

**Adım 3 - Ekstra Bileşenler (Opsiyonel):** Glutamin, BCAA, Kreatin, Karbonhidrat, Vitamin paketi vb. Kullanıcı istediği kadar ekstra ekleyebilir veya hiç eklemeyebilir.

**Adım 4 - Özet & Sepete Ekle:** Seçilen bileşenlerin listesi, toplam fiyat, besin değerleri özeti gösterilir.

Her adımda fiyat canlı olarak güncellenir. Kullanıcı geri gidip seçimlerini değiştirebilir.

**Hazır Şablonlar:** "Kas Kazanımı Paketi", "Yağ Yakımı Paketi" gibi önceden tanımlanmış şablonlar da olacak. Kullanıcı şablondan başlayıp üstünde düzenleme yapabilir.

### 3.2 Bileşen Mağazası

Bileşenler ayrı ayrı da satılır. Normal bir e-ticaret ürün listeleme mantığı:
- Kategori bazlı filtreleme
- Fiyat bazlı filtreleme
- Meilisearch ile full-text arama
- Ürün detay sayfası (besin değerleri tablosu, açıklama, görseller)

### 3.3 Sepet & Ödeme

- Session bazlı sepet (Redis'te tutulur, giriş yapınca kullanıcıya bağlanır)
- Misafir olarak sipariş verebilme (opsiyonel - ilk etapta üyelik zorunlu olabilir)
- Kupon kodu desteği
- Sadece Havale/EFT ile ödeme (PayTR üzerinden)
- Sipariş sonrası havale bilgileri gösterilir
- Admin havale onayı ile sipariş ilerler

### 3.4 Kullanıcı Hesabı

- Kayıt / Giriş (email + şifre)
- Profil düzenleme
- Adres yönetimi (birden fazla adres)
- Sipariş geçmişi ve sipariş detayı
- Şifre değiştirme

### 3.5 Admin Paneli

- Dashboard (günlük/haftalık/aylık satış, sipariş sayısı, müşteri sayısı)
- Bileşen CRUD (gramaj seçenekleri ile birlikte)
- Kategori yönetimi (nested - parent/child)
- Mixer şablon yönetimi
- Sipariş yönetimi (durum güncelleme, ödeme onay)
- Müşteri listesi ve detayı
- Kupon yönetimi
- Sayfa yönetimi (WYSIWYG editör - TipTap)
- Banner yönetimi
- Site ayarları (firma bilgileri, sosyal medya, ödeme ayarları)
- Medya yönetimi

### 3.6 SEO & Performans

- Next.js SSR/SSG hybrid (ürün sayfaları ISR)
- Dinamik meta taglar (title, description, og:image)
- Sitemap.xml otomatik oluşturma
- robots.txt
- Yapısal veri (JSON-LD - Product, BreadcrumbList, Organization)
- Lighthouse skor hedefi: 90+ her kategoride
- Resim optimizasyonu (Next Image, WebP)
- Lazy loading

### 3.7 PWA

- Service Worker ile offline temel sayfa erişimi
- Add to Home Screen
- Push notification altyapısı (opsiyonel, sonraki fazlarda)
- App-like deneyim (no browser chrome)
- Manifest.json (tema rengi, ikonlar, splash screen)

---

## 4. DEPLOYMENT YAPISI

### 4.1 Deploy Stratejisi (Docker/CI-CD Yok)

Her iki repo için ayrı `deploy.sh` dosyaları. GitHub Webhooks ile tetiklenir.

**Backend deploy.sh akışı:**
1. `git pull origin main`
2. `composer install --no-dev --optimize-autoloader`
3. `php artisan migrate --force`
4. `php artisan config:cache`
5. `php artisan route:cache`
6. `php artisan view:cache`
7. `php artisan queue:restart`
8. Meilisearch index güncelle (gerekirse)

**Frontend deploy.sh akışı:**
1. `git pull origin main`
2. `npm install`
3. `npm run build`
4. PM2 veya systemd ile restart

### 4.2 Ortam Değişkenleri (.env)

Backend ve Frontend'de ayrı `.env` dosyaları. `.env.example` dosyaları repoda olacak.

---

## 5. GELİŞTİRME FAZLARI

### FAZ 1 - TEMEL ALTYAPI (Gün 1-2)
**Amaç:** İki projeyi ayağa kaldır, temel yapıyı kur.

**Backend Görevleri:**
- [ ] Laravel 11 kurulumu, temel config
- [ ] MySQL bağlantısı, Redis bağlantısı
- [ ] Migration'ların tamamı (yukarıdaki tüm tablolar)
- [ ] Model'ler ve ilişkileri (relations)
- [ ] Sanctum auth setup
- [ ] Base API Controller, API Resource'lar
- [ ] Form Request validation sınıfları
- [ ] Service/Repository pattern temel yapı
- [ ] CORS ayarları (frontend origin)
- [ ] Meilisearch scout driver setup
- [ ] Seeder'lar (admin user, örnek kategoriler, örnek bileşenler)

**Frontend Görevleri:**
- [ ] Next.js 16 kurulumu (App Router)
- [ ] Tailwind CSS + Shadcn/ui setup
- [ ] Proje klasör yapısı oluşturma
- [ ] API client setup (axios instance, interceptors)
- [ ] Auth context/store (Zustand)
- [ ] Layout yapıları (storefront layout, admin layout)
- [ ] PWA manifest ve service worker temel setup
- [ ] Türkçe slug yapısı, routing config

### FAZ 2 - ADMIN PANELİ ÇEKIRDEK (Gün 3-5)
**Amaç:** Admin girişi ve temel CRUD'lar çalışsın.

**Backend Görevleri:**
- [ ] Admin auth (login, logout, me)
- [ ] Admin middleware (role check)
- [ ] Kategori CRUD API
- [ ] Bileşen (Ingredient) CRUD API + option'lar
- [ ] Mixer şablon CRUD API
- [ ] Medya upload API (resim yükleme, boyutlandırma)
- [ ] Dashboard istatistik endpoint'leri

**Frontend Görevleri:**
- [ ] Admin login sayfası
- [ ] Admin dashboard sayfası (istatistik kartlar, grafikler)
- [ ] Admin sidebar navigasyon
- [ ] Kategori yönetim sayfaları (liste, ekle, düzenle)
- [ ] Bileşen yönetim sayfaları (liste, ekle, düzenle - option'lar ile)
- [ ] Mixer şablon yönetim sayfaları
- [ ] Medya yükleme bileşeni (drag & drop)
- [ ] DataTable bileşeni (sıralama, filtreleme, pagination)
- [ ] Form bileşenleri (input, select, textarea, switch, image upload)

### FAZ 3 - STOREFRONT TEMEL (Gün 6-8)
**Amaç:** Müşteri tarafı sayfaları ve protein oluşturucu çalışsın.

**Backend Görevleri:**
- [ ] Public kategori ve bileşen listeleme API
- [ ] Bileşen detay API (besin değerleri dahil)
- [ ] Mixer fiyat hesaplama endpoint'i
- [ ] Meilisearch index ve arama API
- [ ] Banner ve sayfa API'leri

**Frontend Görevleri:**
- [ ] Anasayfa (hero banner, öne çıkan bileşenler, CTA)
- [ ] Bileşen listeleme sayfası (grid, filtreler, arama)
- [ ] Bileşen detay sayfası
- [ ] **Protein Oluşturucu (Mixer) sayfası** ← EN KRİTİK
  - [ ] Step wizard bileşeni
  - [ ] Protein bazı seçim adımı
  - [ ] Aroma seçim adımı
  - [ ] Ekstra bileşen seçim adımı
  - [ ] Özet ve fiyat hesaplama adımı
  - [ ] Canlı fiyat güncelleme
  - [ ] Hazır şablon seçimi ve düzenleme
- [ ] Arama sonuçları sayfası
- [ ] Header (navbar, sepet ikonu, kullanıcı menü)
- [ ] Footer
- [ ] Mobil hamburger menü
- [ ] Statik sayfalar (hakkımızda, iletişim, SSS)

### FAZ 4 - SEPET & ÖDEME (Gün 9-11)
**Amaç:** Sepet, ödeme ve sipariş akışı tamamlansın.

**Backend Görevleri:**
- [ ] Cart API (add, update, remove, get)
- [ ] Cart Redis storage servisi
- [ ] Kupon doğrulama ve uygulama
- [ ] Checkout API (sipariş oluşturma)
- [ ] PayTR ödeme entegrasyonu
- [ ] PayTR callback handler
- [ ] Sipariş numarası üretimi (PM-2024-XXXXX)
- [ ] Sipariş e-posta bildirimleri (queue ile)
- [ ] Admin sipariş bildirim e-postası

**Frontend Görevleri:**
- [ ] Sepet sayfası (bileşen listesi, miktar güncelleme, silme)
- [ ] Sepet drawer/sidebar (header'dan erişim)
- [ ] Kupon kodu girişi
- [ ] Checkout sayfası
  - [ ] Adres seçimi/girişi
  - [ ] Sipariş özeti
  - [ ] Havale bilgileri gösterimi
  - [ ] Sipariş onay butonu
- [ ] Sipariş başarılı sayfası (havale bilgileri tekrar)
- [ ] Sepet state yönetimi (Zustand + localStorage persist)

### FAZ 5 - KULLANICI HESABI & ADMIN SİPARİŞ (Gün 12-13)
**Amaç:** Hesap yönetimi ve admin sipariş yönetimi.

**Backend Görevleri:**
- [ ] Kullanıcı kayıt/giriş API
- [ ] Profil güncelleme API
- [ ] Şifre değiştirme, şifremi unuttum
- [ ] Adres CRUD API
- [ ] Sipariş geçmişi API
- [ ] Admin sipariş listeleme/detay API
- [ ] Admin sipariş durum güncelleme API
- [ ] Admin ödeme onay API
- [ ] Admin müşteri listeleme API

**Frontend Görevleri:**
- [ ] Kayıt sayfası
- [ ] Giriş sayfası
- [ ] Hesabım layout (sidebar menü)
- [ ] Profil düzenleme sayfası
- [ ] Adres yönetimi sayfası
- [ ] Sipariş geçmişi sayfası
- [ ] Sipariş detay sayfası
- [ ] Admin sipariş listesi sayfası (DataTable)
- [ ] Admin sipariş detay sayfası (durum değiştirme, ödeme onay)
- [ ] Admin müşteri listesi ve detay sayfası

### FAZ 6 - İÇERİK YÖNETİMİ & AYARLAR (Gün 14-15)
**Amaç:** CMS, ayarlar ve kalan admin modülleri.

**Backend Görevleri:**
- [ ] Sayfa CRUD API
- [ ] Banner CRUD API
- [ ] Kupon CRUD API
- [ ] Site ayarları API (get/update)
- [ ] Sitemap.xml endpoint
- [ ] robots.txt endpoint

**Frontend Görevleri:**
- [ ] Admin sayfa yönetimi (TipTap WYSIWYG editör)
- [ ] Admin banner yönetimi (sıralama, tarih aralığı)
- [ ] Admin kupon yönetimi
- [ ] Admin site ayarları sayfası (sekmeli - genel, ödeme, iletişim, sosyal medya)
- [ ] Sitemap ve SEO meta component'leri
- [ ] 404 ve hata sayfaları

### FAZ 7 - POLISH & DEPLOY (Gün 16-18)
**Amaç:** Test, optimizasyon ve canlıya alma.

**Görevler:**
- [ ] Tüm sayfaların mobil responsive kontrolü
- [ ] PWA tam entegrasyonu (icons, splash, offline page)
- [ ] Lighthouse audit ve optimizasyon (90+ hedef)
- [ ] SEO kontrol listesi (meta, og, JSON-LD)
- [ ] API rate limiting
- [ ] Error handling ve logging kontrolü
- [ ] deploy.sh dosyaları hazırlama
- [ ] GitHub webhook setup
- [ ] Sunucu konfigürasyonu (Nginx, PHP-FPM, PM2, SSL)
- [ ] .env production değerleri
- [ ] Son test ve bug fix
- [ ] Canlıya alma

---

## 6. TASARIM İLKELERİ

### 6.1 Genel Yaklaşım

- **Mobile First:** Tüm tasarımlar önce 375px'den başlar, yukarı doğru genişler
- **Renk Paleti:** Siyah, beyaz, yeşil tonları (sağlık/doğal hissi). Accent renk olarak lime veya emerald green
- **Tipografi:** Inter veya Geist Sans (Next.js default). Türkçe karakter desteği tam
- **Boşluklar:** Generous whitespace, nefes alan tasarım
- **Animasyonlar:** Subtle, performans dostu (framer-motion minimal kullanım)

### 6.2 Storefront Sayfa Yapıları

**Anasayfa:**
- Hero slider/banner (tam genişlik)
- "Kendi Proteinini Oluştur" büyük CTA kartı
- Öne çıkan bileşenler grid
- Nasıl Çalışır? adım adım bölüm
- Müşteri yorumları (opsiyonel)
- Footer (linkler, iletişim, sosyal medya)

**Protein Oluşturucu:**
- Sol tarafta adım listesi (mobilde üstte progress bar)
- Ortada seçim alanı (kartlar halinde bileşenler)
- Sağ tarafta canlı özet paneli (mobilde fixed bottom bar)
- Her adımda ileri/geri butonlar

**Ürün Listeleme:**
- Sol sidebar filtreler (mobilde drawer)
- Grid layout (2 kolon mobil, 3-4 kolon desktop)
- Ürün kartları: görsel, isim, kısa açıklama, fiyat, sepete ekle

**Ürün Detay:**
- Görsel galeri (swipe mobilde)
- Ürün bilgileri
- Besin değerleri tablosu (accordion veya tab)
- Gramaj seçenekleri
- Sepete ekle butonu (mobilde fixed bottom)

### 6.3 Admin Panel Yapısı

- Sol sidebar navigasyon (collapse edilebilir)
- Üst bar (bildirimler, profil, çıkış)
- İçerik alanı (breadcrumb + content)
- DataTable'lar: sıralama, filtreleme, pagination, bulk actions
- Form'lar: clear validation mesajları, auto-save draft (opsiyonel)

---

## 7. ÖNEMLİ TEKNİK DETAYLAR

### 7.1 Auth Akışı

Laravel Sanctum token-based auth. Frontend'de token localStorage'da saklanır (httpOnly cookie alternatif olarak düşünülebilir). Her API isteğinde `Authorization: Bearer {token}` header'ı gönderilir. Admin ve customer aynı auth sistemi, `role` field ile ayrılır.

### 7.2 Sepet Mantığı

- Giriş yapmamış kullanıcı: sepet `sessionId` ile Redis'te tutulur
- Giriş yapınca: session sepeti kullanıcı sepetine merge edilir
- Sepet item yapısı: `{ type: 'ingredient'|'mixer', ingredientId?, optionId?, mixerItems?: [...], quantity }`
- Mixer ürünü sepete eklenirken tüm bileşen seçimleri snapshot olarak kaydedilir
- Her sepet güncellemesinde fiyat yeniden hesaplanır (backend tarafında)

### 7.3 Fiyatlandırma

- Her bileşenin (ingredient) seçenekleri (option) farklı fiyatlarda olabilir
- Mixer fiyatı = seçilen tüm bileşen fiyatlarının toplamı
- Kupon: yüzde veya sabit indirim, minimum tutar şartı
- Kargo ücreti: ilk etapta yok (ücretsiz veya fiyata dahil)
- Para birimi: TRY

### 7.4 Meilisearch Kullanımı

- Laravel Scout ile entegre
- İndekslenen modeller: Ingredient (bileşenler)
- Filtrelenebilir alanlar: category_id, is_active, price range
- Aranabilir alanlar: name, description, short_description
- Sıralama: relevance, price_asc, price_desc, newest
- Typo tolerance ve Türkçe karakter desteği

### 7.5 Redis Kullanımı

- Session storage
- Cart storage
- Cache (API response cache, config cache)
- Queue driver (email, sipariş bildirimleri)
- Rate limiting

### 7.6 Türkçe URL Konvansiyonu

Tüm site URL'leri Türkçe olacak (ürün slug'ları hariç, onlar ürün ismine göre):

| Sayfa | URL |
|-------|-----|
| Anasayfa | `/` |
| Ürünler | `/urunler` |
| Ürün Detay | `/urunler/{slug}` |
| Protein Oluştur | `/proteinini-olustur` |
| Sepet | `/sepet` |
| Ödeme | `/odeme` |
| Hesabım | `/hesabim` |
| Siparişlerim | `/hesabim/siparislerim` |
| Adreslerim | `/hesabim/adreslerim` |
| Hakkımızda | `/hakkimizda` |
| İletişim | `/iletisim` |
| SSS | `/sikca-sorulan-sorular` |
| Admin Giriş | `/admin/giris` |
| Admin Dashboard | `/admin/panel` |

---

## 8. CLAUDE CODE ÇALIŞMA PRENSİPLERİ

### 8.1 Genel Kurallar

1. **Türkçe commit mesajları** kullan
2. **Her görev tek bir commit** olsun, atomik commitler
3. Kod içi yorumlar **Türkçe** olabilir, ancak değişken/fonksiyon isimleri **İngilizce**
4. **Backend ve Frontend ayrı repolarda** çalışılır
5. Her faz bittiğinde o fazın **test checklist'i** geçilmeli
6. Hata mesajları ve validation mesajları **Türkçe**
7. API response formatı her zaman tutarlı olmalı:
   ```json
   {
     "success": true,
     "data": {},
     "message": "İşlem başarılı"
   }
   ```
   Hata durumunda:
   ```json
   {
     "success": false,
     "message": "Hata mesajı",
     "errors": {}
   }
   ```

### 8.2 Kod Kalite Standartları

**Backend (Laravel):**
- PSR-12 standartları (Laravel Pint ile enforce)
- Service pattern: Controller → Service → Repository → Model
- Form Request'ler ile validation
- API Resource'lar ile response formatlama
- Enum'lar string-backed olacak
- Soft delete kullanılan modellerde trait ekle
- Her model'de `$fillable` tanımla, `$guarded` kullanma
- N+1 query'lere dikkat, eager loading kullan

**Frontend (Next.js):**
- TypeScript strict mode
- Prettier ile formatlama
- Component'ler functional, hooks ile
- Zustand store'lar modüler (auth store, cart store, ui store)
- API çağrıları özel hook'lar ile (useIngredients, useCart vb.)
- Loading ve error state'leri her sayfada handle edilmeli
- Skeleton loader'lar kullan
- Form'larda react-hook-form + zod validation

---

## 9. CLAUDE CODE İÇİN ÖNEMLİ NOTLAR

- Bu dosya projenin "anayasası"dır. Her kararın referans noktası burasıdır.
- Fazlar sıralı gidecek, bir faz bitmeden diğerine geçilmeyecek.
- Her faz sonunda kısa bir review yapılacak.
- Tasarım kararlarında "Mobile First" prensibi asla unutulmayacak.
- Admin panel ve storefront aynı Next.js projesinde, route group'lar ile ayrılacak.
- Performans her zaman öncelik. Gereksiz kütüphane ekleme, bundle size'a dikkat et.
- Türkçe karakter desteği her yerde olacak (slug'lar, breadcrumb'lar, meta taglar, form mesajları).
