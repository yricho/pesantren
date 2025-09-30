import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// In-memory storage for error tracking (use database in production)
const errorLogs: Array<{
  id: string
  message: string
  stack?: string
  timestamp: number
  url: string
  userAgent: string
  userId?: string
  sessionId?: string | null
  level: 'error' | 'warning' | 'info'
  resolved: boolean
  tags: string[]
  metadata?: Record<string, any>
}> = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const userAgent = request.headers.get('user-agent') || ''
    const sessionId = request.headers.get('x-session-id')
    
    // Validate required fields
    if (!body.message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const errorId = Date.now().toString(36) + Math.random().toString(36).substr(2)
    
    const errorLog = {
      id: errorId,
      message: body.message,
      stack: body.stack,
      timestamp: body.timestamp || Date.now(),
      url: body.url || '',
      userAgent,
      userId: body.userId,
      sessionId,
      level: body.level || 'error',
      resolved: false,
      tags: body.tags || [],
      metadata: body.metadata
    }
    
    errorLogs.push(errorLog)
    
    // Keep only recent errors (last 1000)
    if (errorLogs.length > 1000) {
      errorLogs.splice(0, errorLogs.length - 1000)
    }

    // Log critical errors to console
    if (errorLog.level === 'error') {
      console.error('Client Error Reported:', {
        message: errorLog.message,
        url: errorLog.url,
        userId: errorLog.userId
      })
    }

    return NextResponse.json({ success: true, errorId })
  } catch (error) {
    console.error('Error storing error log:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.role || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '24h'
    const level = searchParams.get('level') || 'all'
    const resolved = searchParams.get('resolved')
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    
    const now = Date.now()
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    }
    
    const cutoff = now - (timeRanges[timeRange as keyof typeof timeRanges] || timeRanges['24h'])
    
    let filteredErrors = errorLogs.filter(error => error.timestamp >= cutoff)
    
    // Filter by level
    if (level !== 'all') {
      filteredErrors = filteredErrors.filter(error => error.level === level)
    }
    
    // Filter by resolution status
    if (resolved !== null) {
      filteredErrors = filteredErrors.filter(error => error.resolved === (resolved === 'true'))
    }
    
    // Sort by timestamp (most recent first)
    filteredErrors.sort((a, b) => b.timestamp - a.timestamp)
    
    // Apply limit
    const paginatedErrors = filteredErrors.slice(0, limit)
    
    // Calculate error statistics
    const stats = calculateErrorStats(filteredErrors)
    
    // Group errors by message for better insights
    const groupedErrors = groupErrorsByMessage(filteredErrors)

    return NextResponse.json({
      errors: paginatedErrors,
      stats,
      groupedErrors,
      totalErrors: filteredErrors.length,
      timeRange
    })
  } catch (error) {
    console.error('Error retrieving error logs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.role || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const errorId = searchParams.get('id')
    const body = await request.json()
    
    if (!errorId) {
      return NextResponse.json(
        { error: 'Error ID is required' },
        { status: 400 }
      )
    }

    const errorIndex = errorLogs.findIndex(error => error.id === errorId)
    
    if (errorIndex === -1) {
      return NextResponse.json(
        { error: 'Error not found' },
        { status: 404 }
      )
    }

    // Update error properties
    if (typeof body.resolved === 'boolean') {
      errorLogs[errorIndex].resolved = body.resolved
    }
    
    if (body.tags) {
      errorLogs[errorIndex].tags = body.tags
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating error log:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function calculateErrorStats(errors: typeof errorLogs) {
  const stats = {
    total: errors.length,
    byLevel: {
      error: 0,
      warning: 0,
      info: 0
    },
    resolved: 0,
    unresolved: 0,
    byHour: [] as Array<{ hour: number; count: number }>,
    topPages: [] as Array<{ url: string; count: number }>,
    topMessages: [] as Array<{ message: string; count: number }>
  }
  
  // Count by level
  errors.forEach(error => {
    stats.byLevel[error.level]++
    if (error.resolved) {
      stats.resolved++
    } else {
      stats.unresolved++
    }
  })
  
  // Group by hour (last 24 hours)
  const hourlyData: Record<number, number> = {}
  const now = new Date()
  
  for (let i = 23; i >= 0; i--) {
    const hour = new Date(now.getTime() - i * 60 * 60 * 1000).getHours()
    hourlyData[hour] = 0
  }
  
  errors.forEach(error => {
    const hour = new Date(error.timestamp).getHours()
    if (hour in hourlyData) {
      hourlyData[hour]++
    }
  })
  
  stats.byHour = Object.entries(hourlyData).map(([hour, count]) => ({
    hour: parseInt(hour),
    count
  }))
  
  // Top pages by error count
  const pageCount: Record<string, number> = {}
  errors.forEach(error => {
    const url = error.url || 'unknown'
    pageCount[url] = (pageCount[url] || 0) + 1
  })
  
  stats.topPages = Object.entries(pageCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([url, count]) => ({ url, count }))
  
  // Top error messages
  const messageCount: Record<string, number> = {}
  errors.forEach(error => {
    const message = error.message.split('\n')[0] // First line only
    messageCount[message] = (messageCount[message] || 0) + 1
  })
  
  stats.topMessages = Object.entries(messageCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([message, count]) => ({ message, count }))
  
  return stats
}

function groupErrorsByMessage(errors: typeof errorLogs) {
  const grouped: Record<string, {
    message: string
    count: number
    latestTimestamp: number
    resolved: boolean
    urls: string[]
    userIds: string[]
  }> = {}
  
  errors.forEach(error => {
    const key = error.message.split('\n')[0] // Group by first line of error message
    
    if (!grouped[key]) {
      grouped[key] = {
        message: key,
        count: 0,
        latestTimestamp: 0,
        resolved: true, // Will be false if any occurrence is unresolved
        urls: [],
        userIds: []
      }
    }
    
    grouped[key].count++
    grouped[key].latestTimestamp = Math.max(grouped[key].latestTimestamp, error.timestamp)
    
    if (!error.resolved) {
      grouped[key].resolved = false
    }
    
    if (error.url && !grouped[key].urls.includes(error.url)) {
      grouped[key].urls.push(error.url)
    }
    
    if (error.userId && !grouped[key].userIds.includes(error.userId)) {
      grouped[key].userIds.push(error.userId)
    }
  })
  
  return Object.values(grouped).sort((a, b) => b.count - a.count)
}