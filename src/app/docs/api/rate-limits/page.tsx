'use client'

import React, { useState } from 'react'
import { Shield, AlertTriangle, Clock, Settings, Code, CheckCircle, XCircle, Info, Copy, Check, Zap, Server, Database } from 'lucide-react'

export default function RateLimitsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'implementation', label: 'Implementation', icon: Code },
    { id: 'configuration', label: 'Configuration', icon: Settings },
    { id: 'monitoring', label: 'Monitoring', icon: Clock },
    { id: 'best-practices', label: 'Best Practices', icon: CheckCircle }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold">API Rate Limits</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Protect your API from abuse and ensure fair usage with rate limiting
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
                  ? 'bg-blue-500 text-white'
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
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Info className="w-6 h-6 text-blue-500" />
                Rate Limiting Strategy
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Default Limits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        <h4 className="font-semibold">Public API</h4>
                      </div>
                      <ul className="space-y-1 text-sm">
                        <li>• 100 requests per minute</li>
                        <li>• 1,000 requests per hour</li>
                        <li>• 10,000 requests per day</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Server className="w-5 h-5 text-green-500" />
                        <h4 className="font-semibold">Authenticated API</h4>
                      </div>
                      <ul className="space-y-1 text-sm">
                        <li>• 300 requests per minute</li>
                        <li>• 5,000 requests per hour</li>
                        <li>• 50,000 requests per day</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Rate Limit Headers</h3>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-sm text-gray-300 overflow-x-auto">
{`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1701936000
X-RateLimit-Reset-After: 60
X-RateLimit-Bucket: api_public`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">429 Response</h3>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-sm text-gray-300 overflow-x-auto">
{`{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please retry after 60 seconds.",
  "retryAfter": 60,
  "limit": 100,
  "remaining": 0,
  "reset": 1701936000
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Rate Limiting Methods</h2>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-semibold mb-2">Token Bucket</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Tokens are added at a constant rate. Each request consumes a token.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                      Burst Support
                    </span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                      Memory Efficient
                    </span>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-semibold mb-2">Sliding Window</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Tracks requests in a moving time window for precise rate limiting.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                      Accurate
                    </span>
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded">
                      More Memory
                    </span>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-semibold mb-2">Fixed Window</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Resets counter at fixed intervals (e.g., every minute).
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                      Simple
                    </span>
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded">
                      Edge Case Issues
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'implementation' && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Middleware Implementation</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">Redis-based Rate Limiter</h3>
                    <button
                      onClick={() => copyToClipboard(`import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Redis and Ratelimit
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

// Create rate limiter with sliding window
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  analytics: true,
  prefix: '@upstash/ratelimit',
})

export async function rateLimitMiddleware(req: NextRequest) {
  // Get identifier (IP address or user ID)
  const identifier = req.ip ?? req.headers.get('x-forwarded-for') ?? 'anonymous'
  
  // Check rate limit
  const { success, limit, remaining, reset } = await ratelimit.limit(identifier)
  
  // Set rate limit headers
  const headers = new Headers()
  headers.set('X-RateLimit-Limit', limit.toString())
  headers.set('X-RateLimit-Remaining', remaining.toString())
  headers.set('X-RateLimit-Reset', new Date(reset).toISOString())
  
  if (!success) {
    return NextResponse.json(
      {
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.floor((reset - Date.now()) / 1000),
      },
      { 
        status: 429,
        headers 
      }
    )
  }
  
  return null // Continue to API route
}`, 'redis-limiter')}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {copiedCode === 'redis-limiter' ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300">
{`import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Redis and Ratelimit
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

// Create rate limiter with sliding window
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  analytics: true,
  prefix: '@upstash/ratelimit',
})

