'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Server, 
  Copy, 
  Check, 
  Terminal,
  Globe,
  Shield,
  Database,
  Settings,
  GitBranch,
  AlertCircle,
  CheckCircle2,
  Info,
  Lock,
  Monitor,
  HardDrive,
  Cpu,
  Cloud,
  DollarSign,
  Package,
  RefreshCw,
  Zap,
  FileText,
  Key,
  Users,
  ArrowRight
} from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';

export default function VPSDeploymentPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState('digitalocean');
  const [osType, setOsType] = useState('ubuntu');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const CodeBlock = ({ code, id, language = 'bash' }: { code: string; id: string; language?: string }) => (
    <div className="relative bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto group">
      <button
        onClick={() => handleCopy(code, id)}
        className="absolute top-2 right-2 p-2 bg-gray-800 rounded hover:bg-gray-700 transition opacity-0 group-hover:opacity-100"
      >
        {copiedId === id ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
      </button>
      <pre className="text-sm font-mono">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );

  const providers = {
    digitalocean: { name: 'DigitalOcean', color: 'bg-blue-500' },
    aws: { name: 'AWS EC2', color: 'bg-orange-500' },
    linode: { name: 'Linode', color: 'bg-green-500' },
    vultr: { name: 'Vultr', color: 'bg-indigo-500' }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
          <div className="container mx-auto px-6">
            <Link
              href="/docs"
              className="inline-flex items-center text-blue-100 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Docs
            </Link>
            <div className="flex items-center mb-4">
              <Server className="h-12 w-12 mr-4" />
              <h1 className="text-4xl font-bold">VPS Deployment Guide</h1>
            </div>
            <p className="text-xl text-blue-100">
              Deploy Pondok Imam Syafi\'i system to your own Virtual Private Server
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* VPS Requirements */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Cpu className="h-8 w-8 text-blue-600 mr-3" />
              VPS Requirements
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">Minimum Specifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">CPU</span>
                    <span className="text-gray-600">2 vCPU cores</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">RAM</span>
                    <span className="text-gray-600">4 GB</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Storage</span>
                    <span className="text-gray-600">40 GB SSD</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Bandwidth</span>
                    <span className="text-gray-600">2 TB/month</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">OS</span>
                    <span className="text-gray-600">Ubuntu 22.04 LTS</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-4">Recommended Specifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">CPU</span>
                    <span className="text-green-600 font-semibold">4 vCPU cores</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">RAM</span>
                    <span className="text-green-600 font-semibold">8 GB</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Storage</span>
                    <span className="text-green-600 font-semibold">80 GB NVMe SSD</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Bandwidth</span>
                    <span className="text-green-600 font-semibold">5 TB/month</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">OS</span>
                    <span className="text-green-600 font-semibold">Ubuntu 22.04 LTS</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-800">Estimated Monthly Cost:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">DigitalOcean:</span>
                  <span className="text-blue-600 ml-1">$20-40/mo</span>
                </div>
                <div>
                  <span className="font-medium">Linode:</span>
                  <span className="text-blue-600 ml-1">$20-40/mo</span>
                </div>
                <div>
                  <span className="font-medium">Vultr:</span>
                  <span className="text-blue-600 ml-1">$20-40/mo</span>
                </div>
                <div>
                  <span className="font-medium">AWS EC2:</span>
                  <span className="text-blue-600 ml-1">$25-50/mo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Provider Selection */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Choose VPS Provider</h2>
            
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              {Object.entries(providers).map(([key, provider]) => (
                <button
                  key={key}
                  onClick={() => setActiveProvider(key)}
                  className={`p-4 rounded-lg border-2 transition ${
                    activeProvider === key
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`h-3 w-full ${provider.color} rounded mb-2`} />
                  <span className="font-semibold">{provider.name}</span>
                </button>
              ))}
            </div>

            {activeProvider === 'digitalocean' && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">Quick Start with DigitalOcean:</h4>
                <ol className="space-y-2 text-sm">
                  <li>1. Sign up and get $200 free credit: <a href="https://m.do.co/c/your-referral" className="text-blue-600 underline">Get Started</a></li>
                  <li>2. Create a Droplet with Ubuntu 22.04 LTS</li>
                  <li>3. Choose at least 4GB RAM plan</li>
                  <li>4. Add SSH key for secure access</li>
                </ol>
              </div>
            )}
          </div>

          {/* Step-by-Step Deployment */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Terminal className="h-8 w-8 text-gray-600 mr-3" />
              Step-by-Step Deployment
            </h2>

            {/* Step 1: Initial Server Setup */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Step 1: Initial Server Setup</h3>
              
              <div className="space-y-4">
                <p className="text-gray-600">Connect to your server via SSH:</p>
                <CodeBlock
                  code="ssh root@your-server-ip"
                  id="ssh-connect"
                />
                
                <p className="text-gray-600">Update system packages:</p>
                <CodeBlock
                  code={`# Update package list
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git vim ufw fail2ban`}
                  id="update-packages"
                />

                <p className="text-gray-600">Create a new user for deployment:</p>
                <CodeBlock
                  code={`# Create user
sudo adduser deploy

# Add to sudo group
sudo usermod -aG sudo deploy

# Switch to new user
su - deploy`}
                  id="create-user"
                />
              </div>
            </div>

            {/* Step 2: Install Node.js */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Step 2: Install Node.js and PM2</h3>
              
              <CodeBlock
                code={`# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 globally
sudo npm install -g pm2

# Setup PM2 to start on boot
pm2 startup systemd
# Follow the command it outputs`}
                id="install-node"
              />
            </div>

            {/* Step 3: Install PostgreSQL */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Step 3: Install PostgreSQL</h3>
              
              <CodeBlock
                code={`# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE USER pondok_user WITH PASSWORD 'your-secure-password';
CREATE DATABASE imam_syafii_db OWNER pondok_user;
GRANT ALL PRIVILEGES ON DATABASE imam_syafii_db TO pondok_user;
EOF`}
                id="install-postgres"
              />
            </div>

            {/* Step 4: Install Nginx */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Step 4: Install and Configure Nginx</h3>
              
              <CodeBlock
                code={`# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Remove default site
sudo rm /etc/nginx/sites-enabled/default`}
                id="install-nginx"
              />

              <p className="text-gray-600 mt-4">Create Nginx configuration:</p>
              <CodeBlock
                code={`sudo nano /etc/nginx/sites-available/pondok-imam-syafii

# Add this configuration:
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
    
    # File upload size
    client_max_body_size 10M;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml application/atom+xml image/svg+xml text/javascript application/x-javascript application/x-font-ttf application/vnd.ms-fontobject font/opentype;
}`}
                id="nginx-config"
                language="nginx"
              />

              <p className="text-gray-600 mt-4">Enable the site:</p>
              <CodeBlock
                code={`# Create symbolic link
sudo ln -s /etc/nginx/sites-available/pondok-imam-syafii /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx`}
                id="enable-site"
              />
            </div>

            {/* Step 5: Clone and Setup Application */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Step 5: Deploy Application</h3>
              
              <CodeBlock
                code={`# Navigate to home directory
cd ~

# Clone repository
git clone https://github.com/pendtiumpraz/pesantren-coconut.git
cd pesantren-coconut

# Install dependencies
npm install

# Copy and configure environment file
cp .env.example .env.production
nano .env.production`}
                id="clone-app"
              />

              <p className="text-gray-600 mt-4">Configure environment variables:</p>
              <CodeBlock
                code={`# Database
DATABASE_URL="postgresql://pondok_user:your-secure-password@localhost:5432/imam_syafii_db"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-32-character-secret"

# Email (optional)
EMAIL_FROM="noreply@your-domain.com"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"`}
                id="env-config"
                language="env"
              />

              <p className="text-gray-600 mt-4">Build and start application:</p>
              <CodeBlock
                code={`# Generate Prisma Client
npx prisma generate

# Push database schema
npx prisma db push

# Build application
npm run build

# Start with PM2
pm2 start npm --name "pondok-imam-syafii" -- start
pm2 save`}
                id="build-start"
              />
            </div>

            {/* Step 6: SSL Certificate */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Step 6: Setup SSL with Let\'s Encrypt</h3>
              
              <CodeBlock
                code={`# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run`}
                id="ssl-setup"
              />

              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-green-800">
                      <strong>SSL Configured!</strong> Certbot will automatically configure Nginx 
                      for HTTPS and set up auto-renewal.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 7: Security Setup */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Step 7: Security Configuration</h3>
              
              <CodeBlock
                code={`# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Configure Fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Add to [sshd] section:
enabled = true
maxretry = 3
bantime = 3600

# Restart Fail2ban
sudo systemctl restart fail2ban`}
                id="security-setup"
              />
            </div>
          </div>

          {/* Monitoring & Management */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Monitor className="h-8 w-8 text-purple-600 mr-3" />
              Monitoring & Management
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-3">PM2 Commands</h3>
                <CodeBlock
                  code={`# View application status
pm2 status

# View logs
pm2 logs pondok-imam-syafii

# Restart application
pm2 restart pondok-imam-syafii

# Stop application
pm2 stop pondok-imam-syafii

# Monitor resources
pm2 monit`}
                  id="pm2-commands"
                />
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3">System Monitoring</h3>
                <CodeBlock
                  code={`# Check system resources
htop

# Check disk usage
df -h

# Check memory usage
free -m

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Check PostgreSQL status
sudo systemctl status postgresql`}
                  id="system-monitoring"
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-bold text-lg mb-3">Setup Monitoring Dashboard (Optional)</h3>
              <CodeBlock
                code={`# Install Netdata for real-time monitoring
bash <(curl -Ss https://my-netdata.io/kickstart.sh)

# Access dashboard at http://your-server-ip:19999`}
                id="netdata-setup"
              />
            </div>
          </div>

          {/* Backup Strategy */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <RefreshCw className="h-8 w-8 text-green-600 mr-3" />
              Backup Strategy
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-3">Automated Database Backup</h3>
                <p className="text-gray-600 mb-3">Create backup script:</p>
                <CodeBlock
                  code={`nano ~/backup-database.sh

#!/bin/bash
BACKUP_DIR="/home/deploy/backups"
DB_NAME="imam_syafii_db"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Perform backup
pg_dump -U pondok_user -h localhost $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Delete backups older than 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql.gz"`}
                  id="backup-script"
                  language="bash"
                />

                <p className="text-gray-600 mt-4">Setup cron job:</p>
                <CodeBlock
                  code={`# Make script executable
chmod +x ~/backup-database.sh

# Add to crontab
crontab -e

# Add this line for daily backup at 2 AM
0 2 * * * /home/deploy/backup-database.sh`}
                  id="cron-setup"
                />
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3">Application Files Backup</h3>
                <CodeBlock
                  code={`# Backup uploads and important files
tar -czf backup_files_$(date +%Y%m%d).tar.gz \\
  ~/pesantren-coconut/public/uploads \\
  ~/pesantren-coconut/.env.production

# Sync to remote storage (optional)
rsync -avz ~/backups/ remote-backup-server:/backups/`}
                  id="files-backup"
                />
              </div>
            </div>
          </div>

          {/* Update & Maintenance */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Package className="h-8 w-8 text-orange-600 mr-3" />
              Update & Maintenance
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-3">Updating Application</h3>
                <CodeBlock
                  code={`# Navigate to application directory
cd ~/pesantren-coconut

# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Run database migrations
npx prisma migrate deploy

# Build application
npm run build

# Restart with PM2
pm2 restart pondok-imam-syafii`}
                  id="update-app"
                />
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3">System Maintenance</h3>
                <CodeBlock
                  code={`# Update system packages
sudo apt update && sudo apt upgrade -y

# Clean up old packages
sudo apt autoremove -y
sudo apt autoclean

# Update Node.js (if needed)
npm install -g n
sudo n latest

# Check disk space
df -h

# Clean npm cache
npm cache clean --force`}
                  id="system-maintenance"
                />
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600 mr-3" />
              Common Issues & Solutions
            </h2>

            <div className="space-y-6">
              <div className="border-l-4 border-orange-400 pl-4">
                <h3 className="font-semibold mb-2">502 Bad Gateway Error</h3>
                <p className="text-sm text-gray-600 mb-2">Application not running or wrong port:</p>
                <CodeBlock
                  code={`# Check if app is running
pm2 status

# Check logs for errors
pm2 logs pondok-imam-syafii --lines 50

# Restart application
pm2 restart pondok-imam-syafii`}
                  id="fix-502"
                />
              </div>

              <div className="border-l-4 border-orange-400 pl-4">
                <h3 className="font-semibold mb-2">Database Connection Error</h3>
                <p className="text-sm text-gray-600 mb-2">Check PostgreSQL and credentials:</p>
                <CodeBlock
                  code={`# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -U pondok_user -d imam_syafii_db -h localhost

# Check environment variables
cat .env.production | grep DATABASE_URL`}
                  id="fix-db"
                />
              </div>

              <div className="border-l-4 border-orange-400 pl-4">
                <h3 className="font-semibold mb-2">High Memory Usage</h3>
                <p className="text-sm text-gray-600 mb-2">Optimize Node.js memory:</p>
                <CodeBlock
                  code={`# Set memory limit in PM2
pm2 delete pondok-imam-syafii
pm2 start npm --name "pondok-imam-syafii" --max-memory-restart 1G -- start

# Enable swap if needed
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile`}
                  id="fix-memory"
                />
              </div>
            </div>
          </div>

          {/* Cost Optimization */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <DollarSign className="h-8 w-8 text-green-600 mr-3" />
              Cost Optimization Tips
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-3">Reduce VPS Costs</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                    <span>Use reserved instances for long-term savings (up to 50% off)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                    <span>Enable auto-scaling during low traffic periods</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                    <span>Use object storage for static files instead of VPS storage</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                    <span>Implement CDN for static assets (Cloudflare free tier)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-3">Performance Optimization</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Zap className="h-4 w-4 text-yellow-600 mt-0.5 mr-2" />
                    <span>Enable Nginx caching for static content</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-4 w-4 text-yellow-600 mt-0.5 mr-2" />
                    <span>Use Redis for session storage and caching</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-4 w-4 text-yellow-600 mt-0.5 mr-2" />
                    <span>Optimize images with compression</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-4 w-4 text-yellow-600 mt-0.5 mr-2" />
                    <span>Enable Gzip compression in Nginx</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-lg">
            <h3 className="font-bold text-2xl mb-4">VPS Deployment Complete! 🎉</h3>
            <p className="text-gray-700 mb-6">
              Your Pondok Imam Syafi\'i system is now running on your VPS. Here are some next steps:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/docs/monitoring" className="bg-white p-4 rounded-lg hover:shadow-lg transition">
                <h4 className="font-semibold mb-2">📊 Setup Monitoring</h4>
                <p className="text-sm text-gray-600">Configure alerts and dashboards</p>
              </Link>
              <Link href="/docs/backup" className="bg-white p-4 rounded-lg hover:shadow-lg transition">
                <h4 className="font-semibold mb-2">💾 Configure Backups</h4>
                <p className="text-sm text-gray-600">Automate backup procedures</p>
              </Link>
              <Link href="/docs/scaling" className="bg-white p-4 rounded-lg hover:shadow-lg transition">
                <h4 className="font-semibold mb-2">⚡ Scale Your App</h4>
                <p className="text-sm text-gray-600">Load balancing and clustering</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}