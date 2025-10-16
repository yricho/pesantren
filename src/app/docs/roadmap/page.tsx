'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Target, 
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  Zap,
  Users,
  Shield,
  Globe,
  Database,
  Smartphone,
  Brain,
  Cloud,
  GitBranch,
  Star,
  TrendingUp,
  Award,
  Sparkles,
  Rocket,
  Flag,
  Play,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';

export default function RoadmapPage() {
  const [selectedQuarter, setSelectedQuarter] = useState('Q1-2025');

  const roadmapData = {
    'Q4-2024': {
      status: 'completed',
      title: 'Foundation & Core Features',
      description: 'Establishing the core system and essential features',
      progress: 100,
      items: [
        { 
          title: 'Core System Setup', 
          status: 'completed',
          icon: Database,
          description: 'Database architecture, authentication, and basic CRUD operations'
        },
        { 
          title: 'Student Management', 
          status: 'completed',
          icon: Users,
          description: 'Complete student information system with enrollment'
        },
        { 
          title: 'Payment System', 
          status: 'completed',
          icon: Clock,
          description: 'SPP billing and basic payment tracking'
        },
        { 
          title: 'Admin Dashboard', 
          status: 'completed',
          icon: Shield,
          description: 'Basic admin panel with role management'
        }
      ]
    },
    'Q1-2025': {
      status: 'in-progress',
      title: 'Performance & Security',
      description: 'Optimizing performance and enhancing security features',
      progress: 75,
      items: [
        { 
          title: '2FA Implementation', 
          status: 'completed',
          icon: Shield,
          description: 'Two-factor authentication with TOTP and SMS'
        },
        { 
          title: 'PWA Features', 
          status: 'completed',
          icon: Smartphone,
          description: 'Offline support, installable app, push notifications'
        },
        { 
          title: 'Performance Optimization', 
          status: 'in-progress',
          icon: Zap,
          description: 'Code splitting, lazy loading, caching strategies'
        },
        { 
          title: 'Advanced Analytics', 
          status: 'in-progress',
          icon: TrendingUp,
          description: 'Comprehensive reporting and data visualization'
        }
      ]
    },
    'Q2-2025': {
      status: 'planned',
      title: 'Communication & Collaboration',
      description: 'Enhancing communication between stakeholders',
      progress: 0,
      items: [
        { 
          title: 'Video Conferencing', 
          status: 'planned',
          icon: Globe,
          description: 'Built-in video calls for parent-teacher meetings'
        },
        { 
          title: 'Real-time Chat', 
          status: 'planned',
          icon: Users,
          description: 'Instant messaging between teachers, students, and parents'
        },
        { 
          title: 'Digital Library', 
          status: 'planned',
          icon: Database,
          description: 'E-book management and lending system'
        },
        { 
          title: 'Assignment System', 
          status: 'planned',
          icon: Award,
          description: 'Digital homework submission and grading'
        }
      ]
    },
    'Q3-2025': {
      status: 'planned',
      title: 'AI & Automation',
      description: 'Leveraging AI for enhanced functionality',
      progress: 0,
      items: [
        { 
          title: 'AI Chatbot', 
          status: 'planned',
          icon: Brain,
          description: '24/7 automated student and parent support'
        },
        { 
          title: 'Predictive Analytics', 
          status: 'planned',
          icon: TrendingUp,
          description: 'Student performance prediction and early intervention'
        },
        { 
          title: 'Automated Scheduling', 
          status: 'planned',
          icon: Calendar,
          description: 'AI-powered class and exam scheduling'
        },
        { 
          title: 'Smart Notifications', 
          status: 'planned',
          icon: Sparkles,
          description: 'Intelligent alert system based on user behavior'
        }
      ]
    },
    'Q4-2025': {
      status: 'planned',
      title: 'Scale & Expand',
      description: 'Preparing for multi-institution support',
      progress: 0,
      items: [
        { 
          title: 'Multi-tenant Architecture', 
          status: 'planned',
          icon: Cloud,
          description: 'Support for multiple institutions in one system'
        },
        { 
          title: 'Mobile Apps', 
          status: 'planned',
          icon: Smartphone,
          description: 'Native iOS and Android applications'
        },
        { 
          title: 'API Marketplace', 
          status: 'planned',
          icon: Globe,
          description: 'Third-party integration ecosystem'
        },
        { 
          title: 'White-label Solution', 
          status: 'planned',
          icon: Flag,
          description: 'Customizable branding for different institutions'
        }
      ]
    },
    'Future': {
      status: 'concept',
      title: 'Vision & Innovation',
      description: 'Long-term vision and innovative features',
      progress: 0,
      items: [
        { 
          title: 'Blockchain Certificates', 
          status: 'concept',
          icon: Shield,
          description: 'Tamper-proof digital certificates and transcripts'
        },
        { 
          title: 'VR Classrooms', 
          status: 'concept',
          icon: Globe,
          description: 'Virtual reality for immersive learning'
        },
        { 
          title: 'IoT Integration', 
          status: 'concept',
          icon: Zap,
          description: 'Smart campus with IoT sensors'
        },
        { 
          title: 'Global Network', 
          status: 'concept',
          icon: Cloud,
          description: 'Connect with Islamic institutions worldwide'
        }
      ]
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in-progress': return 'text-blue-600 bg-blue-50';
      case 'planned': return 'text-purple-600 bg-purple-50';
      case 'concept': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5" />;
      case 'in-progress': return <Play className="h-5 w-5" />;
      case 'planned': return <Clock className="h-5 w-5" />;
      case 'concept': return <Sparkles className="h-5 w-5" />;
      default: return <Circle className="h-5 w-5" />;
    }
  };

  const currentQuarter = roadmapData[selectedQuarter as keyof typeof roadmapData];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
          <div className="container mx-auto px-6">
            <Link
              href="/docs"
              className="inline-flex items-center text-indigo-100 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Docs
            </Link>
            <div className="flex items-center mb-4">
              <Target className="h-12 w-12 mr-4" />
              <h1 className="text-4xl font-bold">Product Roadmap</h1>
            </div>
            <p className="text-xl text-indigo-100">
              Our vision and planned features for Pondok Imam Syafi'i System
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Mission Statement */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-start">
              <Rocket className="h-12 w-12 text-indigo-600 mr-4 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  To build the most comprehensive, user-friendly, and innovative Islamic educational 
                  institution management system that empowers schools to focus on what matters most - 
                  educating and nurturing the next generation of Muslim leaders.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline Navigation */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="font-bold mb-4">Timeline</h3>
            <div className="flex overflow-x-auto space-x-4 pb-2">
              {Object.entries(roadmapData).map(([quarter, data]) => (
                <button
                  key={quarter}
                  onClick={() => setSelectedQuarter(quarter)}
                  className={`flex-shrink-0 px-6 py-3 rounded-lg font-semibold transition ${
                    selectedQuarter === quarter
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-sm">{quarter}</div>
                  <div className={`text-xs mt-1 ${selectedQuarter === quarter ? 'text-indigo-100' : 'text-gray-500'}`}>
                    {data.status}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Quarter Details */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold">{currentQuarter.title}</h2>
                  <p className="text-gray-600 mt-1">{currentQuarter.description}</p>
                </div>
                <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(currentQuarter.status)}`}>
                  {currentQuarter.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>
              
              {/* Progress Bar */}
              {currentQuarter.progress > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{currentQuarter.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${currentQuarter.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {currentQuarter.items.map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-6 rounded-lg border-2 transition ${
                    item.status === 'completed' 
                      ? 'border-green-200 bg-green-50' 
                      : item.status === 'in-progress'
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg mr-4 ${
                      item.status === 'completed' 
                        ? 'bg-green-100' 
                        : item.status === 'in-progress'
                        ? 'bg-blue-100'
                        : 'bg-gray-100'
                    }`}>
                      <item.icon className={`h-6 w-6 ${
                        item.status === 'completed' 
                          ? 'text-green-600' 
                          : item.status === 'in-progress'
                          ? 'text-blue-600'
                          : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="font-bold text-lg">{item.title}</h3>
                        <span className="ml-auto">
                          {getStatusIcon(item.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Users className="h-10 w-10 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-gray-600">Active Institutions</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Star className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-sm text-gray-600">Students Managed</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <TrendingUp className="h-10 w-10 text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-bold">99.9%</div>
              <div className="text-sm text-gray-600">Uptime SLA</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Award className="h-10 w-10 text-purple-600 mx-auto mb-3" />
              <div className="text-3xl font-bold">4.8</div>
              <div className="text-sm text-gray-600">User Rating</div>
            </div>
          </div>

          {/* Feature Request */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <AlertCircle className="h-8 w-8 text-blue-600 mr-3" />
              Have a Feature Request?
            </h2>
            <p className="text-gray-700 mb-6">
              We're always looking for ways to improve our system. Your feedback helps shape our roadmap.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://github.com/pendtiumpraz/pesantren-coconut/issues/new?template=feature_request.md"
                target="_blank"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                <GitBranch className="h-5 w-5 mr-2" />
                Request Feature
              </a>
              <a 
                href="https://github.com/pendtiumpraz/pesantren-coconut/discussions/categories/ideas"
                target="_blank"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                <Users className="h-5 w-5 mr-2" />
                Join Discussion
              </a>
            </div>
          </div>

          {/* Development Principles */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Our Development Principles</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">User-Centric Design</h3>
                  <p className="text-sm text-gray-600">
                    Every feature is designed with the end-user in mind, ensuring intuitive and efficient workflows.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-3 bg-green-100 rounded-lg mr-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">Security First</h3>
                  <p className="text-sm text-gray-600">
                    We prioritize data security and privacy, implementing best practices and regular security audits.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">Performance Matters</h3>
                  <p className="text-sm text-gray-600">
                    Fast loading times and smooth interactions are non-negotiable for user satisfaction.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                  <Globe className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">Accessibility for All</h3>
                  <p className="text-sm text-gray-600">
                    Our system is designed to be accessible to users of all abilities and backgrounds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}