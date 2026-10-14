# Raqamli baholash kompetensiyasi — o‘quv platformasi

“Raqamli ta’limda bo‘lajak boshlang‘ich sinf o‘qituvchilarida ta’lim jarayonini baholash kompetensiyalarini rivojlantirish” dissertatsiya tadqiqoti (M.K. Samatova, 2025) asosidagi o‘quv-metodik platforma.

**Texnologiyalar:** Next.js 16 (App Router), PostgreSQL (Neon), Drizzle ORM, e-pochta + parol orqali kirish (httpOnly cookie sessiyalari).

## Imkoniyatlar

| Rol | Nima qila oladi |
|---|---|
| **Talaba** | Ro‘yxatdan o‘tadi, diagnostika, 8 ta dars, mavzu testlari, yakuniy test, 9 ta mashq, 5 ta simulyator; “Mening sahifam”da keyingi qadam doim ko‘rinadi; sertifikat oladi |
| **O‘qituvchi** | Guruh yaratadi (6 belgili kod va taklif havolasi), talabalar natijalarini ko‘radi, CSV’ga yuklab oladi |
| **Administrator** | Foydalanuvchilar va rollar, vaqtinchalik parol berish; darslar (Markdown tahrirlovchi), test savollari, mashqlar, simulyatorlar, vositalar va glossariyni tahrirlaydi |

Sertifikatlarni `/verify/<raqam>` sahifasida istalgan kishi tekshira oladi.

## Lokal ishga tushirish

```bash
npm install
cp .env.example .env.local   # ADMIN_EMAIL va ADMIN_PASSWORD ni to‘ldiring
npm run db:setup             # jadvallar + boshlang‘ich kontent + administrator
npm run dev                  # http://localhost:3000
```

`DATABASE_URL` bo‘sh bo‘lsa, lokal rejimda `.pglite/` papkasidagi o‘rnatilgan PostgreSQL (PGlite) ishlatiladi — alohida baza o‘rnatish shart emas.

## Neon + Vercel’ga joylash

1. **Neon** (yoki Vercel → Storage → Neon) da baza yarating va ulanish manzilini (`postgresql://…?sslmode=require`) oling.
2. Kompyuterda `.env.local` ga `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` yozing va bir marta bajaring:
   ```bash
   npm run db:setup
   ```
3. GitHub’ga yuklang va Vercel’da loyihani import qiling. **Environment Variables**:
   - `DATABASE_URL` — Neon manzili (majburiy)
   - `APP_URL` — sayt manzili, masalan `https://elektronraqam.uz`
   - `CONTACT_EMAIL` — “Yordam” sahifasidagi aloqa e-pochtasi (ixtiyoriy)
   - `RESEND_API_KEY`, `MAIL_FROM` — parolni e-pochta orqali tiklash uchun (ixtiyoriy; bo‘lmasa admin vaqtinchalik parol beradi)
4. Deploy. Keyin admin sifatida kiring: menyu → **Boshqaruv paneli**.

## Buyruqlar

| Buyruq | Vazifasi |
|---|---|
| `npm run dev` | Ishlab chiqish serveri |
| `npm run build` / `npm start` | Production build va ishga tushirish |
| `npm run db:generate` | `src/db/schema.ts` o‘zgarganda yangi migratsiya yaratish |
| `npm run db:migrate` | Migratsiyalarni qo‘llash |
| `npm run db:seed` | Kontent (faqat bo‘sh bazaga) va administratorni yaratish — qayta ishga tushirish xavfsiz |

## Tuzilma

```
src/
  app/            sahifalar (talaba, /teacher, /admin)
  actions/        server amallari (auth, o‘quv natijalari, o‘qituvchi, admin)
  components/     UI komponentlar va interaktiv bloklar
  db/             sxema, ulanish, migratsiya va boshlang‘ich kontent
  lib/            auth, progress hisoblash, baholash funksiyalari, doimiy matnlar
drizzle/          SQL migratsiyalar
```
