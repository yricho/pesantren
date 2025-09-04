'use client'

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'

interface VirtualScrollProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  overscan?: number
  className?: string
  onScroll?: (scrollTop: number) => void
  loading?: boolean
  hasNextPage?: boolean
  onLoadMore?: () => void
}

export function VirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = '',
  onScroll,
  loading = false,
  hasNextPage = false,
  onLoadMore
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const scrollElementRef = useRef<HTMLDivElement>(null)
  
  const totalHeight = items.length * itemHeight
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )
  
  const visibleItems = useMemo(() => {
    const result = []
    for (let i = startIndex; i <= endIndex; i++) {
      if (items[i]) {
        result.push({
          index: i,
          item: items[i],
          offsetY: i * itemHeight
        })
      }
    }
    return result
  }, [items, startIndex, endIndex, itemHeight])
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop
    setScrollTop(newScrollTop)
    onScroll?.(newScrollTop)
    
    // Load more when near bottom
    if (hasNextPage && onLoadMore && !loading) {
      const scrollPercentage = newScrollTop / (totalHeight - containerHeight)
      if (scrollPercentage > 0.8) {
        onLoadMore()
      }
    }
  }, [onScroll, hasNextPage, onLoadMore, loading, totalHeight, containerHeight])
  
  return (
    <div
      ref={scrollElementRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ index, item, offsetY }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: offsetY,
              width: '100%',
              height: itemHeight
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
        
        {loading && (
          <div
            style={{
              position: 'absolute',
              top: items.length * itemHeight,
              width: '100%',
              height: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div className="text-sm text-gray-500">Loading...</div>
          </div>
        )}
      </div>
    </div>
  )
}

// Table virtual scroll component
interface VirtualTableProps<T> {
  data: T[]
  columns: Array<{
    key: keyof T
    header: string
    width?: number
    render?: (value: any, item: T, index: number) => React.ReactNode
  }>
  rowHeight?: number
  containerHeight: number
  className?: string
  headerClassName?: string
  rowClassName?: string
  onRowClick?: (item: T, index: number) => void
}

export function VirtualTable<T>({
  data,
  columns,
  rowHeight = 50,
  containerHeight,
  className = '',
  headerClassName = '',
  rowClassName = '',
  onRowClick
}: VirtualTableProps<T>) {
  const headerHeight = 40
  const contentHeight = containerHeight - headerHeight
  
  const renderRow = useCallback((item: T, index: number) => (
    <div
      className={`flex border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${rowClassName}`}
      onClick={() => onRowClick?.(item, index)}
    >
      {columns.map((column, colIndex) => {
        const value = item[column.key]
        const displayValue = column.render ? column.render(value, item, index) : String(value)
        
        return (
          <div
            key={colIndex}
            className="flex-1 px-4 py-2 text-sm text-gray-900 truncate"
            style={{ width: column.width }}
          >
            {displayValue}
          </div>
        )
      })}
    </div>
  ), [columns, onRowClick, rowClassName])
  
  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className={`flex bg-gray-50 border-b border-gray-200 ${headerClassName}`} style={{ height: headerHeight }}>
        {columns.map((column, index) => (
          <div
            key={index}
            className="flex-1 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            style={{ width: column.width }}
          >
            {column.header}
          </div>
        ))}
      </div>
      
      {/* Virtual scrolled content */}
      <VirtualScroll
        items={data}
        itemHeight={rowHeight}
        containerHeight={contentHeight}
        renderItem={renderRow}
      />
    </div>
  )
}

// Grid virtual scroll component
interface VirtualGridProps<T> {
  items: T[]
  itemWidth: number
  itemHeight: number
  containerWidth: number
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  gap?: number
  className?: string
}

export function VirtualGrid<T>({
  items,
  itemWidth,
  itemHeight,
  containerWidth,
  containerHeight,
  renderItem,
  gap = 8,
  className = ''
}: VirtualGridProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  
  const itemsPerRow = Math.floor((containerWidth + gap) / (itemWidth + gap))
  const rowHeight = itemHeight + gap
  const totalRows = Math.ceil(items.length / itemsPerRow)
  const totalHeight = totalRows * rowHeight - gap
  
  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - 1)
  const endRow = Math.min(totalRows - 1, Math.ceil((scrollTop + containerHeight) / rowHeight))
  
  const visibleItems = useMemo(() => {
    const result = []
    for (let row = startRow; row <= endRow; row++) {
      for (let col = 0; col < itemsPerRow; col++) {
        const index = row * itemsPerRow + col
        if (index < items.length) {
          result.push({
            index,
            item: items[index],
            x: col * (itemWidth + gap),
            y: row * rowHeight
          })
        }
      }
    }
    return result
  }, [items, startRow, endRow, itemsPerRow, itemWidth, itemHeight, gap, rowHeight])
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])
  
  return (
    <div
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ index, item, x, y }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: itemWidth,
              height: itemHeight
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  )
}

// Infinite scroll hook for API data
export function useInfiniteScroll<T>(
  initialData: T[] = [],
  fetchMore: (page: number) => Promise<{ data: T[]; hasNextPage: boolean }>,
  pageSize: number = 20
) {
  const [data, setData] = useState<T[]>(initialData)
  const [loading, setLoading] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(null)
  
  const loadMore = useCallback(async () => {
    if (loading || !hasNextPage) return
    
    setLoading(true)
    setError(null)
    
    try {
      const result = await fetchMore(page)
      setData(prev => [...prev, ...result.data])
      setHasNextPage(result.hasNextPage)
      setPage(prev => prev + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more data')
    } finally {
      setLoading(false)
    }
  }, [loading, hasNextPage, page, fetchMore])
  
  const reset = useCallback(() => {
    setData(initialData)
    setPage(1)
    setHasNextPage(true)
    setError(null)
  }, [initialData])
  
  return {
    data,
    loading,
    hasNextPage,
    error,
    loadMore,
    reset
  }
}