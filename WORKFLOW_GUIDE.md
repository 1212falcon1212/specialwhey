# Claude Code Workflow Rehberi - ProMix

## Dosya Yerleşim Haritası

```
promix-backend/
├── CLAUDE.md                      ← CLAUDE_BACKEND.md içeriği
├── .claude/
│   └── hooks.json                 ← hooks_backend.json içeriği
├── .claude/skills/
│   └── laravel-api.md             ← skills_backend_api.md içeriği
└── deploy.sh                      ← DEPLOY_SETUP.md'deki backend script

promix-frontend/
├── CLAUDE.md                      ← CLAUDE_FRONTEND.md içeriği
├── .claude/
│   └── hooks.json                 ← hooks_frontend.json içeriği
├── .claude/skills/
│   └── nextjs-frontend.md         ← skills_frontend.md içeriği
└── deploy.sh                      ← DEPLOY_SETUP.md'deki frontend script

MASTER_PROMPT.md                   ← Her iki repoda da referans olarak tutulabilir
```

## Claude Code'a İlk Talimat (Backend Başlangıcı)

```
CLAUDE.md dosyasını oku. Bu bir protein e-ticaret platformu backend'i.

Faz 1'i başlatıyoruz. Sırayla şunları yap:

1. Tüm migration dosyalarını oluştur (MASTER_PROMPT.md veritabanı şemasını referans al)
2. Tüm Model dosyalarını oluştur (ilişkiler, cast'ler, scope'lar dahil)
3. Tüm Enum dosyalarını oluştur
4. Base ApiController ve trait'leri oluştur
5. Sanctum auth config'ini yap
6. CORS ayarlarını düzenle
7. Redis ve Meilisearch config'lerini ayarla
8. Admin ve örnek veri seeder'larını oluştur
9. Route yapısını kur (api.php)
10. Tüm migration'ları çalıştır ve seed et

Her dosyayı oluşturduktan sonra kısa bir özet ver.
```

## Claude Code'a İlk Talimat (Frontend Başlangıcı)

```
CLAUDE.md dosyasını oku. Bu bir protein e-ticaret platformu frontend'i.

Faz 1'i başlatıyoruz. Sırayla şunları yap:

1. Tailwind config'i düzenle (renk paleti, font ayarları)
2. globals.css'i düzenle
3. API client'ı oluştur (lib/api.ts)
4. Utility fonksiyonları oluştur (lib/utils.ts, lib/constants.ts)
5. Type tanımlarını oluştur (types/ klasörü)
6. Zustand store'ları oluştur (auth, cart, ui, mixer)
7. Tüm dizin yapısını oluştur (components, hooks, stores, lib)
8. Root layout'u düzenle (fonts, providers, metadata)
9. Storefront layout'u oluştur (header placeholder, footer placeholder)
10. Admin layout'u oluştur (sidebar placeholder, topbar placeholder)
11. PWA manifest.ts dosyasını oluştur

Her dosyayı oluşturduktan sonra kısa bir özet ver.
```

## Faz Geçiş Kontrol Listesi

Her fazın sonunda bu kontrolleri yap:

### Faz Sonu Checklist
- [ ] Tüm görevler tamamlandı mı?
- [ ] Kod formatlandı mı? (Pint / Prettier)
- [ ] TypeScript hataları var mı? (`npx tsc --noEmit`)
- [ ] Backend testleri geçiyor mu?
- [ ] Frontend build başarılı mı? (`npm run build`)
- [ ] Yeni sayfalar mobilde düzgün görünüyor mu?
- [ ] API endpoint'leri doğru çalışıyor mu? (Postman/Insomnia ile test)
- [ ] N+1 query var mı? (Laravel Debugbar ile kontrol)
- [ ] Console'da hata var mı?
- [ ] Git commit yapıldı mı?

## Hızlı Referans: Sık Kullanılan Claude Code Komutları

```
# Yeni bir migration oluştur
"ingredients tablosu için migration oluştur, şemayı MASTER_PROMPT'tan al"

# Yeni CRUD set oluştur
"Admin bileşen yönetimi için tam CRUD set oluştur: Controller, Service, Repository, FormRequest, Resource"

# Yeni sayfa oluştur
"Storefront ürün listeleme sayfası oluştur, skills dosyasındaki pattern'i kullan"

# Bug fix
"Sepete ekleme butonuna tıklandığında 422 hatası alıyorum, CartController ve CartService'i kontrol et"

# Refactor
"Mixer fiyat hesaplama mantığını MixerService'e taşı, şu an controller'da"

# Test
"IngredientService için unit test yaz"
```

## Commit Mesajı Formatı

```
[Faz X] Kısa açıklama

Örnekler:
[Faz 1] Veritabanı migration'ları oluşturuldu
[Faz 1] Model ilişkileri ve cast'ler tanımlandı
[Faz 2] Admin bileşen CRUD tamamlandı
[Faz 3] Protein oluşturucu wizard bileşeni eklendi
[Faz 4] Sepet ve PayTR entegrasyonu tamamlandı
[Fix] Sepet toplam fiyat hesaplama hatası düzeltildi
[Refactor] CartService Redis yapısı optimize edildi
```
