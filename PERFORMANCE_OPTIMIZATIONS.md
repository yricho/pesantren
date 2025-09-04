# Performance Optimizations Documentation

This document outlines all the comprehensive performance optimizations implemented in the Pondok Imam Syafi'i system. These optimizations ensure the application runs smoothly even with large amounts of data.

## Table of Contents

1. [Database Query Optimization](#database-query-optimization)
2. [Caching Implementation](#caching-implementation)
3. [Image Optimization](#image-optimization)
4. [Code Splitting & Bundle Optimization](#code-splitting--bundle-optimization)
5. [API Response Optimization](#api-response-optimization)
6. [Frontend Performance](#frontend-performance)
7. [Monitoring & Analytics](#monitoring--analytics)
8. [Implementation Examples](#implementation-examples)
9. [Performance Metrics](#performance-metrics)
10. [Best Practices](#best-practices)

## Database Query Optimization

### Indexes Added
The database schema already includes comprehensive indexes for frequently queried fields:

```sql
-- Student queries
@@index([institutionType, status])
@@index([enrollmentYear])
@@index([isOrphan])

-- Activity queries  
@@index([status])
@@index([level])
@@index([paymentStatus])

-- Financial queries
@@index([type, status, date])
@@index([categoryId])
@@index([status, date])
```

### Query Optimization Utilities

**Location**: `src/lib/query-optimizer.ts`

Features:
- **Batch Loading**: Prevents N+1 queries using `BatchLoader` class
- **Optimized Includes**: Pre-defined optimized includes for common relations
- **Performance Monitoring**: Tracks slow queries (>500ms)
- **Connection Pool Monitoring**: Monitors database connections and query metrics

Example usage:
```typescript
// Using optimized includes
const students = await prisma.student.findMany({
  include: optimizedIncludes.student.withClass
})

// Using batch loader to prevent N+1
const user = await batchLoader.load(
  'users',
  userId,
  commonLoaders.loadUsers,
  user => user.id
)
```

## Caching Implementation

### Redis-like In-Memory Cache

**Location**: `src/lib/redis-cache.ts`

Features:
- **API Response Caching**: 5-minute TTL with automatic cleanup
- **ETag Support**: Conditional responses with `If-None-Match` headers
- **Cache Invalidation**: Pattern-based cache invalidation
- **Compression**: Automatic response compression

Example usage:
```typescript
// Using cache middleware
export const withCache = (handler, cacheKey, ttl) => {
  return async (request, context) => {
    const cached = cache.get(cacheKey)
    if (cached) return NextResponse.json(cached)
    
    const response = await handler(request, context)
    cache.set(cacheKey, response.data, ttl)
    return response
  }
}

// Cache invalidation
invalidateCache.students() // Invalidates all student-related cache
```

### Pagination Optimization

**Location**: `src/lib/pagination.ts`

Features:
- **Configurable Page Sizes**: Default 20, max 100 items per page
- **Cursor-based Pagination**: For better performance on large datasets
- **Search Integration**: Optimized search with pagination
- **Performance Metrics**: Monitors pagination query performance

Example usage:
```typescript
const paginationParams = getPaginationParams(request)
const searchParams = getSearchParams(request)

const [data, total] = await Promise.all([
  prisma.student.findMany({
    where: buildPrismaWhereClause(searchParams),
    skip: paginationParams.offset,
    take: paginationParams.limit
  }),
  prisma.student.count({ where })
])

return createPaginationResult(data, total, paginationParams)
```

## Image Optimization

### Next.js Image Configuration

**Location**: `next.config.js`

```javascript
images: {
  unoptimized: false,
  formats: ['image/webp', 'image/avif'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
}
```

### Image Optimization Service

**Location**: `src/lib/image-optimizer.ts`

Features:
- **Format Detection**: Automatic WebP/AVIF format selection based on browser support
- **Responsive Images**: Generate multiple sizes for different breakpoints
- **Progressive Loading**: Blur placeholder while loading
- **Client-side Compression**: Reduce file size before upload
- **Lazy Loading**: Intersection Observer-based lazy loading

Example usage:
```typescript
// Optimized image component
<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description"
  width={300}
  height={200}
  loading="lazy"
  placeholder="blur"
/>

// Progressive image with blur effect
<ProgressiveImage
  src="/high-res-image.jpg"
  placeholder="/low-res-placeholder.jpg"
  alt="Description"
/>
```

## Code Splitting & Bundle Optimization

### Dynamic Imports

**Location**: `src/lib/lazy-loading.tsx`

Features:
- **Component Lazy Loading**: React.lazy with Suspense
- **Route-based Splitting**: Separate bundles for different routes
- **Loading States**: Skeleton screens for better UX
- **Error Boundaries**: Graceful error handling
- **Preloading**: Preload components on hover/focus

Example usage:
```typescript
// Lazy component wrapper
const LazyDashboard = withLazyLoading(
  () => import('@/app/(authenticated)/dashboard/DashboardClient'),
  <LoadingStates.Dashboard />
)

// Dynamic component loading
<DynamicComponent
  loader={() => import('./HeavyComponent')}
  loading={<Skeleton />}
  error={<ErrorMessage />}
/>

// Intersection observer lazy loading
<LazySection fallback={<Skeleton />}>
  <HeavyComponent />
</LazySection>
```

### Bundle Analysis

To analyze bundle size:
```bash
npm run build
npm run analyze
```

## API Response Optimization

### Compression & Caching Headers

**Location**: `src/lib/compression.ts`

Features:
- **Response Compression**: Gzip/Brotli compression for responses >1KB
- **Smart Cache Headers**: Different strategies for different content types
- **ETag Support**: Conditional responses to reduce bandwidth
- **Performance Metrics**: Track compression ratios and savings

Example usage:
```typescript
// Automatic compression middleware
const handler = withCompression(async (request) => {
  const data = await fetchData()
  return NextResponse.json(data)
})

// Cache strategy selection
const cacheStrategy = CacheControlManager.getCacheStrategy(
  request.nextUrl.pathname,
  isAuthenticated
)
```

Cache Strategies:
- **Static Assets**: 1 year cache
- **API Responses**: 5 minutes with stale-while-revalidate
- **User Data**: 1 minute private cache
- **Public Data**: 1 hour CDN cache
- **Sensitive Data**: No cache

## Frontend Performance

### React Component Optimization

**Location**: `src/hooks/use-performance.ts`

Features:
- **Debounced Inputs**: 300ms debounce for search inputs
- **Memoized Computations**: useMemo for expensive calculations
- **Optimized Re-renders**: useCallback for stable function references
- **Form Optimization**: Efficient form state management
- **Performance Tracking**: Component render time monitoring

### Virtual Scrolling

**Location**: `src/components/ui/virtual-scroll.tsx`

Features:
- **Large List Performance**: Handle thousands of items efficiently
- **Variable Heights**: Support for dynamic item heights
- **Infinite Scrolling**: Load more data as user scrolls
- **Grid Layout**: Virtual scrolling for grid layouts
- **Table Virtualization**: Efficient table rendering

Example usage:
```typescript
// Virtual list
<VirtualScroll
  items={largeDataset}
  itemHeight={50}
  containerHeight={400}
  renderItem={(item, index) => <ItemComponent item={item} />}
  onLoadMore={loadMoreData}
  hasNextPage={hasNextPage}
/>

// Virtual table
<VirtualTable
  data={tableData}
  columns={columns}
  rowHeight={60}
  containerHeight={500}
  onRowClick={handleRowClick}
/>
```

### Performance Hooks

```typescript
// Debounced search
const debouncedQuery = useDebounce(searchQuery, 300)

// Optimized pagination
const {
  currentPage,
  paginatedData,
  goToPage,
  hasNextPage
} = usePagination(data, 20)

// Performance monitoring
const { trackAction } = usePerformanceTracking('ComponentName')
```

## Monitoring & Analytics

### Web Vitals Tracking

**Location**: `src/lib/performance-monitoring.ts`

Tracks:
- **Core Web Vitals**: LCP, FID, CLS, FCP, TTFB
- **Custom Metrics**: Component render times, API response times
- **Error Tracking**: Client-side errors with context
- **Real User Monitoring**: Session-based performance data

### Performance Dashboard

**Location**: `src/components/performance/PerformanceDashboard.tsx`

Features:
- **Web Vitals Overview**: Real-time performance metrics
- **Error Tracking**: Error frequency and resolution status
- **Page Performance**: Per-page performance breakdown
- **Device Analytics**: Performance by device type
- **Historical Trends**: Performance over time

### API Endpoints

- `GET /api/analytics/performance` - Performance metrics
- `POST /api/analytics/performance` - Submit performance data
- `GET /api/analytics/errors` - Error logs
- `POST /api/analytics/errors` - Report errors

## Implementation Examples

### Optimized API Endpoint

```typescript
// Before optimization
export async function GET(request: NextRequest) {
  const students = await prisma.student.findMany()
  return NextResponse.json(students)
}

// After optimization
export async function GET(request: NextRequest) {
  const paginationParams = getPaginationParams(request)
  const searchParams = getSearchParams(request)
  
  // Check cache
  const cacheKey = cache.generateAPIKey('students', {
    ...paginationParams,
    ...searchParams
  })
  
  const cached = cache.get(cacheKey)
  if (cached) return withETag(cached, request)
  
  // Optimized query with includes
  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where: buildPrismaWhereClause(searchParams),
      include: optimizedIncludes.student.minimal,
      orderBy: { [paginationParams.orderBy]: paginationParams.sortOrder },
      skip: paginationParams.offset,
      take: paginationParams.limit
    }),
    prisma.student.count({ where: buildPrismaWhereClause(searchParams) })
  ])
  
  const result = createPaginationResult(students, total, paginationParams)
  
  // Cache and return with ETag
  cache.set(cacheKey, result, 5 * 60 * 1000)
  return withETag(result, request)
}
```

### Optimized React Component

See `src/components/siswa/optimized-student-form.tsx` for a complete example of:
- React.memo for preventing unnecessary re-renders
- useCallback for stable function references
- useMemo for expensive computations
- Lazy loading of form sections
- Debounced input handling
- Form validation optimization
- Performance tracking integration

## Performance Metrics

### Target Metrics

- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to First Byte (TTFB)**: < 800ms

### Database Performance

- **Query Response Time**: < 500ms
- **Connection Pool**: Monitor active connections
- **Slow Query Threshold**: 500ms
- **Cache Hit Ratio**: > 80%

### Bundle Size Targets

- **Main Bundle**: < 250KB gzipped
- **Route Chunks**: < 100KB gzipped each
- **Image Optimization**: WebP/AVIF format usage > 80%

## Best Practices

### Database Queries
1. Always use appropriate indexes
2. Limit selected fields with `select`
3. Use pagination for large datasets
4. Implement proper includes to prevent N+1 queries
5. Monitor and optimize slow queries

### Caching Strategy
1. Cache API responses with appropriate TTL
2. Use ETag headers for conditional responses
3. Implement cache invalidation patterns
4. Monitor cache hit ratios
5. Use different cache strategies for different content types

### Frontend Performance
1. Use React.memo for pure components
2. Implement debouncing for search inputs
3. Use virtual scrolling for large lists
4. Lazy load non-critical components
5. Optimize images with Next.js Image component

### Bundle Optimization
1. Implement code splitting at route level
2. Use dynamic imports for heavy components
3. Remove unused dependencies
4. Analyze bundle size regularly
5. Implement tree shaking

### Monitoring
1. Track Core Web Vitals continuously
2. Monitor error rates and resolution times
3. Set up performance budgets
4. Use Real User Monitoring (RUM)
5. Create performance dashboards

## Usage Instructions

1. **Enable Performance Monitoring**:
   ```typescript
   import { performanceMonitor } from '@/lib/performance-monitoring'
   // Monitoring starts automatically
   ```

2. **Use Optimized Components**:
   ```typescript
   import { OptimizedStudentEditForm } from '@/components/siswa/optimized-student-form'
   // Replace existing components gradually
   ```

3. **Implement Caching**:
   ```typescript
   import { withCache } from '@/lib/redis-cache'
   export const GET = withCache(handler, 'endpoint-key', 300000)
   ```

4. **Add Virtual Scrolling**:
   ```typescript
   import { VirtualScroll } from '@/components/ui/virtual-scroll'
   // Use for lists with >100 items
   ```

5. **Monitor Performance**:
   - Access the dashboard at `/performance` (admin only)
   - Check Web Vitals in browser dev tools
   - Monitor API response times

## Deployment Considerations

1. **Environment Variables**: Set up caching and monitoring configs
2. **CDN Configuration**: Enable compression and proper cache headers
3. **Database Connection Pooling**: Configure appropriate pool sizes
4. **Memory Monitoring**: Monitor memory usage for cache size
5. **Performance Budget CI**: Set up performance budget checks in CI/CD

This comprehensive performance optimization implementation ensures the Pondok Imam Syafi'i system can handle large amounts of data while maintaining excellent user experience.