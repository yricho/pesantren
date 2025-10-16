'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  GitBranch, 
  Calendar,
  Tag,
  Star,
  Zap,
  Bug,
  Shield,
  Package,
  CheckCircle,
  AlertCircle,
  Info,
  Plus,
  Minus,
  ArrowUp,
  Clock,
  Code,
  Database,
  Globe,
  Sparkles,
  Tool,
  FileText,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';

export default function ChangelogPage() {
  const [expandedVersion, setExpandedVersion] = useState<string | null>('1.5.0');

  const releases = [
    {
      version: '1.5.0',
      date: '2024-12-05',
      tag: 'Latest',
      type: 'major',
      highlights: 'Major Performance Update with 2FA, PWA, and Advanced Features',
      stats: {
        additions: 127,
        deletions: 45,
        files: 89
      },
      categories: {
        'New Features': {
          icon: Sparkles,
          items: [
            '🔐 Two-Factor Authentication (2FA) with TOTP and SMS',
            '📱 Progressive Web App (PWA) with offline support',
            '⚡ Performance monitoring and optimization',
            '💳 Enhanced payment gateway with multiple methods',
            '📊 Advanced analytics and reporting dashboard',
            '🔄 Real-time data synchronization',
            '📧 Email notification system with templates',
            '🌐 Multi-language support (ID, EN, AR)',
            '🎨 Dark mode with system preference detection',
            '📸 Image optimization and lazy loading'
          ]
        },
        'Improvements': {
          icon: ArrowUp,
          items: [
            'Reduced initial load time by 60%',
            'Optimized database queries with indexes',
            'Improved mobile responsive design',
            'Enhanced security with rate limiting',
            'Better error handling and user feedback',
            'Upgraded to Next.js 14.2.32',
            'Implemented Redis caching',
            'Added virtual scrolling for large lists'
          ]
        },
        'Bug Fixes': {
          icon: Bug,
          items: [
            'Fixed TypeScript compilation errors',
            'Resolved date-fns v3 compatibility issues',
            'Fixed dark mode modal styling',
            'Corrected payment calculation errors',
            'Fixed session persistence issues'
          ]
        },
        'Security': {
          icon: Shield,
          items: [
            'Implemented CSP headers',
            'Added SQL injection protection',
            'Enhanced XSS prevention',
            'Secure cookie configuration',
            'API rate limiting'
          ]
        }
      }
    },
    {
      version: '1.4.0',
      date: '2024-11-20',
      tag: 'Stable',
      type: 'minor',
      highlights: 'Dashboard Enhancements and Reporting',
      stats: {
        additions: 78,
        deletions: 23,
        files: 45
      },
      categories: {
        'New Features': {
          icon: Sparkles,
          items: [
            '📊 Comprehensive monthly reporting system',
            '📈 Business unit analytics',
            '🔍 Advanced search and filtering',
            '📅 Academic calendar integration',
            '👨‍👩‍👧‍👦 Parent portal improvements'
          ]
        },
        'Improvements': {
          icon: ArrowUp,
          items: [
            'Dashboard performance optimization',
            'Better data visualization',
            'Improved navigation structure',
            'Enhanced form validations'
          ]
        }
      }
    },
    {
      version: '1.3.0',
      date: '2024-11-01',
      tag: 'Stable',
      type: 'minor',
      highlights: 'Payment System and Student Management',
      stats: {
        additions: 56,
        deletions: 12,
        files: 34
      },
      categories: {
        'New Features': {
          icon: Sparkles,
          items: [
            '💰 Midtrans payment gateway integration',
            '📱 WhatsApp notification system',
            '👨‍🎓 Bulk student import/export',
            '📊 Financial reporting dashboard'
          ]
        },
        'Bug Fixes': {
          icon: Bug,
          items: [
            'Fixed SPP calculation issues',
            'Resolved student data validation',
            'Fixed export to Excel formatting'
          ]
        }
      }
    },
    {
      version: '1.2.0',
      date: '2024-10-15',
      tag: 'Stable',
      type: 'minor',
      highlights: 'PPDB Online Registration',
      stats: {
        additions: 42,
        deletions: 8,
        files: 28
      },
      categories: {
        'New Features': {
          icon: Sparkles,
          items: [
            '📝 Online PPDB registration form',
            '📋 Document upload system',
            '✉️ Email verification',
            '📊 Registration statistics'
          ]
        }
      }
    },
    {
      version: '1.1.0',
      date: '2024-10-01',
      tag: 'Stable',
      type: 'minor',
      highlights: 'Authentication and User Management',
      stats: {
        additions: 38,
        deletions: 5,
        files: 22
      },
      categories: {
        'New Features': {
          icon: Sparkles,
          items: [
            '🔐 NextAuth.js integration',
            '👥 Role-based access control',
            '🔑 Password reset functionality',
            '📧 Welcome email automation'
          ]
        }
      }
    },
    {
      version: '1.0.0',
      date: '2024-09-15',
      tag: 'Initial Release',
      type: 'major',
      highlights: 'First Production Release',
      stats: {
        additions: 320,
        deletions: 0,
        files: 156
      },
      categories: {
        'Features': {
          icon: Package,
          items: [
            '🏫 Institution management system',
            '👨‍🎓 Student information system',
            '💰 SPP billing management',
            '📊 Basic reporting',
            '🎨 Responsive UI design',
            '🗄️ PostgreSQL database',
            '🔧 Admin dashboard',
            '📱 Mobile responsive'
          ]
        }
      }
    }
  ];

  const upcomingFeatures = [
    { icon: '🤖', title: 'AI-powered chatbot for student support' },
    { icon: '📹', title: 'Video conferencing for online classes' },
    { icon: '📚', title: 'Digital library management' },
    { icon: '🎮', title: 'Gamification for student engagement' },
    { icon: '📊', title: 'Predictive analytics for student performance' }
  ];

  const getVersionBadge = (type: string, tag: string) => {
    if (tag === 'Latest') return 'bg-green-100 text-green-800 border-green-300';
    if (type === 'major') return 'bg-blue-100 text-blue-800 border-blue-300';
    if (type === 'minor') return 'bg-purple-100 text-purple-800 border-purple-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12">
          <div className="container mx-auto px-6">
            <Link
              href="/docs"
              className="inline-flex items-center text-purple-100 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Docs
            </Link>
            <div className="flex items-center mb-4">
              <GitBranch className="h-12 w-12 mr-4" />
              <h1 className="text-4xl font-bold">Changelog</h1>
            </div>
            <p className="text-xl text-purple-100">
              Track the evolution of Pondok Imam Syafi'i Management System
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Current Version */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Current Version</h2>
                <p className="text-gray-600">You're running the latest version!</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-green-600">v1.5.0</div>
                <div className="text-sm text-gray-500">Released Dec 5, 2024</div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">127</div>
                <div className="text-sm text-gray-600">New Features</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <ArrowUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">89</div>
                <div className="text-sm text-gray-600">Improvements</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Bug className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">45</div>
                <div className="text-sm text-gray-600">Bugs Fixed</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-gray-600">Security Updates</div>
              </div>
            </div>
          </div>

          {/* Version History */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Version History</h2>
            
            {releases.map((release) => (
              <div key={release.version} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => setExpandedVersion(
                    expandedVersion === release.version ? null : release.version
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl font-bold mr-3">v{release.version}</span>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getVersionBadge(release.type, release.tag)}`}>
                          {release.tag}
                        </span>
                      </div>
                      <p className="text-lg text-gray-700 mb-2">{release.highlights}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(release.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                        <span className="mx-3">•</span>
                        <Plus className="h-4 w-4 mr-1 text-green-600" />
                        {release.stats.additions}
                        <Minus className="h-4 w-4 ml-3 mr-1 text-red-600" />
                        {release.stats.deletions}
                        <FileText className="h-4 w-4 ml-3 mr-1 text-blue-600" />
                        {release.stats.files} files
                      </div>
                    </div>
                    <div className="ml-4">
                      {expandedVersion === release.version ? (
                        <ChevronDown className="h-6 w-6 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
                
                {expandedVersion === release.version && (
                  <div className="border-t px-6 py-6 bg-gray-50">
                    <div className="grid md:grid-cols-2 gap-6">
                      {Object.entries(release.categories).map(([category, data]) => (
                        <div key={category}>
                          <h3 className="font-bold mb-3 flex items-center">
                            <data.icon className="h-5 w-5 mr-2 text-blue-600" />
                            {category}
                          </h3>
                          <ul className="space-y-2">
                            {data.items.map((item: string, idx: number) => (
                              <li key={idx} className="text-sm text-gray-700 flex items-start">
                                <span className="mr-2">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Upcoming Features */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Sparkles className="h-8 w-8 text-blue-600 mr-3" />
              Coming Soon
            </h2>
            
            <p className="text-gray-700 mb-6">
              We're constantly working on new features to improve your experience. Here's what's coming:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {upcomingFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-center p-4 bg-white rounded-lg">
                  <span className="text-2xl mr-3">{feature.icon}</span>
                  <span className="text-gray-700">{feature.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How to Update */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">How to Update</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-4">
                  1
                </span>
                <div>
                  <h3 className="font-semibold mb-1">Pull Latest Changes</h3>
                  <code className="bg-gray-100 px-3 py-1 rounded text-sm">git pull origin main</code>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-4">
                  2
                </span>
                <div>
                  <h3 className="font-semibold mb-1">Install Dependencies</h3>
                  <code className="bg-gray-100 px-3 py-1 rounded text-sm">npm install</code>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-4">
                  3
                </span>
                <div>
                  <h3 className="font-semibold mb-1">Run Migrations</h3>
                  <code className="bg-gray-100 px-3 py-1 rounded text-sm">npx prisma migrate deploy</code>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-4">
                  4
                </span>
                <div>
                  <h3 className="font-semibold mb-1">Rebuild Application</h3>
                  <code className="bg-gray-100 px-3 py-1 rounded text-sm">npm run build</code>
                </div>
              </div>
            </div>
          </div>

          {/* Subscribe to Updates */}
          <div className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
            <p className="mb-6">
              Get notified about new releases and important updates
            </p>
            <div className="flex justify-center gap-4">
              <a 
                href="https://github.com/pendtiumpraz/pesantren-coconut/releases"
                target="_blank"
                className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                <GitBranch className="inline h-5 w-5 mr-2" />
                Watch on GitHub
              </a>
              <a 
                href="https://github.com/pendtiumpraz/pesantren-coconut/subscription"
                target="_blank"
                className="px-6 py-3 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition"
              >
                <Star className="inline h-5 w-5 mr-2" />
                Subscribe to Releases
              </a>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}