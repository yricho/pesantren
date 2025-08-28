import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/transactions/route'
import { getServerSession } from 'next-auth/next'

// Mock dependencies
jest.mock('next-auth/next')
jest.mock('@/lib/prisma', () => ({
  prisma: {
    transaction: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
  },
}))

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>
const { prisma } = require('@/lib/prisma')

describe('/api/transactions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/transactions', () => {
    const createMockRequest = (params = {}) => {
      const url = new URL('http://localhost:3000/api/transactions')
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value as string)
      })
      return new NextRequest(url)
    }

    it('should return 401 if not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)
      const request = createMockRequest()

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return transactions with default pagination', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1', role: 'STAFF' }
      } as any)

      const mockTransactions = [
        {
          id: 'tx-1',
          type: 'INCOME',
          category: 'Donation',
          amount: 1000000,
          description: 'Monthly donation',
          date: new Date('2024-01-15'),
          creator: { name: 'Admin', username: 'admin' }
        }
      ]

      prisma.transaction.findMany.mockResolvedValue(mockTransactions)
      prisma.transaction.count.mockResolvedValue(1)

      const request = createMockRequest()
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toEqual(mockTransactions)
      expect(data.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      })

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          creator: {
            select: { name: true, username: true },
          },
        },
        orderBy: { date: 'desc' },
        skip: 0,
        take: 10,
      })
    })

    it('should handle pagination parameters', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1', role: 'STAFF' }
      } as any)

      prisma.transaction.findMany.mockResolvedValue([])
      prisma.transaction.count.mockResolvedValue(25)

      const request = createMockRequest({ page: '3', limit: '5' })
      await GET(request)

      expect(prisma.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 5,
        })
      )
    })

    it('should filter by type and category', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1', role: 'STAFF' }
      } as any)

      prisma.transaction.findMany.mockResolvedValue([])
      prisma.transaction.count.mockResolvedValue(0)

      const request = createMockRequest({ type: 'EXPENSE', category: 'Utilities' })
      await GET(request)

      expect(prisma.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { type: 'EXPENSE', category: 'Utilities' },
        })
      )
    })

    it('should handle database errors', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1', role: 'STAFF' }
      } as any)

      prisma.transaction.findMany.mockRejectedValue(new Error('Database error'))

      const request = createMockRequest()
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })
  })

  describe('POST /api/transactions', () => {
    const createMockRequest = (body: any) => {
      return new NextRequest('http://localhost:3000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
    }

    it('should return 401 if not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)
      const request = createMockRequest({})

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should create transaction with valid data', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1', role: 'STAFF' }
      } as any)

      const transactionData = {
        type: 'INCOME',
        category: 'Donation',
        amount: 1000000,
        description: 'Monthly donation from community',
        date: '2024-01-15T10:00:00Z',
      }

      const mockCreatedTransaction = {
        id: 'tx-1',
        ...transactionData,
        date: new Date(transactionData.date),
        createdBy: 'user-1',
        creator: { name: 'Test User', username: 'testuser' }
      }

      prisma.transaction.create.mockResolvedValue(mockCreatedTransaction)

      const request = createMockRequest(transactionData)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.data).toEqual(mockCreatedTransaction)
      expect(data.message).toBe('Transaction created successfully')

      expect(prisma.transaction.create).toHaveBeenCalledWith({
        data: {
          ...transactionData,
          date: new Date(transactionData.date),
          createdBy: 'user-1',
        },
        include: {
          creator: {
            select: { name: true, username: true },
          },
        },
      })
    })

    it('should return 400 for invalid transaction type', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1', role: 'STAFF' }
      } as any)

      const request = createMockRequest({
        type: 'INVALID',
        category: 'Donation',
        amount: 1000000,
        description: 'Test transaction',
        date: '2024-01-15T10:00:00Z',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation error')
      expect(data.details).toBeDefined()
    })

    it('should return 400 for negative amount', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1', role: 'STAFF' }
      } as any)

      const request = createMockRequest({
        type: 'EXPENSE',
        category: 'Utilities',
        amount: -1000,
        description: 'Invalid amount',
        date: '2024-01-15T10:00:00Z',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation error')
    })

    it('should return 400 for missing required fields', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1', role: 'STAFF' }
      } as any)

      const request = createMockRequest({
        type: 'INCOME',
        // missing category, amount, description, date
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation error')
      expect(data.details).toHaveLength(4) // 4 missing fields
    })

    it('should return 400 for invalid date format', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1', role: 'STAFF' }
      } as any)

      const request = createMockRequest({
        type: 'INCOME',
        category: 'Donation',
        amount: 1000000,
        description: 'Test transaction',
        date: 'invalid-date',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation error')
    })

    it('should handle database errors during creation', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1', role: 'STAFF' }
      } as any)

      prisma.transaction.create.mockRejectedValue(new Error('Database error'))

      const request = createMockRequest({
        type: 'INCOME',
        category: 'Donation',
        amount: 1000000,
        description: 'Test transaction',
        date: '2024-01-15T10:00:00Z',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })
  })

  describe('Transactions API Security', () => {
    it('should prevent SQL injection in query parameters', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1', role: 'STAFF' }
      } as any)

      prisma.transaction.findMany.mockResolvedValue([])
      prisma.transaction.count.mockResolvedValue(0)

      const maliciousRequest = new NextRequest(
        new URL('http://localhost:3000/api/transactions?type=\'; DROP TABLE transactions; --')
      )

      await GET(maliciousRequest)

      // Should pass the malicious input as-is to Prisma, which handles sanitization
      expect(prisma.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { type: '\'; DROP TABLE transactions; --' },
        })
      )
    })

    it('should not allow unauthorized users to access financial data', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/transactions')
      const response = await GET(request)

      expect(response.status).toBe(401)
      expect(prisma.transaction.findMany).not.toHaveBeenCalled()
    })

    it('should validate data types for amount field', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1', role: 'STAFF' }
      } as any)

      const request = createMockRequest({
        type: 'INCOME',
        category: 'Donation',
        amount: 'not-a-number',
        description: 'Test transaction',
        date: '2024-01-15T10:00:00Z',
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })
  })

  // Helper function for creating mock requests
  function createMockRequest(body: any) {
    return new NextRequest('http://localhost:3000/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  }
})