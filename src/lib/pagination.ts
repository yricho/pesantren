import { NextRequest } from 'next/server'

export interface PaginationParams {
  page: number
  limit: number
  offset: number
  orderBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationResult<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

export const getPaginationParams = (request: NextRequest): PaginationParams => {
  const { searchParams } = new URL(request.url)
  
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const limit = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(searchParams.get('limit') || String(DEFAULT_PAGE_SIZE), 10))
  )
  const offset = (page - 1) * limit
  const orderBy = searchParams.get('orderBy') || 'createdAt'
  const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'
  
  return {
    page,
    limit,
    offset,
    orderBy,
    sortOrder
  }
}

export const createPaginationResult = <T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginationResult<T> => {
  const { page, limit } = params
  const totalPages = Math.ceil(total / limit)
  
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  }
}

// Prisma pagination helper
export const getPrismaOrderBy = (orderBy: string, sortOrder: 'asc' | 'desc') => {
  const validFields = [
    'id', 'createdAt', 'updatedAt', 'name', 'email', 'title', 
    'date', 'amount', 'status', 'level', 'grade'
  ]
  
  const field = validFields.includes(orderBy) ? orderBy : 'createdAt'
  return { [field]: sortOrder }
}

// Search and filter utilities
export interface SearchParams {
  query?: string
  status?: string
  category?: string
  dateFrom?: string
  dateTo?: string
  [key: string]: string | undefined
}

export const getSearchParams = (request: NextRequest): SearchParams => {
  const { searchParams } = new URL(request.url)
  const params: SearchParams = {}
  
  for (const [key, value] of searchParams.entries()) {
    if (!['page', 'limit', 'orderBy', 'sortOrder'].includes(key) && value) {
      params[key] = value
    }
  }
  
  return params
}

// Build Prisma where clause from search parameters
export const buildPrismaWhereClause = (searchParams: SearchParams) => {
  const where: any = {}
  
  if (searchParams.query) {
    // Generic text search - customize based on your models
    where.OR = [
      { name: { contains: searchParams.query, mode: 'insensitive' } },
      { email: { contains: searchParams.query, mode: 'insensitive' } },
      { description: { contains: searchParams.query, mode: 'insensitive' } }
    ]
  }
  
  if (searchParams.status) {
    where.status = searchParams.status
  }
  
  if (searchParams.category) {
    where.categoryId = searchParams.category
  }
  
  if (searchParams.dateFrom || searchParams.dateTo) {
    where.createdAt = {}
    if (searchParams.dateFrom) {
      where.createdAt.gte = new Date(searchParams.dateFrom)
    }
    if (searchParams.dateTo) {
      where.createdAt.lte = new Date(searchParams.dateTo)
    }
  }
  
  return where
}

// Cursor-based pagination for better performance on large datasets
export interface CursorPaginationParams {
  cursor?: string
  limit: number
  orderBy: string
  sortOrder: 'asc' | 'desc'
}

export const getCursorPaginationParams = (request: NextRequest): CursorPaginationParams => {
  const { searchParams } = new URL(request.url)
  
  return {
    cursor: searchParams.get('cursor') || undefined,
    limit: Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, parseInt(searchParams.get('limit') || String(DEFAULT_PAGE_SIZE), 10))
    ),
    orderBy: searchParams.get('orderBy') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'
  }
}

export interface CursorPaginationResult<T> {
  data: T[]
  meta: {
    limit: number
    hasNextPage: boolean
    nextCursor?: string
  }
}

export const createCursorPaginationResult = <T extends { id: string }>(
  data: T[],
  limit: number
): CursorPaginationResult<T> => {
  const hasNextPage = data.length > limit
  const items = hasNextPage ? data.slice(0, -1) : data
  const nextCursor = hasNextPage ? data[limit - 1].id : undefined
  
  return {
    data: items,
    meta: {
      limit,
      hasNextPage,
      nextCursor
    }
  }
}

// Performance monitoring for pagination queries
export const withPaginationMetrics = async <T>(
  queryFn: () => Promise<T>,
  endpoint: string
): Promise<T> => {
  const startTime = performance.now()
  
  try {
    const result = await queryFn()
    const duration = performance.now() - startTime
    
    // Log slow queries (> 1000ms)
    if (duration > 1000) {
      console.warn(`Slow pagination query detected:`, {
        endpoint,
        duration: `${duration.toFixed(2)}ms`
      })
    }
    
    return result
  } catch (error) {
    const duration = performance.now() - startTime
    console.error(`Pagination query failed:`, {
      endpoint,
      duration: `${duration.toFixed(2)}ms`,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}