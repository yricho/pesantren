# Vercel Deployment Setup Guide

## Your Deployment URL
https://imam-syafii-blitar-cf8hdwg1o-pendtiumprazs-projects.vercel.app

## Required Environment Variables in Vercel

Go to your Vercel project settings and add these environment variables:

### 1. DATABASE_URL (Required)
You need a PostgreSQL database. Choose one of these options:

#### Option A: Neon (Recommended - Free tier available)
1. Go to https://neon.tech
2. Sign up and create a new project
3. Copy the connection string that looks like:
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

#### Option B: Supabase (Free tier available)
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings > Database
4. Copy the "Connection string" under "Connection Pooling"
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:6543/postgres?pgbouncer=true
   ```

#### Option C: Vercel Postgres
1. In your Vercel dashboard, go to Storage
2. Create a new Postgres database
3. It will automatically add the DATABASE_URL

### 2. NEXTAUTH_URL (Required)
Set this to your Vercel deployment URL:
```
https://imam-syafii-blitar-cf8hdwg1o-pendtiumprazs-projects.vercel.app
```

Or if you have a custom domain:
```
https://your-custom-domain.com
```

### 3. NEXTAUTH_SECRET (Required)
Generate a secure secret key:

**On Mac/Linux:**
```bash
openssl rand -base64 32
```

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach {Get-Random -Maximum 256}))
```

**Or use this online generator:**
https://generate-secret.vercel.app/32

## Step-by-Step Setup in Vercel

1. **Go to your Vercel project:**
   https://vercel.com/dashboard

2. **Click on your project:** `imam-syafii-blitar`

3. **Go to Settings → Environment Variables**

4. **Add each variable:**
   - Click "Add New"
   - Enter the Key and Value
   - Select all environments (Production, Preview, Development)
   - Click "Save"

5. **After adding all variables, redeploy:**
   - Go to the Deployments tab
   - Click the three dots on the latest deployment
   - Select "Redeploy"

## Database Setup

After setting up the database connection:

1. **Initialize the database schema:**
   ```bash
   # In your local terminal with DATABASE_URL set
   npx prisma migrate deploy
   ```

2. **Create initial admin user:**
   ```bash
   npx prisma db seed
   ```

   Or manually create through Prisma Studio:
   ```bash
   npx prisma studio
   ```

## Default Admin Credentials

After running the seed command, you can login with:
- Username: `admin`
- Password: `admin123`

**Important:** Change these credentials immediately after first login!

## Troubleshooting

### "Application error" or 500 errors
- Check that all environment variables are set correctly
- Check Vercel function logs for errors

### "Unauthorized" errors
- Verify NEXTAUTH_URL matches your deployment URL exactly
- Ensure NEXTAUTH_SECRET is set

### Database connection errors
- Verify DATABASE_URL is correct
- Ensure the database allows connections from Vercel's IP addresses
- For Supabase: Use the "Connection Pooling" URL, not the direct URL

### Build failures
- Check the build logs in Vercel
- Ensure all dependencies are in package.json
- Try clearing cache and redeploying

## Monitoring

Check your deployment status and logs:
- Build logs: https://vercel.com/pendtiumpraz/imam-syafii-blitar/deployments
- Function logs: https://vercel.com/pendtiumpraz/imam-syafii-blitar/functions

## Custom Domain (Optional)

To add a custom domain:
1. Go to Settings → Domains
2. Add your domain
3. Follow the DNS configuration instructions
4. Update NEXTAUTH_URL to your custom domain

## Support

If you encounter issues:
1. Check the Vercel function logs
2. Review the deployment logs
3. Ensure all environment variables are set correctly
4. Try redeploying after clearing cache