export async function rateLimitMiddleware(req: NextRequest) {
  // Get identifier (IP address or user ID)
  const identifier = req.ip ?? req.headers.get('x-forwarded-for') ?? 'anonymous'
  
  // Check rate limit
  const { success, limit, remaining, reset } = await ratelimit.limit(identifier)
  
  // Set rate limit headers
  const headers = new Headers()
  headers.set('X-RateLimit-Limit', limit.toString())
  headers.set('X-RateLimit-Remaining', remaining.toString())
  headers.set('X-RateLimit-Reset', new Date(reset).toISOString())
  
  if (!success) {
    return NextResponse.json(
      {
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.floor((reset - Date.now()) / 1000),
      },
      { 
        status: 429,
        headers 
      }
    )
  }
  
  return null // Continue to API route
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">API Route Protection</h3>
                    <button
                      onClick={() => copyToClipboard(`import { NextRequest, NextResponse } from 'next/server'
import { rateLimitMiddleware } from '@/lib/rate-limit'

export async function GET(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await rateLimitMiddleware(req)
  if (rateLimitResult) return rateLimitResult
  
  // Your API logic here
  const data = await fetchData()
  
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  // Apply stricter rate limit for POST requests
  const rateLimitResult = await rateLimitMiddleware(req, {
    limit: 10,
    window: '1 m'
  })
  if (rateLimitResult) return rateLimitResult
  
  // Your API logic here
  const body = await req.json()
  const result = await createResource(body)
  
  return NextResponse.json(result)
}`, 'route-protection')}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {copiedCode === 'route-protection' ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300">
{`import { NextRequest, NextResponse } from 'next/server'
import { rateLimitMiddleware } from '@/lib/rate-limit'

export async function GET(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await rateLimitMiddleware(req)
  if (rateLimitResult) return rateLimitResult
  
  // Your API logic here
  const data = await fetchData()
  
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  // Apply stricter rate limit for POST requests
  const rateLimitResult = await rateLimitMiddleware(req, {
    limit: 10,
    window: '1 m'
  })
  if (rateLimitResult) return rateLimitResult
  
  // Your API logic here
  const body = await req.json()
  const result = await createResource(body)
  
  return NextResponse.json(result)
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">In-Memory Rate Limiter</h2>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Note:</strong> In-memory rate limiting doesn't work with serverless or multiple instances. Use Redis for production.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`// Simple in-memory rate limiter for development
class InMemoryRateLimiter {
  private requests: Map<string, number[]> = new Map()
  private readonly limit: number
  private readonly window: number // in milliseconds
  
  constructor(limit: number = 100, windowMs: number = 60000) {
    this.limit = limit
    this.window = windowMs
  }
  
  check(identifier: string): { success: boolean; remaining: number } {
    const now = Date.now()
    const requests = this.requests.get(identifier) || []
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.window)
    
    if (validRequests.length >= this.limit) {
      this.requests.set(identifier, validRequests)
      return { success: false, remaining: 0 }
    }
    
    validRequests.push(now)
    this.requests.set(identifier, validRequests)
    
    return { 
      success: true, 
      remaining: this.limit - validRequests.length 
    }
  }
  
  // Clean up old entries periodically
  cleanup() {
    const now = Date.now()
    for (const [key, requests] of this.requests.entries()) {
      const valid = requests.filter(time => now - time < this.window)
      if (valid.length === 0) {
        this.requests.delete(key)
      } else {
        this.requests.set(key, valid)
      }
    }
  }
}

// Usage
const limiter = new InMemoryRateLimiter(100, 60000) // 100 req/min

// In API route
export async function GET(req: NextRequest) {
  const ip = req.ip || 'unknown'
  const { success, remaining } = limiter.check(ip)
  
  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'Retry-After': '60'
        }
      }
    )
  }
  
  // Continue with request...
}`}
                </pre>
              </div>
            </div>
          </>
        )}

        {activeTab === 'configuration' && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Environment Configuration</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Environment Variables</h3>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-sm text-gray-300 overflow-x-auto">
{`# Rate Limiting Configuration
RATE_LIMIT_ENABLED=true
RATE_LIMIT_PROVIDER=redis # redis | memory | cloudflare

# Redis Configuration (Upstash)
UPSTASH_REDIS_URL=https://your-instance.upstash.io
UPSTASH_REDIS_TOKEN=your-token

