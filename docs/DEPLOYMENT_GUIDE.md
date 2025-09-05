# 🚀 Deployment Guide - Pondok Imam Syafi'i System

## Table of Contents
1. [Vercel Deployment](#vercel-deployment)
2. [VPS Deployment](#vps-deployment)
3. [Docker Deployment](#docker-deployment)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [Post-Deployment](#post-deployment)

---

## 🔷 Vercel Deployment (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Domain name (optional)

### Step 1: Prepare Repository
```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: prisma generate && next build
   Output Directory: .next
   Install Command: npm install
   ```

### Step 3: Environment Variables

Add these in Vercel Dashboard > Settings > Environment Variables:

```env
# Database (Use Prisma Accelerate or Supabase)
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_KEY"
DIRECT_DATABASE_URL="postgresql://user:pass@host:5432/db"

# NextAuth
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="generate-32-char-secret"

# Email
EMAIL_FROM="noreply@your-domain.com"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="app-specific-password"

# WhatsApp (Optional)
WHATSAPP_API_URL="https://graph.facebook.com/v17.0"
WHATSAPP_ACCESS_TOKEN="your-token"
WHATSAPP_PHONE_NUMBER_ID="your-number-id"

# Midtrans Payment
MIDTRANS_SERVER_KEY="SB-Mid-server-xxx"
MIDTRANS_CLIENT_KEY="SB-Mid-client-xxx"
MIDTRANS_IS_PRODUCTION="false"

# Twilio SMS (Optional)
TWILIO_ACCOUNT_SID="ACxxx"
TWILIO_AUTH_TOKEN="xxx"
TWILIO_PHONE_NUMBER="+1234567890"
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (3-5 minutes)
3. Access your app at: `https://your-project.vercel.app`

### Step 5: Custom Domain (Optional)

1. Go to Settings > Domains
2. Add your domain: `imam-syafii-blitar.sch.id`
3. Update DNS records:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Vercel Features
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Auto-scaling
- ✅ Preview deployments
- ✅ Analytics included
- ✅ Serverless functions

---

## 🖥️ VPS Deployment (Full Control)

### Prerequisites
- VPS with Ubuntu 22.04 LTS
- Minimum 2GB RAM, 2 CPU cores
- Domain name with DNS access
- SSH access to server

### Step 1: Server Setup

```bash
# Connect to VPS
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx
apt install -y nginx

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Git
apt install -y git

# Install Certbot for SSL
apt install -y certbot python3-certbot-nginx
```

### Step 2: Setup PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE imam_syafii_db;
CREATE USER imam_syafii_user WITH ENCRYPTED PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE imam_syafii_db TO imam_syafii_user;
\q

# Enable remote connections (if needed)
nano /etc/postgresql/14/main/postgresql.conf
# Add: listen_addresses = '*'

nano /etc/postgresql/14/main/pg_hba.conf
# Add: host all all 0.0.0.0/0 md5

# Restart PostgreSQL
systemctl restart postgresql
```

### Step 3: Clone and Setup Application

```bash
# Create app directory
mkdir -p /var/www
cd /var/www

# Clone repository
git clone https://github.com/pendtiumpraz/imam-syafii-blitar.git
cd imam-syafii-blitar

# Install dependencies
npm install

# Create .env file
nano .env

# Add environment variables
DATABASE_URL="postgresql://imam_syafii_user:strong_password@localhost:5432/imam_syafii_db"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-32-char-secret"
# ... add other variables

# Setup database
npx prisma generate
npx prisma db push
npx prisma db seed

# Build application
npm run build
```

### Step 4: Configure PM2

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'imam-syafii',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/imam-syafii-blitar',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3030
    },
    error_file: '/var/log/pm2/imam-syafii-error.log',
    out_file: '/var/log/pm2/imam-syafii-out.log',
    log_file: '/var/log/pm2/imam-syafii-combined.log',
    time: true
  }]
};
```

Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 5: Configure Nginx

```bash
nano /etc/nginx/sites-available/imam-syafii
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    location / {
        proxy_pass http://localhost:3030;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    client_max_body_size 50M;
    
    location /_next/static {
        alias /var/www/imam-syafii-blitar/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
    
    location /public {
        alias /var/www/imam-syafii-blitar/public;
        expires 30d;
        add_header Cache-Control "public";
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/imam-syafii /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### Step 6: Setup SSL

```bash
certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Step 7: Setup Firewall

```bash
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

### Step 8: Monitoring & Maintenance

```bash
# View logs
pm2 logs imam-syafii

# Monitor resources
pm2 monit

# Restart app
pm2 restart imam-syafii

# Update app
cd /var/www/imam-syafii-blitar
git pull
npm install
npm run build
pm2 restart imam-syafii
```

---

## 🐳 Docker Deployment

### Step 1: Create Dockerfile

```dockerfile
# Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production
RUN npm install prisma

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3030
ENV PORT 3030

CMD ["node", "server.js"]
```

### Step 2: Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3030:3030"
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/imam_syafii
      NEXTAUTH_URL: http://localhost:3030
      NEXTAUTH_SECRET: your-secret-here
    depends_on:
      - db
      - redis
    restart: unless-stopped
    networks:
      - imam-syafii-network

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: imam_syafii
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - imam-syafii-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - imam-syafii-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - imam-syafii-network

volumes:
  postgres_data:
  redis_data:

networks:
  imam-syafii-network:
    driver: bridge
```

### Step 3: Build and Run

```bash
# Build containers
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove everything
docker-compose down -v
```

### Step 4: Database Migration

```bash
# Run migrations
docker-compose exec app npx prisma db push

# Seed database
docker-compose exec app npx prisma db seed

# Access database
docker-compose exec db psql -U postgres -d imam_syafii
```

### Step 5: Scaling

```bash
# Scale app instances
docker-compose up -d --scale app=3

# With Docker Swarm
docker swarm init
docker stack deploy -c docker-compose.yml imam-syafii
```

---

## 💾 Database Setup

### Option 1: Prisma Accelerate (Recommended for Vercel)

1. Sign up at [console.prisma.io](https://console.prisma.io)
2. Create new project
3. Get connection string
4. Add to environment variables

### Option 2: Supabase (Free PostgreSQL)

1. Sign up at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection strings from Settings > Database
4. Use pooling connection for DATABASE_URL
5. Use direct connection for migrations

### Option 3: Self-hosted PostgreSQL

See VPS deployment section above

### Option 4: Managed PostgreSQL

- DigitalOcean Managed Database
- AWS RDS
- Google Cloud SQL
- Azure Database

---

## 🔧 Environment Configuration

### Production Checklist

```env
# Security
NEXTAUTH_SECRET=           # 32+ characters, unique
NODE_ENV=production       # Always set in production

# Database
DATABASE_URL=             # Use connection pooling
DIRECT_DATABASE_URL=      # Direct connection for migrations

# Email
EMAIL_FROM=               # Valid sender email
EMAIL_HOST=               # SMTP server
EMAIL_PORT=587           # Usually 587 for TLS
EMAIL_USER=              # SMTP username
EMAIL_PASSWORD=          # App-specific password

# Payment
MIDTRANS_IS_PRODUCTION=true  # Set to true for production
MIDTRANS_SERVER_KEY=         # Production server key
MIDTRANS_CLIENT_KEY=         # Production client key

# Optional Services
REDIS_URL=                   # For caching
SENTRY_DSN=                 # Error tracking
ANALYTICS_ID=               # Google Analytics
```

### Security Best Practices

1. **Use strong secrets**
   ```bash
   openssl rand -base64 32
   ```

2. **Rotate secrets regularly**
3. **Use environment-specific configs**
4. **Enable HTTPS everywhere**
5. **Set security headers**
6. **Enable rate limiting**
7. **Use WAF if possible**

---

## 📋 Post-Deployment

### 1. Initial Setup

```bash
# Run database migrations
npx prisma db push

# Seed initial data
npx prisma db seed

# Create admin account
npm run create-admin
```

### 2. Health Checks

Add health check endpoint:
```javascript
// pages/api/health.js
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
}
```

### 3. Monitoring

Setup monitoring with:
- Uptime monitoring: UptimeRobot, Pingdom
- Error tracking: Sentry
- Analytics: Google Analytics, Vercel Analytics
- Logs: LogRocket, Datadog

### 4. Backup Strategy

```bash
# Daily database backup
0 2 * * * pg_dump imam_syafii_db > /backups/db-$(date +\%Y\%m\%d).sql

# Weekly full backup
0 3 * * 0 tar -czf /backups/full-$(date +\%Y\%m\%d).tar.gz /var/www/imam-syafii-blitar
```

### 5. Update Process

```bash
# 1. Backup current version
pm2 stop imam-syafii
cp -r /var/www/imam-syafii-blitar /var/www/backup-$(date +\%Y\%m\%d)

# 2. Pull updates
cd /var/www/imam-syafii-blitar
git pull

# 3. Install dependencies
npm install

# 4. Run migrations
npx prisma db push

# 5. Build
npm run build

# 6. Restart
pm2 restart imam-syafii
```

### 6. Performance Optimization

1. **Enable caching**
   - Browser caching via headers
   - CDN for static assets
   - Redis for API caching

2. **Optimize images**
   - Use WebP format
   - Implement lazy loading
   - Use responsive images

3. **Database optimization**
   - Add indexes
   - Use connection pooling
   - Regular VACUUM

4. **Code optimization**
   - Enable gzip compression
   - Minify JS/CSS
   - Remove unused dependencies

---

## 🆘 Troubleshooting

### Common Issues

1. **Build fails**
   ```bash
   # Clear cache
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **Database connection error**
   - Check DATABASE_URL format
   - Verify network connectivity
   - Check firewall rules

3. **Memory issues**
   ```bash
   # Increase Node memory
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

4. **Port already in use**
   ```bash
   # Find and kill process
   lsof -i :3030
   kill -9 <PID>
   ```

---

## 📞 Support

- Documentation: [/docs](https://your-domain.com/docs)
- GitHub Issues: [Report bugs](https://github.com/pendtiumpraz/imam-syafii-blitar/issues)
- Email: admin@imam-syafii-blitar.sch.id