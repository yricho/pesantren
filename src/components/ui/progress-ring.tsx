'use client';

import { cn } from '@/lib/utils';

interface ProgressRingProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  thickness?: number;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  showPercentage?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const sizeMap = {
  sm: { width: 60, height: 60, fontSize: 'text-xs' },
  md: { width: 80, height: 80, fontSize: 'text-sm' },
  lg: { width: 120, height: 120, fontSize: 'text-base' },
  xl: { width: 160, height: 160, fontSize: 'text-lg' }
};

const colorMap = {
  blue: { stroke: '#3B82F6', background: '#EFF6FF' },
  green: { stroke: '#10B981', background: '#ECFDF5' },
  purple: { stroke: '#8B5CF6', background: '#F3E8FF' },
  orange: { stroke: '#F97316', background: '#FFF7ED' },
  red: { stroke: '#EF4444', background: '#FEF2F2' }
};

export function ProgressRing({
  progress,
  size = 'md',
  thickness = 4,
  color = 'blue',
  showPercentage = true,
  children,
  className
}: ProgressRingProps) {
  const { width, height, fontSize } = sizeMap[size];
  const { stroke, background } = colorMap[color];
  
  const center = width / 2;
  const radius = center - thickness * 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={background}
          strokeWidth={thickness}
        />
        
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 0.5s ease-in-out',
          }}
        />
      </svg>
      
      {/* Content */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center flex-col",
        fontSize
      )}>
        {children ? (
          children
        ) : showPercentage ? (
          <>
            <span className="font-bold" style={{ color: stroke }}>
              {Math.round(progress)}%
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
}