# Default Limits
RATE_LIMIT_PUBLIC_PER_MINUTE=100
RATE_LIMIT_PUBLIC_PER_HOUR=1000
RATE_LIMIT_AUTH_PER_MINUTE=300
RATE_LIMIT_AUTH_PER_HOUR=5000

# Cloudflare Rate Limiting (if using CF)
CLOUDFLARE_ZONE_ID=your-zone-id
CLOUDFLARE_API_TOKEN=your-api-token`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Dynamic Configuration</h3>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300">
{`// lib/rate-limit-config.ts
export interface RateLimitConfig {
  enabled: boolean
  provider: 'redis' | 'memory' | 'cloudflare'
  limits: {
    [key: string]: {
      requests: number
      window: string // e.g., '1m', '1h', '1d'
    }
  }
}

export const rateLimitConfig: RateLimitConfig = {
  enabled: process.env.RATE_LIMIT_ENABLED === 'true',
  provider: (process.env.RATE_LIMIT_PROVIDER || 'memory') as any,
  limits: {
    // Public endpoints
    'api.public': {
      requests: 100,
      window: '1m'
    },
    // Auth endpoints - stricter limits
    'api.auth.login': {
      requests: 5,
      window: '15m'
    },
    'api.auth.register': {
      requests: 3,
      window: '1h'
    },
    // Admin endpoints - more relaxed
    'api.admin': {
      requests: 1000,
      window: '1m'
    },
    // Webhook endpoints
    'api.webhook': {
      requests: 50,
      window: '1s'
    }
  }
}

