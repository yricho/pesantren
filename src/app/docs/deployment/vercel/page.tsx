'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Cloud, 
  Copy, 
  Check, 
  Zap,
  Globe,
  Shield,
  Database,
  Settings,
  GitBranch,
  Terminal,
  AlertCircle,
  CheckCircle2,
  Info,
  ExternalLink,
  Play,
  RefreshCw,
  Package,
  Lock,
  DollarSign,
  Clock,
  Server,
  ArrowRight
} from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';

export default function VercelDeploymentPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('automatic');

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

  const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
    <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
      <div className="p-2 bg-white rounded-lg">
        <Icon className="h-5 w-5 text-blue-600" />
      </div>
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );

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
              <div className="p-3 bg-black rounded-lg mr-4">
                <span className="text-white font-bold text-2xl">▲</span>
              </div>
              <h1 className="text-4xl font-bold">Deploy to Vercel</h1>
            </div>
            <p className="text-xl text-blue-100">
              Deploy your Pondok Imam Syafi'i system to Vercel with zero configuration
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Why Vercel */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Zap className="h-8 w-8 text-yellow-500 mr-3" />
              Why Deploy to Vercel?
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={Globe}
                title="Global Edge Network"
                description="Automatic deployment to 100+ edge locations worldwide for fastest loading times"
              />
              <FeatureCard
                icon={Shield}
                title="Automatic HTTPS"
                description="Free SSL certificates with automatic renewal and forced HTTPS"
              />
              <FeatureCard
                icon={RefreshCw}
                title="Instant Rollbacks"
                description="One-click rollback to any previous deployment"
              />
              <FeatureCard
                icon={GitBranch}
                title="Git Integration"
                description="Automatic deployments on every git push"
              />
              <FeatureCard
                icon={Package}
                title="Serverless Functions"
                description="API routes automatically deployed as serverless functions"
              />
              <FeatureCard
                icon={DollarSign}
                title="Generous Free Tier"
                description="Free hosting for personal and small projects"
              />
            </div>
          </div>

          {/* Deployment Methods */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('automatic')}
                  className={`flex-1 px-6 py-4 text-center font-semibold transition ${
                    activeTab === 'automatic'
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Play className="inline h-5 w-5 mr-2" />
                  One-Click Deploy (Recommended)
                </button>
                <button
                  onClick={() => setActiveTab('manual')}
                  className={`flex-1 px-6 py-4 text-center font-semibold transition ${
                    activeTab === 'manual'
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Terminal className="inline h-5 w-5 mr-2" />
                  Manual Deployment
                </button>
              </div>

              <div className="p-8">
                {/* Automatic Deployment */}
                {activeTab === 'automatic' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-6">Deploy with One Click</h3>
                      
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg text-center">
                        <p className="text-gray-700 mb-6">
                          Click the button below to deploy directly to Vercel. You'll be guided through the setup process.
                        </p>
                        
                        <a
                          href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpendtiumpraz%2Fimam-syafii-blitar&env=DATABASE_URL,NEXTAUTH_SECRET,NEXTAUTH_URL&envDescription=Required%20environment%20variables&envLink=https%3A%2F%2Fgithub.com%2Fpendtiumpraz%2Fimam-syafii-blitar%2Fblob%2Fmain%2F.env.example"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-8 py-4 bg-black text-white text-lg font-semibold rounded-lg hover:bg-gray-800 transition"
                        >
                          <span className="mr-3 text-2xl">▲</span>
                          Deploy to Vercel
                          <ExternalLink className="ml-3 h-5 w-5" />
                        </a>
                        
                        <p className="text-sm text-gray-500 mt-4">
                          This will fork the repository to your GitHub account and deploy it
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg mb-4">What happens when you click Deploy:</h4>
                      
                      <ol className="space-y-4">
                        <li className="flex items-start">
                          <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
                            1
                          </span>
                          <div>
                            <h5 className="font-semibold">GitHub Integration</h5>
                            <p className="text-gray-600 mt-1">
                              Connect your GitHub account and fork the repository
                            </p>
                          </div>
                        </li>
                        
                        <li className="flex items-start">
                          <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
                            2
                          </span>
                          <div>
                            <h5 className="font-semibold">Configure Project</h5>
                            <p className="text-gray-600 mt-1">
                              Name your project and select the framework preset (Next.js)
                            </p>
                          </div>
                        </li>
                        
                        <li className="flex items-start">
                          <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
                            3
                          </span>
                          <div>
                            <h5 className="font-semibold">Environment Variables</h5>
                            <p className="text-gray-600 mt-1">
                              Add required environment variables (see configuration below)
                            </p>
                          </div>
                        </li>
                        
                        <li className="flex items-start">
                          <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
                            4
                          </span>
                          <div>
                            <h5 className="font-semibold">Deploy</h5>
                            <p className="text-gray-600 mt-1">
                              Vercel builds and deploys your application automatically
                            </p>
                          </div>
                        </li>
                      </ol>
                    </div>
                  </div>
                )}

                {/* Manual Deployment */}
                {activeTab === 'manual' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold mb-6">Manual Deployment via CLI</h3>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Step 1: Install Vercel CLI</h4>
                      <CodeBlock
                        code="npm i -g vercel"
                        id="install-vercel-cli"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Step 2: Login to Vercel</h4>
                      <CodeBlock
                        code="vercel login"
                        id="vercel-login"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Step 3: Deploy Project</h4>
                      <CodeBlock
                        code={`# Navigate to project directory
cd imam-syafii-blitar

# Deploy to Vercel
vercel

# Or deploy to production directly
vercel --prod`}
                        id="deploy-command"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Step 4: Follow Prompts</h4>
                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                        <div>? Set up and deploy "imam-syafii-blitar"? [Y/n] <span className="text-white">Y</span></div>
                        <div>? Which scope do you want to deploy to? <span className="text-white">Your Account</span></div>
                        <div>? Link to existing project? [y/N] <span className="text-white">N</span></div>
                        <div>? What's your project's name? <span className="text-white">imam-syafii-blitar</span></div>
                        <div>? In which directory is your code located? <span className="text-white">./</span></div>
                        <div className="text-gray-400 mt-2">🔍 Auto-detected Project Settings (Next.js):</div>
                        <div className="text-gray-400">- Build Command: next build</div>
                        <div className="text-gray-400">- Output Directory: .next</div>
                        <div className="text-gray-400">- Development Command: next dev</div>
                        <div>? Want to override the settings? [y/N] <span className="text-white">N</span></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Environment Variables Configuration */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Settings className="h-8 w-8 text-gray-600 mr-3" />
              Environment Variables Configuration
            </h2>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> Add these environment variables in Vercel Dashboard → 
                    Settings → Environment Variables before deployment.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-3">Required Variables</h3>
                <CodeBlock
                  code={`# Database (Use Supabase or Prisma Accelerate for free)
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth Configuration
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="generate-32-character-secret-here"`}
                  id="required-env"
                  language="env"
                />
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3">Optional Variables</h3>
                <CodeBlock
                  code={`# Email Service
EMAIL_FROM="noreply@yourdomain.com"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="app-specific-password"

# Payment Gateway
MIDTRANS_CLIENT_KEY="your-client-key"
MIDTRANS_SERVER_KEY="your-server-key"
MIDTRANS_IS_PRODUCTION="true"

# WhatsApp API
WHATSAPP_API_KEY="your-api-key"
WHATSAPP_API_URL="https://api.whatsapp.com/v1"`}
                  id="optional-env"
                  language="env"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">How to Add in Vercel Dashboard:</h4>
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li>1. Go to your project in Vercel Dashboard</li>
                    <li>2. Click on "Settings" tab</li>
                    <li>3. Navigate to "Environment Variables"</li>
                    <li>4. Add each variable with its value</li>
                    <li>5. Select environments (Production/Preview/Development)</li>
                    <li>6. Click "Save"</li>
                  </ol>
                </div>

                <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Using Vercel CLI:</h4>
                  <CodeBlock
                    code={`# Add environment variable
vercel env add DATABASE_URL

# Pull environment variables locally
vercel env pull .env.local`}
                    id="vercel-env-cli"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Database Setup */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Database className="h-8 w-8 text-blue-600 mr-3" />
              Database Setup for Vercel
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-2 border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-3 text-green-700">
                  Option 1: Supabase (Recommended)
                </h3>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="font-bold mr-2">1.</span>
                    <div>
                      <p>Create free account at <a href="https://supabase.com" className="text-blue-600 underline">supabase.com</a></p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">2.</span>
                    <p>Create new project</p>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">3.</span>
                    <p>Copy connection string from Settings → Database</p>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">4.</span>
                    <p>Add to Vercel environment variables</p>
                  </li>
                </ol>
                <div className="mt-4 p-3 bg-green-50 rounded text-sm">
                  ✓ Free tier includes 500MB database
                </div>
              </div>

              <div className="border-2 border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-3 text-blue-700">
                  Option 2: Vercel Postgres
                </h3>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="font-bold mr-2">1.</span>
                    <p>In Vercel Dashboard, go to Storage</p>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">2.</span>
                    <p>Create new Postgres database</p>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">3.</span>
                    <p>Connect to your project</p>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">4.</span>
                    <p>Environment variables auto-added</p>
                  </li>
                </ol>
                <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
                  ✓ Integrated with Vercel platform
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">After Database Setup:</h4>
              <CodeBlock
                code={`# SSH into Vercel function or run locally with production DB
npx prisma generate
npx prisma db push
npx prisma db seed  # Optional: add sample data`}
                id="db-init"
              />
            </div>
          </div>

          {/* Custom Domain */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Globe className="h-8 w-8 text-green-600 mr-3" />
              Custom Domain Configuration
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-3">Adding a Custom Domain</h3>
                <ol className="space-y-3">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      1
                    </span>
                    <div>
                      <p className="font-semibold">Go to Domains Settings</p>
                      <p className="text-sm text-gray-600">Navigate to Settings → Domains in your Vercel project</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      2
                    </span>
                    <div>
                      <p className="font-semibold">Add Your Domain</p>
                      <p className="text-sm text-gray-600">Enter your domain (e.g., pondok.yourdomain.com)</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      3
                    </span>
                    <div>
                      <p className="font-semibold">Configure DNS</p>
                      <p className="text-sm text-gray-600">Add the provided DNS records to your domain provider</p>
                    </div>
                  </li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-3">DNS Configuration Examples:</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold mb-2">For Apex Domain (example.com)</h5>
                    <CodeBlock
                      code={`Type: A
Name: @
Value: 76.76.21.21`}
                      id="apex-dns"
                      language="text"
                    />
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold mb-2">For Subdomain (app.example.com)</h5>
                    <CodeBlock
                      code={`Type: CNAME
Name: app
Value: cname.vercel-dns.com`}
                      id="subdomain-dns"
                      language="text"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-green-800">
                      <strong>SSL Certificate:</strong> Vercel automatically provisions and renews SSL certificates 
                      for your custom domain at no additional cost.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deployment Configuration */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Package className="h-8 w-8 text-purple-600 mr-3" />
              Build & Deployment Settings
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-3">Build Configuration</h3>
                <CodeBlock
                  code={`{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}`}
                  id="build-config"
                  language="json"
                />
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3">Node.js Version</h3>
                <p className="text-gray-600 mb-3">Specify Node.js version in package.json:</p>
                <CodeBlock
                  code={`{
  "engines": {
    "node": ">=18.0.0"
  }
}`}
                  id="node-version"
                  language="json"
                />
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3">Root Directory</h3>
                <p className="text-gray-600 mb-3">
                  If your Next.js app is in a subdirectory, specify it in Vercel settings:
                </p>
                <CodeBlock
                  code="Root Directory: ./"
                  id="root-dir"
                  language="text"
                />
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3">Ignored Build Step</h3>
                <p className="text-gray-600 mb-3">
                  Skip builds for documentation-only changes:
                </p>
                <CodeBlock
                  code={`# vercel.json
{
  "github": {
    "silent": true
  },
  "ignoreCommand": "git diff --quiet HEAD^ HEAD ./docs ./README.md"
}`}
                  id="ignore-build"
                  language="json"
                />
              </div>
            </div>
          </div>

          {/* Monitoring & Analytics */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Zap className="h-8 w-8 text-yellow-500 mr-3" />
              Monitoring & Performance
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-3">Vercel Analytics</h3>
                <p className="text-gray-600 mb-3">Enable Web Analytics in your Vercel dashboard:</p>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li>1. Go to Analytics tab</li>
                  <li>2. Click "Enable Web Analytics"</li>
                  <li>3. Install @vercel/analytics package</li>
                  <li>4. Add Analytics component to your app</li>
                </ol>
                <CodeBlock
                  code={`npm i @vercel/analytics

// In app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

<Analytics />`}
                  id="vercel-analytics"
                />
              </div>

              <div>
                <h3 className="font-bold mb-3">Speed Insights</h3>
                <p className="text-gray-600 mb-3">Monitor Core Web Vitals:</p>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li>1. Go to Speed Insights tab</li>
                  <li>2. Enable Speed Insights</li>
                  <li>3. Install @vercel/speed-insights</li>
                  <li>4. Add SpeedInsights component</li>
                </ol>
                <CodeBlock
                  code={`npm i @vercel/speed-insights

// In app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

<SpeedInsights />`}
                  id="speed-insights"
                />
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <AlertCircle className="h-8 w-8 text-orange-600 mr-3" />
              Common Issues & Solutions
            </h2>

            <div className="space-y-6">
              <div className="border-l-4 border-orange-400 pl-4">
                <h3 className="font-semibold mb-2">Build fails with "Module not found"</h3>
                <p className="text-sm text-gray-600 mb-2">Solution:</p>
                <CodeBlock
                  code={`# Clear cache and redeploy
vercel --force

# Or in dashboard: Settings → Functions → Clear Cache`}
                  id="fix-module"
                />
              </div>

              <div className="border-l-4 border-orange-400 pl-4">
                <h3 className="font-semibold mb-2">Database connection timeout</h3>
                <p className="text-sm text-gray-600 mb-2">Add connection pool settings:</p>
                <CodeBlock
                  code={`DATABASE_URL="...?pgbouncer=true&connection_limit=1&pool_timeout=20"`}
                  id="fix-db-timeout"
                  language="env"
                />
              </div>

              <div className="border-l-4 border-orange-400 pl-4">
                <h3 className="font-semibold mb-2">Environment variables not working</h3>
                <p className="text-sm text-gray-600 mb-2">Ensure variables are added for the correct environment:</p>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>• Production: For main branch deployments</li>
                  <li>• Preview: For pull request deployments</li>
                  <li>• Development: For local development (vercel dev)</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-400 pl-4">
                <h3 className="font-semibold mb-2">Function size limit exceeded</h3>
                <p className="text-sm text-gray-600 mb-2">Optimize your dependencies:</p>
                <CodeBlock
                  code={`# Check bundle size
npm run analyze

# Use dynamic imports for large libraries
const HeavyComponent = dynamic(() => import('./HeavyComponent'))`}
                  id="fix-function-size"
                />
              </div>
            </div>
          </div>

          {/* Production Checklist */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <CheckCircle2 className="h-8 w-8 text-green-600 mr-3" />
              Production Deployment Checklist
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Before Deployment:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Environment variables configured</span>
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Database connection tested</span>
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Email service configured</span>
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Payment gateway setup (if needed)</span>
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Custom domain configured</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">After Deployment:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Run database migrations</span>
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Test authentication flow</span>
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Verify email sending</span>
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Enable analytics</span>
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Set up monitoring alerts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Useful Commands */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Terminal className="h-8 w-8 text-gray-600 mr-3" />
              Useful Vercel CLI Commands
            </h2>

            <div className="space-y-4">
              <CodeBlock
                code={`# Deployment Commands
vercel              # Deploy to preview
vercel --prod       # Deploy to production
vercel --force      # Force new deployment

# Environment Variables
vercel env ls       # List all env variables
vercel env add      # Add new variable
vercel env rm       # Remove variable
vercel env pull     # Download to .env.local

# Logs & Debugging
vercel logs         # View function logs
vercel inspect     # Inspect deployment

# Domain Management
vercel domains ls   # List domains
vercel domains add  # Add new domain

# Project Management
vercel ls           # List all deployments
vercel rm [url]     # Remove deployment
vercel rollback     # Rollback to previous`}
                id="vercel-commands"
              />
            </div>
          </div>

          {/* Support & Resources */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-lg">
            <h3 className="font-bold text-2xl mb-4">Need Help?</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a 
                href="https://vercel.com/docs"
                target="_blank"
                className="bg-white p-4 rounded-lg hover:shadow-lg transition flex items-center"
              >
                <ExternalLink className="h-5 w-5 mr-2 text-blue-600" />
                <div>
                  <div className="font-semibold">Vercel Docs</div>
                  <div className="text-sm text-gray-600">Official documentation</div>
                </div>
              </a>
              
              <a 
                href="https://vercel.com/support"
                target="_blank"
                className="bg-white p-4 rounded-lg hover:shadow-lg transition flex items-center"
              >
                <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                <div>
                  <div className="font-semibold">Support</div>
                  <div className="text-sm text-gray-600">Get help from Vercel</div>
                </div>
              </a>
              
              <Link 
                href="/docs/troubleshooting"
                className="bg-white p-4 rounded-lg hover:shadow-lg transition flex items-center"
              >
                <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                <div>
                  <div className="font-semibold">Troubleshooting</div>
                  <div className="text-sm text-gray-600">Common issues</div>
                </div>
              </Link>
              
              <Link 
                href="/docs/deployment/vps"
                className="bg-white p-4 rounded-lg hover:shadow-lg transition flex items-center"
              >
                <Server className="h-5 w-5 mr-2 text-purple-600" />
                <div>
                  <div className="font-semibold">VPS Deploy</div>
                  <div className="text-sm text-gray-600">Alternative option</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}