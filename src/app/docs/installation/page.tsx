'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Terminal, 
  Copy, 
  Check, 
  Server,
  Database,
  Package,
  Globe,
  HardDrive,
  Monitor,
  Cloud,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
  ArrowRight,
  Download,
  GitBranch,
  Cpu,
  MemoryStick
} from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';

export default function InstallationPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('local');
  const [osType, setOsType] = useState('windows');

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

  const SystemRequirement = ({ 
    icon: Icon, 
    title, 
    minimum, 
    recommended 
  }: { 
    icon: any; 
    title: string; 
    minimum: string; 
    recommended: string; 
  }) => (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div className="flex items-center mb-3">
        <Icon className="h-6 w-6 text-blue-600 mr-3" />
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500 block mb-1">Minimum</span>
          <span className="font-semibold">{minimum}</span>
        </div>
        <div>
          <span className="text-gray-500 block mb-1">Recommended</span>
          <span className="font-semibold text-green-600">{recommended}</span>
        </div>
      </div>
    </div>
  );

  const installationMethods = {
    local: {
      title: 'Local Development',
      icon: Monitor,
      description: 'Install on your local machine for development'
    },
    cloud: {
      title: 'Cloud Deployment',
      icon: Cloud,
      description: 'Deploy directly to cloud platforms'
    },
    docker: {
      title: 'Docker Container',
      icon: Package,
      description: 'Run in containerized environment'
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
            <h1 className="text-4xl font-bold mb-4">Installation Guide</h1>
            <p className="text-xl text-blue-100">
              Complete installation instructions for all environments
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* System Requirements */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Server className="h-8 w-8 text-blue-600 mr-3" />
              System Requirements
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <SystemRequirement
                icon={Cpu}
                title="Processor"
                minimum="2 Core CPU"
                recommended="4+ Core CPU"
              />
              <SystemRequirement
                icon={MemoryStick}
                title="Memory"
                minimum="4 GB RAM"
                recommended="8+ GB RAM"
              />
              <SystemRequirement
                icon={HardDrive}
                title="Storage"
                minimum="10 GB Free"
                recommended="20+ GB Free"
              />
              <SystemRequirement
                icon={Monitor}
                title="Node.js"
                minimum="v18.0.0"
                recommended="v20.0.0+"
              />
              <SystemRequirement
                icon={Database}
                title="Database"
                minimum="PostgreSQL 12"
                recommended="PostgreSQL 15+"
              />
              <SystemRequirement
                icon={Globe}
                title="Network"
                minimum="Stable Internet"
                recommended="High-speed Internet"
              />
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> For production deployment, we recommend using cloud services like 
                    Vercel (for hosting) and Supabase or Prisma Accelerate (for database) which handle 
                    infrastructure requirements automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Installation Method Tabs */}
          <div className="mb-8">
            <div className="flex space-x-4 border-b">
              {Object.entries(installationMethods).map(([key, method]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center px-6 py-3 border-b-2 transition ${
                    activeTab === key
                      ? 'border-blue-600 text-blue-600 font-semibold'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <method.icon className="h-5 w-5 mr-2" />
                  {method.title}
                </button>
              ))}
            </div>
          </div>

          {/* Local Development Installation */}
          {activeTab === 'local' && (
            <div className="space-y-8">
              {/* OS Selection */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4">Select Your Operating System</h3>
                <div className="flex space-x-4">
                  {['windows', 'macos', 'linux'].map((os) => (
                    <button
                      key={os}
                      onClick={() => setOsType(os)}
                      className={`px-4 py-2 rounded-lg border-2 transition ${
                        osType === os
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {os === 'windows' ? 'Windows' : os === 'macos' ? 'macOS' : 'Linux'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 1: Install Prerequisites */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold mb-6">Step 1: Install Prerequisites</h3>
                
                <div className="space-y-6">
                  {/* Node.js Installation */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Package className="h-5 w-5 mr-2 text-green-600" />
                      Install Node.js (v18 or higher)
                    </h4>
                    
                    {osType === 'windows' && (
                      <>
                        <p className="text-gray-600 mb-3">Download and install Node.js from the official website:</p>
                        <a 
                          href="https://nodejs.org/en/download/" 
                          target="_blank"
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-3"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Node.js for Windows
                        </a>
                        <p className="text-sm text-gray-500 mb-3">Or use Chocolatey:</p>
                        <CodeBlock code="choco install nodejs" id="node-windows" />
                      </>
                    )}
                    
                    {osType === 'macos' && (
                      <>
                        <p className="text-gray-600 mb-3">Install using Homebrew:</p>
                        <CodeBlock code="brew install node" id="node-macos" />
                        <p className="text-sm text-gray-500 mt-2">Or download from nodejs.org</p>
                      </>
                    )}
                    
                    {osType === 'linux' && (
                      <>
                        <p className="text-gray-600 mb-3">Install using package manager:</p>
                        <CodeBlock 
                          code={`# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Fedora/RHEL
sudo dnf module install nodejs:20

# Arch Linux
sudo pacman -S nodejs npm`}
                          id="node-linux"
                        />
                      </>
                    )}
                    
                    <div className="mt-4 p-3 bg-gray-50 rounded">
                      <p className="text-sm font-semibold mb-2">Verify Installation:</p>
                      <CodeBlock 
                        code={`node --version  # Should show v18.0.0 or higher
npm --version   # Should show v9.0.0 or higher`}
                        id="verify-node"
                      />
                    </div>
                  </div>

                  {/* Git Installation */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <GitBranch className="h-5 w-5 mr-2 text-purple-600" />
                      Install Git
                    </h4>
                    
                    {osType === 'windows' && (
                      <>
                        <p className="text-gray-600 mb-3">Download Git for Windows:</p>
                        <a 
                          href="https://git-scm.com/download/win" 
                          target="_blank"
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-3"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Git for Windows
                        </a>
                        <p className="text-sm text-gray-500">Or use Chocolatey:</p>
                        <CodeBlock code="choco install git" id="git-windows" />
                      </>
                    )}
                    
                    {osType === 'macos' && (
                      <CodeBlock code="brew install git" id="git-macos" />
                    )}
                    
                    {osType === 'linux' && (
                      <CodeBlock 
                        code={`# Ubuntu/Debian
sudo apt-get install git

# Fedora
sudo dnf install git

# Arch Linux
sudo pacman -S git`}
                        id="git-linux"
                      />
                    )}
                    
                    <div className="mt-4 p-3 bg-gray-50 rounded">
                      <p className="text-sm font-semibold mb-2">Verify Installation:</p>
                      <CodeBlock code="git --version  # Should show git version 2.x.x" id="verify-git" />
                    </div>
                  </div>

                  {/* PostgreSQL Installation */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Database className="h-5 w-5 mr-2 text-blue-600" />
                      Install PostgreSQL (Optional - Can use cloud database)
                    </h4>
                    
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded">
                      <div className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm text-green-800">
                            <strong>Tip:</strong> You can skip local PostgreSQL installation and use free cloud databases:
                          </p>
                          <ul className="mt-2 space-y-1 text-sm text-green-700">
                            <li>• <a href="https://supabase.com" className="underline">Supabase</a> - Free PostgreSQL hosting</li>
                            <li>• <a href="https://www.prisma.io/data-platform" className="underline">Prisma Accelerate</a> - Serverless PostgreSQL</li>
                            <li>• <a href="https://neon.tech" className="underline">Neon</a> - Serverless PostgreSQL</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    {osType === 'windows' && (
                      <>
                        <p className="text-gray-600 mb-3">Download PostgreSQL installer:</p>
                        <a 
                          href="https://www.postgresql.org/download/windows/" 
                          target="_blank"
                          className="inline-flex items-center text-blue-600 hover:text-blue-700"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download PostgreSQL for Windows
                        </a>
                      </>
                    )}
                    
                    {osType === 'macos' && (
                      <CodeBlock code="brew install postgresql@15" id="postgres-macos" />
                    )}
                    
                    {osType === 'linux' && (
                      <CodeBlock 
                        code={`# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# Fedora
sudo dnf install postgresql postgresql-server

# Arch Linux
sudo pacman -S postgresql`}
                        id="postgres-linux"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Step 2: Clone Repository */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold mb-6">Step 2: Clone Repository</h3>
                
                <div className="space-y-4">
                  <p className="text-gray-600">Clone the repository to your local machine:</p>
                  
                  <CodeBlock 
                    code={`# Clone via HTTPS
git clone https://github.com/pendtiumpraz/pesantren-coconut.git

# Or clone via SSH (if you have SSH keys set up)
git clone git@github.com:pendtiumpraz/pesantren-coconut.git

# Navigate to project directory
cd pesantren-coconut`}
                    id="clone-repo"
                  />
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm text-yellow-800">
                          <strong>Fork First:</strong> If you plan to contribute, fork the repository first 
                          to your GitHub account, then clone your fork instead.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Install Dependencies */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold mb-6">Step 3: Install Dependencies</h3>
                
                <div className="space-y-4">
                  <p className="text-gray-600">Install all project dependencies:</p>
                  
                  <CodeBlock 
                    code={`# Using npm (recommended)
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install`}
                    id="install-deps"
                  />
                  
                  <div className="mt-4 p-4 bg-gray-50 rounded">
                    <h4 className="font-semibold mb-2">What gets installed:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>✓ Next.js 14 framework</li>
                      <li>✓ TypeScript and type definitions</li>
                      <li>✓ Prisma ORM client</li>
                      <li>✓ UI components (Tailwind, Radix UI)</li>
                      <li>✓ Authentication libraries</li>
                      <li>✓ Development tools</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm text-blue-800">
                          <strong>Large Download:</strong> The installation will download ~200MB of packages. 
                          This may take 3-10 minutes depending on your internet speed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Environment Setup */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold mb-6">Step 4: Environment Configuration</h3>
                
                <div className="space-y-4">
                  <p className="text-gray-600">Create your environment configuration file:</p>
                  
                  <CodeBlock 
                    code={`# Copy the example environment file
${osType === 'windows' ? 'copy' : 'cp'} .env.example .env.local`}
                    id="copy-env"
                  />
                  
                  <p className="text-gray-600 mt-4">Edit the <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> file with your configuration:</p>
                  
                  <CodeBlock 
                    code={`# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/imam_syafii_db"

# NextAuth Configuration (Required)
NEXTAUTH_URL="http://localhost:3030"
NEXTAUTH_SECRET="generate-a-32-character-random-string-here"

# Email Configuration (Optional)
EMAIL_FROM="noreply@example.com"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-specific-password"

# Payment Gateway (Optional)
MIDTRANS_CLIENT_KEY="your-midtrans-client-key"
MIDTRANS_SERVER_KEY="your-midtrans-server-key"
MIDTRANS_IS_PRODUCTION="false"

# WhatsApp API (Optional)
WHATSAPP_API_KEY="your-whatsapp-api-key"
WHATSAPP_API_URL="https://api.whatsapp.com/v1"`}
                    id="env-vars"
                    language="env"
                  />
                  
                  <div className="mt-4 p-4 bg-gray-50 rounded">
                    <h4 className="font-semibold mb-2">Generate NextAuth Secret:</h4>
                    <CodeBlock 
                      code={`# Generate using OpenSSL
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`}
                      id="generate-secret"
                    />
                  </div>
                </div>
              </div>

              {/* Step 5: Database Setup */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold mb-6">Step 5: Database Setup</h3>
                
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Option 1: Local Database */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-3">Option 1: Local PostgreSQL</h4>
                      <CodeBlock 
                        code={`# Create database
createdb imam_syafii_db

# Or using psql
psql -U postgres
CREATE DATABASE imam_syafii_db;
\\q`}
                        id="create-local-db"
                      />
                    </div>
                    
                    {/* Option 2: Cloud Database */}
                    <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-3 text-green-700">Option 2: Cloud Database (Recommended)</h4>
                      <ol className="space-y-2 text-sm">
                        <li>1. Sign up for <a href="https://supabase.com" className="text-blue-600 underline">Supabase</a></li>
                        <li>2. Create a new project</li>
                        <li>3. Copy the database URL from Settings → Database</li>
                        <li>4. Update DATABASE_URL in .env.local</li>
                      </ol>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mt-6">Initialize the database schema:</p>
                  
                  <CodeBlock 
                    code={`# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed initial data (optional)
npx prisma db seed`}
                    id="init-db"
                  />
                  
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm text-blue-800">
                          <strong>Default Admin Account:</strong> After seeding, you can login with:
                        </p>
                        <ul className="mt-1 space-y-0.5 text-sm text-blue-700">
                          <li>Username: <code className="bg-blue-100 px-1">admin</code></li>
                          <li>Password: <code className="bg-blue-100 px-1">admin123</code></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 6: Run Development Server */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold mb-6">Step 6: Start Development Server</h3>
                
                <div className="space-y-4">
                  <p className="text-gray-600">Run the development server:</p>
                  
                  <CodeBlock 
                    code={`# Start development server
npm run dev

# Or with specific port
npm run dev -- -p 3000

# Or using yarn
yarn dev`}
                    id="run-dev"
                  />
                  
                  <div className="mt-4 p-4 bg-green-50 rounded">
                    <h4 className="font-semibold mb-2 text-green-700">Success! Your app is running at:</h4>
                    <a 
                      href="http://localhost:3030" 
                      target="_blank"
                      className="text-blue-600 font-mono text-lg hover:text-blue-700"
                    >
                      http://localhost:3030
                    </a>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Available Scripts:</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li><code className="bg-gray-100 px-1">npm run dev</code> - Development server</li>
                        <li><code className="bg-gray-100 px-1">npm run build</code> - Production build</li>
                        <li><code className="bg-gray-100 px-1">npm run start</code> - Production server</li>
                        <li><code className="bg-gray-100 px-1">npm run lint</code> - Run linter</li>
                      </ul>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Database Commands:</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li><code className="bg-gray-100 px-1">npx prisma studio</code> - Database GUI</li>
                        <li><code className="bg-gray-100 px-1">npx prisma db push</code> - Sync schema</li>
                        <li><code className="bg-gray-100 px-1">npx prisma migrate dev</code> - Create migration</li>
                        <li><code className="bg-gray-100 px-1">npx prisma db seed</code> - Seed data</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cloud Deployment Tab */}
          {activeTab === 'cloud' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Cloud Deployment Options</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Link 
                  href="/docs/deployment/vercel"
                  className="border-2 border-blue-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-lg transition"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-black rounded-lg mr-4">
                      <span className="text-white font-bold text-xl">▲</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl">Vercel</h4>
                      <p className="text-sm text-gray-600">Recommended for production</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ One-click deployment</li>
                    <li>✓ Automatic SSL certificates</li>
                    <li>✓ Global CDN</li>
                    <li>✓ Automatic scaling</li>
                  </ul>
                  <div className="mt-4 text-blue-600 font-semibold">
                    Deploy to Vercel →
                  </div>
                </Link>

                <Link 
                  href="/docs/deployment/vps"
                  className="border-2 border-gray-200 rounded-lg p-6 hover:border-gray-400 hover:shadow-lg transition"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-blue-600 rounded-lg mr-4">
                      <Server className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl">VPS Server</h4>
                      <p className="text-sm text-gray-600">Full control deployment</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ Complete control</li>
                    <li>✓ Custom configuration</li>
                    <li>✓ Cost-effective for scale</li>
                    <li>✓ Private hosting option</li>
                  </ul>
                  <div className="mt-4 text-blue-600 font-semibold">
                    Deploy to VPS →
                  </div>
                </Link>
              </div>

              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h4 className="font-bold mb-3">Quick Deploy to Vercel:</h4>
                <a 
                  href="https://vercel.com/new/clone?repository-url=https://github.com/pendtiumpraz/pesantren-coconut"
                  target="_blank"
                  className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
                >
                  <Cloud className="h-5 w-5 mr-2" />
                  Deploy with Vercel
                </a>
              </div>
            </div>
          )}

          {/* Docker Tab */}
          {activeTab === 'docker' && (
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-6">Docker Installation</h3>
                
                <div className="space-y-6">
                  {/* Install Docker */}
                  <div>
                    <h4 className="font-semibold mb-3">1. Install Docker</h4>
                    
                    {osType === 'windows' && (
                      <div>
                        <p className="text-gray-600 mb-3">Download Docker Desktop for Windows:</p>
                        <a 
                          href="https://docs.docker.com/desktop/install/windows-install/" 
                          target="_blank"
                          className="inline-flex items-center text-blue-600 hover:text-blue-700"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Docker Desktop
                        </a>
                      </div>
                    )}
                    
                    {osType === 'macos' && (
                      <div>
                        <p className="text-gray-600 mb-3">Install Docker Desktop for Mac:</p>
                        <CodeBlock code="brew install --cask docker" id="docker-mac" />
                      </div>
                    )}
                    
                    {osType === 'linux' && (
                      <CodeBlock 
                        code={`# Install Docker Engine
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt-get install docker-compose-plugin`}
                        id="docker-linux"
                      />
                    )}
                  </div>

                  {/* Clone and Build */}
                  <div>
                    <h4 className="font-semibold mb-3">2. Clone Repository</h4>
                    <CodeBlock 
                      code={`git clone https://github.com/pendtiumpraz/pesantren-coconut.git
cd pesantren-coconut`}
                      id="docker-clone"
                    />
                  </div>

                  {/* Environment Setup */}
                  <div>
                    <h4 className="font-semibold mb-3">3. Configure Environment</h4>
                    <CodeBlock 
                      code={`# Copy environment file
${osType === 'windows' ? 'copy' : 'cp'} .env.example .env.local

# Edit .env.local with your configuration
${osType === 'windows' ? 'notepad' : 'nano'} .env.local`}
                      id="docker-env"
                    />
                  </div>

                  {/* Docker Compose */}
                  <div>
                    <h4 className="font-semibold mb-3">4. Run with Docker Compose</h4>
                    <CodeBlock 
                      code={`# Build and start containers
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop containers
docker-compose down`}
                      id="docker-compose"
                    />
                  </div>

                  <div className="mt-6 p-4 bg-green-50 rounded">
                    <h4 className="font-semibold mb-2 text-green-700">Services will be available at:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Application: <code className="bg-green-100 px-1">http://localhost:3030</code></li>
                      <li>• Database: <code className="bg-green-100 px-1">localhost:5432</code></li>
                      <li>• Prisma Studio: <code className="bg-green-100 px-1">http://localhost:5555</code></li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm text-blue-800">
                          <strong>Docker Commands Reference:</strong>
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-blue-700">
                          <li><code className="bg-blue-100 px-1">docker ps</code> - List running containers</li>
                          <li><code className="bg-blue-100 px-1">docker-compose exec app sh</code> - Access app container</li>
                          <li><code className="bg-blue-100 px-1">docker-compose exec db psql -U postgres</code> - Access database</li>
                          <li><code className="bg-blue-100 px-1">docker-compose restart</code> - Restart all services</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Troubleshooting Section */}
          <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <AlertCircle className="h-8 w-8 text-orange-600 mr-3" />
              Common Installation Issues
            </h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-orange-400 pl-4">
                <h3 className="font-semibold mb-2">npm install fails with permission errors</h3>
                <p className="text-sm text-gray-600 mb-2">Solution:</p>
                <CodeBlock 
                  code={`# Clear npm cache
npm cache clean --force

# Or use with sudo (Linux/Mac)
sudo npm install`}
                  id="fix-npm-permission"
                />
              </div>

              <div className="border-l-4 border-orange-400 pl-4">
                <h3 className="font-semibold mb-2">Database connection error</h3>
                <p className="text-sm text-gray-600 mb-2">Check your DATABASE_URL format:</p>
                <CodeBlock 
                  code={`# Correct format:
postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Example:
postgresql://postgres:mypassword@localhost:5432/imam_syafii_db`}
                  id="fix-db-connection"
                  language="env"
                />
              </div>

              <div className="border-l-4 border-orange-400 pl-4">
                <h3 className="font-semibold mb-2">Port 3030 already in use</h3>
                <p className="text-sm text-gray-600 mb-2">Solution:</p>
                <CodeBlock 
                  code={`# Run on different port
npm run dev -- -p 3031

# Or kill process using port 3030
${osType === 'windows' ? 'netstat -ano | findstr :3030' : 'lsof -i :3030'}
${osType === 'windows' ? 'taskkill /PID <PID> /F' : 'kill -9 <PID>'}`}
                  id="fix-port"
                />
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded">
              <p className="text-sm">
                Still having issues? Check our <Link href="/docs/troubleshooting" className="text-blue-600 underline">comprehensive troubleshooting guide</Link> or 
                ask for help in our <a href="https://github.com/pendtiumpraz/pesantren-coconut/discussions" className="text-blue-600 underline">GitHub Discussions</a>.
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-lg">
            <h3 className="font-bold text-2xl mb-4">Next Steps</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/docs/configuration" className="bg-white p-4 rounded-lg hover:shadow-lg transition">
                <h4 className="font-semibold mb-2">⚙️ Configuration</h4>
                <p className="text-sm text-gray-600">Configure email, payments, and integrations</p>
              </Link>
              <Link href="/docs/database/setup" className="bg-white p-4 rounded-lg hover:shadow-lg transition">
                <h4 className="font-semibold mb-2">🗄️ Database Setup</h4>
                <p className="text-sm text-gray-600">Set up and optimize your database</p>
              </Link>
              <Link href="/docs/deployment/vercel" className="bg-white p-4 rounded-lg hover:shadow-lg transition">
                <h4 className="font-semibold mb-2">🚀 Deploy</h4>
                <p className="text-sm text-gray-600">Deploy to production</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}