# Vercel Environment Variables Setup

## Required Environment Variables

Add these to your Vercel project settings:

### 1. DATABASE_URL
```
prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19rTjB4aDktVkJjaVhhSmFwSkU3N2giLCJhcGlfa2V5IjoiMDFLM1RHUFNBOTJBRTVGWk5XTlFIQlNUUTAiLCJ0ZW5hbnRfaWQiOiIyNjExZGIzYmJiNjVmZTgwZjFjNGU1MzhjMWVjMGMzOWVjNjFiNzlhNTBmOWQ5YmNmYzkxZTQ4NzVjMDM1ZDU0IiwiaW50ZXJuYWxfc2VjcmV0IjoiYWFkZmE0OTYtNTVmZC00MjY4LWE2NTktODQ3ZTVkNGFhNTNkIn0.OZomtqNuLogzyvjJPWp_Jzl0XhAyNu33Rd61dWgZdZE
```

### 2. POSTGRES_URL (For migrations only - optional in Vercel)
```
postgres://2611db3bbb65fe80f1c4e538c1ec0c39ec61b79a50f9d9bcfc91e4875c035d54:sk_kN0xh9-VBciXaJapJE77h@db.prisma.io:5432/postgres?sslmode=require
```

### 3. NEXTAUTH_URL
```
https://imam-syafii-blitar-cf8hdwg1o-pendtiumprazs-projects.vercel.app
```

### 4. NEXTAUTH_SECRET
Generate a secure secret:
```bash
openssl rand -base64 32
```

Example:
```
xK9Yh5sNpR3wF7jL2mQ8vT1bC6nE4aG0
```

## How to Add in Vercel

1. Go to: https://vercel.com/pendtiumpraz/imam-syafii-blitar/settings/environment-variables

2. Add each variable:
   - Click "Add New"
   - Paste the Key and Value
   - Select all environments (Production, Preview, Development)
   - Click "Save"

3. After adding all variables, redeploy your application

## Database is Already Set Up!

✅ Database has been migrated
✅ Sample data has been seeded
✅ Admin credentials: username: `admin`, password: `admin123`
✅ Staff credentials: username: `staff`, password: `staff123`

## After Adding Environment Variables

Your app should work immediately after redeployment!