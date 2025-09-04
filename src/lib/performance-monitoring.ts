'use client'

import React from 'react'

// Performance monitoring with Web Vitals and custom metrics

interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
  url?: string
  userId?: string
}

interface CustomMetric {
  name: string
  value: number
  unit?: string
  timestamp: number
  metadata?: Record<string, any>
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private customMetrics: CustomMetric[] = []
  private observers: PerformanceObserver[] = []
  private vitalsData: Record<string, number> = {}

  constructor() {
    this.initializeWebVitals()
    this.initializePerformanceObservers()
  }

  // Initialize Web Vitals tracking
  private initializeWebVitals() {
    if (typeof window === 'undefined') return

    // Only load web-vitals in browser environment
    this.trackWebVitals()
  }

  private async trackWebVitals() {
    try {
      const webVitals = await import('web-vitals') as any
      
      if (webVitals.getCLS) {
        webVitals.getCLS((metric: any) => this.recordVital('CLS', metric.value, this.getCLSRating(metric.value)))
      }
      if (webVitals.getFID) {
        webVitals.getFID((metric: any) => this.recordVital('FID', metric.value, this.getFIDRating(metric.value)))
      }
      if (webVitals.getFCP) {
        webVitals.getFCP((metric: any) => this.recordVital('FCP', metric.value, this.getFCPRating(metric.value)))
      }
      if (webVitals.getLCP) {
        webVitals.getLCP((metric: any) => this.recordVital('LCP', metric.value, this.getLCPRating(metric.value)))
      }
      if (webVitals.getTTFB) {
        webVitals.getTTFB((metric: any) => this.recordVital('TTFB', metric.value, this.getTTFBRating(metric.value)))
      }
    } catch (error) {
      console.warn('Web Vitals not available:', error)
      this.trackWebVitalsManually()
    }
  }

  // Fallback manual Web Vitals tracking
  private trackWebVitalsManually() {
    // Track FCP manually using PerformanceObserver
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.recordVital('FCP', entry.startTime, this.getFCPRating(entry.startTime))
          }
        }
      })
      observer.observe({ entryTypes: ['paint'] })
      this.observers.push(observer)
    }

    // Track page load time
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
      this.recordVital('Load Time', loadTime, loadTime < 3000 ? 'good' : loadTime < 5000 ? 'needs-improvement' : 'poor')
    })
  }

  private initializePerformanceObservers() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return

    // Track long tasks
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordCustomMetric('Long Task', entry.duration, 'ms', {
            startTime: entry.startTime,
            name: entry.name
          })
        }
      })
      longTaskObserver.observe({ entryTypes: ['longtask'] })
      this.observers.push(longTaskObserver)
    } catch (error) {
      console.warn('Long task observer not supported:', error)
    }

    // Track resource loading
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resource = entry as PerformanceResourceTiming
          this.recordCustomMetric('Resource Load', resource.duration, 'ms', {
            name: resource.name,
            type: resource.initiatorType,
            size: resource.transferSize
          })
        }
      })
      resourceObserver.observe({ entryTypes: ['resource'] })
      this.observers.push(resourceObserver)
    } catch (error) {
      console.warn('Resource observer not supported:', error)
    }
  }

  // Record Web Vital metric
  private recordVital(name: string, value: number, rating: 'good' | 'needs-improvement' | 'poor') {
    const metric: PerformanceMetric = {
      name,
      value,
      rating,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : undefined
    }

    this.metrics.push(metric)
    this.vitalsData[name] = value

    // Send to analytics service
    this.sendMetricToAnalytics(metric)
  }

  // Record custom metric
  recordCustomMetric(name: string, value: number, unit?: string, metadata?: Record<string, any>) {
    const metric: CustomMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      metadata
    }

    this.customMetrics.push(metric)
  }

  // Web Vitals rating functions
  private getCLSRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor'
  }

  private getFIDRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor'
  }

  private getFCPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor'
  }

  private getLCPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor'
  }

  private getTTFBRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor'
  }

  // Send metrics to analytics service
  private async sendMetricToAnalytics(metric: PerformanceMetric) {
    try {
      if (typeof window !== 'undefined' && navigator.onLine) {
        await fetch('/api/analytics/performance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(metric)
        })
      }
    } catch (error) {
      console.warn('Failed to send metric to analytics:', error)
    }
  }

  // Get performance summary
  getPerformanceSummary() {
    return {
      webVitals: this.vitalsData,
      customMetrics: this.customMetrics.reduce((acc, metric) => {
        acc[metric.name] = metric.value
        return acc
      }, {} as Record<string, number>),
      totalMetrics: this.metrics.length + this.customMetrics.length
    }
  }

  // Clean up observers
  cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

