// Session management for LINE users
// Stores temporary state during multi-step flows

// import { redis } from '@/lib/redis-cache' // Redis is optional

const SESSION_TTL = 600 // 10 minutes

export interface UserSession {
  currentFlow?: string
  step?: number
  data?: Record<string, any>
  waitingFor?: string // For simple input prompts
}

export async function getUserSession(userId: string): Promise<UserSession | null> {
  // Always use in-memory for now (Redis is optional)
  return getInMemorySession(userId)
}

export async function setUserSession(userId: string, session: UserSession | null): Promise<void> {
  // Always use in-memory for now (Redis is optional)
  setInMemorySession(userId, session)
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