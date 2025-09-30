'use client'

import React from 'react'
import { MessageSquare, Send, Bot, Shield, CheckCircle, Smartphone } from 'lucide-react'

export default function WhatsAppIntegrationPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <MessageSquare className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold">WhatsApp Integration</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Integrate WhatsApp Business API for notifications, OTP, and automated messaging
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Notifications</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Payment confirmations</li>
                <li>• SPP reminders</li>
                <li>• Event announcements</li>
                <li>• Exam schedules</li>
                <li>• Emergency alerts</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Interactive Features</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• OTP verification</li>
                <li>• Student info queries</li>
                <li>• Automated responses</li>
                <li>• Bot commands</li>
                <li>• Support chat</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Supported Providers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">WhatsApp Business API</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Official WhatsApp Business API
              </p>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                Recommended
              </span>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Twilio API</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Third-party WhatsApp integration
              </p>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                Global
              </span>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Fonnte</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Indonesian WhatsApp gateway
              </p>
              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded">
                Local
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Bot Features</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-500" />
                Automated Commands
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>/spp</strong> - Check SPP payment status
                </div>
                <div>
                  <strong>/jadwal</strong> - View class schedule  
                </div>
                <div>
                  <strong>/info</strong> - School information
                </div>
                <div>
                  <strong>/help</strong> - List all commands
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Send className="w-5 h-5 text-green-500" />
                Message Templates
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Payment confirmation template</li>
                <li>• OTP verification template</li>
                <li>• Reminder notification template</li>
                <li>• Event announcement template</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Implementation Steps</h2>
          <div className="space-y-4">
            {[
              { step: '1', title: 'WhatsApp Business Account', desc: 'Setup WhatsApp Business account and get verified' },
              { step: '2', title: 'API Configuration', desc: 'Configure webhook URLs and access tokens' },
              { step: '3', title: 'Message Templates', desc: 'Create and approve message templates' },
              { step: '4', title: 'Bot Development', desc: 'Implement bot responses and commands' },
              { step: '5', title: 'Testing', desc: 'Test with sandbox numbers before going live' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Security & Compliance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" />
                Security Features
              </h3>
              <ul className="space-y-2 text-sm">
                {[
                  'Webhook signature verification',
                  'Rate limiting protection',
                  'Message encryption',
                  'User consent management'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-500" />
                Best Practices
              </h3>
              <ul className="space-y-2 text-sm">
                {[
                  'Always get user consent',
                  'Provide opt-out options',
                  'Use official Business API',
                  'Follow message templates'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}