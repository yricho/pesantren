import { NextResponse } from 'next/server'

// Redis cache utility for API responses
class RedisCache {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes in milliseconds

  constructor() {
    // Clean expired cache entries every 5 minutes
    setInterval(() => {
      this.cleanExpired()
    }, 5 * 60 * 1000)
  }

  private generateKey(prefix: string, params?: Record<string, any>): string {
    if (!params) return prefix
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|')
    return `${prefix}:${sortedParams}`
  }

  private cleanExpired(): void {
    const now = Date.now()
    for (const [key, value] of this.cache.entries()) {
      if (now > value.timestamp + value.ttl) {
        this.cache.delete(key)
      }
    }
  }

  set(key: string, data: any, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    })
  }

  get(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    const now = Date.now()
    if (now > cached.timestamp + cached.ttl) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Generate cache key for API endpoints
  generateAPIKey(endpoint: string, params?: Record<string, any>, userId?: string): string {
    const baseKey = userId ? `${endpoint}:user:${userId}` : endpoint
    return this.generateKey(baseKey, params)
  }

  // Invalidate cache by pattern
  invalidatePattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }
}

// Cache middleware for API routes
export const withCache = (
  handler: Function,
  cacheKey: string,
  ttl?: number
) => {
  return async (request: Request, context?: any) => {
    const url = new URL(request.url)
    const searchParams = Object.fromEntries(url.searchParams.entries())
    
    const key = cache.generateAPIKey(cacheKey, searchParams)
    
    // Check cache for GET requests only
    if (request.method === 'GET') {
      const cached = cache.get(key)
      if (cached) {
        return NextResponse.json(cached, {
          headers: {
            'X-Cache': 'HIT',
            'Cache-Control': 'public, max-age=300, stale-while-revalidate=60'
          }
        })
      }
    }

    // Execute handler
    const response = await handler(request, context)
    
    // Cache successful GET responses
    if (request.method === 'GET' && response.ok) {
      try {
        const data = await response.clone().json()
        cache.set(key, data, ttl)
      } catch (error) {
        console.warn('Failed to cache response:', error)
      }
    }

    // Add cache headers
    const headers = new Headers(response.headers)
    headers.set('X-Cache', 'MISS')
    headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60')

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    })
  }
}

// Singleton cache instance
export const cache = new RedisCache()

// Cache invalidation helpers
export const invalidateCache = {
  students: () => cache.invalidatePattern('students'),
  alumni: () => cache.invalidatePattern('alumni'),
  activities: () => cache.invalidatePattern('activities'),
  courses: () => cache.invalidatePattern('courses'),
  finance: () => cache.invalidatePattern('finance'),
  hafalan: () => cache.invalidatePattern('hafalan'),
  billing: () => cache.invalidatePattern('billing'),
  donations: () => cache.invalidatePattern('donations'),
  users: () => cache.invalidatePattern('users'),
  dashboard: () => cache.invalidatePattern('dashboard'),
  statistics: () => cache.invalidatePattern('statistics'),
}

// ETag generation utility
export const generateETag = (data: any): string => {
  const content = JSON.stringify(data)
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return `"${Math.abs(hash).toString(36)}"`
}

// Conditional response helper with ETag support
export const withETag = (data: any, request: Request): NextResponse => {
  const etag = generateETag(data)
  const clientETag = request.headers.get('if-none-match')
  
  if (clientETag === etag) {
    return new NextResponse(null, { status: 304 })
  }
  
  return NextResponse.json(data, {
    headers: {
      'ETag': etag,
      'Cache-Control': 'public, max-age=300, must-revalidate'
    }
  })
}