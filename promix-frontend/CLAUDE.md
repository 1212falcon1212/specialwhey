# CLAUDE.md - ProMix Frontend (Next.js)

## Proje Özeti
ProMix, kullanıcıların kendi protein karışımlarını bileşen bazlı oluşturup satın aldığı e-ticaret platformunun frontend'idir. Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn/ui, Zustand kullanır.

## Komutlar

### Geliştirme
```bash
npm run dev                          # Dev server başlat
npm run build                        # Production build
npm run start                        # Production server
npm run lint                         # ESLint kontrolü
npx tsc --noEmit                     # TypeScript kontrolü
npx prettier --write .               # Kod formatlama
```

## Mimari Kurallar

### Dizin Yapısı
```
src/
├── app/
│   ├── (storefront)/       ← Müşteri tarafı (header + footer layout)
│   ├── (admin)/            ← Admin paneli (sidebar layout)
│   ├── layout.tsx          ← Root layout
│   └── manifest.ts         ← PWA manifest
├── components/
│   ├── ui/                 ← Shadcn bileşenleri (dokunma)
│   ├── storefront/         ← Site bileşenleri
│   ├── admin/              ← Admin bileşenleri
│   └── shared/             ← Ortak bileşenler
├── hooks/                  ← Custom hooks (useSWR wrappers)
├── stores/                 ← Zustand state management
├── types/                  ← TypeScript type tanımları
├── lib/                    ← Utility fonksiyonlar, API client
│   └── validations/        ← Zod şemaları
└── styles/                 ← Global stiller
```

### Önemli Kurallar
1. **TypeScript strict mode.** `any` tipi YASAK
2. **Server Component varsayılan.** Client Component sadece gerektiğinde (`"use client"`)
3. **Zustand** state management için. Context API yerine Zustand kullan
4. **SWR** veri fetching için. `useEffect` + `fetch` YASAK
5. **react-hook-form + zod** form validation için
6. **Shadcn/ui** bileşenleri temel. Kendi UI bileşeni yazmadan önce shadcn'de var mı kontrol et
7. **Mobile First** yaklaşım. Tüm stiller mobil öncelikli
8. **Her component'te state handling:** loading, error, empty, success
9. **Türkçe URL'ler:** `/urunler`, `/sepet`, `/hesabim` vb.
10. **formatPrice()** fonksiyonu ile fiyat gösterimi (₺ formatı)

### API Client
- `src/lib/api.ts` - Axios instance, baseURL: `NEXT_PUBLIC_API_URL`
- Request interceptor: Bearer token ekleme
- Response interceptor: 401 → logout ve /giris'e yönlendir

### State Management
- `auth-store`: token, user, login/logout
- `cart-store`: items, add/remove/update, persist localStorage
- `mixer-store`: currentStep, selectedProtein/flavor/extras
- `ui-store`: sidebar, mobile menu, modals

### Naming Conventions
| Şey | Format | Örnek |
|-----|--------|-------|
| Component | PascalCase | `IngredientCard.tsx` |
| Hook | camelCase, use prefix | `useIngredients.ts` |
| Store | kebab-case | `cart-store.ts` |
| Type dosyası | kebab-case | `ingredient.ts` |
| Sayfa | `page.tsx` (Next.js convention) | `src/app/(storefront)/urunler/page.tsx` |
| Layout | `layout.tsx` | `src/app/(storefront)/layout.tsx` |

## Mevcut Durum
Yeni proje - Faz 1'den başlanacak.

## Sık Yapılan Hatalar & Çözümler
- Hydration hatası: Zustand store'larda `skipHydration: true` kullan
- CORS hatası: Backend'de `config/cors.php` kontrol et
- Image optimizasyonu: Next.js `<Image>` component kullan, `<img>` YASAK
- `useSearchParams` kullanırken `<Suspense>` wrapper gerekir
