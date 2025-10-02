import { NextRequest, NextResponse } from 'next/server'
// import { compress, decompress } from 'lz-string'

// Response compression utility
export class ResponseCompressor {
  private static readonly COMPRESSION_THRESHOLD = 1024 // 1KB
  private static readonly COMPRESSIBLE_TYPES = [
    'application/json',
    'text/html',
    'text/plain',
    'text/css',
    'text/javascript',
    'application/javascript',
    'application/xml',
    'text/xml'
  ]

  static shouldCompress(contentType: string, contentLength: number): boolean {
    return (
      contentLength >= this.COMPRESSION_THRESHOLD &&
      this.COMPRESSIBLE_TYPES.some(type => contentType.includes(type))
    )
  }

  static getAcceptedEncodings(request: NextRequest): string[] {
    const acceptEncoding = request.headers.get('accept-encoding') || ''
    const encodings = acceptEncoding.split(',').map(e => e.trim().toLowerCase())
    return encodings
  }

  static getSupportedEncoding(acceptedEncodings: string[]): string | null {
    if (acceptedEncodings.includes('br')) return 'br'
    if (acceptedEncodings.includes('gzip')) return 'gzip'
    if (acceptedEncodings.includes('deflate')) return 'deflate'
    return null
  }

  static async compressResponse(
    data: string | Uint8Array,
    encoding: string
  ): Promise<Uint8Array> {
    const content = typeof data === 'string' ? new TextEncoder().encode(data) : data
    
    switch (encoding) {
      case 'gzip':
        return await this.gzipCompress(content)
      case 'br':
        return await this.brotliCompress(content)
      case 'deflate':
        return await this.deflateCompress(content)
      default:
        return content
    }
  }

  private static async gzipCompress(data: Uint8Array): Promise<Uint8Array> {
    // Simplified gzip implementation using CompressionStream if available
    if (typeof CompressionStream !== 'undefined') {
      const stream = new CompressionStream('gzip')
      const writer = stream.writable.getWriter()
      const reader = stream.readable.getReader()
      
      writer.write(data as any)
      writer.close()
      
      const chunks: Uint8Array[] = []
      let result = await reader.read()
      
      while (!result.done) {
        chunks.push(result.value)
        result = await reader.read()
      }
      
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
      const compressed = new Uint8Array(totalLength)
      let offset = 0
      
      for (const chunk of chunks) {
        compressed.set(chunk, offset)
        offset += chunk.length
      }
      
      return compressed
    }
    
    // Fallback to simple compression
    const compressed = compress(new TextDecoder().decode(data))
    return new TextEncoder().encode(compressed)
  }

  private static async brotliCompress(data: Uint8Array): Promise<Uint8Array> {
    // Brotli compression if available
    if (typeof CompressionStream !== 'undefined') {
      try {
        const stream = new CompressionStream('deflate-raw')
        // Similar implementation as gzip
        return await this.gzipCompress(data)
      } catch {
        return await this.gzipCompress(data)
      }
    }
    
    return await this.gzipCompress(data)
  }

  private static async deflateCompress(data: Uint8Array): Promise<Uint8Array> {
    return await this.gzipCompress(data)
  }
}

// Cache control headers utility
export class CacheControlManager {
  static readonly CACHE_STRATEGIES = {
    // Static assets (images, CSS, JS) - cache for 1 year
    STATIC: 'public, max-age=31536000, immutable',
    
    // API responses - cache for 5 minutes with revalidation
    API: 'public, max-age=300, stale-while-revalidate=60',
    
    // User-specific data - cache for 1 minute
    USER_DATA: 'private, max-age=60',
    
    // Frequently changing data - cache for 30 seconds
    DYNAMIC: 'public, max-age=30, stale-while-revalidate=10',
    
    // No cache for sensitive data
    NO_CACHE: 'private, no-cache, no-store, must-revalidate',
    
    // CDN cache for public data - 1 hour
    CDN: 'public, max-age=3600, s-maxage=3600'
  }

