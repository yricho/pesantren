'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { cn } from '@/lib/utils';

interface PerformanceData {
  category: string;
  current: number;
  target: number;
  trend: number;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  status: 'excellent' | 'good' | 'fair' | 'needs_improvement';
}

interface PerformanceChartProps {
  title: string;
  description?: string;
  data: PerformanceData[];
  type?: 'bar' | 'ring' | 'mixed';
  showTarget?: boolean;
  showTrend?: boolean;
  className?: string;
}

export function PerformanceChart({
  title,
  description,
  data,
  type = 'bar',
  showTarget = true,
  showTrend = true,
  className
}: PerformanceChartProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'good':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'fair':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'needs_improvement':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'Sangat Baik';
      case 'good':
        return 'Baik';
      case 'fair':
        return 'Cukup';
      case 'needs_improvement':
        return 'Perlu Perbaikan';
      default:
        return 'Unknown';
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return '↗';
    if (trend < 0) return '↘';
    return '→';
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const renderBarChart = () => (
    <div className="space-y-6">
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">{item.category}</span>
              <Badge variant="outline" className={getStatusColor(item.status)}>
                {getStatusText(item.status)}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              {showTrend && (
                <div className={cn(
                  "flex items-center text-xs font-medium",
                  getTrendColor(item.trend)
                )}>
                  <span className="mr-1">{getTrendIcon(item.trend)}</span>
                  <span>{Math.abs(item.trend)}%</span>
                </div>
              )}
              <span className="text-sm font-bold">{item.current}%</span>
            </div>
          </div>
          
          <div className="relative">
            <Progress 
              value={item.current} 
              className="h-3"
              // Custom styling based on color would go here
            />
            {showTarget && item.target !== item.current && (
              <div
                className="absolute top-0 w-1 h-3 bg-gray-400 rounded"
                style={{ left: `${item.target}%` }}
                title={`Target: ${item.target}%`}
              />
            )}
          </div>
          
          {showTarget && (
            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>Target: {item.target}%</span>
              <span>100%</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderRingChart = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item, index) => (
        <div key={index} className="text-center">
          <ProgressRing
            progress={item.current}
            color={item.color}
            size="lg"
            className="mb-4"
          >
            <div className="text-center">
              <div className="text-lg font-bold">{item.current}%</div>
              {showTrend && (
                <div className={cn(
                  "text-xs font-medium",
                  getTrendColor(item.trend)
                )}>
                  {getTrendIcon(item.trend)} {Math.abs(item.trend)}%
                </div>
              )}
            </div>
          </ProgressRing>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm">{item.category}</h4>
            <Badge variant="outline" className={getStatusColor(item.status)}>
              {getStatusText(item.status)}
            </Badge>
            {showTarget && (
              <p className="text-xs text-gray-500">Target: {item.target}%</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderMixedChart = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First item as ring */}
        {data[0] && (
          <div className="text-center">
            <ProgressRing
              progress={data[0].current}
              color={data[0].color}
              size="xl"
              className="mb-4"
            >
              <div className="text-center">
                <div className="text-2xl font-bold">{data[0].current}%</div>
                <div className="text-sm text-gray-600">{data[0].category}</div>
                {showTrend && (
                  <div className={cn(
                    "text-xs font-medium mt-1",
                    getTrendColor(data[0].trend)
                  )}>
                    {getTrendIcon(data[0].trend)} {Math.abs(data[0].trend)}%
                  </div>
                )}
              </div>
            </ProgressRing>
            
            <Badge variant="outline" className={getStatusColor(data[0].status)}>
              {getStatusText(data[0].status)}
            </Badge>
            {showTarget && (
              <p className="text-sm text-gray-500 mt-2">Target: {data[0].target}%</p>
            )}
          </div>
        )}
        
        {/* Rest as bars */}
        <div className="space-y-4">
          {data.slice(1).map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{item.category}</span>
                <div className="flex items-center space-x-2">
                  {showTrend && (
                    <div className={cn(
                      "flex items-center text-xs font-medium",
                      getTrendColor(item.trend)
                    )}>
                      <span className="mr-1">{getTrendIcon(item.trend)}</span>
                      <span>{Math.abs(item.trend)}%</span>
                    </div>
                  )}
                  <span className="text-sm font-bold">{item.current}%</span>
                </div>
              </div>
              <Progress value={item.current} className="h-2" />
              {showTarget && (
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Target: {item.target}%</span>
                  <Badge variant="outline" className={cn("text-xs", getStatusColor(item.status))}>
                    {getStatusText(item.status)}
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderChart = () => {
    switch (type) {
      case 'ring':
        return renderRingChart();
      case 'mixed':
        return renderMixedChart();
      case 'bar':
      default:
        return renderBarChart();
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
}