# Prisma di Vercel - Setup Guide

## Option 1: Prisma Accelerate (RECOMMENDED - Yang Kamu Pakai)
✅ **Sudah optimal untuk Vercel!**

```env
DATABASE_URL="postgres://..."
PRISMA_DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."
```

## Option 2: Database dengan PgBouncer
Kalau pakai Supabase/Neon:

```env
# Connection pooling URL (untuk app)
DATABASE_URL="postgresql://...6543/postgres?pgbouncer=true"

# Direct URL (untuk migrations)  
DIRECT_URL="postgresql://...5432/postgres"
```

Schema:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## Option 3: Vercel Postgres (Built-in)
```bash
# Di Vercel Dashboard
1. Storage → Create Database → Postgres
2. Auto-setup environment variables
```

## Build Command untuk Vercel

Di `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma generate && next build"
  }
}
```

Atau di `vercel.json`:
```json
{
  "buildCommand": "prisma generate && prisma db push && next build"
}
```

## Prisma Client Singleton (PENTING!)

Buat file `lib/prisma.ts`:
```typescript
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
```

## Edge Runtime (Optional)

Untuk API Routes yang pakai Edge Runtime:
```typescript
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())
```

## Troubleshooting

### Error: Too many connections
- Gunakan connection pooling
- Atau upgrade ke Prisma Accelerate

### Error: Can't reach database
- Cek DATABASE_URL format
- Pastikan ada `?sslmode=require`

### Error: Prisma Client not generated
- Tambahkan `postinstall: "prisma generate"` di package.json

## Commands

```bash
# Generate Prisma Client
npx prisma generate

# Push schema ke database
npx prisma db push

# Buat migration (development)
npx prisma migrate dev

# Apply migration (production)
npx prisma migrate deploy
```