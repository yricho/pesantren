'use client'

import React from 'react'
import { Bug, Terminal, Search, Eye, Code, AlertCircle } from 'lucide-react'

export default function DebuggingGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Bug className="w-8 h-8 text-purple-500" />
          </div>
          <h1 className="text-4xl font-bold">Debug Guide</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Comprehensive debugging techniques and tools for development and production
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Terminal className="w-6 h-6 text-green-500" />
            Development Debugging
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Browser DevTools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Console Debugging</h4>
                  <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                    <pre className="text-sm text-gray-300">
{`// Enhanced console debugging
console.log('Simple log')
console.warn('Warning message')
console.error('Error message')
console.info('Info message')

// Structured debugging
console.table([
  { name: 'John', age: 25 },
  { name: 'Jane', age: 30 }
])

// Group related logs
console.group('User Data')
console.log('Name:', user.name)
console.log('Email:', user.email)
console.groupEnd()

// Timing operations
console.time('API Call')
await fetch('/api/data')
console.timeEnd('API Call')

// Conditional logging
console.assert(user.id, 'User ID is required')

// Stack trace
console.trace('Function call stack')`}
                    </pre>
                  </div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Network Debugging</h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-2">
                    <li>• <strong>Network Tab:</strong> Monitor API calls</li>
                    <li>• <strong>Status Codes:</strong> Check response codes</li>
                    <li>• <strong>Headers:</strong> Inspect request/response headers</li>
                    <li>• <strong>Payload:</strong> View request body data</li>
                    <li>• <strong>Timing:</strong> Analyze request timing</li>
                    <li>• <strong>Cookies:</strong> Check cookie values</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">React Developer Tools</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`// React debugging techniques
import { useEffect, useDebugValue } from 'react'

// Custom hook with debug value
function useStudentData(studentId) {
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Show debug info in React DevTools
  useDebugValue(student ? \`Student: \${student.name}\` : 'Loading...')
  
  useEffect(() => {
    fetchStudent(studentId)
      .then(setStudent)
      .finally(() => setLoading(false))
  }, [studentId])
  
  return { student, loading }
}

// Error boundary for debugging
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      logErrorToService(error, errorInfo)
    }
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </details>
          )}
        </div>
      )
    }
    
    return this.props.children
  }
}

// Debugging props and state
const StudentCard = ({ student }) => {
  // Log props changes
  useEffect(() => {
    console.log('Student prop changed:', student)
  }, [student])
  
  return <div>/* Component JSX */</div>
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Code className="w-6 h-6 text-blue-500" />
            Server-Side Debugging
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Node.js Debugging</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`// Enhanced logging utility
class Logger {
  static levels = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
  }
  
  static currentLevel = process.env.LOG_LEVEL === 'debug' ? 3 : 2
  
  static log(level, message, meta = {}) {
    if (level <= this.currentLevel) {
      const timestamp = new Date().toISOString()
      const levelName = Object.keys(this.levels)[level]
      
      console.log(JSON.stringify({
        timestamp,
        level: levelName,
        message,
        ...meta,
        ...(level === 0 && { stack: new Error().stack })
      }))
    }
  }
  
  static error(message, meta = {}) {
    this.log(0, message, meta)
  }
  
  static warn(message, meta = {}) {
    this.log(1, message, meta)
  }
  
  static info(message, meta = {}) {
    this.log(2, message, meta)
  }
  
  static debug(message, meta = {}) {
    this.log(3, message, meta)
  }
}

// API route debugging
export async function POST(request: Request) {
  const requestId = crypto.randomUUID()
  Logger.info('API request started', {
    requestId,
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries())
  })
  
  try {
    const body = await request.json()
    Logger.debug('Request body', { requestId, body })
    
    const result = await processRequest(body)
    
    Logger.info('API request completed', { 
      requestId, 
      duration: Date.now() - start,
      success: true 
    })
    
    return Response.json({ success: true, data: result })
  } catch (error) {
    Logger.error('API request failed', {
      requestId,
      error: error.message,
      stack: error.stack
    })
    
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Database query debugging
const debugQuery = (query, params) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Database Query:', query)
    console.log('📊 Parameters:', params)
    console.time('Query Time')
  }
}

