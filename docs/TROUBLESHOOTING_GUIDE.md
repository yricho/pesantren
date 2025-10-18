# 🔧 Troubleshooting Guide - Pondok Imam Syafi'i System

## Quick Links
- [Common Issues](#common-issues)
- [Build & Deployment Issues](#build--deployment-issues)
- [Database Issues](#database-issues)
- [Authentication Issues](#authentication-issues)
- [Performance Issues](#performance-issues)
- [Payment Gateway Issues](#payment-gateway-issues)
- [Email & Notification Issues](#email--notification-issues)
- [Debug Tools](#debug-tools)

---

## 🚨 Common Issues

### 1. Application Won't Start

#### Symptoms
- `npm run dev` fails
- Port already in use error
- Module not found errors

#### Solutions

```bash
# Solution 1: Clear everything and reinstall
rm -rf node_modules package-lock.json .next
npm install
npm run dev

# Solution 2: Check port usage
lsof -i :3030
# Kill the process using the port
kill -9 <PID>

# Solution 3: Check Node version
node --version  # Should be 18+ 
nvm use 18     # If using nvm

# Solution 4: Check environment variables
cat .env.local  # Ensure all required vars are set
```

### 2. TypeScript Errors

#### Symptoms
- Red underlines in VS Code
- Build fails with TS errors

#### Solutions

```bash
# Solution 1: Regenerate types
npx prisma generate
npm run build

# Solution 2: Clear TypeScript cache
rm -rf .next
npx tsc --noEmit

# Solution 3: Check tsconfig.json
# Ensure paths are correct
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

# Solution 4: Update TypeScript
npm install typescript@latest @types/react@latest @types/node@latest
```

### 3. Module Not Found

#### Symptoms
```
Error: Cannot find module 'xxx'
Module not found: Can't resolve 'xxx'
```

#### Solutions

```bash
# Solution 1: Install missing module
npm install <module-name>

# Solution 2: Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Solution 3: Check import paths
# Wrong: import Button from '../../components/ui/button'
# Right: import Button from '@/components/ui/button'

# Solution 4: Check case sensitivity (Linux/Mac)
# File: Button.tsx
# Wrong: import Button from './button'
# Right: import Button from './Button'
```

---

## 🏗️ Build & Deployment Issues

### 1. Build Fails on Vercel

#### Symptoms
- Vercel deployment fails
- Build timeout
- Out of memory errors

#### Solutions

```bash
# Solution 1: Increase memory for build
# In package.json:
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}

# Solution 2: Check build command
# Vercel settings should have:
Build Command: prisma generate && next build
Install Command: npm install

# Solution 3: Clear Vercel cache
# In Vercel dashboard: Settings > Advanced > Clear Build Cache

# Solution 4: Check environment variables
# Ensure all env vars are added in Vercel dashboard
```

### 2. Static Export Issues

#### Symptoms
- `next export` fails
- Dynamic routes not working

#### Solutions

```javascript
// Solution 1: Remove dynamic imports for static export
// Wrong for static:
export async function getServerSideProps() { }

// Right for static:
export async function getStaticProps() { }
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

// Solution 2: Update next.config.js
module.exports = {
  output: 'export', // Only for full static
  trailingSlash: true,
  images: {
    unoptimized: true // For static export
  }
}
```

### 3. Image Optimization Issues

#### Symptoms
- Images not loading
- Next/image errors

#### Solutions

```javascript
// Solution 1: Configure domains
// next.config.js
module.exports = {
  images: {
    domains: ['localhost', 'your-domain.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
      }
    ]
  }
}

// Solution 2: Use unoptimized for external images
<Image
  src={url}
  alt="..."
  width={100}
  height={100}
  unoptimized
/>

// Solution 3: Fix image paths
// Wrong: src="/public/images/logo.png"
// Right: src="/images/logo.png"
```

---

## 💾 Database Issues

### 1. Cannot Connect to Database

#### Symptoms
```
Error: Can't reach database server
P1001: Can't connect to database
```

#### Solutions

```bash
# Solution 1: Check DATABASE_URL format
# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"

# Prisma Accelerate
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=xxx"

# Solution 2: Test connection
npx prisma db pull

# Solution 3: Check PostgreSQL service
sudo systemctl status postgresql
sudo systemctl start postgresql

# Solution 4: Check firewall
sudo ufw allow 5432/tcp

# Solution 5: SSL issues
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

### 2. Prisma Client Issues

#### Symptoms
```
Error: @prisma/client did not initialize yet
Cannot find module '.prisma/client'
```

#### Solutions

```bash
# Solution 1: Generate Prisma Client
npx prisma generate

# Solution 2: Clear Prisma cache
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma
npm install
npx prisma generate

# Solution 3: Add postinstall script
# package.json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}

# Solution 4: Check schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "./node_modules/.prisma/client"
}
```

### 3. Migration Issues

#### Symptoms
- Migration failed
- Database drift detected
- Schema out of sync

#### Solutions

```bash
# Solution 1: Reset migrations (DEVELOPMENT ONLY!)
npx prisma migrate reset

# Solution 2: Resolve failed migration
npx prisma migrate resolve --rolled-back "20240101_failed_migration"

# Solution 3: Force sync (CAUTION: May lose data)
npx prisma db push --force-reset

# Solution 4: Create baseline
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel ./prisma/schema.prisma \
  --script > baseline.sql
```

---

## 🔐 Authentication Issues

### 1. Cannot Login

#### Symptoms
- Login fails with correct credentials
- Session not persisting
- Unauthorized errors

#### Solutions

```bash
# Solution 1: Check NEXTAUTH_SECRET
# Generate new secret:
openssl rand -base64 32

# Add to .env.local:
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3030"

# Solution 2: Clear browser cookies
# In browser DevTools > Application > Cookies > Clear

# Solution 3: Check user in database
npx prisma studio
# Verify user exists and password is hashed

# Solution 4: Reset password
# Run in Prisma Studio or create script:
UPDATE "User" SET password = '$2a$10$...' WHERE username = 'admin';
```

### 2. 2FA Issues

#### Symptoms
- QR code not generating
- TOTP code not working
- Backup codes lost

#### Solutions

```javascript
// Solution 1: Disable 2FA for user
await prisma.user.update({
  where: { id: userId },
  data: {
    twoFactorEnabled: false,
    twoFactorSecret: null
  }
})

// Solution 2: Time sync issues
// Ensure server time is correct:
date
# Sync time:
sudo ntpdate -s time.nist.gov

// Solution 3: Generate new backup codes
const backupCodes = Array.from({ length: 10 }, () => 
  Math.random().toString(36).substring(2, 8).toUpperCase()
)
```

---

## ⚡ Performance Issues

### 1. Slow Page Load

#### Symptoms
- Pages take long to load
- High TTFB (Time to First Byte)
- Slow API responses

#### Solutions

```javascript
// Solution 1: Enable caching
// pages/api/students.js
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate')
  // ...
}

// Solution 2: Optimize database queries
// Wrong: N+1 problem
const students = await prisma.student.findMany()
for (const student of students) {
  student.bills = await prisma.bill.findMany({ where: { studentId: student.id }})
}

// Right: Use include
const students = await prisma.student.findMany({
  include: { bills: true }
})

// Solution 3: Add database indexes
// schema.prisma
model Student {
  @@index([nisn])
  @@index([institutionLevel, grade])
}

// Solution 4: Use pagination
const students = await prisma.student.findMany({
  take: 10,
  skip: page * 10
})
```

### 2. High Memory Usage

#### Symptoms
- Application crashes
- Out of memory errors
- Slow response times

#### Solutions

```bash
# Solution 1: Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm start

# Solution 2: Check for memory leaks
npm install clinic -g
clinic doctor -- node server.js

# Solution 3: Optimize imports
// Wrong: Import entire library
import * as _ from 'lodash'

// Right: Import only what you need
import debounce from 'lodash/debounce'

# Solution 4: Use streaming for large data
// Instead of loading all data:
const allStudents = await prisma.student.findMany()

// Stream data:
for await (const student of prisma.student.findMany().stream()) {
  // Process one at a time
}
```

---

## 💳 Payment Gateway Issues

### 1. Midtrans Not Working

#### Symptoms
- Payment page not loading
- Transaction failing
- Webhook not received

#### Solutions

```javascript
// Solution 1: Check credentials
MIDTRANS_SERVER_KEY="SB-Mid-server-xxx" // Sandbox
MIDTRANS_CLIENT_KEY="SB-Mid-client-xxx"  // Sandbox
MIDTRANS_IS_PRODUCTION="false"

// Solution 2: Whitelist IP
// In Midtrans dashboard: Settings > Configuration > Webhook URL
// Add your server IP

// Solution 3: Test webhook locally
// Use ngrok for local testing:
ngrok http 3030
// Add ngrok URL to Midtrans webhook settings

// Solution 4: Check CORS
// pages/api/payment/create.js
res.setHeader('Access-Control-Allow-Origin', '*')
res.setHeader('Access-Control-Allow-Methods', 'POST')
```

### 2. Payment Status Not Updating

#### Symptoms
- Payment successful but status still pending
- Webhook received but not processed

#### Solutions

```javascript
// Solution 1: Verify webhook signature
import crypto from 'crypto'

function verifySignature(body, signature) {
  const hash = crypto
    .createHash('sha512')
    .update(body + MIDTRANS_SERVER_KEY)
    .digest('hex')
  return hash === signature
}

// Solution 2: Handle webhook properly
export default async function webhook(req, res) {
  const { order_id, transaction_status } = req.body
  
  if (transaction_status === 'settlement') {
    await prisma.payment.update({
      where: { orderId: order_id },
      data: { status: 'PAID' }
    })
  }
  
  res.status(200).json({ status: 'ok' })
}

// Solution 3: Manual status check
const status = await fetch(`https://api.midtrans.com/v2/${orderId}/status`, {
  headers: {
    'Authorization': 'Basic ' + Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64')
  }
})
```

---

## 📧 Email & Notification Issues

### 1. Emails Not Sending

#### Symptoms
- No emails received
- SMTP errors
- Timeout errors

#### Solutions

```javascript
// Solution 1: Check SMTP settings
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"           // TLS
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="app-password"  // Not regular password!

// Solution 2: Enable less secure apps (Gmail)
// Go to: https://myaccount.google.com/apppasswords
// Generate app-specific password

// Solution 3: Test email manually
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

await transporter.sendMail({
  from: 'test@example.com',
  to: 'recipient@example.com',
  subject: 'Test',
  text: 'Test email'
})

// Solution 4: Use email service
// SendGrid, Mailgun, AWS SES, etc.
```

### 2. WhatsApp Not Sending

#### Symptoms
- WhatsApp messages not delivered
- API errors
- Invalid token

#### Solutions

```bash
# Solution 1: Verify WhatsApp Business API setup
# Check token expiry
# Regenerate token in Meta Business Suite

# Solution 2: Test API manually
curl -X POST https://graph.facebook.com/v17.0/PHONE_NUMBER_ID/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "628123456789",
    "type": "text",
    "text": {"body": "Test message"}
  }'

# Solution 3: Check phone number format
// Must include country code without +
// Wrong: 081234567890 or +6281234567890
// Right: 6281234567890

# Solution 4: Template message issues
// Ensure template is approved in Meta Business
```

---

## 🛠️ Debug Tools

### 1. Enable Debug Mode

```javascript
// .env.local
DEBUG=true
NODE_ENV=development

// In your code
if (process.env.DEBUG) {
  console.log('Debug info:', data)
}
```

### 2. Prisma Debug

```bash
# Enable Prisma debug logs
DEBUG="prisma:*" npm run dev

# Or specific logs
DEBUG="prisma:client" npm run dev
DEBUG="prisma:engine" npm run dev

# In code
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
})
```

### 3. Next.js Debug

```javascript
// next.config.js
module.exports = {
  reactStrictMode: true,
  // Enable build profiling
  experimental: {
    profilingRenderer: true,
  },
  // Add webpack analysis
  webpack: (config, { isServer }) => {
    if (process.env.ANALYZE) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(new BundleAnalyzerPlugin())
    }
    return config
  }
}

// Run analysis
ANALYZE=true npm run build
```

### 4. Browser DevTools

```javascript
// Add debug points
console.time('fetchData')
const data = await fetchData()
console.timeEnd('fetchData')

// Track renders
useEffect(() => {
  console.count('Component rendered')
})

// Debug network
// Chrome DevTools > Network > Slow 3G
// Test slow connections

// Memory profiling
// Chrome DevTools > Memory > Heap Snapshot
```

### 5. Logging Service

```javascript
// Setup logging (e.g., winston)
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console())
}

