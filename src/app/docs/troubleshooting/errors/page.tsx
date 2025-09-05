'use client'

import React, { useState } from 'react'
import { AlertTriangle, Search, Database, Shield, Code, Copy, Check, Bug, Server, Wifi } from 'lucide-react'

export default function CommonErrorsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: AlertTriangle },
    { id: 'database', label: 'Database Errors', icon: Database },
    { id: 'auth', label: 'Authentication', icon: Shield },
    { id: 'api', label: 'API Errors', icon: Server },
    { id: 'frontend', label: 'Frontend Issues', icon: Code },
    { id: 'network', label: 'Network Issues', icon: Wifi }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold">Common Errors & Solutions</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Comprehensive guide to diagnose and resolve common issues in school management system
        </p>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="space-y-8">
        {activeTab === 'overview' && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Error Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg">
                  <Database className="w-8 h-8 text-red-500 mb-2" />
                  <h3 className="font-semibold mb-2">Database Errors</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Connection timeouts</li>
                    <li>• Query execution failures</li>
                    <li>• Migration issues</li>
                    <li>• Constraint violations</li>
                  </ul>
                </div>
                <div className="p-4 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <Shield className="w-8 h-8 text-blue-500 mb-2" />
                  <h3 className="font-semibold mb-2">Authentication Issues</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Login failures</li>
                    <li>• Session expiration</li>
                    <li>• Permission denied</li>
                    <li>• Token validation errors</li>
                  </ul>
                </div>
                <div className="p-4 border border-green-200 dark:border-green-800 rounded-lg">
                  <Server className="w-8 h-8 text-green-500 mb-2" />
                  <h3 className="font-semibold mb-2">API Errors</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• 500 Internal server errors</li>
                    <li>• Rate limiting</li>
                    <li>• Validation failures</li>
                    <li>• External API timeouts</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Quick Diagnostic Steps</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h3 className="font-semibold">Check System Status</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Verify database connection, API health, and service availability</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h3 className="font-semibold">Review Error Logs</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Check application logs, database logs, and system logs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-semibold">Identify Root Cause</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Use debugging tools and monitoring dashboards</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                  <div>
                    <h3 className="font-semibold">Apply Solution</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Follow documented solutions and test thoroughly</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'database' && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Database Connection Issues</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-red-600 mb-2">Error: Connection timeout</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Database connection is taking too long or failing completely
                  </p>
                  
                  <div className="bg-gray-900 rounded-lg p-3 mb-3">
                    <pre className="text-sm text-red-300">
{`Error: connect ETIMEDOUT
    at Connection._handleTimeout
    at Socket.emit (events.js:314:20)`}
                    </pre>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Solutions:</h4>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• Check database server status: <code>systemctl status postgresql</code></li>
                      <li>• Verify connection string in environment variables</li>
                      <li>• Check network connectivity between app and database</li>
                      <li>• Review PostgreSQL connection limits: <code>max_connections</code></li>
                      <li>• Consider using connection pooling (PgBouncer)</li>
                    </ul>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-red-600 mb-2">Error: Too many connections</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Database has reached maximum connection limit
                  </p>
                  
                  <div className="bg-gray-900 rounded-lg p-3 mb-3">
                    <pre className="text-sm text-red-300">
{`FATAL: too many connections for role "postgres"
FATAL: remaining connection slots are reserved for non-replication superuser connections`}
                    </pre>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Solutions:</h4>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      <p className="mb-2">Check current connections:</p>
                      <div className="bg-gray-900 rounded p-2 mb-2">
                        <code className="text-gray-300">
{`SELECT count(*) FROM pg_stat_activity;
SELECT pid, usename, application_name, state 
FROM pg_stat_activity WHERE state = 'active';`}
                        </code>
                      </div>
                      <ul className="space-y-1">
                        <li>• Increase max_connections in postgresql.conf</li>
                        <li>• Implement connection pooling</li>
                        <li>• Kill idle connections: <code>SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle';</code></li>
                        <li>• Optimize application connection handling</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-red-600 mb-2">Error: Migration failed</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Database migration encountered an error
                  </p>
                  
                  <div className="bg-gray-900 rounded-lg p-3 mb-3">
                    <pre className="text-sm text-red-300">
{`Migration failed: relation "students" already exists
Error: P2010 Raw query failed. Code: 42P07`}
                    </pre>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Solutions:</h4>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      <div className="bg-gray-900 rounded p-2 mb-2">
                        <code className="text-gray-300">
{`# Check migration status
npx prisma migrate status

# Reset database (development only)
npx prisma migrate reset

# Apply specific migration
npx prisma migrate deploy

# Generate new migration
npx prisma migrate dev --name fix-migration`}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'auth' && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Authentication & Authorization Errors</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-red-600 mb-2">Error: JWT Token Invalid</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    JSON Web Token is malformed, expired, or invalid
                  </p>
                  
                  <div className="bg-gray-900 rounded-lg p-3 mb-3">
                    <pre className="text-sm text-red-300">
{`JsonWebTokenError: invalid token
TokenExpiredError: jwt expired
Error: JWT malformed`}
                    </pre>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Solutions:</h4>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      <div className="bg-gray-900 rounded p-2 mb-2">
                        <code className="text-gray-300">
{`// Check token expiration
import jwt from 'jsonwebtoken'

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  console.log('Token valid:', decoded)
} catch (error) {
  if (error.name === 'TokenExpiredError') {
    // Redirect to login
    return NextResponse.redirect('/login')
  }
  console.error('Invalid token:', error.message)
}`}
                        </code>
                      </div>
                      <ul className="space-y-1">
                        <li>• Verify JWT_SECRET environment variable</li>
                        <li>• Check token format and structure</li>
                        <li>• Implement automatic token refresh</li>
                        <li>• Clear browser cookies and localStorage</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-red-600 mb-2">Error: NextAuth Session Error</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    NextAuth.js authentication session issues
                  </p>
                  
                  <div className="bg-gray-900 rounded-lg p-3 mb-3">
                    <pre className="text-sm text-red-300">
{`[next-auth][error][JWT_SESSION_ERROR]
[next-auth][error][INVALID_CALLBACK_URL]
Error: Callback URL not allowed`}
                    </pre>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Solutions:</h4>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      <div className="bg-gray-900 rounded p-2 mb-2">
                        <code className="text-gray-300">
{`// Check NextAuth configuration
// pages/api/auth/[...nextauth].ts

export default NextAuth({
  providers: [
    // Your providers
  ],
  secret: process.env.NEXTAUTH_SECRET, // Required!
  url: process.env.NEXTAUTH_URL,      // Set correct URL
  callbacks: {
    async session({ token, session }) {
      // Session callback logic
      return session
    }
  }
})`}
                        </code>
                      </div>
                      <ul className="space-y-1">
                        <li>• Set NEXTAUTH_SECRET environment variable</li>
                        <li>• Verify NEXTAUTH_URL matches deployment URL</li>
                        <li>• Check OAuth app callback URLs</li>
                        <li>• Clear browser cookies and try again</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-red-600 mb-2">Error: Access Denied</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    User doesn't have required permissions for the action
                  </p>
                  
                  <div className="bg-gray-900 rounded-lg p-3 mb-3">
                    <pre className="text-sm text-red-300">
{`Error: Access denied. Required role: admin
Error: Insufficient permissions
Status: 403 Forbidden`}
                    </pre>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Solutions:</h4>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      <div className="bg-gray-900 rounded p-2 mb-2">
                        <code className="text-gray-300">
{`// Check user roles in database
SELECT u.email, r.name as role 
FROM users u 
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'user@example.com';

// Update user role
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';`}
                        </code>
                      </div>
                      <ul className="space-y-1">
                        <li>• Verify user role assignments in database</li>
                        <li>• Check role-based access control logic</li>
                        <li>• Update user permissions if needed</li>
                        <li>• Review API route protection</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'api' && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">API & Server Errors</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-red-600 mb-2">Error: 500 Internal Server Error</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Unhandled server-side error occurred
                  </p>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Debug Steps:</h4>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      <div className="bg-gray-900 rounded p-2 mb-2">
                        <code className="text-gray-300">
{`// Check server logs
docker logs container_name
tail -f /var/log/application.log

// Add error handling to API routes
export async function POST(request: NextRequest) {
  try {
    // Your API logic here
    const result = await someAsyncOperation()
    return NextResponse.json(result)
  } catch (error) {
    console.error('API Error:', error)
    
    // Log full error details
    console.error({
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}`}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-red-600 mb-2">Error: Rate Limit Exceeded</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Too many requests from the same IP address
                  </p>
                  
                  <div className="bg-gray-900 rounded-lg p-3 mb-3">
                    <pre className="text-sm text-red-300">
{`Error: Rate limit exceeded. Try again later.
Status: 429 Too Many Requests
X-RateLimit-Remaining: 0`}
                    </pre>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Solutions:</h4>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      <div className="bg-gray-900 rounded p-2 mb-2">
                        <code className="text-gray-300">
{`// Implement exponential backoff
async function apiCallWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options)
      
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || 60
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000))
        continue
      }
      
      return response
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 2 ** i * 1000))
    }
  }
}`}
                        </code>
                      </div>
                      <ul className="space-y-1">
                        <li>• Check rate limit configuration</li>
                        <li>• Implement request queuing</li>
                        <li>• Use caching to reduce API calls</li>
                        <li>• Contact admin to increase rate limits</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-red-600 mb-2">Error: Validation Failed</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Request data doesn't match expected schema
                  </p>
                  
                  <div className="bg-gray-900 rounded-lg p-3 mb-3">
                    <pre className="text-sm text-red-300">
{`Error: Validation failed
- email: Invalid email format
- name: Required field missing
- age: Must be a positive integer`}
                    </pre>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Solutions:</h4>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      <div className="bg-gray-900 rounded p-2 mb-2">
                        <code className="text-gray-300">
{`// Client-side validation
import { z } from 'zod'

const studentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  nisn: z.string().length(10, 'NISN must be 10 digits')
})

// Validate before sending
try {
  const validData = studentSchema.parse(formData)
  await createStudent(validData)
} catch (error) {
  // Handle validation errors
  setErrors(error.errors)
}`}
                        </code>
                      </div>
                      <ul className="space-y-1">
                        <li>• Check request payload format</li>
                        <li>• Validate required fields</li>
                        <li>• Review API documentation</li>
                        <li>• Use schema validation libraries</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'frontend' && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Frontend & UI Issues</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-red-600 mb-2">Error: Hydration Mismatch</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Server-side and client-side rendered content doesn't match
                  </p>
                  
                  <div className="bg-gray-900 rounded-lg p-3 mb-3">
                    <pre className="text-sm text-red-300">
{`Warning: Text content did not match. Server: "..." Client: "..."
Error: Hydration failed because the initial UI does not match`}
                    </pre>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Solutions:</h4>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      <div className="bg-gray-900 rounded p-2 mb-2">
                        <code className="text-gray-300">
{`// Use dynamic imports for client-only components
import dynamic from 'next/dynamic'

const ClientOnlyComponent = dynamic(
  () => import('./ClientOnlyComponent'),
  { ssr: false }
)

// Or use useEffect for client-side only data
const [clientData, setClientData] = useState(null)

useEffect(() => {
  setClientData(getClientSideData())
}, [])

// Avoid using Date.now() or Math.random() in SSR
// Use suppressHydrationWarning sparingly
<div suppressHydrationWarning>
  {new Date().toLocaleDateString()}
</div>`}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-red-600 mb-2">Error: Module Not Found</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Import/export statements reference non-existent modules
                  </p>
                  
                  <div className="bg-gray-900 rounded-lg p-3 mb-3">
                    <pre className="text-sm text-red-300">
{`Module not found: Can't resolve './components/StudentForm'
Error: Cannot find module '../utils/helpers'
TypeScript error: Cannot find module or its corresponding type declarations`}
                    </pre>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Solutions:</h4>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      <ul className="space-y-1">
                        <li>• Check file path and spelling</li>
                        <li>• Verify file extensions (.ts, .tsx, .js)</li>
                        <li>• Update import paths after file moves</li>
                        <li>• Install missing dependencies: <code>npm install package-name</code></li>
                        <li>• Check tsconfig.json path mappings</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-red-600 mb-2">Error: Memory Leak Warning</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Component causing memory leaks due to improper cleanup
                  </p>
                  
                  <div className="bg-gray-900 rounded-lg p-3 mb-3">
                    <pre className="text-sm text-red-300">
{`Warning: Can't perform a React state update on an unmounted component
Memory leak detected: EventListener not removed
Timer still running after component unmount`}
                    </pre>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Solutions:</h4>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      <div className="bg-gray-900 rounded p-2 mb-2">
                        <code className="text-gray-300">
{`// Proper cleanup in useEffect
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1)
  }, 1000)
  
  const handleResize = () => setWindowWidth(window.innerWidth)
  window.addEventListener('resize', handleResize)
  
  // Cleanup function
  return () => {
    clearInterval(timer)
    window.removeEventListener('resize', handleResize)
  }
}, [])

// Use AbortController for async operations
useEffect(() => {
  const controller = new AbortController()
  
  fetchData({ signal: controller.signal })
    .then(setData)
    .catch(error => {
      if (error.name !== 'AbortError') {
        console.error(error)
      }
    })
  
  return () => controller.abort()
}, [])`}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'network' && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Network & Connectivity Issues</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-red-600 mb-2">Error: CORS Policy Violation</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Cross-Origin Resource Sharing error blocking API requests
                  </p>
                  
                  <div className="bg-gray-900 rounded-lg p-3 mb-3">
                    <pre className="text-sm text-red-300">
{`Access to fetch at 'https://api.school.com' from origin 'https://school.com' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header`}
                    </pre>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Solutions:</h4>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      <div className="bg-gray-900 rounded p-2 mb-2">
                        <code className="text-gray-300">
{`// next.config.js - Add CORS headers
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://yourdomain.com'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          }
        ]
      }
    ]
  }
}

// API route CORS handling
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}`}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-red-600 mb-2">Error: Network Timeout</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Request taking too long to complete
                  </p>
                  
                  <div className="bg-gray-900 rounded-lg p-3 mb-3">
                    <pre className="text-sm text-red-300">
{`Error: Network timeout
fetch: request timeout
ConnectionError: timeout of 5000ms exceeded`}
                    </pre>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Solutions:</h4>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      <div className="bg-gray-900 rounded p-2 mb-2">
                        <code className="text-gray-300">
{`// Implement timeout and retry logic
async function fetchWithTimeout(url, options = {}, timeout = 10000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error('Request timeout')
    }
    throw error
  }
}

// Use with retry mechanism
async function apiCallWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetchWithTimeout(url, options, 10000)
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}`}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-red-600 mb-2">Error: SSL Certificate Issues</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    HTTPS connection failing due to certificate problems
                  </p>
                  
                  <div className="bg-gray-900 rounded-lg p-3 mb-3">
                    <pre className="text-sm text-red-300">
{`Error: certificate has expired
Error: unable to verify the first certificate
net::ERR_CERT_AUTHORITY_INVALID`}
                    </pre>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Solutions:</h4>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      <ul className="space-y-1">
                        <li>• Check certificate expiration date</li>
                        <li>• Verify domain matches certificate</li>
                        <li>• Update SSL certificate if expired</li>
                        <li>• Check certificate chain completeness</li>
                        <li>• Use SSL certificate monitoring tools</li>
                      </ul>
                      <div className="bg-gray-900 rounded p-2 mt-2">
                        <code className="text-gray-300">
{`# Check certificate details
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Check certificate expiration
openssl x509 -in certificate.crt -text -noout | grep -A 2 "Validity"`}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}