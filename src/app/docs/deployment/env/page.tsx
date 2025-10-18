'use client'

import React from 'react'
import { Settings, Shield, Database, Globe, Key, AlertTriangle } from 'lucide-react'

export default function DeploymentEnvPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Settings className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold">Environment Configuration</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Complete guide to environment variables and deployment configuration
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Environment Files Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">.env.local</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Development environment
              </p>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                Local Dev
              </span>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">.env.production</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Production environment
              </p>
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded">
                Production
              </span>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">.env.example</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Template for all environments
              </p>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                Template
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Database className="w-6 h-6 text-green-500" />
            Database Configuration
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">PostgreSQL Connection</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`# PostgreSQL Database URL
DATABASE_URL="postgresql://username:password@host:port/database"

# Example configurations:

# Local PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/imam_syafii_db"

# Supabase
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# Railway
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST].railway.app:5432/railway"

# Neon
DATABASE_URL="postgresql://[USERNAME]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require"

# For Prisma DirectURL (connection pooling)
POSTGRES_URL="postgresql://username:password@host:port/database"
POSTGRES_URL_NON_POOLING="postgresql://username:password@host:port/database"`}
                </pre>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Database Security</h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 space-y-1">
                    <li>• Always use SSL/TLS in production (sslmode=require)</li>
                    <li>• Use connection pooling for better performance</li>
                    <li>• Rotate database credentials regularly</li>
                    <li>• Use read replicas for heavy read operations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-red-500" />
            Authentication & Security
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">NextAuth Configuration</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`# NextAuth.js Configuration
NEXTAUTH_URL="https://yourdomain.com"  # No trailing slash!
NEXTAUTH_SECRET="your-super-secret-key-min-32-characters"

# Generate secret with:
# openssl rand -base64 32

# Development
NEXTAUTH_URL="http://localhost:3030"

# Vercel (automatic)
# NEXTAUTH_URL is set automatically on Vercel`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">JWT & Encryption</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`# JWT Configuration
JWT_SECRET="your-jwt-secret-key"
JWT_EXPIRES_IN="7d"

# Encryption keys
ENCRYPTION_KEY="32-character-encryption-key"
IV_KEY="16-character-iv-key"

# Password hashing
BCRYPT_ROUNDS=12

# Session configuration  
SESSION_MAX_AGE=86400  # 24 hours
SESSION_UPDATE_AGE=3600  # 1 hour`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Two-Factor Authentication</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`# 2FA Configuration
TOTP_ISSUER="Pondok Imam Syafii"
TOTP_WINDOW=1  # Allow 1 step tolerance
BACKUP_CODES_COUNT=8

# QR Code generation
QR_CODE_SIZE=200
QR_CODE_ERROR_CORRECTION="M"`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-500" />
            External Services
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Payment Gateways</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`# Midtrans
MIDTRANS_SERVER_KEY="your-midtrans-server-key"
MIDTRANS_CLIENT_KEY="your-midtrans-client-key"
MIDTRANS_IS_PRODUCTION=false  # true for production
MIDTRANS_WEBHOOK_URL="https://yourdomain.com/api/payment/webhook"

# Xendit
XENDIT_SECRET_KEY="your-xendit-secret-key"
XENDIT_WEBHOOK_TOKEN="your-webhook-verification-token"
XENDIT_IS_PRODUCTION=false`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Communication Services</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`# Email Services
# Gmail SMTP
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="noreply@yourschool.com"
EMAIL_FROM_NAME="Pondok Imam Syafii"

# SendGrid
SENDGRID_API_KEY="your-sendgrid-api-key"

# Resend (modern alternative)
RESEND_API_KEY="your-resend-api-key"

# WhatsApp
WHATSAPP_TOKEN="your-whatsapp-business-token"
WHATSAPP_PHONE_NUMBER_ID="your-phone-number-id"
WHATSAPP_WEBHOOK_VERIFY_TOKEN="your-webhook-verify-token"

# SMS (Twilio)
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">File Storage</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`# AWS S3
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="ap-southeast-1"
AWS_BUCKET_NAME="your-s3-bucket"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Local file upload
UPLOAD_MAX_SIZE=5242880  # 5MB
UPLOAD_ALLOWED_TYPES="image/jpeg,image/png,application/pdf"`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Key className="w-6 h-6 text-purple-500" />
            Application Settings
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Basic Configuration</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`# Application
NODE_ENV="production"  # development | production | test
PORT=3030
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_NAME="Pondok Imam Syafii"

