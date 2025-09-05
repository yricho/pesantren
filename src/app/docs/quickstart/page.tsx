'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Terminal, 
  Copy, 
  Check, 
  Rocket,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  PlayCircle
} from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';

export default function QuickStartPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

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

  const steps = [
    {
      title: "Prerequisites Check",
      time: "1 min",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Ensure you have the required software installed:</p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Terminal className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Node.js 18+</span>
              </div>
              <CodeBlock code="node --version" id="node-check" />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Terminal className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Git</span>
              </div>
              <CodeBlock code="git --version" id="git-check" />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Terminal className="h-5 w-5 text-gray-600" />
                <span className="font-medium">PostgreSQL (optional)</span>
              </div>
              <CodeBlock code="psql --version" id="psql-check" />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Clone Repository",
      time: "2 min",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Clone the repository and navigate to the project directory:</p>
          
          <CodeBlock 
            code={`git clone https://github.com/pendtiumpraz/imam-syafii-blitar.git
cd imam-syafii-blitar`}
            id="clone-repo"
          />
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
              <div>
                <p className="text-sm text-blue-800">
                  <strong>Alternative:</strong> You can also fork the repository first to your own GitHub account, 
                  then clone your fork for contributing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Install Dependencies",
      time: "3-5 min",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Install all required packages:</p>
          
          <CodeBlock code="npm install" id="npm-install" />
          
          <p className="text-gray-600">Or if you prefer using yarn:</p>
          
          <CodeBlock code="yarn install" id="yarn-install" />
          
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
              <div>
                <p className="text-sm text-yellow-800">
                  This might take a few minutes as it installs over 200 packages including Next.js, Prisma, 
                  TypeScript, and UI libraries.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Environment Setup",
      time: "2 min",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Copy the example environment file and configure:</p>
          
          <CodeBlock code="cp .env.example .env.local" id="copy-env" />
          
          <p className="text-gray-600 mt-4">Edit <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> with your settings:</p>
          
          <CodeBlock 
            code={`# Database (Use Prisma Accelerate for free)
DATABASE_URL="postgresql://user:password@localhost:5432/imam_syafii_db"

# NextAuth (Required)
NEXTAUTH_URL="http://localhost:3030"
NEXTAUTH_SECRET="your-32-character-secret-here"

# Email (Optional but recommended)
EMAIL_FROM="noreply@example.com"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"`}
            id="env-config"
            language="env"
          />
          
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <div className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
              <div>
                <p className="text-sm text-green-800">
                  <strong>Tip:</strong> You can use Supabase or Prisma Accelerate for a free PostgreSQL database. 
                  No local PostgreSQL installation needed!
                </p>
                <Link href="/docs/database/setup" className="text-green-700 underline text-sm mt-1 inline-block">
                  Learn more about database options →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Database Setup",
      time: "2 min",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Initialize the database schema and seed data:</p>
          
          <CodeBlock 
            code={`# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed initial data (optional)
npx prisma db seed`}
            id="db-setup"
          />
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">What this does:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Creates all database tables</li>
              <li>• Sets up relationships and indexes</li>
              <li>• Creates admin user (username: admin, password: admin123)</li>
              <li>• Adds sample data for testing</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Run Development Server",
      time: "1 min",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Start the development server:</p>
          
          <CodeBlock code="npm run dev" id="run-dev" />
          
          <p className="text-gray-600 mt-4">You should see output like this:</p>
          
          <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
            <div>▲ Next.js 14.2.32</div>
            <div>- Local: http://localhost:3030</div>
            <div>- Environments: .env.local</div>
            <div className="text-gray-400 mt-2">✓ Ready in 2.5s</div>
          </div>
          
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-lg mb-2">🎉 Congratulations!</h4>
                <p className="text-gray-700">Your app is now running. Open your browser and visit:</p>
                <a 
                  href="http://localhost:3030" 
                  target="_blank"
                  className="inline-flex items-center mt-3 text-blue-600 font-semibold hover:text-blue-700"
                >
                  http://localhost:3030
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
              <Rocket className="h-12 w-12 text-blue-600" />
            </div>
          </div>
        </div>
      )
    }
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
            <h1 className="text-4xl font-bold mb-4">Quick Start Guide</h1>
            <p className="text-xl text-blue-100">
              Get your Pondok Imam Syafi\'i system up and running in less than 10 minutes!
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Time Estimate */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Total Setup Time</h2>
                <p className="text-gray-600">From zero to running application</p>
              </div>
              <div className="flex items-center space-x-2 text-3xl font-bold text-blue-600">
                <Clock className="h-8 w-8" />
                <span>~10 minutes</span>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(index + 1)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition ${
                      currentStep > index + 1
                        ? 'bg-green-500 text-white'
                        : currentStep === index + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {currentStep > index + 1 ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 w-full mx-2 ${
                      currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className={`text-xs text-center ${
                    currentStep === index + 1 ? 'text-blue-600 font-semibold' : 'text-gray-500'
                  }`}
                >
                  <div>{step.title}</div>
                  <div className="text-gray-400">{step.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Step Content */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              Step {currentStep}: {steps[currentStep - 1].title}
            </h2>
            {steps[currentStep - 1].content}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              <ArrowLeft className="inline h-5 w-5 mr-2" />
              Previous
            </button>
            
            {currentStep < steps.length ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Next Step
                <ArrowRight className="inline h-5 w-5 ml-2" />
              </button>
            ) : (
              <Link
                href="/docs/configuration"
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Continue to Configuration
                <ArrowRight className="inline h-5 w-5 ml-2" />
              </Link>
            )}
          </div>

          {/* Troubleshooting */}
          <div className="mt-12 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-3 flex items-center">
              <AlertCircle className="h-6 w-6 text-yellow-600 mr-2" />
              Need Help?
            </h3>
            <div className="space-y-2 text-sm text-yellow-800">
              <p>If you encounter any issues during setup:</p>
              <ul className="space-y-1 ml-4">
                <li>• Check the <Link href="/docs/troubleshooting" className="underline font-semibold">Troubleshooting Guide</Link></li>
                <li>• Join our <a href="https://github.com/pendtiumpraz/imam-syafii-blitar/discussions" className="underline font-semibold">GitHub Discussions</a></li>
                <li>• Report bugs on <a href="https://github.com/pendtiumpraz/imam-syafii-blitar/issues" className="underline font-semibold">GitHub Issues</a></li>
              </ul>
            </div>
          </div>

          {/* What\'s Next */}
          <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-lg">
            <h3 className="font-bold text-2xl mb-4">What\'s Next?</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/docs/configuration" className="bg-white p-4 rounded-lg hover:shadow-lg transition">
                <h4 className="font-semibold mb-2">⚙️ Configuration</h4>
                <p className="text-sm text-gray-600">Configure email, WhatsApp, payment gateway, and more</p>
              </Link>
              <Link href="/docs/deployment/vercel" className="bg-white p-4 rounded-lg hover:shadow-lg transition">
                <h4 className="font-semibold mb-2">🚀 Deploy to Vercel</h4>
                <p className="text-sm text-gray-600">Deploy your app to production in minutes</p>
              </Link>
              <Link href="/docs/data-requirements" className="bg-white p-4 rounded-lg hover:shadow-lg transition">
                <h4 className="font-semibold mb-2">📝 Add Your Data</h4>
                <p className="text-sm text-gray-600">Fill in your institution\'s information</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}