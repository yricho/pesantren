# 💾 Backup & Recovery Guide - Pondok Imam Syafi'i System

## Table of Contents
1. [Backup Strategy Overview](#backup-strategy-overview)
2. [Database Backup](#database-backup)
3. [File System Backup](#file-system-backup)
4. [Automated Backup](#automated-backup)
5. [Recovery Procedures](#recovery-procedures)
6. [Disaster Recovery Plan](#disaster-recovery-plan)
7. [Testing & Verification](#testing--verification)

---

## 📋 Backup Strategy Overview

### What to Backup

| Component | Priority | Frequency | Retention |
|-----------|----------|-----------|-----------|
| Database | Critical | Daily | 30 days |
| User uploads | Critical | Daily | 90 days |
| Configuration | High | Weekly | 30 days |
| Application code | Medium | On change | Git history |
| System logs | Low | Weekly | 7 days |

### 3-2-1 Rule
- **3** copies of important data
- **2** different storage media
- **1** offsite backup

### Backup Schedule
```
Daily:  02:00 AM - Database, User files
Weekly: Sunday 03:00 AM - Full system backup
Monthly: 1st day 04:00 AM - Archive to cloud
```

---

## 🗄️ Database Backup

### 1. Manual Database Backup

#### PostgreSQL Backup

```bash
# Basic backup
pg_dump -U postgres -h localhost imam_syafii_db > backup_$(date +%Y%m%d).sql

# Compressed backup
pg_dump -U postgres -h localhost -Fc imam_syafii_db > backup_$(date +%Y%m%d).dump

# With schema only
pg_dump -U postgres -h localhost --schema-only imam_syafii_db > schema_$(date +%Y%m%d).sql

# With data only
pg_dump -U postgres -h localhost --data-only imam_syafii_db > data_$(date +%Y%m%d).sql

# Specific tables
pg_dump -U postgres -h localhost -t Student -t Bill imam_syafii_db > tables_backup.sql

# Exclude tables
pg_dump -U postgres -h localhost -T "Log*" -T "_prisma_migrations" imam_syafii_db > backup.sql
```

#### Using Prisma

```bash
# Export data via Prisma
npx prisma db pull
npx prisma migrate diff --from-schema-datasource --to-schema-datamodel --script > backup.sql

# Backup with seed data
node -e "
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function backup() {
  const students = await prisma.student.findMany();
  const bills = await prisma.bill.findMany();
  const data = { students, bills };
  fs.writeFileSync('backup.json', JSON.stringify(data, null, 2));
}

backup().then(() => process.exit(0));
"
```

### 2. Remote Database Backup

#### Backup from Prisma Accelerate

```bash
# Using connection string
DATABASE_URL="postgresql://user:pass@host:5432/db"
pg_dump "$DATABASE_URL" > backup_$(date +%Y%m%d).sql

# With SSL
pg_dump "$DATABASE_URL?sslmode=require" > backup_$(date +%Y%m%d).sql
```

#### Backup from Supabase

```bash
# Get connection string from Supabase dashboard
SUPABASE_DB="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
pg_dump "$SUPABASE_DB" > supabase_backup_$(date +%Y%m%d).sql
```

### 3. Incremental Backup

```bash
# Using pg_basebackup for incremental
pg_basebackup -h localhost -D /backup/base -U postgres -P -Xs -c fast

# WAL archiving setup
# postgresql.conf
archive_mode = on
archive_command = 'cp %p /backup/archive/%f'
wal_level = replica
```

---

## 📁 File System Backup

### 1. User Uploads Backup

```bash
#!/bin/bash
# backup_files.sh

BACKUP_DIR="/backup/files"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup public uploads
tar -czf "$BACKUP_DIR/uploads_$DATE.tar.gz" /var/www/imam-syafii/public/uploads/

# Backup user avatars
tar -czf "$BACKUP_DIR/avatars_$DATE.tar.gz" /var/www/imam-syafii/public/avatars/

# Backup documents
tar -czf "$BACKUP_DIR/documents_$DATE.tar.gz" /var/www/imam-syafii/public/documents/

# Remove old backups (keep 30 days)
find $BACKUP_DIR -type f -mtime +30 -delete
```

### 2. Configuration Backup

```bash
#!/bin/bash
# backup_config.sh

CONFIG_BACKUP="/backup/config"
DATE=$(date +%Y%m%d)

# Create config backup directory
mkdir -p "$CONFIG_BACKUP/$DATE"

# Backup environment files
cp /var/www/imam-syafii/.env* "$CONFIG_BACKUP/$DATE/"

# Backup Nginx config
cp /etc/nginx/sites-available/* "$CONFIG_BACKUP/$DATE/"

# Backup PM2 config
pm2 save
cp ~/.pm2/dump.pm2 "$CONFIG_BACKUP/$DATE/"

# Backup cron jobs
crontab -l > "$CONFIG_BACKUP/$DATE/crontab.txt"

# Create archive
tar -czf "$CONFIG_BACKUP/config_$DATE.tar.gz" "$CONFIG_BACKUP/$DATE/"
rm -rf "$CONFIG_BACKUP/$DATE"
```

### 3. Full Application Backup

```bash
#!/bin/bash
# full_backup.sh

BACKUP_ROOT="/backup"
APP_DIR="/var/www/imam-syafii-blitar"
DATE=$(date +%Y%m%d_%H%M%S)

echo "Starting full backup at $(date)"

# Create backup directory
mkdir -p "$BACKUP_ROOT/full"

# Stop application
pm2 stop all

# Backup database
pg_dump imam_syafii_db | gzip > "$BACKUP_ROOT/full/db_$DATE.sql.gz"

# Backup application files
tar --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.git' \
    -czf "$BACKUP_ROOT/full/app_$DATE.tar.gz" \
    "$APP_DIR"

# Backup uploads separately
tar -czf "$BACKUP_ROOT/full/uploads_$DATE.tar.gz" \
    "$APP_DIR/public/uploads"

# Start application
pm2 restart all

echo "Backup completed at $(date)"
echo "Files created:"
ls -lh "$BACKUP_ROOT/full/*_$DATE.*"
```

---

## 🤖 Automated Backup

### 1. Cron Job Setup

```bash
# Edit crontab
crontab -e

# Add backup jobs
# Daily database backup at 2 AM
0 2 * * * /scripts/backup_database.sh >> /var/log/backup.log 2>&1

# Daily file backup at 2:30 AM
30 2 * * * /scripts/backup_files.sh >> /var/log/backup.log 2>&1

# Weekly full backup on Sunday at 3 AM
0 3 * * 0 /scripts/full_backup.sh >> /var/log/backup.log 2>&1

# Monthly cloud sync on 1st at 4 AM
0 4 1 * * /scripts/sync_to_cloud.sh >> /var/log/backup.log 2>&1

# Clean old backups daily at 5 AM
0 5 * * * /scripts/cleanup_backups.sh >> /var/log/backup.log 2>&1
```

### 2. Automated Backup Script

```bash
#!/bin/bash
# automated_backup.sh

set -e  # Exit on error

# Configuration
BACKUP_DIR="/backup"
DB_NAME="imam_syafii_db"
APP_DIR="/var/www/imam-syafii-blitar"
S3_BUCKET="s3://backup-bucket"
RETENTION_DAYS=30
SLACK_WEBHOOK="https://hooks.slack.com/..."

# Function to send notification
notify() {
    curl -X POST $SLACK_WEBHOOK -H 'Content-Type: application/json' \
         -d "{\"text\":\"$1\"}"
}

# Function to backup database
backup_database() {
    echo "Backing up database..."
    DBFILE="$BACKUP_DIR/db/db_$(date +%Y%m%d_%H%M%S).sql.gz"
    pg_dump $DB_NAME | gzip > $DBFILE
    
    if [ $? -eq 0 ]; then
        echo "Database backup successful: $DBFILE"
        return 0
    else
        notify "❌ Database backup failed!"
        return 1
    fi
}

# Function to backup files
backup_files() {
    echo "Backing up files..."
    FILEFILE="$BACKUP_DIR/files/files_$(date +%Y%m%d_%H%M%S).tar.gz"
    tar -czf $FILEFILE $APP_DIR/public/uploads
    
    if [ $? -eq 0 ]; then
        echo "File backup successful: $FILEFILE"
        return 0
    else
        notify "❌ File backup failed!"
        return 1
    fi
}

# Function to sync to cloud
sync_to_cloud() {
    echo "Syncing to cloud..."
    aws s3 sync $BACKUP_DIR $S3_BUCKET --delete
    
    if [ $? -eq 0 ]; then
        echo "Cloud sync successful"
        notify "✅ Backup synced to cloud"
        return 0
    else
        notify "❌ Cloud sync failed!"
        return 1
    fi
}

# Function to cleanup old backups
cleanup_old() {
    echo "Cleaning old backups..."
    find $BACKUP_DIR -type f -mtime +$RETENTION_DAYS -delete
    echo "Cleanup completed"
}

# Main execution
notify "🔄 Starting backup process..."

backup_database
backup_files
sync_to_cloud
cleanup_old

notify "✅ Backup completed successfully!"
```

### 3. Docker Backup

```yaml
# docker-compose.backup.yml
version: '3.8'

services:
  postgres-backup:
    image: prodrigestivill/postgres-backup-local
    environment:
      POSTGRES_HOST: db
      POSTGRES_DB: imam_syafii_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      SCHEDULE: "@daily"
      BACKUP_KEEP_DAYS: 30
      BACKUP_KEEP_WEEKS: 4
      BACKUP_KEEP_MONTHS: 6
    volumes:
      - /backup/postgres:/backups
    networks:
      - imam-syafii-network
      
  file-backup:
    image: offen/docker-volume-backup
    environment:
      BACKUP_FILENAME: "backup-%Y-%m-%d.tar.gz"
      BACKUP_RETENTION_DAYS: "30"
      BACKUP_STOP_CONTAINER_LABEL: "true"
    volumes:
      - /var/www/imam-syafii:/backup/app:ro
      - /backup/files:/archive
```

---

## 🔄 Recovery Procedures

### 1. Database Recovery

#### Restore from SQL Backup

```bash
# Stop application
pm2 stop all

# Drop and recreate database
dropdb imam_syafii_db
createdb imam_syafii_db

# Restore from backup
psql imam_syafii_db < backup_20241205.sql

# Or compressed backup
gunzip -c backup_20241205.sql.gz | psql imam_syafii_db

# Or custom format
pg_restore -d imam_syafii_db backup_20241205.dump

# Verify restore
psql imam_syafii_db -c "SELECT COUNT(*) FROM \"Student\";"

# Restart application
pm2 restart all
```

#### Restore Specific Tables

```bash
# Extract specific table from backup
pg_dump -t Student backup.sql > student_table.sql

# Restore just that table
psql imam_syafii_db < student_table.sql

# Or restore with data only
psql imam_syafii_db -c "TRUNCATE TABLE \"Student\" CASCADE;"
psql imam_syafii_db < student_data.sql
```

#### Point-in-Time Recovery (PITR)

```bash
# Restore base backup
pg_basebackup -D /var/lib/postgresql/recovery

# Configure recovery
cat > /var/lib/postgresql/recovery/postgresql.conf << EOF
restore_command = 'cp /backup/archive/%f %p'
recovery_target_time = '2024-12-05 10:00:00'
recovery_target_action = 'promote'
EOF

# Start PostgreSQL in recovery mode
pg_ctl start -D /var/lib/postgresql/recovery
```

### 2. File Recovery

```bash
#!/bin/bash
# restore_files.sh

BACKUP_FILE=$1
RESTORE_TO=${2:-"/var/www/imam-syafii-blitar"}

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: ./restore_files.sh <backup_file> [restore_path]"
    exit 1
fi

echo "Restoring from: $BACKUP_FILE"
echo "Restoring to: $RESTORE_TO"

# Create restore directory
mkdir -p "$RESTORE_TO"

# Extract backup
tar -xzf "$BACKUP_FILE" -C "$RESTORE_TO"

# Fix permissions
chown -R www-data:www-data "$RESTORE_TO/public/uploads"
chmod -R 755 "$RESTORE_TO/public/uploads"

echo "File restore completed"
```

### 3. Full System Recovery

```bash
#!/bin/bash
# full_restore.sh

BACKUP_DATE=$1

if [ -z "$BACKUP_DATE" ]; then
    echo "Usage: ./full_restore.sh YYYYMMDD"
    exit 1
fi

echo "Starting full system restore from $BACKUP_DATE"

# Stop all services
systemctl stop nginx
pm2 stop all

# Restore database
echo "Restoring database..."
gunzip -c /backup/full/db_${BACKUP_DATE}*.sql.gz | psql imam_syafii_db

# Restore application files
echo "Restoring application files..."
tar -xzf /backup/full/app_${BACKUP_DATE}*.tar.gz -C /

# Restore uploads
echo "Restoring uploads..."
tar -xzf /backup/full/uploads_${BACKUP_DATE}*.tar.gz -C /

# Restore configuration
echo "Restoring configuration..."
tar -xzf /backup/config/config_${BACKUP_DATE}.tar.gz -C /

# Install dependencies
cd /var/www/imam-syafii-blitar
npm install
npx prisma generate
npm run build

# Start services
pm2 restart all
systemctl start nginx

echo "Full system restore completed"
```

---

## 🚨 Disaster Recovery Plan

### 1. Recovery Time Objectives (RTO/RPO)

| Service Level | RPO (Data Loss) | RTO (Downtime) | Cost |
|---------------|----------------|----------------|------|
| **Tier 1** (Critical) | < 1 hour | < 2 hours | High |
| **Tier 2** (Important) | < 6 hours | < 12 hours | Medium |
| **Tier 3** (Standard) | < 24 hours | < 48 hours | Low |

### 2. Disaster Scenarios

#### Scenario 1: Database Corruption
```bash
# Step 1: Stop application
pm2 stop all

# Step 2: Restore from last good backup
./restore_database.sh /backup/db/last_good_backup.sql

# Step 3: Verify data integrity
npm run verify-data

# Step 4: Restart application
pm2 restart all
```

#### Scenario 2: Server Failure
```bash
# Step 1: Provision new server
./provision_server.sh

# Step 2: Restore from offsite backup
aws s3 sync s3://backup-bucket /backup/

# Step 3: Run full restore
./full_restore.sh

# Step 4: Update DNS
./update_dns.sh

# Step 5: Verify services
./health_check.sh
```

#### Scenario 3: Data Breach
```bash
# Step 1: Isolate affected systems
iptables -A INPUT -j DROP

# Step 2: Restore to clean state
./restore_to_point.sh "2024-12-04 23:00:00"

# Step 3: Reset all passwords
npm run reset-all-passwords

# Step 4: Audit logs
./audit_security.sh

# Step 5: Re-enable access
iptables -D INPUT -j DROP
```

### 3. Recovery Checklist

```markdown
## Pre-Recovery
- [ ] Identify issue scope
- [ ] Notify stakeholders
- [ ] Activate DR team
- [ ] Document incident

## During Recovery
- [ ] Stop affected services
- [ ] Backup current state
- [ ] Restore from backup
- [ ] Verify data integrity
- [ ] Test functionality
- [ ] Monitor performance

## Post-Recovery
- [ ] Confirm full restoration
- [ ] Update documentation
- [ ] Conduct post-mortem
- [ ] Improve DR plan
- [ ] Test new procedures
```

---

## 🧪 Testing & Verification

### 1. Backup Verification

```bash
#!/bin/bash
# verify_backup.sh

BACKUP_FILE=$1

# Test database backup
echo "Testing database backup..."
createdb test_restore
gunzip -c $BACKUP_FILE | psql test_restore

# Run integrity checks
psql test_restore -c "SELECT COUNT(*) FROM \"Student\";" || exit 1
psql test_restore -c "SELECT COUNT(*) FROM \"Bill\";" || exit 1

# Clean up
dropdb test_restore

echo "✅ Backup verification successful"
```

### 2. Recovery Drill

```bash
#!/bin/bash
# recovery_drill.sh

echo "Starting recovery drill..."

# Create test environment
docker-compose -f docker-compose.test.yml up -d

# Simulate failure
docker-compose -f docker-compose.test.yml stop db

# Perform recovery
./restore_database.sh /backup/latest.sql

# Test application
curl -f http://localhost:3030/api/health || exit 1

# Clean up
docker-compose -f docker-compose.test.yml down

echo "✅ Recovery drill completed"
```

### 3. Monitoring Script

```bash
#!/bin/bash
# monitor_backups.sh

BACKUP_DIR="/backup"
MAX_AGE_HOURS=26  # Alert if backup older than 26 hours
MIN_SIZE_MB=10    # Alert if backup smaller than 10MB

# Check latest backup age
LATEST_BACKUP=$(ls -t $BACKUP_DIR/db/*.sql.gz | head -1)
AGE_HOURS=$((($(date +%s) - $(stat -c %Y "$LATEST_BACKUP")) / 3600))

if [ $AGE_HOURS -gt $MAX_AGE_HOURS ]; then
    echo "⚠️ WARNING: Latest backup is $AGE_HOURS hours old"
    # Send alert
fi

# Check backup size
SIZE_MB=$(du -m "$LATEST_BACKUP" | cut -f1)
if [ $SIZE_MB -lt $MIN_SIZE_MB ]; then
    echo "⚠️ WARNING: Backup size is only ${SIZE_MB}MB"
    # Send alert
fi

echo "✅ Backup monitoring passed"
```

---

## 📦 Cloud Backup Solutions

### 1. AWS S3 Backup

```bash
# Install AWS CLI
apt install awscli

# Configure AWS
aws configure

# Sync backups to S3
aws s3 sync /backup/ s3://imam-syafii-backups/ --delete

# Download from S3
aws s3 sync s3://imam-syafii-backups/ /restore/

# Lifecycle policy (auto-delete old backups)
aws s3api put-bucket-lifecycle-configuration \
    --bucket imam-syafii-backups \
    --lifecycle-configuration file://lifecycle.json
```

### 2. Google Cloud Storage

```bash
# Install gsutil
curl https://sdk.cloud.google.com | bash

# Configure
gcloud init

# Upload backups
gsutil -m rsync -r /backup/ gs://imam-syafii-backups/

# Download backups
gsutil -m rsync -r gs://imam-syafii-backups/ /restore/
```

### 3. Automated Cloud Backup

```javascript
// cloud-backup.js
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

async function uploadBackup(filePath) {
  const fileName = path.basename(filePath);
  const fileContent = fs.readFileSync(filePath);
  
  const params = {
    Bucket: 'imam-syafii-backups',
    Key: `${new Date().toISOString().split('T')[0]}/${fileName}`,
    Body: fileContent,
    ServerSideEncryption: 'AES256'
  };
  
  await s3.upload(params).promise();
  console.log(`Uploaded: ${fileName}`);
}

// Schedule upload
const cron = require('node-cron');
cron.schedule('0 3 * * *', () => {
  uploadBackup('/backup/latest.sql.gz');
});
```

---

## 📋 Backup Retention Policy

### Standard Retention

| Backup Type | Frequency | Local Retention | Cloud Retention |
|------------|-----------|-----------------|-----------------|
| Database | Daily | 30 days | 90 days |
| Files | Daily | 14 days | 30 days |
| Full | Weekly | 4 weeks | 12 weeks |
| Archive | Monthly | 3 months | 1 year |

### Cleanup Script

```bash
#!/bin/bash
# cleanup_backups.sh

# Clean local backups
find /backup/db -type f -mtime +30 -delete
find /backup/files -type f -mtime +14 -delete
find /backup/full -type f -mtime +28 -delete

# Clean S3 (using lifecycle rules)
aws s3api put-bucket-lifecycle-configuration \
    --bucket imam-syafii-backups \
    --lifecycle-configuration '{
      "Rules": [{
        "Id": "DeleteOldBackups",
        "Status": "Enabled",
        "Expiration": {"Days": 90}
      }]
    }'

echo "✅ Cleanup completed"
```

---

## 📞 Emergency Contacts

### Disaster Recovery Team

| Role | Name | Phone | Email |
|------|------|-------|-------|
| DR Coordinator | [Name] | [Phone] | [Email] |
| Database Admin | [Name] | [Phone] | [Email] |
| System Admin | [Name] | [Phone] | [Email] |
| Network Admin | [Name] | [Phone] | [Email] |

### External Support

- **Hosting Provider**: [Support contact]
- **Database Support**: [PostgreSQL support]
- **Cloud Provider**: [AWS/GCP support]
- **Security Team**: [Security contact]

---

**Remember**: Regular testing of backup and recovery procedures is essential!