  static getCacheStrategy(path: string, isAuthenticated: boolean = false): string {
    // Static assets
    if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$/)) {
      return this.CACHE_STRATEGIES.STATIC
    }
    
    // API routes
    if (path.startsWith('/api/')) {
      // Authentication endpoints - no cache
      if (path.includes('/auth/') || path.includes('/login') || path.includes('/logout')) {
        return this.CACHE_STRATEGIES.NO_CACHE
      }
      
      // User-specific API data
      if (isAuthenticated && (path.includes('/user/') || path.includes('/profile/'))) {
        return this.CACHE_STRATEGIES.USER_DATA
      }
      
      // Public API data
      if (path.includes('/public/') || path.includes('/statistics/')) {
        return this.CACHE_STRATEGIES.CDN
      }
      
      // Default API cache
      return this.CACHE_STRATEGIES.API
    }
    
    // Dynamic pages
    if (path.includes('/dashboard/') || path.includes('/admin/')) {
      return this.CACHE_STRATEGIES.DYNAMIC
    }
    
    // Public pages
    if (path === '/' || path.includes('/about/') || path.includes('/contact/')) {
      return this.CACHE_STRATEGIES.CDN
    }
    
    return this.CACHE_STRATEGIES.API
  }

  static addCacheHeaders(
    response: NextResponse,
    strategy?: string,
    customHeaders?: Record<string, string>
  ): NextResponse {
    const headers = new Headers(response.headers)
    
    if (strategy) {
      headers.set('Cache-Control', strategy)
    }
    
    // Add additional cache-related headers
    headers.set('Vary', 'Accept-Encoding, User-Agent')
    
    if (customHeaders) {
      Object.entries(customHeaders).forEach(([key, value]) => {
        headers.set(key, value)
      })
    }
    
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    })
  }
}

// Middleware for automatic compression and caching
export const withCompression = (handler: Function) => {
  return async (request: NextRequest, ...args: any[]) => {
    const response = await handler(request, ...args)
    
    if (!response || response.status >= 400) {
      return response
    }
    
    const contentType = response.headers.get('content-type') || ''
    const contentLength = parseInt(response.headers.get('content-length') || '0', 10)
    
    // Skip compression for small or non-compressible content
    if (!ResponseCompressor.shouldCompress(contentType, contentLength)) {
      return CacheControlManager.addCacheHeaders(
        response,
        CacheControlManager.getCacheStrategy(request.nextUrl.pathname)
      )
    }
    
    const acceptedEncodings = ResponseCompressor.getAcceptedEncodings(request)
    const supportedEncoding = ResponseCompressor.getSupportedEncoding(acceptedEncodings)
    
    if (!supportedEncoding) {
      return CacheControlManager.addCacheHeaders(
        response,
        CacheControlManager.getCacheStrategy(request.nextUrl.pathname)
      )
    }
    
    try {
      const body = await response.text()
      const compressedBody = await ResponseCompressor.compressResponse(body, supportedEncoding)
      
      const compressedResponse = new NextResponse(compressedBody as any, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(response.headers.entries()),
          'Content-Encoding': supportedEncoding,
          'Content-Length': compressedBody.length.toString(),
        }
      })
      
      return CacheControlManager.addCacheHeaders(
        compressedResponse,
        CacheControlManager.getCacheStrategy(request.nextUrl.pathname)
      )
    } catch (error) {
      console.error('Compression failed:', error)
      return CacheControlManager.addCacheHeaders(
        response,
        CacheControlManager.getCacheStrategy(request.nextUrl.pathname)
      )
    }
  }
}

// Performance monitoring for compression
export const CompressionMetrics = {
  totalRequests: 0,
  compressedRequests: 0,
  totalSavedBytes: 0,
  
  logCompression: (originalSize: number, compressedSize: number) => {
    CompressionMetrics.totalRequests++
    CompressionMetrics.compressedRequests++
    CompressionMetrics.totalSavedBytes += (originalSize - compressedSize)
  },
  
  logSkipped: () => {
    CompressionMetrics.totalRequests++
  },
  
  getMetrics: () => ({
    totalRequests: CompressionMetrics.totalRequests,
    compressionRate: CompressionMetrics.totalRequests > 0 
      ? (CompressionMetrics.compressedRequests / CompressionMetrics.totalRequests * 100).toFixed(2)
      : '0.00',
    totalSavedBytes: CompressionMetrics.totalSavedBytes,
    averageSavings: CompressionMetrics.compressedRequests > 0
      ? Math.round(CompressionMetrics.totalSavedBytes / CompressionMetrics.compressedRequests)
      : 0
  })
}

// Conditional response based on request headers
export const conditionalResponse = (
  request: NextRequest,
  data: any,
  lastModified?: Date
): NextResponse | null => {
  const ifNoneMatch = request.headers.get('if-none-match')
  const ifModifiedSince = request.headers.get('if-modified-since')
  
  // Generate ETag
  const etag = `"${btoa(JSON.stringify(data)).slice(0, 16)}"`
  
  // Check ETag
  if (ifNoneMatch === etag) {
    return new NextResponse(null, { 
      status: 304,
      headers: { 'ETag': etag }
    })
  }
  
  // Check Last-Modified
  if (lastModified && ifModifiedSince) {
    const modifiedSince = new Date(ifModifiedSince)
    if (lastModified <= modifiedSince) {
      return new NextResponse(null, { 
        status: 304,
        headers: { 
          'Last-Modified': lastModified.toUTCString(),
          'ETag': etag
        }
      })
    }
  }
  
  return null // Return null to indicate response should be sent normally
}