// Use in code
logger.error('Error occurred', error)
logger.info('User logged in', { userId })
```

---

## 📊 Monitoring

### 1. Health Check Endpoint

```javascript
// pages/api/health.js
export default async function handler(req, res) {
  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`
    
    // Check Redis (if used)
    // await redis.ping()
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage()
    })
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    })
  }
}
```

### 2. Error Tracking (Sentry)

```javascript
// Install: npm install @sentry/nextjs

// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV
})

// Capture errors
try {
  // Your code
} catch (error) {
  Sentry.captureException(error)
  throw error
}
```

---

## 🆘 Getting Help

### 1. Gather Information

```bash
# System info
npx envinfo --system --binaries --npmPackages

# Create error report
npm run build 2>&1 | tee build-error.log

# Check logs
pm2 logs
journalctl -u nginx
```

### 2. Where to Get Help

- GitHub Issues: [Create issue](https://github.com/pendtiumpraz/pesantren-coconut/issues)
- Stack Overflow: Tag with `nextjs`, `prisma`, `typescript`
- Discord: Next.js Discord server
- Documentation:
  - [Next.js Docs](https://nextjs.org/docs)
  - [Prisma Docs](https://prisma.io/docs)
  - [TypeScript Docs](https://typescriptlang.org/docs)

### 3. Reporting Bugs

Include:
1. Error message (full)
2. Steps to reproduce
3. Environment (OS, Node version)
4. Configuration files
5. Relevant code snippets
6. What you've tried

---

## 📝 Maintenance Checklist

### Daily
- [ ] Check application health endpoint
- [ ] Monitor error logs
- [ ] Check disk space
- [ ] Verify backups

### Weekly
- [ ] Update dependencies
- [ ] Run security audit
- [ ] Check performance metrics
- [ ] Review error reports

### Monthly
- [ ] Full backup test
- [ ] Security patches
- [ ] Database optimization
- [ ] Clean old logs

---

**Remember**: Always backup before making changes!