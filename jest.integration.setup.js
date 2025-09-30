// Integration test setup
require('dotenv').config({ path: '.env.test' })

// Mock environment variables for integration tests
process.env.NEXTAUTH_SECRET = 'integration-test-secret'
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.DATABASE_URL = 'file:./test-integration.db'

// Setup test database
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Global setup for integration tests
beforeAll(async () => {
  // Ensure database is ready for tests
  try {
    await prisma.$connect()
    console.log('Connected to test database')
  } catch (error) {
    console.error('Failed to connect to test database:', error)
  }
})

afterAll(async () => {
  // Cleanup after all tests
  await prisma.$disconnect()
  console.log('Disconnected from test database')
})

beforeEach(async () => {
  // Clean up data before each test
  const tablenames = await prisma.$queryRaw`
    SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';
  `
  
  for (const { name } of tablenames) {
    if (name !== '_prisma_migrations') {
      try {
        await prisma.$executeRawUnsafe(`DELETE FROM "${name}";`)
      } catch (error) {
        console.warn(`Failed to clear table ${name}:`, error.message)
      }
    }
  }
})

// Test data factories
global.testData = {
  users: {
    admin: {
      username: 'admin',
      email: 'admin@test.com',
      password: 'hashedpassword',
      name: 'Test Admin',
      role: 'ADMIN'
    },
    staff: {
      username: 'staff',
      email: 'staff@test.com', 
      password: 'hashedpassword',
      name: 'Test Staff',
      role: 'STAFF'
    }
  },
  transactions: {
    income: {
      type: 'INCOME',
      category: 'Donation',
      amount: 1000000,
      description: 'Monthly donation',
      date: new Date()
    },
    expense: {
      type: 'EXPENSE', 
      category: 'Utilities',
      amount: 500000,
      description: 'Electricity bill',
      date: new Date()
    }
  },
  activities: {
    upcoming: {
      title: 'Weekly Study',
      description: 'Regular study session',
      type: 'education',
      date: new Date(Date.now() + 86400000), // tomorrow
      location: 'Main Hall',
      photos: [],
      status: 'planned'
    },
    ongoing: {
      title: 'Community Service',
      description: 'Help local community',
      type: 'service',
      date: new Date(),
      location: 'Community Center',
      photos: [],
      status: 'ongoing'
    }
  },
  courses: {
    active: {
      name: 'Basic Arabic',
      description: 'Learn Arabic fundamentals',
      level: 'beginner',
      schedule: 'Monday, Wednesday, Friday 09:00-10:00',
      teacher: 'Ustadz Ahmad',
      duration: '3 months',
      capacity: 20,
      enrolled: 15,
      status: 'active'
    }
  },
  videos: {
    public: {
      title: 'Introduction to Islam',
      description: 'Basic introduction video',
      url: 'https://example.com/video1.mp4',
      thumbnail: 'https://example.com/thumb1.jpg',
      duration: '15:30',
      category: 'education',
      teacher: 'Ustadz Ibrahim',
      uploadDate: new Date(),
      views: 0,
      isPublic: true
    }
  }
}

// Helper function to create test user
global.createTestUser = async (userData = global.testData.users.admin) => {
  return await prisma.user.create({ data: userData })
}

// Helper function to create test transaction
global.createTestTransaction = async (transactionData, userId) => {
  return await prisma.transaction.create({
    data: {
      ...transactionData,
      createdBy: userId
    }
  })
}

// Export prisma instance for tests
global.testPrisma = prisma