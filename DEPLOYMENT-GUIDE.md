# Deployment Guide - Pondok Imam Syafi'i Blitar Application

## Overview
This document provides comprehensive instructions for deploying the Pondok Imam Syafi'i Blitar management application to GitHub Pages and other hosting platforms.

## Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager
- Git for version control
- GitHub account

### Local Development Setup
```bash
# Clone the repository
git clone https://github.com/[username]/pondok-imam-syafii-blitar.git
cd pondok-imam-syafii-blitar

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Set up database
npx prisma db push

# Start development server
npm run dev
```

## Deployment to GitHub Pages

### 1. Repository Setup

#### Create GitHub Repository
```bash
# Create repository on GitHub
gh repo create pondok-imam-syafii-blitar --public

# Push existing code
git remote add origin https://github.com/[username]/pondok-imam-syafii-blitar.git
git branch -M main
git push -u origin main
```

#### Enable GitHub Pages
1. Go to repository Settings → Pages
2. Select "GitHub Actions" as source
3. Save configuration

### 2. Environment Configuration

#### GitHub Secrets
Add these secrets in Repository Settings → Secrets and Variables → Actions:

```
NEXTAUTH_SECRET=your-secret-key-here
DATABASE_URL=file:./production.db
NETLIFY_AUTH_TOKEN=optional-for-preview-deploys
NETLIFY_SITE_ID=optional-for-preview-deploys
SNYK_TOKEN=optional-for-security-scanning
LHCI_GITHUB_APP_TOKEN=optional-for-lighthouse-ci
```

#### Generate NextAuth Secret
```bash
# Generate secure secret
openssl rand -base64 32
```

### 3. Automatic Deployment

The application is configured for automatic deployment via GitHub Actions:

- **Push to `main` branch**: Triggers production deployment
- **Pull requests**: Creates preview deployments
- **All pushes**: Run full test suite

#### Deployment Workflow
1. Code pushed to repository
2. Automated tests run (unit, integration, E2E)
3. Security scans performed
4. Performance tests executed
5. Application built and optimized
6. Deployed to GitHub Pages

### 4. Custom Domain (Optional)

#### Setup Custom Domain
1. Add `CNAME` file to `public/` directory:
   ```
   your-domain.com
   ```

2. Configure DNS records:
   ```
   Type: CNAME
   Name: www
   Value: [username].github.io
   ```

3. Enable HTTPS in repository settings

## Alternative Deployment Options

### Netlify Deployment

#### Manual Deployment
1. Build the application:
   ```bash
   npm run build
   npm run export
   ```

2. Deploy `out/` directory to Netlify

#### Automatic Deployment
1. Connect GitHub repository to Netlify
2. Set build command: `npm run build && npm run export`
3. Set publish directory: `out`
4. Add environment variables

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Traditional Web Hosting

#### Shared Hosting Setup
1. Build the application:
   ```bash
   npm run build
   npm run export
   ```

2. Upload `out/` directory contents to web root
3. Configure server for SPA routing (if needed)

#### Apache Configuration
Create `.htaccess` file:
```apache
RewriteEngine On
RewriteBase /

# Handle Angular and other client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Enable Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/javascript application/json;
    gzip_min_length 1000;
}
```

## Database Management

### Production Database Setup

For production deployments, consider these database options:

#### SQLite (Static Hosting)
- Suitable for read-only or small-scale applications
- Database included in deployment bundle
- Limited concurrent access

#### PostgreSQL (Recommended)
```bash
# Update DATABASE_URL for PostgreSQL
DATABASE_URL="postgresql://user:password@host:port/database"

# Run migrations
npx prisma db push
```

#### MySQL/MariaDB
```bash
# Update DATABASE_URL for MySQL
DATABASE_URL="mysql://user:password@host:port/database"

# Run migrations
npx prisma db push
```

### Data Migration
```bash
# Export development data
npx prisma db seed

# Backup production data
pg_dump -h host -U user database_name > backup.sql

# Restore data
psql -h host -U user database_name < backup.sql
```

## Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
npm run build
npm run analyze

# Optimize images
npm install sharp
npm run optimize-images
```

### CDN Configuration
Add to `next.config.js`:
```javascript
module.exports = {
  images: {
    domains: ['your-cdn-domain.com'],
    loader: 'custom',
  },
  assetPrefix: 'https://your-cdn-domain.com',
}
```

### Service Worker Caching
The application includes automatic service worker generation for:
- Static assets caching
- API response caching
- Offline functionality
- Background sync

## Monitoring and Maintenance

### Error Tracking
Integrate with error tracking service:
```javascript
// Add to _app.tsx
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
})
```

### Analytics
Add analytics tracking:
```javascript
// Google Analytics 4
import { gtag } from 'ga-gtag'

gtag('config', process.env.NEXT_PUBLIC_GA_ID)
```

### Performance Monitoring
- Lighthouse CI runs automatically on deployments
- Core Web Vitals tracking included
- Bundle size monitoring

### Backup Procedures

#### Automated Backups
```bash
#!/bin/bash
# backup-script.sh

DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backups/backup_$DATE.sql

# Keep only last 30 days
find backups/ -name "backup_*.sql" -mtime +30 -delete

# Upload to cloud storage (optional)
aws s3 cp backups/backup_$DATE.sql s3://your-backup-bucket/
```

#### Manual Backup
```bash
# Database backup
npx prisma db pull
npx prisma migrate dev --name backup-$(date +%Y%m%d)

# File backup
tar -czf backup-$(date +%Y%m%d).tar.gz .
```

## Security Considerations

### HTTPS Configuration
- Ensure HTTPS is enabled on all deployments
- Use HSTS headers
- Configure secure cookies

### Environment Variables
- Never commit secrets to repository
- Use GitHub Secrets or hosting platform env vars
- Rotate secrets regularly

### Content Security Policy
Add to `next.config.js`:
```javascript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob:;
    `.replace(/\s{2,}/g, ' ').trim()
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
```

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

#### Database Connection Issues
```bash
# Test database connection
npx prisma db pull

# Reset database
npx prisma migrate reset
```

#### Service Worker Issues
```bash
# Clear service worker cache
# In browser dev tools: Application → Storage → Clear Storage
```

#### Memory Issues
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run build

# Check specific components
DEBUG=next:* npm run dev
```

### Performance Issues
```bash
# Profile build
npm run build -- --profile

# Analyze bundle
npm run analyze

# Check Core Web Vitals
npm run lighthouse
```

## Support and Updates

### Updating Dependencies
```bash
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm install package@latest
```

### Version Management
```bash
# Tag releases
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Create release on GitHub
gh release create v1.0.0 --title "v1.0.0" --notes "Release notes"
```

### Contributing
1. Fork the repository
2. Create feature branch
3. Run tests: `npm run test:all`
4. Submit pull request
5. Automated deployment to preview environment

## Production Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Security scan completed
- [ ] Performance benchmarks met
- [ ] Database migrations ready
- [ ] Environment variables configured
- [ ] Domain and SSL setup
- [ ] Backup procedures tested

### Post-deployment
- [ ] Application loads correctly
- [ ] All features functional
- [ ] Database connectivity verified
- [ ] Performance monitoring active
- [ ] Error tracking operational
- [ ] SSL certificate valid
- [ ] CDN configured (if applicable)

### Monitoring Setup
- [ ] Uptime monitoring
- [ ] Performance tracking
- [ ] Error alerting
- [ ] Usage analytics
- [ ] Security monitoring

This deployment guide ensures the Pondok Imam Syafi'i Blitar application can be successfully deployed to various hosting platforms with proper configuration, monitoring, and maintenance procedures.