'use client'

import React from 'react'
import { CreditCard, DollarSign, Smartphone, CheckCircle } from 'lucide-react'

export default function PaymentIntegrationPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <CreditCard className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold">Payment Integration</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Integrate multiple payment gateways for SPP and other transactions
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Supported Payment Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Bank Transfer</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• BCA Virtual Account</li>
                <li>• Mandiri Virtual Account</li>
                <li>• BNI Virtual Account</li>
                <li>• BRI Virtual Account</li>
              </ul>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">E-Wallet</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• GoPay</li>
                <li>• OVO</li>
                <li>• DANA</li>
                <li>• LinkAja</li>
              </ul>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Retail Outlet</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Indomaret</li>
                <li>• Alfamart</li>
                <li>• Manual Transfer</li>
                <li>• Cash Payment</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Payment Providers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="w-6 h-6 text-green-500" />
                <h3 className="font-semibold">Midtrans</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Leading payment gateway in Indonesia with comprehensive features
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>✓ Virtual Account</li>
                <li>✓ Credit Card</li>
                <li>✓ E-Wallet</li>
                <li>✓ Bank Transfer</li>
              </ul>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Smartphone className="w-6 h-6 text-blue-500" />
                <h3 className="font-semibold">Xendit</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Modern payment infrastructure with developer-friendly APIs
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>✓ Virtual Account</li>
                <li>✓ QR Code Payments</li>
                <li>✓ E-Wallet</li>
                <li>✓ Direct Debit</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Implementation Steps</h2>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Configure Environment', desc: 'Set up API keys and webhook URLs' },
              { step: '2', title: 'Create Payment Service', desc: 'Implement payment gateway integration' },
              { step: '3', title: 'Setup Webhooks', desc: 'Handle payment notifications securely' },
              { step: '4', title: 'Test Integration', desc: 'Test with sandbox credentials' },
              { step: '5', title: 'Go Live', desc: 'Switch to production environment' }
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
          <h2 className="text-2xl font-bold mb-4">Security Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Webhook signature verification',
              'SSL/TLS encryption',
              'PCI DSS compliance',
              'Fraud detection',
              'Transaction monitoring',
              'Secure tokenization'
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