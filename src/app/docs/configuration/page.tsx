'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Settings, 
  Copy, 
  Check, 
  Mail,
  MessageSquare,
  CreditCard,
  Database,
  Shield,
  Key,
  Globe,
  Bell,
  Upload,
  AlertCircle,
  CheckCircle2,
  Info,
  Lock,
  Server,
  Smartphone,
  FileText,
  Cloud,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';

export default function ConfigurationPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('environment');
  const [showSecrets, setShowSecrets] = useState<{ [key: string]: boolean }>({});

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const CodeBlock = ({ code, id, language = 'bash', secret = false }: { 
    code: string; 
    id: string; 
    language?: string;
    secret?: boolean;
  }) => (
    <div className="relative bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto group">
      <button
        onClick={() => handleCopy(code, id)}
        className="absolute top-2 right-2 p-2 bg-gray-800 rounded hover:bg-gray-700 transition opacity-0 group-hover:opacity-100"
      >
        {copiedId === id ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
      </button>
      {secret && (
        <button
          onClick={() => toggleSecret(id)}
          className="absolute top-2 right-12 p-2 bg-gray-800 rounded hover:bg-gray-700 transition opacity-0 group-hover:opacity-100"
        >
          {showSecrets[id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      )}
      <pre className="text-sm font-mono">
        <code className={`language-${language}`}>
          {secret && !showSecrets[id] ? code.replace(/=".+"/g, '="••••••••"') : code}
        </code>
      </pre>
    </div>
  );

  const sections = [
    { id: 'environment', title: 'Environment Variables', icon: FileText },
    { id: 'database', title: 'Database', icon: Database },
    { id: 'authentication', title: 'Authentication', icon: Shield },
    { id: 'email', title: 'Email Service', icon: Mail },
    { id: 'whatsapp', title: 'WhatsApp API', icon: MessageSquare },
    { id: 'payment', title: 'Payment Gateway', icon: CreditCard },
    { id: 'storage', title: 'File Storage', icon: Upload },
    { id: 'monitoring', title: 'Monitoring', icon: Zap },
    { id: 'security', title: 'Security', icon: Lock },
    { id: 'advanced', title: 'Advanced', icon: Settings }
  ];

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
            <h1 className="text-4xl font-bold mb-4">Configuration Guide</h1>
            <p className="text-xl text-blue-100">
              Configure your Pondok Imam Syafi'i system for production
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64">
              <div className="sticky top-4">
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <h3 className="font-bold mb-4">Configuration Sections</h3>
                  <nav className="space-y-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center ${
                          activeSection === section.id
                            ? 'bg-blue-50 text-blue-600 font-semibold'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <section.icon className="h-4 w-4 mr-2" />
                        {section.title}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-lg p-8">
                {/* Environment Variables Section */}
                {activeSection === 'environment' && (
                  <div>
                    <h2 className="text-3xl font-bold mb-6 flex items-center">
                      <FileText className="h-8 w-8 text-blue-600 mr-3" />
                      Environment Variables
                    </h2>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm text-blue-800">
                            Environment variables are stored in <code className="bg-blue-100 px-1">.env.local</code> for local development 
                            and configured in your deployment platform for production.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-lg mb-3">Creating Environment File</h3>
                        <CodeBlock 
                          code={`# Copy example file
cp .env.example .env.local

# Open in editor
nano .env.local  # or use your preferred editor`}
                          id="create-env"
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-3">Required Variables</h3>
                        <CodeBlock 
                          code={`# Application URL (change for production)
NEXTAUTH_URL="http://localhost:3030"

# Secret key for NextAuth (generate unique 32+ character string)
NEXTAUTH_SECRET="your-secret-key-minimum-32-characters"

# Database connection string
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"`}
                          id="required-env"
                          language="env"
                          secret={true}
                        />

                        <div className="mt-4 p-4 bg-gray-50 rounded">
                          <h4 className="font-semibold mb-2">Generate Secure Secret:</h4>
                          <CodeBlock 
                            code={`# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using Python
python -c "import secrets; print(secrets.token_urlsafe(32))"`}
                            id="generate-secrets"
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-3">Environment Variable Priority</h3>
                        <ol className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <span className="font-bold mr-2">1.</span>
                            <span><code className="bg-gray-100 px-1">.env.local</code> - Local overrides (highest priority)</span>
                          </li>
                          <li className="flex items-start">
                            <span className="font-bold mr-2">2.</span>
                            <span><code className="bg-gray-100 px-1">.env.development</code> - Development defaults</span>
                          </li>
                          <li className="flex items-start">
                            <span className="font-bold mr-2">3.</span>
                            <span><code className="bg-gray-100 px-1">.env.production</code> - Production defaults</span>
                          </li>
                          <li className="flex items-start">
                            <span className="font-bold mr-2">4.</span>
                            <span><code className="bg-gray-100 px-1">.env</code> - Default values (lowest priority)</span>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                )}

                {/* Database Section */}
                {activeSection === 'database' && (
                  <div>
                    <h2 className="text-3xl font-bold mb-6 flex items-center">
                      <Database className="h-8 w-8 text-blue-600 mr-3" />
                      Database Configuration
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-lg mb-3">PostgreSQL Connection</h3>
                        <CodeBlock 
                          code={`# Local PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/imam_syafii_db"

# Supabase (Recommended for production)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Prisma Accelerate (Edge-ready)
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=[YOUR-API-KEY]"

# Connection Pool (for serverless)
DATABASE_URL="postgresql://user:pass@host:5432/db?pgbouncer=true&connection_limit=1"`}
                          id="db-urls"
                          language="env"
                          secret={true}
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-3">Database Setup Commands</h3>
                        <CodeBlock 
                          code={`# Generate Prisma Client
npx prisma generate

# Create database schema
npx prisma db push

# Create and apply migrations
npx prisma migrate dev --name init

# Seed initial data
npx prisma db seed

# Open Prisma Studio (GUI)
npx prisma studio`}
                          id="db-commands"
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-3">Connection Pool Settings</h3>
                        <CodeBlock 
                          code={`# Add to DATABASE_URL for production
?connection_limit=10  # Max connections
&pool_timeout=30      # Timeout in seconds
&pgbouncer=true       # Enable PgBouncer
&schema=public        # Database schema`}
                          id="db-pool"
                          language="env"
                        />
                      </div>

                      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                          <div>
                            <p className="text-sm text-yellow-800">
                              <strong>Production Tip:</strong> Use connection pooling for serverless deployments 
                              to avoid connection limit issues. Supabase and Prisma Accelerate handle this automatically.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Authentication Section */}
                {activeSection === 'authentication' && (
                  <div>
                    <h2 className="text-3xl font-bold mb-6 flex items-center">
                      <Shield className="h-8 w-8 text-blue-600 mr-3" />
                      Authentication Configuration
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-lg mb-3">NextAuth.js Setup</h3>
                        <CodeBlock 
                          code={`# Required for NextAuth
NEXTAUTH_URL="https://your-domain.com"  # No trailing slash
NEXTAUTH_SECRET="generate-secure-32-character-minimum-secret"

# Optional: Custom session configuration
SESSION_MAX_AGE=86400  # 24 hours in seconds
SESSION_UPDATE_AGE=3600 # 1 hour in seconds`}
                          id="nextauth-config"
                          language="env"
                          secret={true}
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-3">Two-Factor Authentication (2FA)</h3>
                        <CodeBlock 
                          code={`# TOTP Settings
TWO_FACTOR_ISSUER="Pondok Imam Syafii"
TWO_FACTOR_PERIOD=30  # seconds
TWO_FACTOR_DIGITS=6

# SMS Provider (Optional for SMS 2FA)
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"`}
                          id="2fa-config"
                          language="env"
                          secret={true}
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-3">OAuth Providers (Optional)</h3>
                        <CodeBlock 
                          code={`# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth
GITHUB_ID="your-github-app-id"
GITHUB_SECRET="your-github-app-secret"`}
                          id="oauth-config"
                          language="env"
                          secret={true}
                        />
                      </div>

                      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                        <div className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                          <div>
                            <p className="text-sm text-green-800">
                              <strong>Security Best Practice:</strong> Always use strong, unique secrets in production. 
                              Enable 2FA for admin accounts and regularly rotate secrets.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Section */}
                {activeSection === 'email' && (
                  <div>
                    <h2 className="text-3xl font-bold mb-6 flex items-center">
                      <Mail className="h-8 w-8 text-blue-600 mr-3" />
                      Email Service Configuration
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-lg mb-3">SMTP Configuration</h3>
                        <CodeBlock 
                          code={`# Email Settings
EMAIL_FROM="noreply@yourdomain.com"
EMAIL_FROM_NAME="Pondok Imam Syafii"

# SMTP Server
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_SECURE="false"  # true for 465, false for 587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-specific-password"`}
                          id="smtp-config"
                          language="env"
                          secret={true}
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-3">Gmail Setup</h3>
                        <ol className="space-y-3">
                          <li className="flex items-start">
                            <span className="font-bold mr-2">1.</span>
                            <div>
                              <p>Enable 2-Step Verification in your Google Account</p>
                              <a href="https://myaccount.google.com/security" className="text-blue-600 text-sm underline">
                                Go to Google Account Security →
                              </a>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <span className="font-bold mr-2">2.</span>
                            <div>
                              <p>Generate App-Specific Password</p>
                              <a href="https://myaccount.google.com/apppasswords" className="text-blue-600 text-sm underline">
                                Create App Password →
                              </a>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <span className="font-bold mr-2">3.</span>
                            <p>Use the 16-character app password in EMAIL_PASSWORD</p>
                          </li>
                        </ol>
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-3">Alternative Email Services</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold mb-2">SendGrid</h4>
                            <CodeBlock 
                              code={`EMAIL_HOST="smtp.sendgrid.net"
EMAIL_PORT="587"
EMAIL_USER="apikey"
EMAIL_PASSWORD="SG.your-api-key"`}
                              id="sendgrid-config"
                              language="env"
                            />
                          </div>
                          
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold mb-2">Mailgun</h4>
                            <CodeBlock 
                              code={`EMAIL_HOST="smtp.mailgun.org"
EMAIL_PORT="587"
EMAIL_USER="postmaster@domain"
EMAIL_PASSWORD="your-password"`}
                              id="mailgun-config"
                              language="env"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* WhatsApp Section */}
                {activeSection === 'whatsapp' && (
                  <div>
                    <h2 className="text-3xl font-bold mb-6 flex items-center">
                      <MessageSquare className="h-8 w-8 text-green-600 mr-3" />
                      WhatsApp API Configuration
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-lg mb-3">WhatsApp Business API</h3>
                        <CodeBlock 
                          code={`# WhatsApp Cloud API
WHATSAPP_API_VERSION="v17.0"
WHATSAPP_PHONE_NUMBER_ID="your-phone-number-id"
WHATSAPP_BUSINESS_ACCOUNT_ID="your-business-account-id"
WHATSAPP_ACCESS_TOKEN="your-access-token"
WHATSAPP_WEBHOOK_VERIFY_TOKEN="your-verify-token"`}
                          id="whatsapp-config"
                          language="env"
                          secret={true}
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-3">Webhook Configuration</h3>
                        <CodeBlock 
                          code={`# Add this webhook URL in Meta Business Platform
https://your-domain.com/api/webhooks/whatsapp

# Verify token must match WHATSAPP_WEBHOOK_VERIFY_TOKEN`}
                          id="whatsapp-webhook"
                          language="text"
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-3">Alternative: Twilio WhatsApp</h3>
                        <CodeBlock 
                          code={`# Twilio WhatsApp
TWILIO_ACCOUNT_SID="your-account-sid"
TWILIO_AUTH_TOKEN="your-auth-token"
TWILIO_WHATSAPP_NUMBER="whatsapp:+14155238886"`}
                          id="twilio-whatsapp"
                          language="env"
                          secret={true}
                        />
                      </div>

                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                        <div className="flex items-start">
                          <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                          <div>
                            <p className="text-sm text-blue-800">
                              <strong>Setup Guide:</strong> Follow the official 
                              <a href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started" className="underline ml-1">
                                WhatsApp Cloud API documentation
                              </a> to obtain your credentials.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Section */}
                {activeSection === 'payment' && (
                  <div>
                    <h2 className="text-3xl font-bold mb-6 flex items-center">
                      <CreditCard className="h-8 w-8 text-blue-600 mr-3" />
                      Payment Gateway Configuration
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-lg mb-3">Midtrans Configuration</h3>
                        <CodeBlock 
                          code={`# Midtrans Settings
MIDTRANS_CLIENT_KEY="your-client-key"
MIDTRANS_SERVER_KEY="your-server-key"
MIDTRANS_IS_PRODUCTION="false"  # true for production
MIDTRANS_MERCHANT_ID="your-merchant-id"

# Notification URL
MIDTRANS_NOTIFICATION_URL="https://your-domain.com/api/payments/notification"`}
                          id="midtrans-config"
                          language="env"
                          secret={true}
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-3">Payment Methods</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold mb-2">Bank Transfer</h4>
                            <ul className="text-sm space-y-1 text-gray-600">
                              <li>• BCA Virtual Account</li>
                              <li>• BNI Virtual Account</li>
                              <li>• Mandiri Bill Payment</li>
                              <li>• Permata Virtual Account</li>
                            </ul>
                          </div>
                          
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold mb-2">E-Wallet & Others</h4>
                            <ul className="text-sm space-y-1 text-gray-600">
                              <li>• GoPay</li>
                              <li>• OVO</li>
                              <li>• DANA</li>
                              <li>• QRIS</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-3">Testing Cards</h3>
                        <CodeBlock 
                          code={`# Test Credit Card Numbers (Sandbox only)
Visa: 4811 1111 1111 1114
MasterCard: 5211 1111 1111 1117
CVV: 123
Expiry: Any future date`}
                          id="test-cards"
                          language="text"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Storage Section */}
                {activeSection === 'storage' && (
                  <div>
                    <h2 className="text-3xl font-bold mb-6 flex items-center">
                      <Upload className="h-8 w-8 text-blue-600 mr-3" />
                      File Storage Configuration
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-lg mb-3">Local Storage (Default)</h3>
                        <CodeBlock 
                          code={`# Local storage settings
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE="10485760"  # 10MB in bytes
ALLOWED_FILE_TYPES="image/jpeg,image/png,application/pdf"`}
                          id="local-storage"
                          language="env"
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-3">AWS S3 Configuration</h3>
                        <CodeBlock 
                          code={`# AWS S3 Settings
STORAGE_TYPE="s3"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="ap-southeast-1"
AWS_S3_BUCKET="your-bucket-name"
AWS_S3_ENDPOINT="https://s3.amazonaws.com"  # Optional for S3-compatible services`}
                          id="s3-storage"
                          language="env"
                          secret={true}
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-3">Cloudinary Configuration</h3>
                        <CodeBlock 
                          code={`# Cloudinary Settings
STORAGE_TYPE="cloudinary"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
CLOUDINARY_UPLOAD_PRESET="your-preset"  # Optional`}
                          id="cloudinary-storage"
                          language="env"
                          secret={true}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Monitoring Section */}
                {activeSection === 'monitoring' && (
                  <div>
                    <h2 className="text-3xl font-bold mb-6 flex items-center">
                      <Zap className="h-8 w-8 text-blue-600 mr-3" />
                      Monitoring & Analytics
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-lg mb-3">Error Tracking - Sentry</h3>
                        <CodeBlock 
                          code={`# Sentry Configuration
SENTRY_DSN="https://your-key@sentry.io/project-id"
SENTRY_ENVIRONMENT="production"
SENTRY_TRACES_SAMPLE_RATE="1.0"  # 1.0 = 100%
SENTRY_RELEASE="1.0.0"`}
                          id="sentry-config"
                          language="env"
                          secret={true}
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-3">Analytics - Google Analytics</h3>
                        <CodeBlock 
                          code={`# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Optional: Google Tag Manager
NEXT_PUBLIC_GTM_ID="GTM-XXXXXXX"`}
                          id="analytics-config"
                          language="env"
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-3">Application Monitoring</h3>
                        <CodeBlock 
                          code={`# New Relic
NEW_RELIC_LICENSE_KEY="your-license-key"
NEW_RELIC_APP_NAME="Pondok Imam Syafii"

# LogRocket
NEXT_PUBLIC_LOGROCKET_APP_ID="your-app-id"`}
                          id="monitoring-config"
                          language="env"
                          secret={true}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Section */}
                {activeSection === 'security' && (
                  <div>
                    <h2 className="text-3xl font-bold mb-6 flex items-center">
                      <Lock className="h-8 w-8 text-blue-600 mr-3" />
                      Security Configuration
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-lg mb-3">Security Headers</h3>
                        <CodeBlock 
                          code={`# Content Security Policy
CSP_DIRECTIVES="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'"

# CORS Settings
CORS_ORIGIN="https://yourdomain.com,https://app.yourdomain.com"
CORS_CREDENTIALS="true"`}
                          id="security-headers"
                          language="env"
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-3">Rate Limiting</h3>
                        <CodeBlock 
                          code={`# Rate Limit Configuration
RATE_LIMIT_ENABLED="true"
RATE_LIMIT_WINDOW_MS="900000"  # 15 minutes
RATE_LIMIT_MAX_REQUESTS="100"

# Redis for distributed rate limiting
REDIS_URL="redis://localhost:6379"`}
                          id="rate-limit-config"
                          language="env"
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-3">Encryption & Hashing</h3>
                        <CodeBlock 
                          code={`# Bcrypt Rounds
BCRYPT_ROUNDS="12"

# Encryption Key (for sensitive data)
ENCRYPTION_KEY="32-character-encryption-key-here"

# JWT Settings
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="24h"`}
                          id="encryption-config"
                          language="env"
                          secret={true}
                        />
                      </div>

                      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                          <div>
                            <p className="text-sm text-red-800">
                              <strong>Security Warning:</strong> Never commit .env files to version control. 
                              Always use strong, unique secrets and rotate them regularly.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Advanced Section */}
                {activeSection === 'advanced' && (
                  <div>
                    <h2 className="text-3xl font-bold mb-6 flex items-center">
                      <Settings className="h-8 w-8 text-blue-600 mr-3" />
                      Advanced Configuration
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-lg mb-3">Performance Optimization</h3>
                        <CodeBlock 
                          code={`# Cache Configuration
CACHE_TTL="3600"  # 1 hour
CACHE_STRATEGY="memory"  # memory, redis, or disk

# Image Optimization
IMAGE_QUALITY="85"
IMAGE_FORMATS="webp,avif"
IMAGE_SIZES="640,750,828,1080,1200,1920,2048,3840"`}
                          id="performance-config"
                          language="env"
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-3">Feature Flags</h3>
                        <CodeBlock 
                          code={`# Feature Toggles
FEATURE_2FA_ENABLED="true"
FEATURE_PWA_ENABLED="true"
FEATURE_PAYMENT_ENABLED="true"
FEATURE_WHATSAPP_ENABLED="false"
FEATURE_EMAIL_NOTIFICATIONS="true"`}
                          id="feature-flags"
                          language="env"
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-3">Maintenance Mode</h3>
                        <CodeBlock 
                          code={`# Maintenance Settings
MAINTENANCE_MODE="false"
MAINTENANCE_MESSAGE="System is under maintenance. Please try again later."
MAINTENANCE_ALLOWED_IPS="192.168.1.1,10.0.0.1"`}
                          id="maintenance-config"
                          language="env"
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-3">Backup Configuration</h3>
                        <CodeBlock 
                          code={`# Automated Backup
BACKUP_ENABLED="true"
BACKUP_SCHEDULE="0 2 * * *"  # Daily at 2 AM
BACKUP_RETENTION_DAYS="30"
BACKUP_S3_BUCKET="your-backup-bucket"`}
                          id="backup-config"
                          language="env"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Configuration Validation */}
              <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold mb-4">Validate Configuration</h3>
                
                <p className="text-gray-600 mb-4">
                  Run this command to validate your environment configuration:
                </p>
                
                <CodeBlock 
                  code={`# Check configuration
npm run config:validate

# Test database connection
npm run db:test

# Test email sending
npm run email:test

# Full system check
npm run system:check`}
                  id="validate-config"
                />

                <div className="mt-6 p-4 bg-green-50 rounded">
                  <h4 className="font-semibold mb-2">Configuration Checklist:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>☑ Environment variables set correctly</li>
                    <li>☑ Database connection working</li>
                    <li>☑ Authentication configured</li>
                    <li>☑ Email service tested</li>
                    <li>☑ Payment gateway configured (if needed)</li>
                    <li>☑ Security settings reviewed</li>
                    <li>☑ Backup strategy in place</li>
                  </ul>
                </div>
              </div>

              {/* Next Steps */}
              <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-lg">
                <h3 className="font-bold text-2xl mb-4">Configuration Complete!</h3>
                <p className="text-gray-700 mb-4">
                  Your system is now configured. Here are the next steps:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <Link href="/docs/database/setup" className="bg-white p-4 rounded-lg hover:shadow-lg transition">
                    <h4 className="font-semibold mb-2">🗄️ Setup Database</h4>
                    <p className="text-sm text-gray-600">Initialize schema and seed data</p>
                  </Link>
                  <Link href="/docs/deployment/vercel" className="bg-white p-4 rounded-lg hover:shadow-lg transition">
                    <h4 className="font-semibold mb-2">🚀 Deploy to Production</h4>
                    <p className="text-sm text-gray-600">Deploy your configured app</p>
                  </Link>
                  <Link href="/docs/data-requirements" className="bg-white p-4 rounded-lg hover:shadow-lg transition">
                    <h4 className="font-semibold mb-2">📝 Add Your Data</h4>
                    <p className="text-sm text-gray-600">Import institution data</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}