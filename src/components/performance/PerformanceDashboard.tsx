'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useOptimizedFetch } from '@/hooks/use-performance'

interface PerformanceData {
  webVitals: Record<string, {
    average: number
    p75: number
    p90: number
    good: number
    needsImprovement: number
    poor: number
    total: number
  }>
  customMetrics: Record<string, {
    average: number
    min: number
    max: number
    total: number
    unit?: string
  }>
  trends: Array<{
    hour: number
    webVitals: Record<string, number>
    customMetrics: Record<string, number>
  }>
  pageBreakdown: Array<{
    url: string
    views: number
    avgLCP: number
    avgFCP: number
    avgFID: number
    avgCLS: number
  }>
  deviceBreakdown: Record<string, number>
  totalMetrics: number
  timeRange: string
}

interface ErrorData {
  errors: Array<{
    id: string
    message: string
    timestamp: number
    url: string
    level: string
    resolved: boolean
  }>
  stats: {
    total: number
    byLevel: Record<string, number>
    resolved: number
    unresolved: number
    byHour: Array<{ hour: number; count: number }>
    topPages: Array<{ url: string; count: number }>
    topMessages: Array<{ message: string; count: number }>
  }
  groupedErrors: Array<{
    message: string
    count: number
    latestTimestamp: number
    resolved: boolean
    urls: string[]
  }>
}

export default function PerformanceDashboard() {
  const [timeRange, setTimeRange] = useState('24h')
  const [activeTab, setActiveTab] = useState('overview')

  const { data: performanceData, loading: perfLoading } = useOptimizedFetch<PerformanceData>(
    `/api/analytics/performance?timeRange=${timeRange}`,
    [timeRange]
  )

  const { data: errorData, loading: errorLoading } = useOptimizedFetch<ErrorData>(
    `/api/analytics/errors?timeRange=${timeRange}`,
    [timeRange]
  )

  const getRatingColor = (rating: number, thresholds: [number, number]) => {
    if (rating <= thresholds[0]) return 'text-green-600 bg-green-100'
    if (rating <= thresholds[1]) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const formatMetricValue = (value: number, unit?: string) => {
    if (unit === 'ms') {
      return `${Math.round(value)}ms`
    }
    if (unit === 'bytes') {
      return `${(value / 1024 / 1024).toFixed(2)}MB`
    }
    return value.toFixed(2)
  }

  const webVitalThresholds = {
    LCP: [2500, 4000] as [number, number],
    FID: [100, 300] as [number, number],
    CLS: [0.1, 0.25] as [number, number],
    FCP: [1800, 3000] as [number, number],
    TTFB: [800, 1800] as [number, number]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Performance Dashboard</h1>
        <div className="flex gap-2">
          {['1h', '24h', '7d', '30d'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="webvitals">Web Vitals</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-sm font-medium text-gray-500">Total Page Views</div>
              <div className="text-2xl font-bold text-gray-900">
                {performanceData?.totalMetrics?.toLocaleString() || 0}
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm font-medium text-gray-500">Error Rate</div>
              <div className="text-2xl font-bold text-red-600">
                {errorData?.stats ? 
                  ((errorData.stats.total / (performanceData?.totalMetrics || 1)) * 100).toFixed(2) + '%'
                  : '0%'
                }
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm font-medium text-gray-500">Avg LCP</div>
              <div className={`text-2xl font-bold ${
                performanceData?.webVitals?.LCP ? 
                  getRatingColor(performanceData.webVitals.LCP.average, webVitalThresholds.LCP)
                  : 'text-gray-900'
              }`}>
                {performanceData?.webVitals?.LCP ? 
                  formatMetricValue(performanceData.webVitals.LCP.average, 'ms')
                  : 'N/A'
                }
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm font-medium text-gray-500">Unresolved Errors</div>
              <div className="text-2xl font-bold text-red-600">
                {errorData?.stats?.unresolved || 0}
              </div>
            </Card>
          </div>

          {/* Device Breakdown */}
          {performanceData?.deviceBreakdown && (
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Traffic by Device</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(performanceData.deviceBreakdown).map(([device, count]) => (
                  <div key={device} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{count}</div>
                    <div className="text-sm text-gray-500 capitalize">{device}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="webvitals" className="space-y-6">
          {/* Web Vitals Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {performanceData?.webVitals && Object.entries(performanceData.webVitals).map(([vital, data]) => (
              <Card key={vital} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium">{vital}</h3>
                  <Badge className={getRatingColor(data.average, webVitalThresholds[vital as keyof typeof webVitalThresholds] || [1000, 2000] as [number, number])}>
                    {data.average <= (webVitalThresholds[vital as keyof typeof webVitalThresholds]?.[0] || 1000) ? 'Good' :
                     data.average <= (webVitalThresholds[vital as keyof typeof webVitalThresholds]?.[1] || 2000) ? 'Needs Improvement' : 'Poor'}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Average:</span>
                    <span className="font-medium">{formatMetricValue(data.average, 'ms')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">75th Percentile:</span>
                    <span className="font-medium">{formatMetricValue(data.p75, 'ms')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">90th Percentile:</span>
                    <span className="font-medium">{formatMetricValue(data.p90, 'ms')}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between text-xs">
                    <span className="text-green-600">{data.good} Good</span>
                    <span className="text-yellow-600">{data.needsImprovement} NI</span>
                    <span className="text-red-600">{data.poor} Poor</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Page Performance */}
          {performanceData?.pageBreakdown && (
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Top Pages by Traffic</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">LCP</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">FCP</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">CLS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {performanceData.pageBreakdown.map((page, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900 truncate max-w-xs">{page.url}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{page.views}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{formatMetricValue(page.avgLCP, 'ms')}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{formatMetricValue(page.avgFCP, 'ms')}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{page.avgCLS.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Custom Metrics */}
          {performanceData?.customMetrics && (
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Custom Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(performanceData.customMetrics).map(([name, data]) => (
                  <div key={name} className="border rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-900">{name}</div>
                    <div className="text-lg font-bold text-gray-700">
                      {formatMetricValue(data.average, data.unit)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Min: {formatMetricValue(data.min, data.unit)} | 
                      Max: {formatMetricValue(data.max, data.unit)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          {/* Error Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-sm font-medium text-gray-500">Total Errors</div>
              <div className="text-2xl font-bold text-red-600">{errorData?.stats?.total || 0}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm font-medium text-gray-500">Critical Errors</div>
              <div className="text-2xl font-bold text-red-700">{errorData?.stats?.byLevel?.error || 0}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm font-medium text-gray-500">Warnings</div>
              <div className="text-2xl font-bold text-yellow-600">{errorData?.stats?.byLevel?.warning || 0}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm font-medium text-gray-500">Resolved</div>
              <div className="text-2xl font-bold text-green-600">{errorData?.stats?.resolved || 0}</div>
            </Card>
          </div>

          {/* Top Error Messages */}
          {errorData?.groupedErrors && (
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Most Frequent Errors</h3>
              <div className="space-y-3">
                {errorData.groupedErrors.slice(0, 10).map((error, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">{error.message}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {error.count} occurrences • {error.urls.length} pages affected
                        </div>
                      </div>
                      <Badge variant={error.resolved ? 'default' : 'destructive'}>
                        {error.resolved ? 'Resolved' : 'Active'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}