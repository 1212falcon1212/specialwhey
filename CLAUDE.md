# ProMix - Workspace Root

## Proje Yapısı
Bu workspace iki ayrı projeyi barındırır:

- **`promix-backend/`** - Laravel 11 API (PHP)
- **`promix-frontend/`** - Next.js 15 Frontend (TypeScript)

Her proje kendi `CLAUDE.md`, `.claude/hooks.json` ve `.claude/skills/` dosyalarına sahiptir.

## Referans Dokümanlar
- `MASTER_PROMPT_Protein.md` - Projenin ana referans dokümanı
- `DEPLOY_SETUP.md` - Deploy konfigürasyon rehberi
- `WORKFLOW_GUIDE.md` - Çalışma akışı rehberi

## Hızlı Başlangıç

### Backend
```bash
cd promix-backend
php artisan serve                    # API: http://localhost:8000
php artisan migrate:fresh --seed     # DB sıfırla
```

### Frontend
```bash
cd promix-frontend
npm run dev                          # Site: http://localhost:3000
```

## Admin Giriş
- E-posta: admin@promix.com.tr
- Şifre: password