// Prisma debugging
const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
    { level: 'info', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
  ],
})

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Params: ' + e.params)
  console.log('Duration: ' + e.duration + 'ms')
})`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">API Debugging Middleware</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`// middleware.ts - Request logging
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const start = Date.now()
  const requestId = crypto.randomUUID()
  
  // Add request ID to headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-request-id', requestId)
  
  console.log('📨 Incoming request:', {
    requestId,
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent'),
    ip: request.ip || 'unknown'
  })
  
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  
  // Add request ID to response
  response.headers.set('x-request-id', requestId)
  
  // Log response (Note: this won't capture the actual response time)
  console.log('📤 Response sent:', {
    requestId,
    status: response.status,
    duration: Date.now() - start
  })
  
  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Eye className="w-6 h-6 text-orange-500" />
            Production Debugging
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Error Tracking & Monitoring</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`// Error tracking service integration
class ErrorTracker {
  static init() {
    if (typeof window !== 'undefined') {
      // Client-side error tracking
      window.addEventListener('error', (event) => {
        this.captureError(event.error, {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        })
      })
      
      window.addEventListener('unhandledrejection', (event) => {
        this.captureError(event.reason, {
          type: 'unhandledRejection'
        })
      })
    }
  }
  
  static captureError(error, context = {}) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
      userId: this.getCurrentUserId(),
      ...context
    }
    
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service
      this.sendToService(errorData)
    } else {
      // Log to console in development
      console.error('🚨 Error tracked:', errorData)
    }
  }
  
  static async sendToService(errorData) {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData)
      })
    } catch (e) {
      console.error('Failed to send error to tracking service:', e)
    }
  }
  
  static getCurrentUserId() {
    // Get current user ID from context/session
    return 'anonymous'
  }
  
  static captureMessage(message, level = 'info', extra = {}) {
    this.captureError(new Error(message), { level, ...extra })
  }
}

// Initialize error tracking
ErrorTracker.init()

// API error handling
export async function POST(request: Request) {
  try {
    const result = await processRequest()
    return Response.json({ success: true, data: result })
  } catch (error) {
    // Capture error with context
    ErrorTracker.captureError(error, {
      endpoint: '/api/students',
      method: 'POST',
      headers: Object.fromEntries(request.headers.entries()),
      timestamp: new Date().toISOString()
    })
    
    // Return generic error to client
    return Response.json(
      { error: 'An error occurred processing your request' },
      { status: 500 }
    )
  }
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Application Health Monitoring</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`// Health check endpoints
// app/api/health/route.ts
export async function GET() {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  }
  
  try {
    // Test database connection
    await prisma.$queryRaw\`SELECT 1\`
    healthData.database = 'connected'
  } catch (error) {
    healthData.status = 'unhealthy'
    healthData.database = 'disconnected'
    healthData.error = error.message
  }
  
  // Test external services
  try {
    const response = await fetch('https://api.external-service.com/health', {
      timeout: 5000
    })
    healthData.externalService = response.ok ? 'available' : 'unavailable'
  } catch (error) {
    healthData.externalService = 'unavailable'
  }
  
  const status = healthData.status === 'healthy' ? 200 : 503
  return Response.json(healthData, { status })
}

// Performance metrics endpoint
// app/api/metrics/route.ts
export async function GET() {
  const metrics = {
    timestamp: new Date().toISOString(),
    nodejs: {
      version: process.version,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    },
    database: await getDatabaseMetrics(),
    requests: await getRequestMetrics(),
    errors: await getErrorMetrics()
  }
  
  return Response.json(metrics)
}

async function getDatabaseMetrics() {
  try {
    const [activeConnections] = await prisma.$queryRaw\`
      SELECT count(*) as count 
      FROM pg_stat_activity 
      WHERE state = 'active'
    \`
    
    const [dbSize] = await prisma.$queryRaw\`
      SELECT pg_size_pretty(pg_database_size(current_database())) as size
    \`
    
    return {
      activeConnections: activeConnections.count,
      size: dbSize.size
    }
  } catch (error) {
    return { error: error.message }
  }
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Remote Debugging</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`// Remote debugging setup for production issues

// 1. Conditional debug endpoints (secure)
// app/api/debug/logs/route.ts
export async function GET(request: Request) {
  // Only allow in development or with special token
  const token = request.headers.get('debug-token')
  if (process.env.NODE_ENV === 'production' && token !== process.env.DEBUG_TOKEN) {
    return new Response('Forbidden', { status: 403 })
  }
  
  const logs = await getRecentLogs()
  return Response.json({ logs })
}

// 2. Safe debug information endpoint
// app/api/debug/info/route.ts
export async function GET() {
  const debugInfo = {
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    uptime: Math.floor(process.uptime()),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
    },
    // Never expose sensitive data
    config: {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT || '3000',
      hasDatabase: !!process.env.DATABASE_URL,
      hasRedis: !!process.env.REDIS_URL
    }
  }
  
  return Response.json(debugInfo)
}

