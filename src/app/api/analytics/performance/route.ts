import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// In-memory storage for performance metrics (use Redis/database in production)
const performanceMetrics: Array<{
  id: string
  name: string
  value: number
  rating: string
  timestamp: number
  url: string
  userId?: string
  userAgent?: string
  sessionId?: string | null
}> = []

const customMetrics: Array<{
  id: string
  name: string
  value: number
  unit?: string
  timestamp: number
  metadata?: Record<string, any>
  userId?: string
  sessionId?: string | null
}> = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const userAgent = request.headers.get('user-agent') || ''
    const sessionId = request.headers.get('x-session-id')
    
    // Validate required fields
    if (!body.name || typeof body.value !== 'number') {
      return NextResponse.json(
        { error: 'Name and value are required' },
        { status: 400 }
      )
    }

    const metricId = Date.now().toString(36) + Math.random().toString(36).substr(2)
    
    // Determine if this is a Web Vital or custom metric
    if (['CLS', 'FID', 'FCP', 'LCP', 'TTFB'].includes(body.name)) {
      // Web Vital metric
      const metric = {
        id: metricId,
        name: body.name,
        value: body.value,
        rating: body.rating || 'good',
        timestamp: body.timestamp || Date.now(),
        url: body.url || '',
        userId: body.userId,
        userAgent,
        sessionId
      }
      
      performanceMetrics.push(metric)
      
      // Keep only recent metrics (last 1000)
      if (performanceMetrics.length > 1000) {
        performanceMetrics.splice(0, performanceMetrics.length - 1000)
      }
    } else {
      // Custom metric
      const metric = {
        id: metricId,
        name: body.name,
        value: body.value,
        unit: body.unit,
        timestamp: body.timestamp || Date.now(),
        metadata: body.metadata,
        userId: body.userId,
        sessionId
      }
      
      customMetrics.push(metric)
      
      // Keep only recent metrics (last 1000)
      if (customMetrics.length > 1000) {
        customMetrics.splice(0, customMetrics.length - 1000)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error storing performance metric:', error)
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
    const timeRange = searchParams.get('timeRange') || '24h' // 24h, 7d, 30d
    const metricType = searchParams.get('type') || 'all' // webvitals, custom, all
    
    const now = Date.now()
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    }
    
    const cutoff = now - (timeRanges[timeRange as keyof typeof timeRanges] || timeRanges['24h'])
    
    // Filter metrics by time range
    const filteredPerformanceMetrics = performanceMetrics.filter(m => m.timestamp >= cutoff)
    const filteredCustomMetrics = customMetrics.filter(m => m.timestamp >= cutoff)
    
    // Calculate Web Vitals summary
    const webVitalsSummary = calculateWebVitalsSummary(filteredPerformanceMetrics)
    
    // Calculate custom metrics summary
    const customMetricsSummary = calculateCustomMetricsSummary(filteredCustomMetrics)
    
    // Performance trends
    const trends = calculateTrends(filteredPerformanceMetrics, filteredCustomMetrics)
    
    // Page performance breakdown
    const pageBreakdown = calculatePageBreakdown(filteredPerformanceMetrics)
    
    // Device/browser breakdown
    const deviceBreakdown = calculateDeviceBreakdown(filteredPerformanceMetrics)

    return NextResponse.json({
      webVitals: webVitalsSummary,
      customMetrics: customMetricsSummary,
      trends,
      pageBreakdown,
      deviceBreakdown,
      totalMetrics: filteredPerformanceMetrics.length + filteredCustomMetrics.length,
      timeRange
    })
  } catch (error) {
    console.error('Error retrieving performance metrics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function calculateWebVitalsSummary(metrics: typeof performanceMetrics) {
  const webVitals = ['CLS', 'FID', 'FCP', 'LCP', 'TTFB']
  const summary: Record<string, {
    average: number
    p75: number
    p90: number
    good: number
    needsImprovement: number
    poor: number
    total: number
  }> = {}
  
  webVitals.forEach(vital => {
    const vitalMetrics = metrics.filter(m => m.name === vital)
    if (vitalMetrics.length === 0) {
      summary[vital] = {
        average: 0,
        p75: 0,
        p90: 0,
        good: 0,
        needsImprovement: 0,
        poor: 0,
        total: 0
      }
      return
    }
    
    const values = vitalMetrics.map(m => m.value).sort((a, b) => a - b)
    const ratings = vitalMetrics.map(m => m.rating)
    
    summary[vital] = {
      average: values.reduce((sum, val) => sum + val, 0) / values.length,
      p75: values[Math.floor(values.length * 0.75)] || 0,
      p90: values[Math.floor(values.length * 0.90)] || 0,
      good: ratings.filter(r => r === 'good').length,
      needsImprovement: ratings.filter(r => r === 'needs-improvement').length,
      poor: ratings.filter(r => r === 'poor').length,
      total: vitalMetrics.length
    }
  })
  
  return summary
}

function calculateCustomMetricsSummary(metrics: typeof customMetrics) {
  const grouped = metrics.reduce((acc, metric) => {
    if (!acc[metric.name]) {
      acc[metric.name] = []
    }
    acc[metric.name].push(metric.value)
    return acc
  }, {} as Record<string, number[]>)
  
  const summary: Record<string, {
    average: number
    min: number
    max: number
    total: number
    unit?: string
  }> = {}
  
  Object.entries(grouped).forEach(([name, values]) => {
    const unit = metrics.find(m => m.name === name)?.unit
    summary[name] = {
      average: values.reduce((sum, val) => sum + val, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      total: values.length,
      unit
    }
  })
  
  return summary
}

function calculateTrends(perfMetrics: typeof performanceMetrics, custMetrics: typeof customMetrics) {
  // Group by hour for the last 24 hours
  const hourlyData: Record<string, {
    hour: number
    webVitals: Record<string, number>
    customMetrics: Record<string, number>
  }> = {}
  
  const now = new Date()
  for (let i = 23; i >= 0; i--) {
    const hour = new Date(now.getTime() - i * 60 * 60 * 1000).getHours()
    hourlyData[hour] = {
      hour,
      webVitals: {},
      customMetrics: {}
    }
  }
  
  // Process performance metrics
  perfMetrics.forEach(metric => {
    const hour = new Date(metric.timestamp).getHours()
    if (hourlyData[hour]) {
      if (!hourlyData[hour].webVitals[metric.name]) {
        hourlyData[hour].webVitals[metric.name] = 0
      }
      hourlyData[hour].webVitals[metric.name] += metric.value
    }
  })
  
  // Process custom metrics
  custMetrics.forEach(metric => {
    const hour = new Date(metric.timestamp).getHours()
    if (hourlyData[hour]) {
      if (!hourlyData[hour].customMetrics[metric.name]) {
        hourlyData[hour].customMetrics[metric.name] = 0
      }
      hourlyData[hour].customMetrics[metric.name] += metric.value
    }
  })
  
  return Object.values(hourlyData)
}

function calculatePageBreakdown(metrics: typeof performanceMetrics) {
  const pageStats: Record<string, {
    url: string
    views: number
    avgLCP: number
    avgFCP: number
    avgFID: number
    avgCLS: number
  }> = {}
  
  metrics.forEach(metric => {
    const url = metric.url || 'unknown'
    if (!pageStats[url]) {
      pageStats[url] = {
        url,
        views: 0,
        avgLCP: 0,
        avgFCP: 0,
        avgFID: 0,
        avgCLS: 0
      }
    }
    
    pageStats[url].views++
    if (metric.name === 'LCP') pageStats[url].avgLCP += metric.value
    if (metric.name === 'FCP') pageStats[url].avgFCP += metric.value
    if (metric.name === 'FID') pageStats[url].avgFID += metric.value
    if (metric.name === 'CLS') pageStats[url].avgCLS += metric.value
  })
  
  // Calculate averages
  Object.values(pageStats).forEach(stats => {
    stats.avgLCP = stats.avgLCP / stats.views
    stats.avgFCP = stats.avgFCP / stats.views
    stats.avgFID = stats.avgFID / stats.views
    stats.avgCLS = stats.avgCLS / stats.views
  })
  
  return Object.values(pageStats).sort((a, b) => b.views - a.views).slice(0, 10)
}

function calculateDeviceBreakdown(metrics: typeof performanceMetrics) {
  const deviceStats: Record<string, number> = {}
  
  metrics.forEach(metric => {
    const userAgent = metric.userAgent || 'unknown'
    let deviceType = 'desktop'
    
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      deviceType = 'mobile'
    } else if (/Tablet|iPad/.test(userAgent)) {
      deviceType = 'tablet'
    }
    
    deviceStats[deviceType] = (deviceStats[deviceType] || 0) + 1
  })
  
  return deviceStats
}