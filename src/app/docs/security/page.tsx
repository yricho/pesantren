'use client'

import React from 'react'
import Link from 'next/link'
import { Shield, Lock, Database, FileCheck, AlertTriangle, Key, UserCheck, Server, Eye, CheckCircle } from 'lucide-react'

export default function SecurityPage() {
  const securityTopics = [
    {
      title: 'Authentication & Authorization',
      href: '/docs/security/auth',
      icon: Lock,
      description: 'Secure user authentication, session management, and role-based access control',
      features: [
        'JWT implementation',
        'Two-factor authentication (2FA)',
        'Session security',
        'Role-based permissions'
      ],
      status: 'production'
    },
    {
      title: 'Data Protection',
      href: '/docs/security/data',
      icon: Database,
      description: 'Data encryption, privacy compliance, and secure data handling practices',
      features: [
        'Encryption at rest',
        'Encryption in transit',
        'PII protection',
        'GDPR compliance'
      ],
      status: 'production'
    },
    {
      title: 'Security Audit',
      href: '/docs/security/audit',
      icon: FileCheck,
      description: 'Security auditing, monitoring, and incident response procedures',
      features: [
        'Audit logging',
        'Security monitoring',
        'Vulnerability scanning',
        'Incident response'
      ],
      status: 'beta'
    }
  ]

  const securityChecklist = [
    { label: 'HTTPS enabled with SSL certificate', checked: true },
    { label: 'Environment variables properly secured', checked: true },
    { label: 'Database credentials encrypted', checked: true },
    { label: 'API rate limiting implemented', checked: true },
    { label: 'Input validation on all forms', checked: true },
    { label: 'SQL injection prevention', checked: true },
    { label: 'XSS protection headers', checked: true },
    { label: 'CSRF tokens implemented', checked: true },
    { label: 'Two-factor authentication available', checked: true },
    { label: 'Regular security updates applied', checked: false },
    { label: 'Penetration testing completed', checked: false },
    { label: 'Security incident response plan', checked: false }
  ]

  const securityHeaders = [
    {
      header: 'Content-Security-Policy',
      value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
      description: 'Prevents XSS attacks by controlling resource loading'
    },
    {
      header: 'X-Frame-Options',
      value: 'DENY',
      description: 'Prevents clickjacking attacks'
    },
    {
      header: 'X-Content-Type-Options',
      value: 'nosniff',
      description: 'Prevents MIME type sniffing'
    },
    {
      header: 'Referrer-Policy',
      value: 'strict-origin-when-cross-origin',
      description: 'Controls referrer information sent with requests'
    },
    {
      header: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=()',
      description: 'Controls browser features and APIs'
    }
  ]

  const vulnerabilities = [
    {
      type: 'SQL Injection',
      severity: 'Critical',
      prevention: 'Use Prisma ORM with parameterized queries',
      status: 'Protected'
    },
    {
      type: 'Cross-Site Scripting (XSS)',
      severity: 'High',
      prevention: 'React automatic escaping + CSP headers',
      status: 'Protected'
    },
    {
      type: 'Cross-Site Request Forgery (CSRF)',
      severity: 'High',
      prevention: 'CSRF tokens in forms + SameSite cookies',
      status: 'Protected'
    },
    {
      type: 'Authentication Bypass',
      severity: 'Critical',
      prevention: 'JWT validation + session management',
      status: 'Protected'
    },
    {
      type: 'Sensitive Data Exposure',
      severity: 'High',
      prevention: 'HTTPS + encryption at rest',
      status: 'Protected'
    },
    {
      type: 'Broken Access Control',
      severity: 'High',
      prevention: 'RBAC + middleware validation',
      status: 'Protected'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Shield className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold">Security</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Comprehensive security measures to protect your application and data
        </p>
      </div>

      {/* Security Alert */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
              Security Best Practices
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Always keep dependencies updated, use strong passwords, enable 2FA for admin accounts, 
              and regularly review security logs. Report security issues to security@pondokimamsyafii.com
            </p>
          </div>
        </div>
      </div>

      {/* Security Topics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {securityTopics.map((topic) => {
          const Icon = topic.icon
          return (
            <Link
              key={topic.href}
              href={topic.href}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Icon className="w-6 h-6 text-green-500" />
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  topic.status === 'production' 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                }`}>
                  {topic.status}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{topic.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {topic.description}
              </p>
              <ul className="space-y-1">
                {topic.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Link>
          )
        })}
      </div>

      {/* Security Checklist */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-green-500" />
          Security Checklist
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {securityChecklist.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded flex items-center justify-center ${
                item.checked 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                {item.checked && <CheckCircle className="w-3 h-3" />}
              </div>
              <span className={`text-sm ${
                item.checked 
                  ? 'text-gray-700 dark:text-gray-300' 
                  : 'text-gray-400 dark:text-gray-500'
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Completion:</strong> {securityChecklist.filter(i => i.checked).length} of {securityChecklist.length} security measures implemented
          </p>
        </div>
      </div>

      {/* Security Headers */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Server className="w-6 h-6 text-blue-500" />
          Security Headers Configuration
        </h2>
        <div className="space-y-4">
          {securityHeaders.map((header, idx) => (
            <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-mono font-semibold text-sm">{header.header}</h3>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                  Active
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{header.description}</p>
              <div className="bg-gray-100 dark:bg-gray-900 rounded p-2">
                <code className="text-xs text-gray-700 dark:text-gray-300 break-all">
                  {header.value}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vulnerability Matrix */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Eye className="w-6 h-6 text-red-500" />
          Vulnerability Protection Matrix
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 px-4">Vulnerability Type</th>
                <th className="text-left py-3 px-4">Severity</th>
                <th className="text-left py-3 px-4">Prevention Method</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {vulnerabilities.map((vuln, idx) => (
                <tr key={idx} className="border-b dark:border-gray-700">
                  <td className="py-3 px-4 font-medium">{vuln.type}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      vuln.severity === 'Critical' 
                        ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        : 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
                    }`}>
                      {vuln.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {vuln.prevention}
                  </td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      {vuln.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Quick Security Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Key className="w-6 h-6 text-blue-500 mb-2" />
            <h3 className="font-semibold text-sm">Rotate API Keys</h3>
          </button>
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <UserCheck className="w-6 h-6 text-green-500 mb-2" />
            <h3 className="font-semibold text-sm">Review Permissions</h3>
          </button>
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <FileCheck className="w-6 h-6 text-purple-500 mb-2" />
            <h3 className="font-semibold text-sm">View Audit Logs</h3>
          </button>
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Shield className="w-6 h-6 text-red-500 mb-2" />
            <h3 className="font-semibold text-sm">Run Security Scan</h3>
          </button>
        </div>
      </div>

      {/* Resources */}
      <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Security Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noopener noreferrer" 
             className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            OWASP Top 10 Security Risks →
          </a>
          <a href="https://github.com/OWASP/CheatSheetSeries" target="_blank" rel="noopener noreferrer"
             className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            OWASP Cheat Sheet Series →
          </a>
          <a href="https://web.dev/secure/" target="_blank" rel="noopener noreferrer"
             className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            Web Security Best Practices →
          </a>
        </div>
      </div>
    </div>
  )
}