// React hook for performance monitoring
export function usePerformanceTracking(componentName: string) {
  React.useEffect(() => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      performanceMonitor.recordCustomMetric(
        `${componentName} Mount Time`,
        endTime - startTime,
        'ms'
      )
    }
  }, [componentName])

  const trackAction = React.useCallback((actionName: string, actionFn: () => void | Promise<void>) => {
    const startTime = performance.now()
    
    const result = actionFn()
    
    if (result instanceof Promise) {
      result.finally(() => {
        const endTime = performance.now()
        performanceMonitor.recordCustomMetric(
          `${componentName} ${actionName}`,
          endTime - startTime,
          'ms'
        )
      })
    } else {
      const endTime = performance.now()
      performanceMonitor.recordCustomMetric(
        `${componentName} ${actionName}`,
        endTime - startTime,
        'ms'
      )
    }
  }, [componentName])

  return { trackAction }
}

// Error tracking utility
class ErrorTracker {
  private errors: Array<{
    message: string
    stack?: string
    timestamp: number
    url: string
    userAgent: string
    userId?: string
  }> = []

  constructor() {
    this.initializeErrorTracking()
  }

  private initializeErrorTracking() {
    if (typeof window === 'undefined') return

    // Global error handler
    window.addEventListener('error', (event) => {
      this.recordError(event.error || new Error(event.message))
    })

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.recordError(new Error(event.reason))
    })
  }

  recordError(error: Error, userId?: string) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      userId
    }

    this.errors.push(errorData)
    
    // Send to error tracking service
    this.sendErrorToService(errorData)
  }

  private async sendErrorToService(errorData: any) {
    try {
      if (typeof window !== 'undefined' && navigator.onLine) {
        await fetch('/api/analytics/errors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(errorData)
        })
      }
    } catch (error) {
      console.warn('Failed to send error to tracking service:', error)
    }
  }

  getRecentErrors(limit: number = 10) {
    return this.errors
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
  }
}

export const errorTracker = new ErrorTracker()

// Performance budget checker
export class PerformanceBudget {
  private budgets = {
    FCP: 1800, // First Contentful Paint
    LCP: 2500, // Largest Contentful Paint
    FID: 100,  // First Input Delay
    CLS: 0.1,  // Cumulative Layout Shift
    TTFB: 800, // Time to First Byte
    bundleSize: 250 * 1024, // 250KB
    imageSize: 500 * 1024   // 500KB per image
  }

  checkBudget(metric: string, value: number): boolean {
    const budget = this.budgets[metric as keyof typeof this.budgets]
    return budget ? value <= budget : true
  }

  getBudgetStatus() {
    const summary = performanceMonitor.getPerformanceSummary()
    const status: Record<string, { value: number; budget: number; passed: boolean }> = {}

    Object.entries(this.budgets).forEach(([key, budget]) => {
      const value = summary.webVitals[key] || summary.customMetrics[key] || 0
      status[key] = {
        value,
        budget,
        passed: this.checkBudget(key, value)
      }
    })

    return status
  }
}

export const performanceBudget = new PerformanceBudget()

// Real User Monitoring (RUM)
export class RealUserMonitoring {
  private sessionId: string
  private startTime: number

  constructor() {
    this.sessionId = this.generateSessionId()
    this.startTime = Date.now()
    this.initializeRUM()
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private initializeRUM() {
    if (typeof window === 'undefined') return

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      performanceMonitor.recordCustomMetric(
        'Page Visibility',
        document.visibilityState === 'visible' ? 1 : 0,
        'boolean'
      )
    })

    // Track connection type
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      performanceMonitor.recordCustomMetric(
        'Connection Type',
        connection.effectiveType === '4g' ? 4 : connection.effectiveType === '3g' ? 3 : 2,
        'generation'
      )
    }

    // Track memory usage
    if ('memory' in performance) {
      const memory = (performance as any).memory
      performanceMonitor.recordCustomMetric('Memory Used', memory.usedJSHeapSize, 'bytes')
      performanceMonitor.recordCustomMetric('Memory Total', memory.totalJSHeapSize, 'bytes')
    }
  }

  getSessionData() {
    return {
      sessionId: this.sessionId,
      duration: Date.now() - this.startTime,
      performance: performanceMonitor.getPerformanceSummary(),
      errors: errorTracker.getRecentErrors()
    }
  }
}

export const rum = new RealUserMonitoring()