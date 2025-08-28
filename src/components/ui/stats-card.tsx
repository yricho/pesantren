'use client'

import { Card, CardContent } from './card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'default' | 'green' | 'red' | 'blue' | 'yellow' | 'purple'
  className?: string
}

const colorClasses = {
  default: {
    icon: 'bg-gray-100 text-gray-600',
    value: 'text-gray-900',
    trend: 'text-gray-600'
  },
  green: {
    icon: 'bg-green-100 text-green-600',
    value: 'text-green-600',
    trend: 'text-green-600'
  },
  red: {
    icon: 'bg-red-100 text-red-600',
    value: 'text-red-600',
    trend: 'text-red-600'
  },
  blue: {
    icon: 'bg-blue-100 text-blue-600',
    value: 'text-blue-600',
    trend: 'text-blue-600'
  },
  yellow: {
    icon: 'bg-yellow-100 text-yellow-600',
    value: 'text-yellow-600',
    trend: 'text-yellow-600'
  },
  purple: {
    icon: 'bg-purple-100 text-purple-600',
    value: 'text-purple-600',
    trend: 'text-purple-600'
  }
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'default',
  className
}: StatsCardProps) {
  const colors = colorClasses[color]

  return (
    <Card className={cn('hover:shadow-lg transition-shadow', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">
              {title}
            </p>
            <div className="flex items-baseline">
              <p className={cn('text-2xl font-bold', colors.value)}>
                {value}
              </p>
              {trend && (
                <span className={cn(
                  'ml-2 text-sm font-medium',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {Icon && (
            <div className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center',
              colors.icon
            )}>
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}