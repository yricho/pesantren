import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./test-e2e.db'
    }
  }
})

export async function seedTestData() {
  console.log('🌱 Seeding E2E test data...')

  try {
    // Clean existing data
    await prisma.video.deleteMany()
    await prisma.course.deleteMany()
    await prisma.activity.deleteMany()
    await prisma.transaction.deleteMany()
    await prisma.financialCategory.deleteMany()
    await prisma.financialAccount.deleteMany()
    await prisma.user.deleteMany()

    // Create test users
    const hashedAdminPassword = await bcrypt.hash('admin123', 12)
    const hashedStaffPassword = await bcrypt.hash('staff123', 12)

    const adminUser = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@pondok-test.com',
        password: hashedAdminPassword,
        name: 'Test Administrator',
        role: 'ADMIN',
        isActive: true,
      },
    })

    const staffUser = await prisma.user.create({
      data: {
        username: 'staff',
        email: 'staff@pondok-test.com', 
        password: hashedStaffPassword,
        name: 'Test Staff Member',
        role: 'STAFF',
        isActive: true,
      },
    })

    // Create financial accounts
    const incomeAccount = await prisma.financialAccount.create({
      data: {
        code: '4001',
        name: 'Donation Income',
        type: 'INCOME',
        subtype: 'DONATION',
        isActive: true,
        balance: 0,
        description: 'Income from donations'
      }
    })

    const expenseAccount = await prisma.financialAccount.create({
      data: {
        code: '5001',
        name: 'General Expenses',
        type: 'EXPENSE',
        subtype: 'OPERATIONAL',
        isActive: true,
        balance: 0,
        description: 'General operational expenses'
      }
    })

    // Create financial categories
    const donationCategory = await prisma.financialCategory.create({
      data: {
        name: 'Donation',
        type: 'INCOME',
        code: 'DON001',
        accountId: incomeAccount.id,
        color: '#22C55E',
        icon: 'heart',
        isActive: true,
        description: 'Community donations'
      }
    })

    const utilitiesCategory = await prisma.financialCategory.create({
      data: {
        name: 'Utilities',
        type: 'EXPENSE',
        code: 'EXP001',
        accountId: expenseAccount.id,
        color: '#EF4444',
        icon: 'bolt',
        isActive: true,
        description: 'Utilities expenses'
      }
    })

    const zakatCategory = await prisma.financialCategory.create({
      data: {
        name: 'Zakat',
        type: 'DONATION',
        code: 'ZAK001',
        accountId: incomeAccount.id,
        color: '#10B981',
        icon: 'currency-dollar',
        isActive: true,
        description: 'Zakat donations'
      }
    })

    const foodCategory = await prisma.financialCategory.create({
      data: {
        name: 'Food',
        type: 'EXPENSE',
        code: 'EXP002',
        accountId: expenseAccount.id,
        color: '#F59E0B',
        icon: 'shopping-bag',
        isActive: true,
        description: 'Food and supplies'
      }
    })

    // Create test transactions
    const transactions = [
      {
        transactionNo: 'TRX-2024-001',
        type: 'INCOME',
        categoryId: donationCategory.id,
        amount: 5000000,
        description: 'Monthly community donation',
        date: new Date('2024-01-15'),
        status: 'POSTED',
        createdBy: adminUser.id,
      },
      {
        transactionNo: 'TRX-2024-002',
        type: 'EXPENSE',
        categoryId: utilitiesCategory.id,
        amount: 1500000,
        description: 'Electricity and water bills',
        date: new Date('2024-01-10'),
        status: 'POSTED',
        createdBy: staffUser.id,
      },
      {
        transactionNo: 'TRX-2024-003',
        type: 'DONATION',
        categoryId: zakatCategory.id,
        amount: 2000000,
        description: 'Zakat from local community',
        date: new Date('2024-01-20'),
        status: 'POSTED',
        createdBy: adminUser.id,
      },
      {
        transactionNo: 'TRX-2024-004',
        type: 'EXPENSE',
        categoryId: foodCategory.id,
        amount: 3000000,
        description: 'Monthly food supplies',
        date: new Date('2024-01-25'),
        status: 'POSTED',
        createdBy: staffUser.id,
      },
    ]

    await prisma.transaction.createMany({ data: transactions })

    // Create test activities
    const activities = [
      {
        title: 'Weekly Quran Study',
        description: 'Regular Quran study and discussion session',
        type: 'education',
        date: new Date(Date.now() + 86400000), // Tomorrow
        location: 'Main Hall',
        photos: JSON.stringify(['https://example.com/photo1.jpg']),
        status: 'planned',
        createdBy: adminUser.id,
      },
      {
        title: 'Community Service',
        description: 'Help local community with various needs',
        type: 'service',
        date: new Date(),
        location: 'Community Center',
        photos: '[]',
        status: 'ongoing',
        createdBy: staffUser.id,
      },
      {
        title: 'Islamic History Seminar',
        description: 'Learning about Islamic civilization history',
        type: 'seminar',
        date: new Date(Date.now() - 86400000), // Yesterday
        location: 'Conference Room',
        photos: JSON.stringify(['https://example.com/photo2.jpg', 'https://example.com/photo3.jpg']),
        status: 'completed',
        createdBy: adminUser.id,
      },
    ]

    await prisma.activity.createMany({ data: activities })

    // Create test courses
    const courses = [
      {
        name: 'Basic Arabic Language',
        description: 'Learn fundamental Arabic language skills for reading Quran',
        level: 'beginner',
        schedule: 'Monday, Wednesday, Friday 09:00-10:00',
        teacher: 'Ustadz Ahmad Rahman',
        duration: '3 months',
        capacity: 20,
        enrolled: 15,
        status: 'active',
        createdBy: adminUser.id,
      },
      {
        name: 'Advanced Fiqh Studies',
        description: 'Deep dive into Islamic jurisprudence and legal principles',
        level: 'advanced',
        schedule: 'Tuesday, Thursday 14:00-16:00',
        teacher: 'Ustadz Muhammad Hakim',
        duration: '6 months',
        capacity: 15,
        enrolled: 12,
        status: 'active',
        createdBy: adminUser.id,
      },
      {
        name: 'Quran Memorization',
        description: 'Structured program for Quran memorization (Tahfidz)',
        level: 'intermediate',
        schedule: 'Daily 05:00-07:00',
        teacher: 'Ustadz Ibrahim Yusuf',
        duration: '2 years',
        capacity: 25,
        enrolled: 18,
        status: 'active',
        createdBy: staffUser.id,
      },
    ]

    await prisma.course.createMany({ data: courses })

    // Create test videos
    const videos = [
      {
        title: 'Introduction to Islam',
        description: 'Basic introduction to Islamic faith and principles',
        url: 'https://example.com/videos/intro-islam.mp4',
        thumbnail: 'https://example.com/thumbs/intro-islam.jpg',
        duration: '25:30',
        category: 'Islamic Studies',
        teacher: 'Ustadz Ahmad Rahman',
        uploadDate: new Date('2024-01-01'),
        views: 150,
        isPublic: true,
        createdBy: adminUser.id,
      },
      {
        title: 'Arabic Alphabet Basics',
        description: 'Learn to read and write Arabic letters',
        url: 'https://example.com/videos/arabic-alphabet.mp4',
        thumbnail: 'https://example.com/thumbs/arabic-alphabet.jpg',
        duration: '18:45',
        category: 'Arabic Language',
        teacher: 'Ustadz Muhammad Hakim',
        uploadDate: new Date('2024-01-05'),
        views: 89,
        isPublic: true,
        createdBy: adminUser.id,
      },
      {
        title: 'Advanced Tajweed Rules',
        description: 'Master the rules of Quranic pronunciation',
        url: 'https://example.com/videos/tajweed-advanced.mp4',
        thumbnail: 'https://example.com/thumbs/tajweed.jpg',
        duration: '45:20',
        category: 'Quran Studies',
        teacher: 'Ustadz Ibrahim Yusuf',
        uploadDate: new Date('2024-01-10'),
        views: 67,
        isPublic: false,
        createdBy: staffUser.id,
      },
    ]

    await prisma.video.createMany({ data: videos })

    console.log('✅ E2E test data seeded successfully')
    console.log(`👤 Admin user: admin / admin123`)
    console.log(`👤 Staff user: staff / staff123`)
    console.log(`💰 ${transactions.length} transactions created`)
    console.log(`📅 ${activities.length} activities created`)
    console.log(`📚 ${courses.length} courses created`)
    console.log(`🎥 ${videos.length} videos created`)

  } catch (error) {
    console.error('❌ Error seeding test data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Allow running this script directly
if (require.main === module) {
  seedTestData()
    .then(() => {
      console.log('✅ Test data seeding completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Test data seeding failed:', error)
      process.exit(1)
    })
}