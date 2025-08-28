'use client'

import { cn } from '@/lib/utils'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export function Loading({ size = 'md', className, text }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center space-y-4">
        <div
          className={cn(
            'animate-spin rounded-full border-2 border-gray-300 border-t-primary-600',
            sizeClasses[size]
          )}
        />
        {text && (
          <p className="text-sm text-gray-600 animate-pulse">{text}</p>
        )}
      </div>
    </div>
  )
}

export function LoadingScreen({ text = 'Memuat...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-16 h-16 animate-spin rounded-full border-4 border-gray-300 border-t-primary-600 mx-auto mb-4" />
        <p className="text-lg text-gray-600">{text}</p>
      </div>
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-48 rounded-t-lg"></div>
      <div className="p-6 space-y-3">
        <div className="bg-gray-200 h-4 rounded w-3/4"></div>
        <div className="bg-gray-200 h-4 rounded w-1/2"></div>
        <div className="bg-gray-200 h-4 rounded w-5/6"></div>
      </div>
    </div>
  )
}

export function LoadingTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex space-x-4">
          <div className="bg-gray-200 h-4 rounded flex-1"></div>
          <div className="bg-gray-200 h-4 rounded w-20"></div>
          <div className="bg-gray-200 h-4 rounded w-16"></div>
        </div>
      ))}
    </div>
  )
}