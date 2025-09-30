import bcrypt from 'bcryptjs'
import { authOptions } from '@/lib/auth'

// Mock dependencies
jest.mock('bcryptjs')
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}))

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>
const { prisma } = require('@/lib/prisma')

describe('Auth Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Credentials Provider', () => {
    const credentialsProvider = authOptions.providers[0]

    it('should have correct provider configuration', () => {
      expect(credentialsProvider.name).toBe('credentials')
      expect(credentialsProvider.credentials).toEqual({
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      })
    })

    describe('authorize function', () => {
      const authorize = credentialsProvider.authorize

      it('should return null if credentials are missing', async () => {
        const result = await authorize({})
        expect(result).toBeNull()
      })

      it('should return null if username is missing', async () => {
        const result = await authorize({ password: 'password123' })
        expect(result).toBeNull()
      })

      it('should return null if password is missing', async () => {
        const result = await authorize({ username: 'testuser' })
        expect(result).toBeNull()
      })

      it('should return null if user is not found', async () => {
        prisma.user.findUnique.mockResolvedValue(null)

        const result = await authorize({
          username: 'nonexistent',
          password: 'password123'
        })

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
          where: { username: 'nonexistent' }
        })
        expect(result).toBeNull()
      })

      it('should return null if user is inactive', async () => {
        const inactiveUser = {
          id: 'user-1',
          username: 'testuser',
          email: 'test@example.com',
          name: 'Test User',
          role: 'STAFF',
          password: 'hashedpassword',
          isActive: false
        }

        prisma.user.findUnique.mockResolvedValue(inactiveUser)

        const result = await authorize({
          username: 'testuser',
          password: 'password123'
        })

        expect(result).toBeNull()
      })

      it('should return null if password does not match', async () => {
        const activeUser = {
          id: 'user-1',
          username: 'testuser',
          email: 'test@example.com',
          name: 'Test User',
          role: 'STAFF',
          password: 'hashedpassword',
          isActive: true
        }

        prisma.user.findUnique.mockResolvedValue(activeUser)
        mockedBcrypt.compare.mockResolvedValue(false)

        const result = await authorize({
          username: 'testuser',
          password: 'wrongpassword'
        })

        expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword')
        expect(result).toBeNull()
      })

      it('should return user data if authentication succeeds', async () => {
        const activeUser = {
          id: 'user-1',
          username: 'testuser',
          email: 'test@example.com',
          name: 'Test User',
          role: 'STAFF',
          password: 'hashedpassword',
          isActive: true
        }

        prisma.user.findUnique.mockResolvedValue(activeUser)
        mockedBcrypt.compare.mockResolvedValue(true)

        const result = await authorize({
          username: 'testuser',
          password: 'correctpassword'
        })

        expect(bcrypt.compare).toHaveBeenCalledWith('correctpassword', 'hashedpassword')
        expect(result).toEqual({
          id: 'user-1',
          username: 'testuser',
          email: 'test@example.com',
          name: 'Test User',
          role: 'STAFF'
        })
      })

      it('should handle database errors gracefully', async () => {
        prisma.user.findUnique.mockRejectedValue(new Error('Database error'))

        await expect(authorize({
          username: 'testuser',
          password: 'password123'
        })).rejects.toThrow('Database error')
      })

      it('should handle bcrypt errors gracefully', async () => {
        const activeUser = {
          id: 'user-1',
          username: 'testuser',
          email: 'test@example.com',
          name: 'Test User',
          role: 'STAFF',
          password: 'hashedpassword',
          isActive: true
        }

        prisma.user.findUnique.mockResolvedValue(activeUser)
        mockedBcrypt.compare.mockRejectedValue(new Error('Bcrypt error'))

        await expect(authorize({
          username: 'testuser',
          password: 'password123'
        })).rejects.toThrow('Bcrypt error')
      })
    })
  })

  describe('Session Configuration', () => {
    it('should use JWT strategy', () => {
      expect(authOptions.session?.strategy).toBe('jwt')
    })
  })

  describe('Callbacks', () => {
    describe('JWT callback', () => {
      const jwtCallback = authOptions.callbacks?.jwt

      it('should add user role and username to token', async () => {
        const token = { sub: 'user-1' }
        const user = {
          id: 'user-1',
          role: 'ADMIN',
          username: 'admin'
        }

        const result = await jwtCallback({ token, user })

        expect(result).toEqual({
          sub: 'user-1',
          role: 'ADMIN',
          username: 'admin'
        })
      })

      it('should return token unchanged if no user', async () => {
        const token = { sub: 'user-1', role: 'STAFF' }

        const result = await jwtCallback({ token })

        expect(result).toEqual(token)
      })
    })

    describe('Session callback', () => {
      const sessionCallback = authOptions.callbacks?.session

      it('should add token data to session', async () => {
        const session = {
          user: {
            name: 'Test User',
            email: 'test@example.com'
          }
        }
        const token = {
          sub: 'user-1',
          role: 'ADMIN',
          username: 'admin'
        }

        const result = await sessionCallback({ session, token })

        expect(result.user.id).toBe('user-1')
        expect(result.user.role).toBe('ADMIN')
        expect(result.user.username).toBe('admin')
      })

      it('should return session unchanged if no token', async () => {
        const session = {
          user: {
            name: 'Test User',
            email: 'test@example.com'
          }
        }

        const result = await sessionCallback({ session, token: null })

        expect(result).toEqual(session)
      })
    })
  })

  describe('Pages Configuration', () => {
    it('should have correct sign in page', () => {
      expect(authOptions.pages?.signIn).toBe('/auth/signin')
    })
  })
})

// Additional security tests
describe('Auth Security', () => {
  describe('Password Security', () => {
    it('should handle empty password correctly', async () => {
      const credentialsProvider = authOptions.providers[0]
      const result = await credentialsProvider.authorize({
        username: 'testuser',
        password: ''
      })
      expect(result).toBeNull()
    })

    it('should handle whitespace-only password correctly', async () => {
      const credentialsProvider = authOptions.providers[0]
      const result = await credentialsProvider.authorize({
        username: 'testuser',
        password: '   '
      })
      expect(result).toBeNull()
    })
  })

  describe('Username Security', () => {
    it('should handle SQL injection attempts in username', async () => {
      const credentialsProvider = authOptions.providers[0]
      prisma.user.findUnique.mockResolvedValue(null)

      const result = await credentialsProvider.authorize({
        username: "admin'; DROP TABLE users; --",
        password: 'password123'
      })

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: "admin'; DROP TABLE users; --" }
      })
      expect(result).toBeNull()
    })

    it('should handle very long username gracefully', async () => {
      const credentialsProvider = authOptions.providers[0]
      const longUsername = 'a'.repeat(1000)
      
      prisma.user.findUnique.mockResolvedValue(null)

      const result = await credentialsProvider.authorize({
        username: longUsername,
        password: 'password123'
      })

      expect(result).toBeNull()
    })
  })

  describe('Role-based Access', () => {
    it('should preserve user role in authentication flow', async () => {
      const credentialsProvider = authOptions.providers[0]
      const adminUser = {
        id: 'admin-1',
        username: 'admin',
        email: 'admin@example.com',
        name: 'Administrator',
        role: 'ADMIN',
        password: 'hashedpassword',
        isActive: true
      }

      prisma.user.findUnique.mockResolvedValue(adminUser)
      mockedBcrypt.compare.mockResolvedValue(true)

      const result = await credentialsProvider.authorize({
        username: 'admin',
        password: 'adminpassword'
      })

      expect(result?.role).toBe('ADMIN')
    })
  })
})