// Get rate limit for specific endpoint
export function getRateLimit(endpoint: string) {
  // Check for exact match
  if (rateLimitConfig.limits[endpoint]) {
    return rateLimitConfig.limits[endpoint]
  }
  
  // Check for pattern match
  for (const [pattern, limit] of Object.entries(rateLimitConfig.limits)) {
    if (endpoint.startsWith(pattern.replace('*', ''))) {
      return limit
    }
  }
  
  // Default limit
  return { requests: 100, window: '1m' }
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Per-User/Role Limits</h3>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300">
{`// lib/user-rate-limits.ts
interface UserRateLimit {
  role: string
  multiplier: number // Multiplier for base limits
  customLimits?: {
    [endpoint: string]: {
      requests: number
      window: string
    }
  }
}

const userRateLimits: UserRateLimit[] = [
  {
    role: 'SUPER_ADMIN',
    multiplier: 10, // 10x normal limits
  },
  {
    role: 'ADMIN',
    multiplier: 5, // 5x normal limits
  },
  {
    role: 'GURU',
    multiplier: 2, // 2x normal limits
  },
  {
    role: 'SISWA',
    multiplier: 1, // Normal limits
    customLimits: {
      'api.spp.pay': {
        requests: 10,
        window: '1h' // Limit payment attempts
      }
    }
  },
  {
    role: 'ORANG_TUA',
    multiplier: 1,
    customLimits: {
      'api.student.view': {
        requests: 100,
        window: '1h' // Can check student info frequently
      }
    }
  }
]

export function getUserRateLimit(role: string, endpoint: string) {
  const userLimit = userRateLimits.find(l => l.role === role)
  if (!userLimit) return getRateLimit(endpoint)
  
  // Check for custom endpoint limits
  if (userLimit.customLimits?.[endpoint]) {
    return userLimit.customLimits[endpoint]
  }
  
  // Apply multiplier to base limit
  const baseLimit = getRateLimit(endpoint)
  return {
    requests: baseLimit.requests * userLimit.multiplier,
    window: baseLimit.window
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Bypass & Whitelist</h2>
              
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`// lib/rate-limit-bypass.ts
const BYPASS_TOKENS = process.env.RATE_LIMIT_BYPASS_TOKENS?.split(',') || []
const WHITELISTED_IPS = process.env.RATE_LIMIT_WHITELIST_IPS?.split(',') || []

export function shouldBypassRateLimit(req: NextRequest): boolean {
  // Check for bypass token
  const bypassToken = req.headers.get('X-RateLimit-Bypass')
  if (bypassToken && BYPASS_TOKENS.includes(bypassToken)) {
    return true
  }
  
  // Check for whitelisted IP
  const ip = req.ip || req.headers.get('x-forwarded-for')
  if (ip && WHITELISTED_IPS.includes(ip)) {
    return true
  }
  
  // Check for internal requests
  const host = req.headers.get('host')
  if (host?.includes('localhost') || host?.includes('127.0.0.1')) {
    return process.env.NODE_ENV === 'development'
  }
  
  // Check for health check endpoints
  if (req.nextUrl.pathname === '/api/health') {
    return true
  }
  
  return false
}`}
                </pre>
              </div>
            </div>
          </>
        )}

        {activeTab === 'monitoring' && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Monitoring & Analytics</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Rate Limit Analytics</h3>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300">
{`// lib/rate-limit-analytics.ts
import { Redis } from '@upstash/redis'

interface RateLimitEvent {
  timestamp: number
  identifier: string
  endpoint: string
  success: boolean
  remaining: number
  limit: number
}

export class RateLimitAnalytics {
  private redis: Redis
  
  constructor(redis: Redis) {
    this.redis = redis
  }
  
  async recordEvent(event: RateLimitEvent) {
    const key = \`rate_limit:analytics:\${event.endpoint}:\${new Date().toISOString().split('T')[0]}\`
    
    // Increment counters
    await this.redis.hincrby(key, 'total', 1)
    if (!event.success) {
      await this.redis.hincrby(key, 'blocked', 1)
    }
    
    // Store detailed event for analysis
    await this.redis.lpush(
      \`rate_limit:events:\${event.identifier}\`,
      JSON.stringify(event)
    )
    
    // Expire after 7 days
    await this.redis.expire(key, 7 * 24 * 60 * 60)
  }
  
  async getStats(endpoint: string, days: number = 7) {
    const stats = []
    const now = new Date()
    
    for (let i = 0; i < days; i++) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const key = \`rate_limit:analytics:\${endpoint}:\${dateStr}\`
      
      const data = await this.redis.hgetall(key)
      stats.push({
        date: dateStr,
        total: parseInt(data.total || '0'),
        blocked: parseInt(data.blocked || '0'),
        successRate: data.total ? 
          ((parseInt(data.total) - parseInt(data.blocked || '0')) / parseInt(data.total) * 100).toFixed(2) : 
          100
      })
    }
    
    return stats
  }
  
  async getTopOffenders(limit: number = 10) {
    // Get all rate limit events from the last hour
    const keys = await this.redis.keys('rate_limit:events:*')
    const offenders: Map<string, number> = new Map()
    
    for (const key of keys) {
      const events = await this.redis.lrange(key, 0, -1)
      let blockedCount = 0
      
      for (const eventStr of events) {
        const event = JSON.parse(eventStr)
        if (!event.success && Date.now() - event.timestamp < 3600000) {
          blockedCount++
        }
      }
      
      if (blockedCount > 0) {
        const identifier = key.split(':').pop()!
        offenders.set(identifier, blockedCount)
      }
    }
    
    // Sort and return top offenders
    return Array.from(offenders.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([identifier, count]) => ({ identifier, blockedRequests: count }))
  }
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Dashboard Component</h3>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300">
{`// components/RateLimitDashboard.tsx
'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

export function RateLimitDashboard() {
  const [stats, setStats] = useState([])
  const [offenders, setOffenders] = useState([])
  
  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000) // Update every 30s
    return () => clearInterval(interval)
  }, [])
  
  async function fetchStats() {
    const res = await fetch('/api/admin/rate-limits/stats')
    const data = await res.json()
    setStats(data.stats)
    setOffenders(data.offenders)
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Requests (24h)</h3>
          <p className="text-2xl font-bold">{stats.reduce((sum, s) => sum + s.total, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Blocked Requests (24h)</h3>
          <p className="text-2xl font-bold text-red-500">{stats.reduce((sum, s) => sum + s.blocked, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
          <p className="text-2xl font-bold text-green-500">
            {stats.length ? (
              (stats.reduce((sum, s) => sum + parseFloat(s.successRate), 0) / stats.length).toFixed(1)
            ) : 100}%
          </p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Request Trends (7 Days)</h3>
        <BarChart width={600} height={300} data={stats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#3B82F6" name="Total Requests" />
          <Bar dataKey="blocked" fill="#EF4444" name="Blocked Requests" />
        </BarChart>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Top Offenders (Last Hour)</h3>
        <div className="space-y-2">
          {offenders.map((offender, idx) => (
            <div key={idx} className="flex justify-between items-center py-2 border-b dark:border-gray-700">
              <span className="font-mono text-sm">{offender.identifier}</span>
              <span className="text-red-500 font-semibold">{offender.blockedRequests} blocked</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Alert System</h3>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300">
{`// lib/rate-limit-alerts.ts
export async function checkRateLimitAlerts() {
  const analytics = new RateLimitAnalytics(redis)
  
  // Check for high block rate
  const stats = await analytics.getStats('api', 1)
  const todayStats = stats[0]
  
  if (todayStats.blocked > 1000) {
    await sendAlert({
      type: 'HIGH_BLOCK_RATE',
      severity: 'warning',
      message: \`High number of blocked requests: \${todayStats.blocked}\`,
      data: todayStats
    })
  }
  
  // Check for repeated offenders
  const offenders = await analytics.getTopOffenders()
  for (const offender of offenders) {
    if (offender.blockedRequests > 100) {
      await sendAlert({
        type: 'REPEAT_OFFENDER',
        severity: 'critical',
        message: \`Potential attack from \${offender.identifier}\`,
        data: offender
      })
    }
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'best-practices' && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
              
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Use Distributed Rate Limiting</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Always use Redis or similar distributed storage for rate limiting in production to ensure consistency across multiple server instances.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Implement Gradual Backoff</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Increase rate limit penalties for repeated violations to discourage abuse while allowing legitimate users to recover.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Different Limits per Endpoint</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Apply stricter limits to sensitive endpoints (auth, payments) and more relaxed limits to read-only endpoints.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Include Rate Limit Info in Headers</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Always return rate limit headers so clients can adapt their behavior and avoid hitting limits.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Monitor and Alert</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Set up monitoring for rate limit violations and alert on suspicious patterns that might indicate attacks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Common Pitfalls</h2>
              
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Not Rate Limiting Authentication</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Login and registration endpoints are prime targets for brute force attacks. Always apply strict rate limits.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Using IP-only Identification</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        IPs can be shared (NAT, proxies). Combine IP with user ID or session tokens for better accuracy.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Not Handling Edge Cases</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Consider legitimate high-traffic scenarios like webhooks, batch operations, and migration scripts.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Fixed Window Issues</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Fixed windows can allow double the limit at window boundaries. Use sliding window for better accuracy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Testing Rate Limits</h2>
              
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`# Test rate limiting with curl
for i in {1..110}; do
  curl -X GET https://api.example.com/endpoint \\
    -H "Authorization: Bearer token" \\
    -w "\\nStatus: %{http_code} - Remaining: %{header.x-ratelimit-remaining}\\n"
  sleep 0.5
done

# Test with Apache Bench
ab -n 200 -c 10 -H "Authorization: Bearer token" https://api.example.com/endpoint

# Node.js test script
const axios = require('axios')

async function testRateLimit() {
  const results = []
  
  for (let i = 0; i < 110; i++) {
    try {
      const response = await axios.get('https://api.example.com/endpoint')
      results.push({
        request: i + 1,
        status: response.status,
        remaining: response.headers['x-ratelimit-remaining']
      })
    } catch (error) {
      if (error.response?.status === 429) {
        results.push({
          request: i + 1,
          status: 429,
          retryAfter: error.response.headers['retry-after']
        })
      }
    }
  }
  
  console.table(results)
}

testRateLimit()`}
                </pre>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}