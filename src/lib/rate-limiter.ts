import { NextRequest } from 'next/server'

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  skipSuccessfulRequests?: boolean
}

interface RateLimitEntry {
  count: number
  resetTime: number
  blocked: boolean
}

// In-memory store for rate limiting (consider Redis for production)
const rateLimitStore = new Map<string, RateLimitEntry>()

export class RateLimiter {
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
  }

  private getKey(request: NextRequest, userId?: string): string {
    const ip = request.headers.get('x-forwarded-for') || 
              request.headers.get('x-real-ip') || 
              'unknown'
    
    if (userId) {
      return `user:${userId}`
    }
    
    return `ip:${ip}`
  }

  private cleanExpiredEntries(): void {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  }

  public checkLimit(request: NextRequest, userId?: string): {
    allowed: boolean
    remaining: number
    resetTime: number
    blocked: boolean
  } {
    this.cleanExpiredEntries()
    
    const key = this.getKey(request, userId)
    const now = Date.now()
    const resetTime = now + this.config.windowMs
    
    let entry = rateLimitStore.get(key)
    
    if (!entry) {
      entry = {
        count: 1,
        resetTime,
        blocked: false
      }
      rateLimitStore.set(key, entry)
    } else if (now > entry.resetTime) {
      // Reset the window
      entry.count = 1
      entry.resetTime = resetTime
      entry.blocked = false
    } else {
      entry.count += 1
    }

    const allowed = entry.count <= this.config.maxRequests && !entry.blocked
    const remaining = Math.max(0, this.config.maxRequests - entry.count)

    // Block if limit exceeded
    if (entry.count > this.config.maxRequests) {
      entry.blocked = true
    }

    return {
      allowed,
      remaining,
      resetTime: entry.resetTime,
      blocked: entry.blocked
    }
  }

  public blockKey(request: NextRequest, userId?: string, durationMs?: number): void {
    const key = this.getKey(request, userId)
    const now = Date.now()
    const blockDuration = durationMs || this.config.windowMs * 2
    
    let entry = rateLimitStore.get(key)
    if (!entry) {
      entry = {
        count: this.config.maxRequests + 1,
        resetTime: now + blockDuration,
        blocked: true
      }
    } else {
      entry.blocked = true
      entry.resetTime = Math.max(entry.resetTime, now + blockDuration)
    }
    
    rateLimitStore.set(key, entry)
  }

  public resetKey(request: NextRequest, userId?: string): void {
    const key = this.getKey(request, userId)
    rateLimitStore.delete(key)
  }
}

// Predefined rate limiters for different endpoints
export const rateLimiters = {
  // General API rate limiter - 100 requests per 15 minutes
  general: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  }),

  // Authentication rate limiter - 5 attempts per 15 minutes
  auth: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  }),

  // 2FA verification - 10 attempts per 15 minutes
  twoFactor: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10,
  }),

  // SMS sending - 3 attempts per hour
  sms: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
  }),

  // Password reset - 3 attempts per hour
  passwordReset: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
  }),

  // Account lockout - strict rate limiting after multiple failures
  lockout: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 1,
  }),
}

// Helper function to apply rate limiting to API routes
export function applyRateLimit(
  request: NextRequest,
  limiter: RateLimiter,
  userId?: string
): {
  allowed: boolean
  remaining: number
  resetTime: number
  headers: Record<string, string>
} {
  const result = limiter.checkLimit(request, userId)
  
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': limiter['config'].maxRequests.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
  }

  if (!result.allowed) {
    headers['Retry-After'] = Math.ceil((result.resetTime - Date.now()) / 1000).toString()
  }

  return {
    allowed: result.allowed,
    remaining: result.remaining,
    resetTime: result.resetTime,
    headers
  }
}

// Security event types for monitoring
export enum SecurityEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  TWO_FACTOR_ENABLED = 'TWO_FACTOR_ENABLED',
  TWO_FACTOR_DISABLED = 'TWO_FACTOR_DISABLED',
  TWO_FACTOR_SUCCESS = 'TWO_FACTOR_SUCCESS',
  TWO_FACTOR_FAILURE = 'TWO_FACTOR_FAILURE',
  BACKUP_CODE_USED = 'BACKUP_CODE_USED',
  SMS_OTP_SENT = 'SMS_OTP_SENT',
  SMS_OTP_SUCCESS = 'SMS_OTP_SUCCESS',
  SMS_OTP_FAILURE = 'SMS_OTP_FAILURE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
}

// Suspicious activity detector
export class SecurityMonitor {
  private static suspiciousPatterns = [
    // Multiple failed login attempts from same IP
    { event: SecurityEventType.LOGIN_FAILURE, count: 5, windowMs: 5 * 60 * 1000 },
    // Multiple 2FA failures
    { event: SecurityEventType.TWO_FACTOR_FAILURE, count: 10, windowMs: 15 * 60 * 1000 },
    // Multiple SMS requests
    { event: SecurityEventType.SMS_OTP_SENT, count: 5, windowMs: 60 * 60 * 1000 },
    // Rate limit exceeded multiple times
    { event: SecurityEventType.RATE_LIMIT_EXCEEDED, count: 3, windowMs: 15 * 60 * 1000 },
  ]

  public static async detectSuspiciousActivity(
    events: Array<{ event: SecurityEventType; timestamp: Date; metadata?: any }>
  ): Promise<boolean> {
    const now = Date.now()
    
    for (const pattern of this.suspiciousPatterns) {
      const recentEvents = events.filter(
        e => e.event === pattern.event && 
             (now - e.timestamp.getTime()) <= pattern.windowMs
      )
      
      if (recentEvents.length >= pattern.count) {
        return true
      }
    }
    
    return false
  }
}

export default RateLimiter