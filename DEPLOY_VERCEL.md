# 📚 Panduan Deploy ke Vercel dengan NextAuth

## 1. Persiapan Database

### Option A: Vercel Postgres (Recommended)
1. Di Vercel Dashboard → Storage → Create Database
2. Pilih Postgres
3. Copy DATABASE_URL yang diberikan

### Option B: Supabase/Neon/Railway
1. Buat akun di provider pilihan
2. Create new database
3. Copy connection string

## 2. Setup Environment Variables di Vercel

### Via Vercel Dashboard:
1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project Anda
3. Settings → Environment Variables
4. Tambahkan variables berikut:

```
DATABASE_URL = "postgresql://..."
NEXTAUTH_URL = "https://nama-app-anda.vercel.app"
NEXTAUTH_SECRET = "hasil-generate-random-32-chars"
```

### Generate NEXTAUTH_SECRET:
```bash
# Di terminal lokal, jalankan:
openssl rand -base64 32
# Copy hasilnya ke Vercel
```

## 3. Setup Google OAuth (Optional)

### Di Google Cloud Console:
1. Buka https://console.cloud.google.com/
2. Create New Project (atau pilih existing)
3. APIs & Services → Enable APIs → Google+ API
4. Credentials → Create Credentials → OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs, tambahkan:
   - `https://nama-app-anda.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID dan Client Secret

### Di Vercel:
Tambahkan environment variables:
```
GOOGLE_CLIENT_ID = "xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "xxx"
```

## 4. Deploy ke Vercel

### Option A: Via GitHub (Recommended)
```bash
# Push code ke GitHub
git add .
git commit -m "Add NextAuth configuration"
git push origin main

# Di Vercel:
1. Import Git Repository
2. Pilih repo GitHub Anda
3. Deploy akan otomatis
```

### Option B: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## 5. Setup Database Schema

Setelah deploy, jalankan migration:

### Option A: Via Vercel Dashboard
1. Functions → Console
2. Jalankan:
```bash
npx prisma db push
```

### Option B: Lokal dengan Production DB
```bash
# Set DATABASE_URL ke production
DATABASE_URL="your-production-db-url" npx prisma db push
```

## 6. Test Authentication

1. Buka `https://nama-app-anda.vercel.app/api/auth/signin`
2. Test login dengan Google (jika setup)
3. Atau gunakan credentials authentication

## 7. Troubleshooting

### Error: NEXTAUTH_URL mismatch
- Pastikan NEXTAUTH_URL sama dengan domain Vercel
- Jangan pakai trailing slash (/)

### Error: Database connection
- Cek DATABASE_URL format
- Pastikan SSL mode: `?sslmode=require`

### Error: Google OAuth
- Cek redirect URI di Google Console
- Pastikan domain benar di Authorized domains

## 8. Security Checklist

✅ NEXTAUTH_SECRET minimal 32 karakter
✅ DATABASE_URL menggunakan SSL
✅ Environment variables di Vercel, bukan di code
✅ .env.local ada di .gitignore
✅ Google OAuth redirect URIs benar

## 9. Monitor & Logs

- Vercel Dashboard → Functions → Logs
- Vercel Dashboard → Analytics
- Runtime Logs untuk debug errors

## 10. Update Environment Variables

Jika perlu update:
1. Vercel Dashboard → Settings → Environment Variables
2. Update value
3. Redeploy: Deployments → Redeploy

---

## Quick Start Commands

```bash
# Clone repo
git clone your-repo-url
cd pondok-imam-syafii

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local dengan values yang benar

# Push ke GitHub
git remote add origin your-github-repo
git push -u origin main

# Deploy ke Vercel
vercel --prod
```

## Support Links

- [NextAuth Documentation](https://next-auth.js.org/)
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)