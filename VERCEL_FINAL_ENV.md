# Environment Variables untuk Vercel - FINAL

Copy paste ini ke Vercel Settings → Environment Variables:

## 1. DATABASE_URL
```
prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19rTjB4aDktVkJjaVhhSmFwSkU3N2giLCJhcGlfa2V5IjoiMDFLM1RHUFNBOTJBRTVGWk5XTlFIQlNUUTAiLCJ0ZW5hbnRfaWQiOiIyNjExZGIzYmJiNjVmZTgwZjFjNGU1MzhjMWVjMGMzOWVjNjFiNzlhNTBmOWQ5YmNmYzkxZTQ4NzVjMDM1ZDU0IiwiaW50ZXJuYWxfc2VjcmV0IjoiYWFkZmE0OTYtNTVmZC00MjY4LWE2NTktODQ3ZTVkNGFhNTNkIn0.OZomtqNuLogzyvjJPWp_Jzl0XhAyNu33Rd61dWgZdZE
```

## 2. NEXTAUTH_URL
```
https://imam-syafii-blitar-cf8hdwg1o-pendtiumprazs-projects.vercel.app
```

## 3. NEXTAUTH_SECRET
```
vQjk42DCgjgJSvqkBdvU4yp0LLt457+FjdHA4+R7174=
```

## Cara Pasang:

1. Buka: https://vercel.com/pendtiumpraz/imam-syafii-blitar/settings/environment-variables

2. Untuk setiap variable di atas:
   - Klik "Add New"
   - Masukkan Key (nama variable)
   - Paste Value (isi variable)
   - Environment: Pilih semua (Production ✓, Preview ✓, Development ✓)
   - Klik "Save"

3. Setelah semua ditambahkan:
   - Pergi ke tab "Deployments"
   - Klik titik tiga (...) di deployment terbaru
   - Pilih "Redeploy"
   - Klik "Redeploy" lagi

## Login Credentials (Setelah Deploy):

**Admin:**
- Username: admin
- Password: admin123

**Staff:**
- Username: staff  
- Password: staff123

## Troubleshooting:

Jika masih error setelah add environment variables:
1. Pastikan tidak ada spasi di awal/akhir value
2. Pastikan semua 3 variables sudah ditambahkan
3. Coba Redeploy ulang
4. Cek Function Logs di Vercel untuk error detail

## Status:
✅ Database sudah di-migrate
✅ Database sudah di-seed dengan data sample
✅ Tinggal add environment variables ini saja!