# API Configuration
API_VERSION="v1"
API_PREFIX="/api"
API_TIMEOUT=30000  # 30 seconds

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL="info"  # error | warn | info | debug
LOG_FILE="logs/app.log"`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Feature Flags</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`# Feature toggles
ENABLE_2FA=true
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_WHATSAPP_NOTIFICATIONS=true
ENABLE_SMS_NOTIFICATIONS=false
ENABLE_PUSH_NOTIFICATIONS=true
ENABLE_ANALYTICS=true
ENABLE_DEBUG_MODE=false

# PWA Features
ENABLE_PWA=true
ENABLE_OFFLINE_MODE=true
ENABLE_BACKGROUND_SYNC=true`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Caching & Performance</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`# Redis Cache
REDIS_URL="redis://localhost:6379"
REDIS_PASSWORD="your-redis-password"
CACHE_TTL=3600  # 1 hour default

# CDN
NEXT_PUBLIC_CDN_URL="https://cdn.yourdomain.com"

# Performance
NEXT_PUBLIC_ENABLE_COMPRESSION=true
NEXT_PUBLIC_OPTIMIZE_IMAGES=true
BUNDLE_ANALYZER=false`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Environment-Specific Examples</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Development (.env.local)</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`# Development Environment
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3030
NEXTAUTH_SECRET=development-secret-key-32-chars
DATABASE_URL=postgresql://postgres:password@localhost:5432/imam_syafii_dev
ENABLE_DEBUG_MODE=true
LOG_LEVEL=debug

# Use test API keys
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_SERVER_KEY=SB-Mid-server-test-key
MIDTRANS_CLIENT_KEY=SB-Mid-client-test-key`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Production (.env.production)</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`# Production Environment  
NODE_ENV=production
NEXTAUTH_URL=https://pesantren-coconut.vercel.app
NEXTAUTH_SECRET=super-secure-production-secret-key
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
ENABLE_DEBUG_MODE=false
LOG_LEVEL=warn

# Production API keys
MIDTRANS_IS_PRODUCTION=true  
MIDTRANS_SERVER_KEY=Mid-server-production-key
MIDTRANS_CLIENT_KEY=Mid-client-production-key`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Testing (.env.test)</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`# Test Environment
NODE_ENV=test
DATABASE_URL=postgresql://postgres:password@localhost:5432/imam_syafii_test
ENABLE_DEBUG_MODE=true
LOG_LEVEL=error

# Mock external services in tests
MOCK_EMAIL_SERVICE=true
MOCK_PAYMENT_SERVICE=true
MOCK_WHATSAPP_SERVICE=true`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-red-800 dark:text-red-200">Security Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-red-700 dark:text-red-300">Do's</h3>
              <ul className="text-sm text-red-600 dark:text-red-400 space-y-2">
                <li>✅ Use strong, unique secrets (min 32 characters)</li>
                <li>✅ Rotate secrets regularly</li>
                <li>✅ Use different keys for different environments</li>
                <li>✅ Store secrets in secure vaults (not in code)</li>
                <li>✅ Use environment-specific configurations</li>
                <li>✅ Enable SSL/TLS for all connections</li>
                <li>✅ Implement proper access controls</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-red-700 dark:text-red-300">Don'ts</h3>
              <ul className="text-sm text-red-600 dark:text-red-400 space-y-2">
                <li>❌ Never commit .env files to version control</li>
                <li>❌ Don't use production keys in development</li>
                <li>❌ Don't share secrets via email/chat</li>
                <li>❌ Don't use default or weak passwords</li>
                <li>❌ Don't expose sensitive data in client-side code</li>
                <li>❌ Don't use HTTP for sensitive operations</li>
                <li>❌ Don't ignore certificate errors</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-800 dark:text-blue-200">Environment Validation</h2>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`// lib/env-validation.ts
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.string().url(),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  MIDTRANS_SERVER_KEY: z.string().min(1),
  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.coerce.number().optional(),
})

export const env = envSchema.parse(process.env)

// Usage in next.config.js
const { env } = require('./lib/env-validation')

module.exports = {
  env: {
    CUSTOM_KEY: env.CUSTOM_KEY,
  },
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}