// Session management for LINE users
// Stores temporary state during multi-step flows

import { redis } from '@/lib/redis-cache'

const SESSION_TTL = 600 // 10 minutes

export interface UserSession {
  currentFlow: string
  step: number
  data: Record<string, any>
}

export async function getUserSession(userId: string): Promise<UserSession | null> {
  try {
    const key = `line:session:${userId}`
    const session = await redis.get(key)
    return session ? JSON.parse(session) : null
  } catch (error) {
    // Fallback to in-memory if Redis not available
    return getInMemorySession(userId)
  }
}

export async function setUserSession(userId: string, session: UserSession | null): Promise<void> {
  try {
    const key = `line:session:${userId}`
    if (session) {
      await redis.setex(key, SESSION_TTL, JSON.stringify(session))
    } else {
      await redis.del(key)
    }
  } catch (error) {
    // Fallback to in-memory if Redis not available
    setInMemorySession(userId, session)
  }
}

// In-memory fallback (for development/testing)
const memoryStore = new Map<string, UserSession>()

function getInMemorySession(userId: string): UserSession | null {
  return memoryStore.get(userId) || null
}

function setInMemorySession(userId: string, session: UserSession | null): void {
  if (session) {
    memoryStore.set(userId, session)
    // Auto cleanup after TTL
    setTimeout(() => memoryStore.delete(userId), SESSION_TTL * 1000)
  } else {
    memoryStore.delete(userId)
  }
}