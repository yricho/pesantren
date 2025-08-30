'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down' | 'neutral';
  };
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const colorMap = {
  blue: {
    icon: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    value: 'text-blue-600'
  },
  green: {
    icon: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    value: 'text-green-600'
  },
  purple: {
    icon: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    value: 'text-purple-600'
  },
  orange: {
    icon: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    value: 'text-orange-600'
  },
  red: {
    icon: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    value: 'text-red-600'
  },
  gray: {
    icon: 'text-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    value: 'text-gray-900'
  }
};

const sizeMap = {
  sm: {
    padding: 'p-4',
    iconSize: 'w-6 h-6',
    valueText: 'text-xl',
    titleText: 'text-sm',
    subtitleText: 'text-xs'
  },
  md: {
    padding: 'p-6',
    iconSize: 'w-8 h-8',
    valueText: 'text-2xl',
    titleText: 'text-sm',
    subtitleText: 'text-xs'
  },
  lg: {
    padding: 'p-8',
    iconSize: 'w-10 h-10',
    valueText: 'text-3xl',
    titleText: 'text-base',
    subtitleText: 'text-sm'
  }
};

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  badge,
  color = 'gray',
  size = 'md',
  className,
  onClick
}: MetricCardProps) {
  const colors = colorMap[color];
  const sizes = sizeMap[size];

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <Card 
      className={cn(
        "hover:shadow-md transition-shadow cursor-pointer",
        onClick && "hover:shadow-lg",
        className
      )}
      onClick={onClick}
    >
      <CardContent className={sizes.padding}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={cn(
              "rounded-lg p-3",
              colors.bg,
              colors.border,
              "border"
            )}>
              <Icon className={cn(sizes.iconSize, colors.icon)} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <p className={cn(
                  "font-medium text-gray-600",
                  sizes.titleText
                )}>
                  {title}
                </p>
                {badge && (
                  <Badge variant={badge.variant || 'outline'} className="text-xs">
                    {badge.text}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-baseline space-x-2">
                <p className={cn(
                  "font-bold",
                  colors.value,
                  sizes.valueText
                )}>
                  {value}
                </p>
                
                {trend && (
                  <div className={cn(
                    "flex items-center text-xs font-medium",
                    getTrendColor(trend.direction)
                  )}>
                    <span className="mr-1">
                      {getTrendIcon(trend.direction)}
                    </span>
                    <span>{Math.abs(trend.value)}%</span>
                  </div>
                )}
              </div>
              
              {subtitle && (
                <p className={cn(
                  "text-gray-500 mt-1",
                  sizes.subtitleText
                )}>
                  {subtitle}
                </p>
              )}
              
              {trend?.label && (
                <p className={cn(
                  "text-gray-500 mt-1",
                  sizes.subtitleText
                )}>
                  {trend.label}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}