'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Webhook, 
  Copy, 
  Check, 
  Globe,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle2,
  Info,
  Code,
  RefreshCw,
  Zap,
  Mail,
  CreditCard,
  Users,
  Bell,
  FileText,
  Settings,
  Key,
  Terminal
} from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';

export default function WebhooksPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const CodeBlock = ({ code, id, language = 'javascript', title = '' }: { 
    code: string; 
    id: string; 
    language?: string;
    title?: string;
  }) => (
    <div className="relative bg-gray-900 text-gray-100 rounded-lg overflow-hidden">
      {title && (
        <div className="bg-gray-800 px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
          {title}
        </div>
      )}
      <div className="relative p-4 overflow-x-auto">
        <button
          onClick={() => handleCopy(code, id)}
          className="absolute top-2 right-2 p-2 bg-gray-800 rounded hover:bg-gray-700 transition opacity-0 hover:opacity-100"
        >
          {copiedId === id ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
        </button>
        <pre className="text-sm font-mono">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  );

  const webhookEvents = [
    {
      category: 'Student Events',
      icon: Users,
      events: [
        { name: 'student.created', description: 'New student registered' },
        { name: 'student.updated', description: 'Student information updated' },
        { name: 'student.deleted', description: 'Student record deleted' },
        { name: 'student.enrolled', description: 'Student enrolled in class' },
        { name: 'student.graduated', description: 'Student graduated' }
      ]
    },
    {
      category: 'Payment Events',
      icon: CreditCard,
      events: [
        { name: 'payment.created', description: 'New payment created' },
        { name: 'payment.success', description: 'Payment successful' },
        { name: 'payment.failed', description: 'Payment failed' },
        { name: 'payment.pending', description: 'Payment pending' },
        { name: 'payment.refunded', description: 'Payment refunded' }
      ]
    },
    {
      category: 'Registration Events',
      icon: FileText,
      events: [
        { name: 'ppdb.registered', description: 'New PPDB registration' },
        { name: 'ppdb.approved', description: 'PPDB application approved' },
        { name: 'ppdb.rejected', description: 'PPDB application rejected' },
        { name: 'ppdb.documents_uploaded', description: 'Documents uploaded' }
      ]
    },
    {
      category: 'Notification Events',
      icon: Bell,
      events: [
        { name: 'notification.sent', description: 'Notification sent' },
        { name: 'notification.delivered', description: 'Notification delivered' },
        { name: 'notification.failed', description: 'Notification failed' },
        { name: 'notification.opened', description: 'Notification opened' }
      ]
    }
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12">
          <div className="container mx-auto px-6">
            <Link
              href="/docs/api"
              className="inline-flex items-center text-purple-100 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to API Docs
            </Link>
            <div className="flex items-center mb-4">
              <Globe className="h-12 w-12 mr-4" />
              <h1 className="text-4xl font-bold">Webhooks</h1>
            </div>
            <p className="text-xl text-purple-100">
              Real-time event notifications for your application
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-lg mb-8">
            <div className="flex border-b overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('setup')}
                className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                  activeTab === 'setup'
                    ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Setup
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                  activeTab === 'events'
                    ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Events
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                  activeTab === 'security'
                    ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab('testing')}
                className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                  activeTab === 'testing'
                    ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Testing
              </button>
            </div>

            <div className="p-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Webhooks Overview</h2>
                    <p className="text-gray-600 mb-6">
                      Webhooks allow your application to receive real-time notifications when events occur in the Pondok Imam Syafi'i system.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-purple-50 rounded-lg">
                      <Zap className="h-8 w-8 text-purple-600 mb-3" />
                      <h3 className="font-bold text-lg mb-2">Real-time Events</h3>
                      <p className="text-sm text-gray-600">
                        Instant notifications when important events occur in your system.
                      </p>
                    </div>
                    
                    <div className="p-6 bg-blue-50 rounded-lg">
                      <RefreshCw className="h-8 w-8 text-blue-600 mb-3" />
                      <h3 className="font-bold text-lg mb-2">Automatic Retries</h3>
                      <p className="text-sm text-gray-600">
                        Failed webhook deliveries are automatically retried with exponential backoff.
                      </p>
                    </div>
                    
                    <div className="p-6 bg-green-50 rounded-lg">
                      <Shield className="h-8 w-8 text-green-600 mb-3" />
                      <h3 className="font-bold text-lg mb-2">Secure Delivery</h3>
                      <p className="text-sm text-gray-600">
                        HMAC signatures ensure webhook payloads are authentic and untampered.
                      </p>
                    </div>
                    
                    <div className="p-6 bg-orange-50 rounded-lg">
                      <Clock className="h-8 w-8 text-orange-600 mb-3" />
                      <h3 className="font-bold text-lg mb-2">Event History</h3>
                      <p className="text-sm text-gray-600">
                        View delivery status and retry attempts for all webhook events.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3">How Webhooks Work</h3>
                    <ol className="space-y-3">
                      <li className="flex items-start">
                        <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold mr-3">1</span>
                        <div>
                          <p className="font-semibold">Event Occurs</p>
                          <p className="text-sm text-gray-600">An event happens in the system (e.g., new payment received)</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold mr-3">2</span>
                        <div>
                          <p className="font-semibold">Webhook Triggered</p>
                          <p className="text-sm text-gray-600">System creates webhook payload with event data</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold mr-3">3</span>
                        <div>
                          <p className="font-semibold">HTTP POST Request</p>
                          <p className="text-sm text-gray-600">Payload is sent to your configured endpoint URL</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold mr-3">4</span>
                        <div>
                          <p className="font-semibold">Your App Responds</p>
                          <p className="text-sm text-gray-600">Your endpoint processes the event and returns 200 OK</p>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>
              )}

              {/* Setup Tab */}
              {activeTab === 'setup' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-4">Setting Up Webhooks</h2>

                  <div>
                    <h3 className="font-bold text-lg mb-3">Step 1: Create Webhook Endpoint</h3>
                    <p className="text-gray-600 mb-3">Create an endpoint in your application to receive webhook events:</p>
                    
                    <CodeBlock
                      code={`// pages/api/webhooks/pondok.ts
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify webhook signature
  const signature = req.headers['x-webhook-signature'];
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Process webhook event
  const { event, data } = req.body;

  switch (event) {
    case 'payment.success':
      await handlePaymentSuccess(data);
      break;
    case 'student.created':
      await handleNewStudent(data);
      break;
    // Add more event handlers
  }

  // Always return 200 OK quickly
  res.status(200).json({ received: true });
}`}
                      id="webhook-endpoint"
                      language="typescript"
                      title="webhook-endpoint.ts"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3">Step 2: Register Webhook URL</h3>
                    <CodeBlock
                      code={`POST /api/webhooks/register
Authorization: Bearer <admin-token>

{
  "url": "https://your-app.com/api/webhooks/pondok",
  "events": [
    "payment.success",
    "payment.failed",
    "student.created",
    "ppdb.registered"
  ],
  "secret": "your-webhook-secret-key",
  "active": true
}`}
                      id="register-webhook"
                      language="json"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3">Step 3: Handle Events</h3>
                    <CodeBlock
                      code={`// Event handler examples
async function handlePaymentSuccess(data) {
  const { paymentId, studentId, amount, paidAt } = data;
  
  // Update your database
  await updatePaymentStatus(paymentId, 'completed');
  
  // Send confirmation email
  await sendPaymentConfirmation(studentId, amount);
  
  // Update student balance
  await updateStudentBalance(studentId, -amount);
  
  console.log(\`Payment \${paymentId} processed successfully\`);
}

async function handleNewStudent(data) {
  const { studentId, name, email, grade } = data;
  
  // Create user account
  await createUserAccount(email, name);
  
  // Send welcome email
  await sendWelcomeEmail(email, name);
  
  // Sync with other systems
  await syncWithLMS(studentId, grade);
}`}
                      id="event-handlers"
                      language="javascript"
                    />
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm text-yellow-800">
                          <strong>Important:</strong> Your webhook endpoint must return a 200 status code within 10 seconds, 
                          or the delivery will be considered failed and retried.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Events Tab */}
              {activeTab === 'events' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-4">Webhook Events</h2>

                  <div className="space-y-6">
                    {webhookEvents.map((category, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center">
                          <category.icon className="h-6 w-6 text-purple-600 mr-2" />
                          {category.category}
                        </h3>
                        
                        <div className="space-y-3">
                          {category.events.map((event, eventIdx) => (
                            <div key={eventIdx} className="flex items-start p-3 bg-gray-50 rounded">
                              <code className="font-mono text-sm text-purple-600 font-semibold mr-3">
                                {event.name}
                              </code>
                              <span className="text-sm text-gray-600">{event.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3">Event Payload Structure</h3>
                    <CodeBlock
                      code={`{
  "id": "evt_1234567890",
  "event": "payment.success",
  "created": "2024-12-05T10:30:00Z",
  "data": {
    "paymentId": "pay_abc123",
    "studentId": "std_xyz789",
    "amount": 500000,
    "currency": "IDR",
    "method": "bank_transfer",
    "paidAt": "2024-12-05T10:29:45Z",
    "metadata": {
      "invoice": "INV-2024-12-001",
      "description": "SPP Desember 2024"
    }
  },
  "attempt": 1,
  "signature": "sha256=abcdef1234567890..."
}`}
                      id="event-payload"
                      language="json"
                    />
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-4">Webhook Security</h2>

                  <div>
                    <h3 className="font-bold text-lg mb-3">Signature Verification</h3>
                    <p className="text-gray-600 mb-3">
                      All webhook payloads are signed using HMAC-SHA256. Always verify the signature before processing events.
                    </p>
                    
                    <CodeBlock
                      code={`// Node.js signature verification
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  // Use timingSafeEqual to prevent timing attacks
  const expectedBuffer = Buffer.from(expectedSignature, 'hex');
  const signatureBuffer = Buffer.from(signature.replace('sha256=', ''), 'hex');
  
  if (expectedBuffer.length !== signatureBuffer.length) {
    return false;
  }
  
  return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
}

// Usage in webhook handler
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const isValid = verifyWebhookSignature(
    req.body,
    signature,
    process.env.WEBHOOK_SECRET
  );
  
  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process webhook...
});`}
                      id="signature-verify"
                      language="javascript"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3">Best Practices</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold mb-2">DO ✓</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Always verify webhook signatures</li>
                          <li>• Use HTTPS endpoints only</li>
                          <li>• Return 200 OK immediately</li>
                          <li>• Process events asynchronously</li>
                          <li>• Implement idempotency</li>
                          <li>• Store and check event IDs</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-red-50 rounded-lg">
                        <h4 className="font-semibold mb-2">DON'T ✗</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Don't trust payloads without verification</li>
                          <li>• Don't perform long operations synchronously</li>
                          <li>• Don't expose webhook URLs publicly</li>
                          <li>• Don't retry on client errors (4xx)</li>
                          <li>• Don't process duplicate events</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3">IP Whitelisting</h3>
                    <p className="text-gray-600 mb-3">
                      For additional security, whitelist our webhook IP addresses:
                    </p>
                    <div className="bg-gray-100 p-4 rounded font-mono text-sm">
                      <div>Production: 103.150.117.0/24</div>
                      <div>Staging: 103.150.118.0/24</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Testing Tab */}
              {activeTab === 'testing' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-4">Testing Webhooks</h2>

                  <div>
                    <h3 className="font-bold text-lg mb-3">Test Webhook Delivery</h3>
                    <CodeBlock
                      code={`POST /api/webhooks/test
Authorization: Bearer <admin-token>

{
  "webhookId": "webhook_123",
  "event": "payment.success",
  "data": {
    "paymentId": "test_pay_123",
    "amount": 100000,
    "studentId": "test_std_456"
  }
}

// Response
{
  "success": true,
  "delivery": {
    "status": "delivered",
    "responseCode": 200,
    "responseTime": 245,
    "attempts": 1
  }
}`}
                      id="test-webhook"
                      language="json"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3">Using ngrok for Local Testing</h3>
                    <CodeBlock
                      code={`# 1. Install ngrok
npm install -g ngrok

# 2. Start your local server
npm run dev

# 3. Create tunnel to your local server
ngrok http 3000

# 4. Use the HTTPS URL provided by ngrok
# Example: https://abc123.ngrok.io/api/webhooks

# 5. Register this URL as your webhook endpoint`}
                      id="ngrok-testing"
                      language="bash"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3">Webhook Testing Tool</h3>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800 mb-3">
                        Use our webhook testing tool in the admin dashboard to:
                      </p>
                      <ul className="space-y-1 text-sm">
                        <li>• Send test events to your endpoint</li>
                        <li>• View request/response details</li>
                        <li>• Debug signature verification</li>
                        <li>• Check delivery status</li>
                        <li>• Replay failed webhooks</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3">Retry Mechanism</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-2 text-left">Attempt</th>
                            <th className="px-4 py-2 text-left">Delay</th>
                            <th className="px-4 py-2 text-left">Total Time</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          <tr>
                            <td className="px-4 py-2">1</td>
                            <td className="px-4 py-2">Immediate</td>
                            <td className="px-4 py-2">0 seconds</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2">2</td>
                            <td className="px-4 py-2">5 seconds</td>
                            <td className="px-4 py-2">5 seconds</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2">3</td>
                            <td className="px-4 py-2">30 seconds</td>
                            <td className="px-4 py-2">35 seconds</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2">4</td>
                            <td className="px-4 py-2">2 minutes</td>
                            <td className="px-4 py-2">~2.5 minutes</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2">5</td>
                            <td className="px-4 py-2">10 minutes</td>
                            <td className="px-4 py-2">~12.5 minutes</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2">6</td>
                            <td className="px-4 py-2">1 hour</td>
                            <td className="px-4 py-2">~1 hour</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Webhook Management API */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Webhook Management API</h2>
            
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded">
                <div className="flex items-center mb-2">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold mr-2">GET</span>
                  <code className="text-sm">/api/webhooks</code>
                </div>
                <p className="text-sm text-gray-600">List all configured webhooks</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded">
                <div className="flex items-center mb-2">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold mr-2">POST</span>
                  <code className="text-sm">/api/webhooks</code>
                </div>
                <p className="text-sm text-gray-600">Create new webhook</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded">
                <div className="flex items-center mb-2">
                  <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold mr-2">PUT</span>
                  <code className="text-sm">/api/webhooks/:id</code>
                </div>
                <p className="text-sm text-gray-600">Update webhook configuration</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded">
                <div className="flex items-center mb-2">
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold mr-2">DELETE</span>
                  <code className="text-sm">/api/webhooks/:id</code>
                </div>
                <p className="text-sm text-gray-600">Delete webhook</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded">
                <div className="flex items-center mb-2">
                  <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-bold mr-2">POST</span>
                  <code className="text-sm">/api/webhooks/:id/test</code>
                </div>
                <p className="text-sm text-gray-600">Send test event to webhook</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}