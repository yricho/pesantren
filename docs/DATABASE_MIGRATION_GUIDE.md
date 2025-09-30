# 🗄️ Database Migration & Management Guide

## Table of Contents
1. [Understanding Prisma Migrations](#understanding-prisma-migrations)
2. [Initial Setup](#initial-setup)
3. [Creating Migrations](#creating-migrations)  
4. [Applying Migrations](#applying-migrations)
5. [Migration Strategies](#migration-strategies)
6. [Data Migration](#data-migration)
7. [Rollback Procedures](#rollback-procedures)
8. [Best Practices](#best-practices)

---

## 📚 Understanding Prisma Migrations

### What are Migrations?
Migrations are a way to evolve your database schema over time in a consistent and trackable way. Each migration represents a set of changes to your database schema.

### Prisma Migration Files
Located in `prisma/migrations/` directory:
```
prisma/
├── schema.prisma          # Your database schema
├── migrations/            # Migration history
│   ├── 20240101000000_init/
│   │   └── migration.sql
│   ├── 20240102000000_add_users/
│   │   └── migration.sql
│   └── migration_lock.toml
```

---

## 🚀 Initial Setup

### 1. Fresh Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Create database schema (development)
npx prisma db push

# Or create first migration (production)
npx prisma migrate dev --name init

# Seed initial data
npx prisma db seed
```

### 2. Existing Database Setup

```bash
# Introspect existing database
npx prisma db pull

# Review generated schema
cat prisma/schema.prisma

# Create baseline migration
npx prisma migrate dev --name baseline --create-only

# Mark as applied
npx prisma migrate resolve --applied "20240101000000_baseline"
```

---

## ✨ Creating Migrations

### 1. Schema Changes

Edit `prisma/schema.prisma`:

```prisma
// Example: Add new field
model Student {
  id        String   @id @default(cuid())
  name      String
  email     String?
  phone     String?  // New field
  createdAt DateTime @default(now())
}

// Example: Add new model
model Attendance {
  id        String   @id @default(cuid())
  studentId String
  date      DateTime
  status    String
  student   Student  @relation(fields: [studentId], references: [id])
}
```

### 2. Generate Migration

```bash
# Development (auto-apply)
npx prisma migrate dev --name add_phone_to_students

# Production (create only)
npx prisma migrate dev --name add_phone_to_students --create-only
```

### 3. Review Migration SQL

```bash
# Check generated SQL
cat prisma/migrations/*/migration.sql
```

Example migration:
```sql
-- AlterTable
ALTER TABLE "Student" ADD COLUMN "phone" TEXT;

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" 
  FOREIGN KEY ("studentId") REFERENCES "Student"("id") 
  ON DELETE RESTRICT ON UPDATE CASCADE;
```

---

## 🔄 Applying Migrations

### Development Environment

```bash
# Apply all pending migrations
npx prisma migrate dev

# Reset database (CAUTION: Deletes all data!)
npx prisma migrate reset

# Deploy migrations without creating new ones
npx prisma migrate deploy
```

### Production Environment

```bash
# 1. Backup database first!
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# 2. Deploy migrations
npx prisma migrate deploy

# 3. Verify
npx prisma migrate status
```

### Vercel Deployment

Add to `package.json`:
```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma migrate deploy && next build",
    "postinstall": "prisma generate"
  }
}
```

---

## 📊 Migration Strategies

### 1. Safe Column Addition

```prisma
// Step 1: Add optional column
model User {
  newField String? // Optional first
}
```

```bash
npx prisma migrate dev --name add_optional_field
```

```prisma
// Step 2: Backfill data (via script)
// Step 3: Make required if needed
model User {
  newField String // Now required
}
```

### 2. Renaming Columns

```prisma
// Use @map to avoid data loss
model User {
  firstName String @map("first_name") // Maps to existing column
  lastName  String @map("last_name")
}
```

### 3. Changing Column Types

```bash
# Create custom migration
npx prisma migrate dev --name change_column_type --create-only
```

Edit migration SQL:
```sql
-- Safe type change with casting
ALTER TABLE "User" 
ALTER COLUMN "age" TYPE INTEGER 
USING "age"::INTEGER;
```

### 4. Adding Indexes

```prisma
model Student {
  id    String @id
  nisn  String @unique
  email String
  
  @@index([email]) // Add index for performance
}
```

---

## 🔀 Data Migration

### 1. Simple Data Migration

Create `prisma/migrations/scripts/migrate_data.ts`:
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Example: Migrate old phone format
  const users = await prisma.user.findMany()
  
  for (const user of users) {
    if (user.phone && !user.phone.startsWith('+62')) {
      await prisma.user.update({
        where: { id: user.id },
        data: { phone: '+62' + user.phone.replace(/^0/, '') }
      })
    }
  }
  
  console.log('Data migration completed')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Run migration:
```bash
npx ts-node prisma/migrations/scripts/migrate_data.ts
```

### 2. Batch Data Migration

For large datasets:
```typescript
async function batchMigration() {
  const batchSize = 100
  let skip = 0
  let hasMore = true

  while (hasMore) {
    const batch = await prisma.user.findMany({
      skip,
      take: batchSize
    })

    if (batch.length === 0) {
      hasMore = false
      break
    }

    // Process batch
    await Promise.all(
      batch.map(user => 
        prisma.user.update({
          where: { id: user.id },
          data: { /* updates */ }
        })
      )
    )

    skip += batchSize
    console.log(`Processed ${skip} records`)
  }
}
```

### 3. Complex Data Migration

```typescript
// Example: Split full name into first and last name
async function splitNames() {
  await prisma.$executeRaw`
    UPDATE "User"
    SET 
      "firstName" = SPLIT_PART("fullName", ' ', 1),
      "lastName" = SPLIT_PART("fullName", ' ', 2)
    WHERE "fullName" IS NOT NULL
  `
}
```

---

## ↩️ Rollback Procedures

### 1. Rollback Last Migration

```bash
# Check current status
npx prisma migrate status

# Rollback (manual process)
# 1. Restore database backup
pg_restore -d $DATABASE_URL backup.sql

# 2. Mark migration as rolled back
npx prisma migrate resolve --rolled-back "20240101000000_migration_name"

# 3. Remove migration files
rm -rf prisma/migrations/20240101000000_migration_name
```

### 2. Create Rollback Migration

```sql
-- Create reverse migration
-- Example: Drop column
ALTER TABLE "User" DROP COLUMN IF EXISTS "newField";

-- Example: Drop table
DROP TABLE IF EXISTS "NewTable";

-- Example: Remove index
DROP INDEX IF EXISTS "User_email_idx";
```

### 3. Emergency Rollback Script

```bash
#!/bin/bash
# emergency_rollback.sh

echo "Starting emergency rollback..."

# Stop application
pm2 stop all

# Restore backup
pg_restore -d $DATABASE_URL /backups/latest.sql

# Checkout previous version
git checkout HEAD~1

# Reinstall dependencies
npm install

# Generate Prisma client
npx prisma generate

# Restart application
pm2 restart all

echo "Rollback completed"
```

---

## ✅ Best Practices

### 1. Pre-Migration Checklist

- [ ] Backup database
- [ ] Test migration in staging
- [ ] Review migration SQL
- [ ] Check for data loss
- [ ] Plan rollback strategy
- [ ] Schedule maintenance window
- [ ] Notify users

### 2. Migration Naming Convention

```bash
# Good names
add_phone_to_users
create_attendance_table
add_index_to_students_nisn
rename_username_to_email
drop_deprecated_fields

# Bad names
update
fix
change
migration1
```

### 3. Safe Migration Practices

```typescript
// Always use transactions for data migrations
async function safeDataMigration() {
  return await prisma.$transaction(async (tx) => {
    // All operations in transaction
    await tx.user.updateMany({ /* ... */ })
    await tx.student.updateMany({ /* ... */ })
    // Rolls back if any fail
  })
}
```

### 4. Zero-Downtime Migrations

```bash
# Step 1: Add new column (optional)
ALTER TABLE users ADD COLUMN new_field VARCHAR(255);

# Step 2: Deploy new code that writes to both columns

# Step 3: Backfill data
UPDATE users SET new_field = old_field WHERE new_field IS NULL;

# Step 4: Deploy code that reads from new column

# Step 5: Drop old column
ALTER TABLE users DROP COLUMN old_field;
```

### 5. Migration Testing

```typescript
// test/migrations.test.ts
describe('Migration Tests', () => {
  beforeEach(async () => {
    // Reset to clean state
    await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`
  })

  it('should migrate user data correctly', async () => {
    // Insert test data
    await prisma.user.create({
      data: { name: 'Test User', email: 'test@example.com' }
    })

    // Run migration
    await runMigration('add_phone_field')

    // Verify
    const user = await prisma.user.findFirst()
    expect(user).toHaveProperty('phone')
  })
})
```

---

## 🔧 Common Migration Issues

### 1. Migration Lock

```bash
# Error: Migration lock is already held
# Solution: Remove lock file
rm prisma/migrations/migration_lock.toml
```

### 2. Drift Detection

```bash
# Error: Database schema drift detected
# Solution: Reset or baseline
npx prisma migrate diff \
  --from-schema-datasource prisma/schema.prisma \
  --to-schema-datamodel prisma/schema.prisma \
  --script > drift.sql
```

### 3. Failed Migration

```bash
# Mark as failed and fix
npx prisma migrate resolve --rolled-back "20240101000000_failed"

# Fix schema and create new migration
npx prisma migrate dev --name fixed_migration
```

### 4. Prisma Version Mismatch

```bash
# Ensure consistent versions
npm install @prisma/client@latest prisma@latest
npx prisma generate
```

---

## 📝 Migration Scripts

### Backup Before Migration

```bash
#!/bin/bash
# backup_and_migrate.sh

DB_NAME="imam_syafii"
BACKUP_DIR="/var/backups"
DATE=$(date +%Y%m%d_%H%M%S)

echo "Creating backup..."
pg_dump $DATABASE_URL > "$BACKUP_DIR/pre_migration_$DATE.sql"

echo "Running migrations..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
  echo "Migration successful"
else
  echo "Migration failed! Restoring backup..."
  psql $DATABASE_URL < "$BACKUP_DIR/pre_migration_$DATE.sql"
  exit 1
fi
```

### Automated Migration Pipeline

```yaml
# .github/workflows/migrate.yml
name: Database Migration

on:
  push:
    paths:
      - 'prisma/schema.prisma'
      - 'prisma/migrations/**'

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install deps
        run: npm ci
        
      - name: Run migrations
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          npx prisma migrate deploy
          npx prisma generate
```

---

## 🗂️ Schema Versioning

### Track Schema Changes

```json
// package.json
{
  "prisma": {
    "schema": "prisma/schema.prisma",
    "seed": "ts-node prisma/seed.ts"
  },
  "schemaVersion": "2.1.0"
}
```

### Schema Changelog

Create `SCHEMA_CHANGELOG.md`:
```markdown
# Schema Changelog

## v2.1.0 - 2024-12-05
- Added `phone` field to User model
- Created Attendance model
- Added index on Student.nisn

## v2.0.0 - 2024-11-01
- Major refactor of Student model
- Added Bill and Payment models
- Implemented soft deletes
```

---

## 📞 Support

- Prisma Docs: [prisma.io/docs](https://www.prisma.io/docs)
- GitHub Issues: [Report issues](https://github.com/pendtiumpraz/imam-syafii-blitar/issues)
- Database Admin: admin@imam-syafii-blitar.sch.id