// 3. Debug mode toggle (for staging environment)
let debugMode = process.env.DEBUG_MODE === 'true'

export function toggleDebugMode(enable: boolean) {
  if (process.env.NODE_ENV !== 'production') {
    debugMode = enable
    console.log(\`Debug mode \${enable ? 'enabled' : 'disabled'}\`)
  }
}

export function isDebugMode() {
  return debugMode && process.env.NODE_ENV !== 'production'
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Search className="w-6 h-6 text-purple-500" />
            Debugging Tools & Commands
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Development Commands</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`# Next.js debugging
npm run dev -- --turbo  # Enable Turbopack for faster development
npm run dev -- --port 3001  # Run on different port

# Build analysis
npm run build  # Check for build errors
ANALYZE=true npm run build  # Analyze bundle size

# Database debugging
npx prisma studio  # Visual database editor
npx prisma db push --preview-feature  # Push schema changes
npx prisma generate --watch  # Auto-regenerate client

# TypeScript debugging
npx tsc --noEmit  # Check types without compilation
npx tsc --noEmit --watch  # Watch mode

# Package debugging
npm ls  # List installed packages
npm audit  # Check for vulnerabilities
npm audit fix  # Fix vulnerabilities

# Node.js debugging
node --inspect-brk=0.0.0.0:9229 server.js  # Remote debugging
node --trace-warnings server.js  # Trace warnings
node --max-old-space-size=4096 server.js  # Increase memory limit`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">VS Code Debugging Configuration</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Next.js",
      "type": "node",
      "request": "launch",
      "program": "\${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "console": "integratedTerminal",
      "env": {
        "NODE_ENV": "development"
      },
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Debug Next.js (Server)",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Debug Jest Tests",
      "type": "node",
      "request": "launch",
      "program": "\${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-coverage"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "disableOptimisticBPs": true,
      "windows": {
        "program": "\${workspaceFolder}/node_modules/jest/bin/jest"
      }
    }
  ]
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Production Debugging Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Log Analysis</h4>
                  <div className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <p><strong>Vercel:</strong> Check Function Logs in dashboard</p>
                    <p><strong>Railway:</strong> View logs in project dashboard</p>
                    <p><strong>Server:</strong> Check PM2 logs or systemd journals</p>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Performance Tools</h4>
                  <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <p><strong>Lighthouse:</strong> Web vitals and performance</p>
                    <p><strong>WebPageTest:</strong> Detailed load analysis</p>
                    <p><strong>Chrome DevTools:</strong> Performance profiling</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-red-800 dark:text-red-200 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Debug Security Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-red-700 dark:text-red-300">Safe Debugging</h3>
              <ul className="text-sm text-red-600 dark:text-red-400 space-y-2">
                <li>✅ Use environment-specific log levels</li>
                <li>✅ Sanitize sensitive data in logs</li>
                <li>✅ Secure debug endpoints with authentication</li>
                <li>✅ Remove debug code before production</li>
                <li>✅ Use structured logging with correlation IDs</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-red-700 dark:text-red-300">Avoid in Production</h3>
              <ul className="text-sm text-red-600 dark:text-red-400 space-y-2">
                <li>❌ Never log passwords or tokens</li>
                <li>❌ Don't expose internal paths/structure</li>
                <li>❌ Avoid console.log in production builds</li>
                <li>❌ Don't leave debug endpoints open</li>
                <li>❌ Never debug with real user data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}