'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Database, 
  Copy, 
  Check, 
  Terminal,
  Cloud,
  Server,
  AlertCircle,
  CheckCircle2,
  Info,
  Play,
  Settings,
  Shield,
  Zap,
  DollarSign,
  Globe,
  Package,
  GitBranch,
  RefreshCw,
  HardDrive,
  Key,
  Lock,
  Users,
  FileText,
  Download,
  Eye,
  Table
} from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';

export default function DatabaseSetupPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState('supabase');
  const [activeTab, setActiveTab] = useState('cloud');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const CodeBlock = ({ code, id, language = 'bash', title = '' }: { 
    code: string; 
    id: string; 
    language?: string;
    title?: string;
  }) => (
    <div className="relative bg-gray-900 text-gray-100 rounded-lg overflow-hidden">
      {title && (
        <div className="bg-gray-800 px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
          {title}
        </div>
      )}
      <div className="relative p-4 overflow-x-auto">
        <button
          onClick={() => handleCopy(code, id)}
          className="absolute top-2 right-2 p-2 bg-gray-800 rounded hover:bg-gray-700 transition opacity-0 hover:opacity-100"
        >
          {copiedId === id ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
        </button>
        <pre className="text-sm font-mono">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  );

  const providers = {
    supabase: { 
      name: 'Supabase', 
      icon: '⚡', 
      color: 'bg-green-500',
      description: 'Open source Firebase alternative',
      free: '500MB database, 2GB file storage',
      price: 'Free tier available'
    },
    prisma: { 
      name: 'Prisma Accelerate', 
      icon: '🚀', 
      color: 'bg-purple-500',
      description: 'Global database cache & connection pooling',
      free: '100k requests/month',
      price: 'Free tier available'
    },
    neon: { 
      name: 'Neon', 
      icon: '🌟', 
      color: 'bg-blue-500',
      description: 'Serverless PostgreSQL',
      free: '3GB storage, unlimited databases',
      price: 'Free tier available'
    },
    railway: { 
      name: 'Railway', 
      icon: '🚂', 
      color: 'bg-indigo-500',
      description: 'Infrastructure platform',
      free: '$5 free credit/month',
      price: 'Pay as you go'
    }
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
              <Database className="h-12 w-12 mr-4" />
              <h1 className="text-4xl font-bold">Database Setup Guide</h1>
            </div>
            <p className="text-xl text-blue-100">
              Configure PostgreSQL database for Pondok Imam Syafi\'i system
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Database Schema Overview */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Table className="h-8 w-8 text-blue-600 mr-3" />
              Database Schema Overview
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Core Tables</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Users & Authentication</li>
                  <li>• Students & Parents</li>
                  <li>• Teachers & Staff</li>
                  <li>• Classes & Grades</li>
                  <li>• Academic Years</li>
                </ul>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Financial</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• SPP Bills & Payments</li>
                  <li>• Payment Methods</li>
                  <li>• Financial Reports</li>
                  <li>• Discounts & Fees</li>
                  <li>• Transaction History</li>
                </ul>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Academic</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Hafalan Records</li>
                  <li>• Attendance</li>
                  <li>• Grades & Reports</li>
                  <li>• PPDB Applications</li>
                  <li>• Announcements</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Total Tables:</strong> 45+ tables with relationships
                <span className="mx-2">•</span>
                <strong>Database Size:</strong> ~100MB initial, grows with data
                <span className="mx-2">•</span>
                <strong>Indexes:</strong> Optimized for common queries
              </p>
            </div>
          </div>

          {/* Setup Options */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('cloud')}
                  className={`flex-1 px-6 py-4 text-center font-semibold transition flex items-center justify-center ${
                    activeTab === 'cloud'
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Cloud className="h-5 w-5 mr-2" />
                  Cloud Database (Recommended)
                </button>
                <button
                  onClick={() => setActiveTab('local')}
                  className={`flex-1 px-6 py-4 text-center font-semibold transition flex items-center justify-center ${
                    activeTab === 'local'
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Server className="h-5 w-5 mr-2" />
                  Local PostgreSQL
                </button>
              </div>

              <div className="p-8">
                {/* Cloud Database Setup */}
                {activeTab === 'cloud' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Cloud Database Providers</h3>
                      <p className="text-gray-600 mb-6">
                        Choose a cloud database provider for easy setup and management.
                      </p>
                    </div>

                    {/* Provider Selection */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      {Object.entries(providers).map(([key, provider]) => (
                        <button
                          key={key}
                          onClick={() => setActiveProvider(key)}
                          className={`p-4 rounded-lg border-2 transition text-left ${
                            activeProvider === key
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-2">{provider.icon}</div>
                          <h4 className="font-bold">{provider.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">{provider.description}</p>
                          <p className="text-xs text-green-600 mt-2 font-semibold">{provider.price}</p>
                        </button>
                      ))}
                    </div>

                    {/* Supabase Setup */}
                    {activeProvider === 'supabase' && (
                      <div className="space-y-6">
                        <div className="p-6 bg-green-50 rounded-lg">
                          <h4 className="font-bold text-lg mb-4 flex items-center">
                            <Zap className="h-6 w-6 text-green-600 mr-2" />
                            Setup Supabase Database
                          </h4>

                          <ol className="space-y-4">
                            <li className="flex items-start">
                              <span className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold mr-3">
                                1
                              </span>
                              <div className="flex-1">
                                <p className="font-semibold">Create Supabase Account</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Sign up at <a href="https://supabase.com" target="_blank" className="text-blue-600 underline">supabase.com</a> with GitHub
                                </p>
                              </div>
                            </li>

                            <li className="flex items-start">
                              <span className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold mr-3">
                                2
                              </span>
                              <div className="flex-1">
                                <p className="font-semibold">Create New Project</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Name: <code className="bg-gray-100 px-1">pondok-imam-syafii</code>
                                </p>
                                <p className="text-sm text-gray-600">
                                  Region: Choose nearest to your users
                                </p>
                                <p className="text-sm text-gray-600">
                                  Database Password: Save this securely!
                                </p>
                              </div>
                            </li>

                            <li className="flex items-start">
                              <span className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold mr-3">
                                3
                              </span>
                              <div className="flex-1">
                                <p className="font-semibold">Get Connection String</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Go to Settings → Database → Connection String
                                </p>
                                <CodeBlock
                                  code={`# Connection string format:
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# With connection pooling (recommended):
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres?pgbouncer=true`}
                                  id="supabase-connection"
                                  language="env"
                                />
                              </div>
                            </li>

                            <li className="flex items-start">
                              <span className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold mr-3">
                                4
                              </span>
                              <div className="flex-1">
                                <p className="font-semibold">Update Environment Variable</p>
                                <CodeBlock
                                  code={`# In your .env.local file:
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"`}
                                  id="supabase-env"
                                  language="env"
                                />
                              </div>
                            </li>
                          </ol>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h5 className="font-semibold mb-2">Supabase Features:</h5>
                          <ul className="space-y-1 text-sm">
                            <li>✓ Automatic backups</li>
                            <li>✓ Built-in Auth (optional)</li>
                            <li>✓ Realtime subscriptions</li>
                            <li>✓ SQL editor in dashboard</li>
                            <li>✓ Connection pooling included</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Prisma Accelerate Setup */}
                    {activeProvider === 'prisma' && (
                      <div className="space-y-6">
                        <div className="p-6 bg-purple-50 rounded-lg">
                          <h4 className="font-bold text-lg mb-4 flex items-center">
                            <Zap className="h-6 w-6 text-purple-600 mr-2" />
                            Setup Prisma Accelerate
                          </h4>

                          <ol className="space-y-4">
                            <li className="flex items-start">
                              <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold mr-3">
                                1
                              </span>
                              <div className="flex-1">
                                <p className="font-semibold">Sign up for Prisma Data Platform</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Visit <a href="https://www.prisma.io/data-platform" target="_blank" className="text-blue-600 underline">prisma.io/data-platform</a>
                                </p>
                              </div>
                            </li>

                            <li className="flex items-start">
                              <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold mr-3">
                                2
                              </span>
                              <div className="flex-1">
                                <p className="font-semibold">Create Accelerate Project</p>
                                <CodeBlock
                                  code={`# Install Prisma CLI globally
npm install -g prisma

# Initialize Accelerate
npx prisma init --datasource-provider postgresql`}
                                  id="prisma-init"
                                />
                              </div>
                            </li>

                            <li className="flex items-start">
                              <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold mr-3">
                                3
                              </span>
                              <div className="flex-1">
                                <p className="font-semibold">Get Accelerate Connection String</p>
                                <CodeBlock
                                  code={`# Accelerate URL format:
prisma://accelerate.prisma-data.net/?api_key=[YOUR-API-KEY]

# Update schema.prisma:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL") // For migrations
}`}
                                  id="prisma-url"
                                  language="prisma"
                                />
                              </div>
                            </li>
                          </ol>
                        </div>

                        <div className="p-4 bg-purple-50 rounded-lg">
                          <h5 className="font-semibold mb-2">Accelerate Benefits:</h5>
                          <ul className="space-y-1 text-sm">
                            <li>✓ Global edge caching</li>
                            <li>✓ Connection pooling</li>
                            <li>✓ Query result caching</li>
                            <li>✓ Reduced latency</li>
                            <li>✓ Works with any PostgreSQL</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Neon Setup */}
                    {activeProvider === 'neon' && (
                      <div className="space-y-6">
                        <div className="p-6 bg-blue-50 rounded-lg">
                          <h4 className="font-bold text-lg mb-4 flex items-center">
                            <Database className="h-6 w-6 text-blue-600 mr-2" />
                            Setup Neon Database
                          </h4>

                          <ol className="space-y-4">
                            <li className="flex items-start">
                              <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
                                1
                              </span>
                              <div className="flex-1">
                                <p className="font-semibold">Create Neon Account</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Sign up at <a href="https://neon.tech" target="_blank" className="text-blue-600 underline">neon.tech</a>
                                </p>
                              </div>
                            </li>

                            <li className="flex items-start">
                              <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
                                2
                              </span>
                              <div className="flex-1">
                                <p className="font-semibold">Create Project</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  PostgreSQL version: 15 (latest)
                                </p>
                                <p className="text-sm text-gray-600">
                                  Region: Choose nearest
                                </p>
                              </div>
                            </li>

                            <li className="flex items-start">
                              <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
                                3
                              </span>
                              <div className="flex-1">
                                <p className="font-semibold">Connection Details</p>
                                <CodeBlock
                                  code={`# Pooled connection (for serverless):
postgresql://[user]:[password]@[endpoint].neon.tech/[dbname]?sslmode=require

# Direct connection:
postgresql://[user]:[password]@[endpoint].neon.tech:5432/[dbname]`}
                                  id="neon-connection"
                                  language="env"
                                />
                              </div>
                            </li>
                          </ol>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h5 className="font-semibold mb-2">Neon Features:</h5>
                          <ul className="space-y-1 text-sm">
                            <li>✓ Serverless PostgreSQL</li>
                            <li>✓ Autoscaling & branching</li>
                            <li>✓ Point-in-time recovery</li>
                            <li>✓ Instant database copies</li>
                            <li>✓ Pay per use pricing</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Railway Setup */}
                    {activeProvider === 'railway' && (
                      <div className="space-y-6">
                        <div className="p-6 bg-indigo-50 rounded-lg">
                          <h4 className="font-bold text-lg mb-4 flex items-center">
                            <Server className="h-6 w-6 text-indigo-600 mr-2" />
                            Setup Railway PostgreSQL
                          </h4>

                          <ol className="space-y-4">
                            <li className="flex items-start">
                              <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold mr-3">
                                1
                              </span>
                              <div className="flex-1">
                                <p className="font-semibold">Create Railway Account</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Sign up at <a href="https://railway.app" target="_blank" className="text-blue-600 underline">railway.app</a>
                                </p>
                              </div>
                            </li>

                            <li className="flex items-start">
                              <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold mr-3">
                                2
                              </span>
                              <div className="flex-1">
                                <p className="font-semibold">New Project → Deploy PostgreSQL</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Click "New Project" → "Provision PostgreSQL"
                                </p>
                              </div>
                            </li>

                            <li className="flex items-start">
                              <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold mr-3">
                                3
                              </span>
                              <div className="flex-1">
                                <p className="font-semibold">Get Connection URL</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Go to PostgreSQL service → Variables → DATABASE_URL
                                </p>
                              </div>
                            </li>
                          </ol>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Local Database Setup */}
                {activeTab === 'local' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Local PostgreSQL Setup</h3>
                      <p className="text-gray-600 mb-6">
                        Install and configure PostgreSQL on your local machine.
                      </p>
                    </div>

                    {/* Installation */}
                    <div>
                      <h4 className="font-bold text-lg mb-4">Install PostgreSQL</h4>
                      
                      <div className="space-y-4">
                        {/* Windows */}
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold mb-2">Windows</h5>
                          <p className="text-sm text-gray-600 mb-3">
                            Download installer from <a href="https://www.postgresql.org/download/windows/" target="_blank" className="text-blue-600 underline">postgresql.org</a>
                          </p>
                          <p className="text-sm text-gray-600">
                            Or use Chocolatey:
                          </p>
                          <CodeBlock
                            code="choco install postgresql"
                            id="install-pg-windows"
                          />
                        </div>

                        {/* macOS */}
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold mb-2">macOS</h5>
                          <CodeBlock
                            code={`# Using Homebrew
brew install postgresql@15
brew services start postgresql@15

# Or download Postgres.app
# https://postgresapp.com/`}
                            id="install-pg-mac"
                          />
                        </div>

                        {/* Linux */}
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold mb-2">Linux (Ubuntu/Debian)</h5>
                          <CodeBlock
                            code={`# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql`}
                            id="install-pg-linux"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Create Database */}
                    <div>
                      <h4 className="font-bold text-lg mb-4">Create Database and User</h4>
                      <CodeBlock
                        code={`# Access PostgreSQL as superuser
sudo -u postgres psql

# Or on macOS/Windows:
psql -U postgres

# Create database and user
CREATE USER pondok_user WITH PASSWORD 'your-secure-password';
CREATE DATABASE imam_syafii_db OWNER pondok_user;
GRANT ALL PRIVILEGES ON DATABASE imam_syafii_db TO pondok_user;

# Exit
\\q`}
                        id="create-db-local"
                        language="sql"
                      />
                    </div>

                    {/* Configure Connection */}
                    <div>
                      <h4 className="font-bold text-lg mb-4">Configure Connection</h4>
                      <CodeBlock
                        code={`# Update .env.local
DATABASE_URL="postgresql://pondok_user:your-secure-password@localhost:5432/imam_syafii_db"

# Test connection
npx prisma db pull`}
                        id="config-local-db"
                        language="env"
                      />
                    </div>

                    {/* PostgreSQL Configuration */}
                    <div>
                      <h4 className="font-bold text-lg mb-4">Optimize PostgreSQL Settings</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Edit postgresql.conf for better performance:
                      </p>
                      <CodeBlock
                        code={`# Find config file location
psql -U postgres -c 'SHOW config_file'

# Common optimizations:
shared_buffers = 256MB          # 25% of RAM
effective_cache_size = 1GB      # 50-75% of RAM
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1          # For SSD
work_mem = 4MB

# Connection settings
max_connections = 100
listen_addresses = 'localhost'`}
                        id="postgres-config"
                        language="ini"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Initialize Schema */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <GitBranch className="h-8 w-8 text-purple-600 mr-3" />
              Initialize Database Schema
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-3">Step 1: Generate Prisma Client</h3>
                <CodeBlock
                  code={`# Generate Prisma Client
npx prisma generate

# This creates the client at node_modules/@prisma/client`}
                  id="prisma-generate"
                />
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3">Step 2: Push Schema to Database</h3>
                <CodeBlock
                  code={`# Push schema without creating migrations (development)
npx prisma db push

# Or create and apply migrations (production)
npx prisma migrate dev --name init`}
                  id="prisma-push"
                />
                
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> Use <code className="bg-yellow-100 px-1">db push</code> for development 
                        and <code className="bg-yellow-100 px-1">migrate</code> for production to track schema changes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3">Step 3: Seed Initial Data</h3>
                <CodeBlock
                  code={`# Run seed script
npx prisma db seed

# This will create:
# - Admin user (username: admin, password: admin123)
# - Sample institution levels (TK, SD, SMP, PONDOK)
# - Academic year
# - Sample data for testing`}
                  id="prisma-seed"
                />
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3">Step 4: Verify Setup</h3>
                <CodeBlock
                  code={`# Open Prisma Studio to view data
npx prisma studio

# Opens at http://localhost:5555`}
                  id="prisma-studio"
                />
              </div>
            </div>
          </div>

          {/* Database Management */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Settings className="h-8 w-8 text-gray-600 mr-3" />
              Database Management Commands
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-3">Schema Management</h3>
                <CodeBlock
                  code={`# Pull schema from database
npx prisma db pull

# Format schema file
npx prisma format

# Validate schema
npx prisma validate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset`}
                  id="schema-commands"
                />
              </div>

              <div>
                <h3 className="font-bold mb-3">Migration Commands</h3>
                <CodeBlock
                  code={`# Create migration
npx prisma migrate dev --name add_feature

# Apply migrations
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Resolve failed migrations
npx prisma migrate resolve`}
                  id="migration-commands"
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-bold mb-3">Database Introspection</h3>
              <CodeBlock
                code={`# Introspect existing database
npx prisma db pull

# This updates your schema.prisma file
# to match the current database structure`}
                id="introspection"
              />
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <AlertCircle className="h-8 w-8 text-orange-600 mr-3" />
              Common Database Issues
            </h2>

            <div className="space-y-6">
              <div className="border-l-4 border-orange-400 pl-4">
                <h3 className="font-semibold mb-2">P1001: Can't reach database</h3>
                <p className="text-sm text-gray-600 mb-2">Check your connection string and database status:</p>
                <CodeBlock
                  code={`# Test connection
npx prisma db pull

# Check DATABASE_URL format
echo $DATABASE_URL

# For local: ensure PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list                 # macOS`}
                  id="fix-p1001"
                />
              </div>

              <div className="border-l-4 border-orange-400 pl-4">
                <h3 className="font-semibold mb-2">P1002: Connection timeout</h3>
                <p className="text-sm text-gray-600 mb-2">Add connection timeout and pool settings:</p>
                <CodeBlock
                  code={`# Add to DATABASE_URL
?connect_timeout=30&pool_timeout=30&socket_timeout=30

# For serverless/edge:
?pgbouncer=true&connection_limit=1`}
                  id="fix-p1002"
                  language="env"
                />
              </div>

              <div className="border-l-4 border-orange-400 pl-4">
                <h3 className="font-semibold mb-2">Migration failed</h3>
                <p className="text-sm text-gray-600 mb-2">Reset and reapply migrations:</p>
                <CodeBlock
                  code={`# Mark migration as rolled back
npx prisma migrate resolve --rolled-back

# Or reset database (WARNING: data loss)
npx prisma migrate reset`}
                  id="fix-migration"
                />
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <CheckCircle2 className="h-8 w-8 text-green-600 mr-3" />
              Database Best Practices
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-3">Security</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Lock className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                    <span>Use strong, unique passwords</span>
                  </li>
                  <li className="flex items-start">
                    <Lock className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                    <span>Enable SSL/TLS connections</span>
                  </li>
                  <li className="flex items-start">
                    <Lock className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                    <span>Restrict database access IPs</span>
                  </li>
                  <li className="flex items-start">
                    <Lock className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                    <span>Use connection pooling</span>
                  </li>
                  <li className="flex items-start">
                    <Lock className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                    <span>Regular security updates</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-3">Performance</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Zap className="h-4 w-4 text-yellow-600 mt-0.5 mr-2" />
                    <span>Add indexes for frequent queries</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-4 w-4 text-yellow-600 mt-0.5 mr-2" />
                    <span>Use connection pooling</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-4 w-4 text-yellow-600 mt-0.5 mr-2" />
                    <span>Optimize query patterns</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-4 w-4 text-yellow-600 mt-0.5 mr-2" />
                    <span>Regular VACUUM and ANALYZE</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-4 w-4 text-yellow-600 mt-0.5 mr-2" />
                    <span>Monitor slow queries</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-lg">
            <h3 className="font-bold text-2xl mb-4">Database Ready! 🎉</h3>
            <p className="text-gray-700 mb-6">
              Your database is configured and ready. Here are the next steps:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/docs/database/migrations" className="bg-white p-4 rounded-lg hover:shadow-lg transition">
                <h4 className="font-semibold mb-2">📝 Migrations</h4>
                <p className="text-sm text-gray-600">Learn about schema migrations</p>
              </Link>
              <Link href="/docs/database/backup" className="bg-white p-4 rounded-lg hover:shadow-lg transition">
                <h4 className="font-semibold mb-2">💾 Backup</h4>
                <p className="text-sm text-gray-600">Setup backup strategies</p>
              </Link>
              <Link href="/docs/database/performance" className="bg-white p-4 rounded-lg hover:shadow-lg transition">
                <h4 className="font-semibold mb-2">⚡ Optimization</h4>
                <p className="text-sm text-gray-600">Performance tuning</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}