'use client'

import React from 'react'
import { Database, Server, Shield, CheckCircle, AlertTriangle } from 'lucide-react'

export default function DatabaseDocumentationPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Database className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold">Database Documentation</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Database schema, backup strategies, and performance optimization
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Database Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-500" />
                Technology Stack
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• <strong>Database:</strong> PostgreSQL 15+</li>
                <li>• <strong>ORM:</strong> Prisma v5</li>
                <li>• <strong>Connection Pool:</strong> PgBouncer</li>
                <li>• <strong>Backup:</strong> pg_dump + S3</li>
                <li>• <strong>Monitoring:</strong> PostgreSQL Stats</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" />
                Security Features
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• SSL/TLS encryption in transit</li>
                <li>• Password hashing with bcrypt</li>
                <li>• Row-level security policies</li>
                <li>• Database user permissions</li>
                <li>• Audit logging enabled</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Database Schema</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Core Tables</h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded border">
                    <h4 className="font-semibold text-blue-600">users</h4>
                    <p className="text-xs text-gray-500">System users and authentication</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded border">
                    <h4 className="font-semibold text-green-600">students</h4>
                    <p className="text-xs text-gray-500">Student profiles and data</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded border">
                    <h4 className="font-semibold text-purple-600">bills</h4>
                    <p className="text-xs text-gray-500">SPP and payment records</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded border">
                    <h4 className="font-semibold text-orange-600">hafalan</h4>
                    <p className="text-xs text-gray-500">Quran memorization tracking</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded border">
                    <h4 className="font-semibold text-red-600">activities</h4>
                    <p className="text-xs text-gray-500">School activities and events</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded border">
                    <h4 className="font-semibold text-indigo-600">courses</h4>
                    <p className="text-xs text-gray-500">Educational courses</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Schema Configuration</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id       String @id @default(cuid())
  username String @unique
  email    String @unique
  password String
  name     String
  role     Role
  isActive Boolean @default(true)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("users")
}

model Student {
  id               String @id @default(cuid())
  nisn             String? @unique
  nis              String? @unique
  fullName         String
  nickname         String?
  birthPlace       String?
  birthDate        DateTime?
  gender           Gender
  institutionLevel InstitutionLevel
  grade            String?
  
  // Relations
  bills    Bill[]
  hafalan  Hafalan[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("students")
}

enum Role {
  SUPER_ADMIN
  ADMIN
  STAFF
  TEACHER
  PARENT
  STUDENT
}

enum InstitutionLevel {
  TK
  SD
  SMP
  PONDOK
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Backup & Recovery</h2>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Automated Backup Schedule</h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• <strong>Daily:</strong> Full database backup at 2:00 AM</li>
                <li>• <strong>Hourly:</strong> Transaction log backup</li>
                <li>• <strong>Weekly:</strong> Schema-only backup for structure</li>
                <li>• <strong>Retention:</strong> 30 days daily, 12 weeks weekly</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Backup Commands</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`# Full database backup
pg_dump -h localhost -U postgres -d school_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Schema only backup
pg_dump -h localhost -U postgres -d school_db --schema-only > schema_backup.sql

# Data only backup
pg_dump -h localhost -U postgres -d school_db --data-only > data_backup.sql

# Compressed backup
pg_dump -h localhost -U postgres -d school_db | gzip > backup.sql.gz

# Restore from backup
psql -h localhost -U postgres -d school_db < backup_file.sql

# Restore with cleanup
psql -h localhost -U postgres -d school_db --clean --if-exists < backup_file.sql`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Performance Optimization</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-3">Database Indexes</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`-- Key indexes for performance
CREATE INDEX idx_students_nisn ON students(nisn);
CREATE INDEX idx_students_institution_level ON students(institution_level);
CREATE INDEX idx_students_grade ON students(grade);

CREATE INDEX idx_bills_student_id ON bills(student_id);
CREATE INDEX idx_bills_month_year ON bills(month, year);
CREATE INDEX idx_bills_status ON bills(status);
CREATE INDEX idx_bills_due_date ON bills(due_date);

CREATE INDEX idx_hafalan_student_id ON hafalan(student_id);
CREATE INDEX idx_hafalan_date ON hafalan(date);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Composite indexes
CREATE INDEX idx_bills_student_month_year ON bills(student_id, month, year);
CREATE INDEX idx_students_level_grade ON students(institution_level, grade);`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Query Optimization</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h4 className="font-semibold mb-2 text-green-600">Best Practices</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Use SELECT with specific columns</li>
                    <li>• Implement proper WHERE clauses</li>
                    <li>• Use LIMIT for pagination</li>
                    <li>• Avoid N+1 queries with includes</li>
                    <li>• Use database transactions</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h4 className="font-semibold mb-2 text-red-600">Common Issues</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• SELECT * queries</li>
                    <li>• Missing indexes on foreign keys</li>
                    <li>• Unnecessary JOINs</li>
                    <li>• Large OFFSET values</li>
                    <li>• Unoptimized LIKE queries</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Monitoring & Maintenance</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-3">Health Check Queries</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`-- Database size
SELECT pg_size_pretty(pg_database_size(current_database()));

-- Table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Active connections
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';

-- Slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Index usage
SELECT 
  indexrelname,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_tup_read DESC;`}
                </pre>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Maintenance Tasks
                </h4>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Weekly VACUUM ANALYZE</li>
                  <li>• Monthly index rebuild</li>
                  <li>• Quarterly statistics update</li>
                  <li>• Log rotation and cleanup</li>
                  <li>• Backup verification</li>
                </ul>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Alert Thresholds
                </h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Connection count &gt; 80%</li>
                  <li>• Database size &gt; 80% capacity</li>
                  <li>• Query time &gt; 5 seconds</li>
                  <li>• Failed backups</li>
                  <li>• Replication lag &gt; 1 minute</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}