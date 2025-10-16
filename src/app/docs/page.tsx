import Link from 'next/link';
import { 
  BookOpen, 
  Code, 
  Server, 
  Database, 
  AlertCircle, 
  HardDrive,
  Shield,
  FileText,
  Terminal,
  Cloud,
  GitBranch,
  Settings,
  Zap,
  Key,
  Globe,
  Layers
} from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';

const documentationCategories = [
  {
    title: 'Getting Started',
    icon: BookOpen,
    color: 'bg-blue-500',
    items: [
      { 
        title: 'Quick Start Guide', 
        href: '/docs/quickstart',
        description: 'Get up and running in 5 minutes',
        public: true
      },
      { 
        title: 'Installation', 
        href: '/docs/installation',
        description: 'Step-by-step installation guide',
        public: true
      },
      { 
        title: 'Configuration', 
        href: '/docs/configuration',
        description: 'Configure your environment',
        public: true
      },
      { 
        title: 'Website Data Requirements', 
        href: '/docs/data-requirements',
        description: 'Data needed for website content',
        public: false
      }
    ]
  },
  {
    title: 'API Reference',
    icon: Code,
    color: 'bg-purple-500',
    items: [
      { 
        title: 'API Documentation', 
        href: '/docs/api',
        description: 'Complete API endpoints reference',
        public: true
      },
      { 
        title: 'Authentication', 
        href: '/docs/api/auth',
        description: 'Auth endpoints and JWT tokens',
        public: true
      },
      { 
        title: 'Webhooks', 
        href: '/docs/api/webhooks',
        description: 'Webhook integrations guide',
        public: true
      },
      { 
        title: 'Rate Limiting', 
        href: '/docs/api/rate-limits',
        description: 'API rate limits and quotas',
        public: true
      }
    ]
  },
  {
    title: 'Deployment',
    icon: Cloud,
    color: 'bg-green-500',
    items: [
      { 
        title: 'Vercel Deployment', 
        href: '/docs/deployment/vercel',
        description: 'Deploy to Vercel platform',
        public: true
      },
      { 
        title: 'VPS Deployment', 
        href: '/docs/deployment/vps',
        description: 'Self-host on VPS server',
        public: true
      },
      { 
        title: 'Docker Deployment', 
        href: '/docs/deployment/docker',
        description: 'Container-based deployment',
        public: true
      },
      { 
        title: 'Environment Variables', 
        href: '/docs/deployment/env',
        description: 'Environment configuration',
        public: true
      }
    ]
  },
  {
    title: 'Database',
    icon: Database,
    color: 'bg-orange-500',
    items: [
      { 
        title: 'Database Setup', 
        href: '/docs/database/setup',
        description: 'PostgreSQL and Prisma setup',
        public: true
      },
      { 
        title: 'Migrations Guide', 
        href: '/docs/database/migrations',
        description: 'Schema migrations with Prisma',
        public: true
      },
      { 
        title: 'Backup & Recovery', 
        href: '/docs/database/backup',
        description: 'Backup strategies and recovery',
        public: false
      },
      { 
        title: 'Performance Tuning', 
        href: '/docs/database/performance',
        description: 'Optimize database performance',
        public: false
      }
    ]
  },
  {
    title: 'Troubleshooting',
    icon: AlertCircle,
    color: 'bg-red-500',
    items: [
      { 
        title: 'Common Issues', 
        href: '/docs/troubleshooting',
        description: 'Solutions to common problems',
        public: true
      },
      { 
        title: 'Error Codes', 
        href: '/docs/troubleshooting/errors',
        description: 'Error codes reference',
        public: true
      },
      { 
        title: 'Debug Guide', 
        href: '/docs/troubleshooting/debug',
        description: 'Debugging techniques',
        public: true
      },
      { 
        title: 'Performance Issues', 
        href: '/docs/troubleshooting/performance',
        description: 'Fix performance problems',
        public: false
      }
    ]
  },
  {
    title: 'Security',
    icon: Shield,
    color: 'bg-indigo-500',
    items: [
      { 
        title: 'Security Best Practices', 
        href: '/docs/security',
        description: 'Security guidelines',
        public: false
      },
      { 
        title: 'Authentication & 2FA', 
        href: '/docs/security/auth',
        description: 'Auth and two-factor setup',
        public: false
      },
      { 
        title: 'Data Protection', 
        href: '/docs/security/data',
        description: 'Data privacy and protection',
        public: false
      },
      { 
        title: 'Audit Logs', 
        href: '/docs/security/audit',
        description: 'Security audit logging',
        public: false
      }
    ]
  },
  {
    title: 'Integrations',
    icon: Layers,
    color: 'bg-teal-500',
    items: [
      { 
        title: 'Payment Gateway', 
        href: '/docs/integrations/payment',
        description: 'Midtrans integration guide',
        public: true
      },
      { 
        title: 'WhatsApp API', 
        href: '/docs/integrations/whatsapp',
        description: 'WhatsApp Business API',
        public: true
      },
      { 
        title: 'Email Service', 
        href: '/docs/integrations/email',
        description: 'Email SMTP configuration',
        public: true
      },
      { 
        title: 'SMS Gateway', 
        href: '/docs/integrations/sms',
        description: 'Twilio SMS integration',
        public: true
      }
    ]
  },
  {
    title: 'Advanced',
    icon: Zap,
    color: 'bg-yellow-500',
    items: [
      { 
        title: 'Performance Optimization', 
        href: '/docs/advanced/performance',
        description: 'Optimize app performance',
        public: false
      },
      { 
        title: 'Scaling Guide', 
        href: '/docs/advanced/scaling',
        description: 'Scale for more users',
        public: false
      },
      { 
        title: 'Custom Development', 
        href: '/docs/advanced/customization',
        description: 'Extend functionality',
        public: false
      },
      { 
        title: 'Testing Guide', 
        href: '/docs/advanced/testing',
        description: 'Testing best practices',
        public: true
      }
    ]
  }
];

