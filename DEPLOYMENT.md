# Deployment Guide for Vercel

## Prerequisites

1. A Vercel account
2. A PostgreSQL database (recommended: Neon, Supabase, or PlanetScale)

## Database Setup

### Option 1: Neon (Recommended for Vercel)
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

### Option 2: Supabase
1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string

### Option 3: PlanetScale
1. Sign up at [planetscale.com](https://planetscale.com)
2. Create a new database
3. Get the connection string from the Connect modal

## Environment Variables

Set these in your Vercel project settings:

```
DATABASE_URL=your_postgresql_connection_string
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=generate_using_openssl_rand_-base64_32
```

## Deployment Steps

1. **Fork or clone the repository**

2. **Set up database**
   - Create a PostgreSQL database using one of the options above
   - Copy the connection string

3. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel
   ```

4. **Set environment variables in Vercel Dashboard**
   - Go to your project settings
   - Add the environment variables listed above

5. **Initialize database**
   ```bash
   # Run migrations
   npx prisma migrate deploy
   
   # Seed initial data (optional)
   npx prisma db seed
   ```

## Local Development with PostgreSQL

If you want to use PostgreSQL locally:

1. Install PostgreSQL
2. Create a database
3. Update `.env.local`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/pondok_imam_syafii"
   ```
4. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

## Troubleshooting

### Build fails with "Failed to collect page data"
- Make sure all environment variables are set correctly
- Ensure DATABASE_URL is a valid PostgreSQL connection string

### "Invalid `prisma.user.findUnique()` invocation"
- Run `npx prisma generate` 
- Run `npx prisma migrate deploy`

### Authentication not working
- Verify NEXTAUTH_URL matches your deployment URL
- Ensure NEXTAUTH_SECRET is set and secure