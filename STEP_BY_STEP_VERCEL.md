# 🚀 STEP BY STEP DEPLOY KE VERCEL (SUPER SIMPLE!)

## ✅ YANG SUDAH DI-GENERATE UNTUKMU:
```
NEXTAUTH_SECRET = "uanFT5205gKeqayTqfDb/28VoHw26fgpXaYNirCKBcs="
```
**LANGSUNG PAKAI AJA! Udah aman, 32 karakter, random!**

---

## 📝 STEP 1: BIKIN DATABASE (Pilih 1 aja)

### Option A: VERCEL POSTGRES (Paling Gampang!)
1. Login [Vercel](https://vercel.com)
2. Klik **Storage** di sidebar
3. Klik **Create Database**
4. Pilih **Postgres**
5. Kasih nama: `pondok-db`
6. Klik **Create**
7. **COPY DATABASE_URL** yang dikasih (bentuknya panjang)

### Option B: SUPABASE (Gratis Forever)
1. Buka [supabase.com](https://supabase.com)
2. Sign up pakai GitHub
3. **New Project**
4. Isi:
   - Name: `pondok-imam-syafii`
   - Password: `bikin-password-kuat`
   - Region: `Southeast Asia (Singapore)`
5. **Create Project** (tunggu 2 menit)
6. Settings → Database → Connection String → **Copy URI**

---

## 📝 STEP 2: DEPLOY KE VERCEL

### A. Push ke GitHub dulu:
```bash
git add .
git commit -m "Ready deploy"
git push origin main
```

### B. Import di Vercel:
1. Buka [vercel.com](https://vercel.com)
2. Klik **Add New** → **Project**
3. **Import Git Repository**
4. Pilih repo `pondok-imam-syafii`
5. Klik **Import**

---

## 📝 STEP 3: SETTING ENVIRONMENT VARIABLES

Di halaman deploy Vercel:

### 1. Klik **Environment Variables**

### 2. Add satu-satu:

#### Variable 1:
```
Name: DATABASE_URL
Value: [paste URL dari Step 1]
```

#### Variable 2:
```
Name: NEXTAUTH_URL
Value: https://pondok-imam-syafii.vercel.app
```
**Note:** Nanti kalau nama app beda, ganti aja

#### Variable 3:
```
Name: NEXTAUTH_SECRET
Value: uanFT5205gKeqayTqfDb/28VoHw26fgpXaYNirCKBcs=
```
**COPY-PASTE AJA! Udah di-generate!**

### 3. Klik **Deploy**
Tunggu 2-3 menit...

---

## 📝 STEP 4: SETUP DATABASE SCHEMA

### Setelah deploy success:
1. Di Vercel Dashboard → **Functions** tab
2. Scroll ke bawah → **Console**
3. Paste & Enter:
```bash
npx prisma db push
```
4. Tunggu sampai selesai

---

## 📝 STEP 5: TEST APLIKASI

1. Buka: `https://nama-app-kamu.vercel.app`
2. Coba login di `/api/auth/signin`
3. DONE! 🎉

---

## 🔧 OPTIONAL: GOOGLE LOGIN

### Mau pakai Google Login? Ikuti ini:

1. Buka [console.cloud.google.com](https://console.cloud.google.com)
2. **Create Project** → Nama: `Pondok Imam Syafii`
3. **APIs & Services** → **Enable APIs**
4. Cari **Google+ API** → **Enable**
5. **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
6. Isi:
   - Type: **Web application**
   - Name: `Pondok Auth`
   - Authorized JavaScript origins:
     ```
     https://pondok-imam-syafii.vercel.app
     http://localhost:3000
     ```
   - Authorized redirect URIs:
     ```
     https://pondok-imam-syafii.vercel.app/api/auth/callback/google
     http://localhost:3000/api/auth/callback/google
     ```
7. **Create** → Copy **Client ID** & **Client Secret**

### Add ke Vercel:
Settings → Environment Variables → Add:
```
GOOGLE_CLIENT_ID = [paste client id]
GOOGLE_CLIENT_SECRET = [paste client secret]
```

Redeploy → DONE!

---

## ❌ TROUBLESHOOTING

### Error: Database connection failed
- Cek DATABASE_URL ada `?sslmode=require` di akhir
- Pastikan database udah jalan

### Error: NEXTAUTH_URL mismatch
- Pastikan NEXTAUTH_URL = domain Vercel (tanpa / di akhir)
- Contoh benar: `https://app.vercel.app`
- Contoh salah: `https://app.vercel.app/`

### Error: Secret too short
- Pakai secret yang udah di-generate: `uanFT5205gKeqayTqfDb/28VoHw26fgpXaYNirCKBcs=`

---

## 📱 QUICK COPY SEMUA ENV:

Copy-paste ini ke Vercel Environment Variables:

```env
DATABASE_URL=[paste dari database provider]
NEXTAUTH_URL=https://pondok-imam-syafii.vercel.app
NEXTAUTH_SECRET=uanFT5205gKeqayTqfDb/28VoHw26fgpXaYNirCKBcs=
```

---

## ✨ SELESAI!

App kamu udah live di: `https://pondok-imam-syafii.vercel.app`

Ada masalah? Cek:
- Logs: Vercel Dashboard → Functions → Logs
- Error details: Vercel Dashboard → Deployments