export default function DocsPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center mb-6">
              <BookOpen className="h-16 w-16" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              Documentation
            </h1>
            <p className="text-xl text-center text-blue-100 max-w-3xl mx-auto">
              Complete guide to deploy, configure, and manage the Pondok Imam Syafi'i Management System
            </p>
            
            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link
                href="/docs/quickstart"
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                <Terminal className="inline h-5 w-5 mr-2" />
                Quick Start
              </Link>
              <Link
                href="/docs/api"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition"
              >
                <Code className="inline h-5 w-5 mr-2" />
                API Reference
              </Link>
              <Link
                href="https://github.com/pendtiumpraz/pesantren-coconut"
                target="_blank"
                className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
              >
                <GitBranch className="inline h-5 w-5 mr-2" />
                GitHub
              </Link>
            </div>
          </div>
        </div>

        {/* Documentation Categories */}
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {documentationCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className={`${category.color} text-white p-3 rounded-lg inline-block mb-4`}>
                  <category.icon className="h-8 w-8" />
                </div>
                
                <h2 className="text-2xl font-bold mb-4">{category.title}</h2>
                
                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link
                        href={item.href}
                        className="group flex items-start hover:text-blue-600 transition"
                      >
                        <div className="flex-1">
                          <div className="font-semibold group-hover:underline">
                            {item.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            {item.description}
                          </div>
                        </div>
                        {!item.public && (
                          <Key className="h-4 w-4 text-gray-400 ml-2 mt-1" title="Requires login" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Additional Resources */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Additional Resources</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <a
                href="https://github.com/pendtiumpraz/pesantren-coconut/issues"
                target="_blank"
                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <AlertCircle className="h-8 w-8 text-orange-500" />
                <div>
                  <div className="font-semibold">Report Issues</div>
                  <div className="text-sm text-gray-600">GitHub Issues</div>
                </div>
              </a>

              <a
                href="https://github.com/pendtiumpraz/pesantren-coconut/discussions"
                target="_blank"
                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <Globe className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="font-semibold">Community</div>
                  <div className="text-sm text-gray-600">Discussions</div>
                </div>
              </a>

              <Link
                href="/docs/changelog"
                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <FileText className="h-8 w-8 text-green-500" />
                <div>
                  <div className="font-semibold">Changelog</div>
                  <div className="text-sm text-gray-600">Version history</div>
                </div>
              </Link>

              <Link
                href="/docs/roadmap"
                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <Settings className="h-8 w-8 text-purple-500" />
                <div>
                  <div className="font-semibold">Roadmap</div>
                  <div className="text-sm text-gray-600">Future plans</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mt-8 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Built With Modern Stack</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                'Next.js 14',
                'TypeScript',
                'Prisma ORM',
                'PostgreSQL',
                'Tailwind CSS',
                'NextAuth.js',
                'Vercel',
                'Docker',
                'Redis',
                'PWA',
                '2FA Auth',
                'Midtrans'
              ].map((tech, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-center font-semibold"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}