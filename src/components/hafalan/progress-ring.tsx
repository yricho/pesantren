'use client';

import { useState, useEffect } from 'react';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showText?: boolean;
  text?: string;
  animate?: boolean;
  className?: string;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#10B981', // Green
  backgroundColor = '#E5E7EB', // Gray
  showText = true,
  text,
  animate = true,
  className = ''
}: ProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedProgress(progress);
    }
  }, [progress, animate]);

  const normalizedRadius = (size - strokeWidth) / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  const getProgressColor = (prog: number) => {
    if (prog >= 80) return '#10B981'; // Green
    if (prog >= 60) return '#3B82F6'; // Blue
    if (prog >= 40) return '#F59E0B'; // Yellow
    if (prog >= 20) return '#EF4444'; // Red
    return '#6B7280'; // Gray
  };

  const actualColor = color === '#10B981' ? getProgressColor(progress) : color;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={normalizedRadius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
          className="opacity-30"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={normalizedRadius}
          stroke={actualColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`
            ${animate ? 'transition-all duration-1000 ease-out' : ''}
            drop-shadow-sm
          `}
          style={{
            filter: `drop-shadow(0 0 6px ${actualColor}30)`
          }}
        />
      </svg>
      
      {/* Center text */}
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: actualColor }}>
              {text || `${Math.round(progress)}%`}
            </div>
            {text && (
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(progress)}%
              </div>
            )}
          </div>
        </div>
      )}

      {/* Glow effect for high progress */}
      {progress >= 90 && (
        <div 
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            boxShadow: `0 0 20px ${actualColor}40`,
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        />
      )}
    </div>
  );
}

// Specialized progress rings for different metrics
export function JuzProgressRing({ progress, juzNumber, ...props }: ProgressRingProps & { juzNumber?: number }) {
  return (
    <ProgressRing
      {...props}
      progress={progress}
      text={juzNumber ? `Juz ${juzNumber}` : undefined}
      size={props.size || 80}
    />
  );
}

export function SurahProgressRing({ progress, surahCount, ...props }: ProgressRingProps & { surahCount?: number }) {
  return (
    <ProgressRing
      {...props}
      progress={progress}
      text={surahCount ? `${surahCount} Surah` : undefined}
      size={props.size || 100}
    />
  );
}

export function QualityProgressRing({ quality, ...props }: ProgressRingProps & { quality: 'A' | 'B' | 'C' }) {
  const qualityMap = { A: 100, B: 75, C: 50 };
  const colorMap = { A: '#10B981', B: '#3B82F6', C: '#F59E0B' };
  
  return (
    <ProgressRing
      {...props}
      progress={qualityMap[quality]}
      color={colorMap[quality]}
      text={quality}
      size={props.size || 60}
    />
  );
}