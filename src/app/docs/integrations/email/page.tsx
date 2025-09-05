'use client'

import React from 'react'
import { Mail, Send, Shield, CheckCircle, Server, Bell } from 'lucide-react'

export default function EmailIntegrationPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Mail className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold">Email Integration</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Configure email services for notifications, confirmations, and automated messaging
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Email Providers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Gmail SMTP</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Free SMTP service from Google
              </p>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                Recommended
              </span>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">SendGrid</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Professional email service
              </p>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                Enterprise
              </span>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Mailgun</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Developer-friendly email API
              </p>
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded">
                API First
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Email Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-500" />
                Notifications
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Payment confirmations</li>
                <li>• SPP payment reminders</li>
                <li>• Event announcements</li>
                <li>• Exam schedules</li>
                <li>• Grade reports</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-500" />
                System Emails
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Account verification</li>
                <li>• Password reset</li>
                <li>• Login alerts</li>
                <li>• System maintenance</li>
                <li>• Security notifications</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Configuration</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h3 className="font-semibold mb-2">Environment Variables</h3>
              <div className="bg-gray-800 text-gray-100 p-4 rounded text-sm font-mono">
                SMTP_HOST=smtp.gmail.com<br/>
                SMTP_PORT=587<br/>
                SMTP_USER=your-email@gmail.com<br/>
                SMTP_PASSWORD=your-app-password<br/>
                FROM_EMAIL=noreply@pondokimamsyafii.com
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h3 className="font-semibold mb-2">Email Templates</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Welcome email template</li>
                <li>• Payment confirmation template</li>
                <li>• Password reset template</li>
                <li>• Event notification template</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Security Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'TLS/SSL encryption',
              'DKIM authentication',
              'SPF records',
              'Rate limiting',
              'Template validation',
              'Bounce handling'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}