import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@ponimsy-blitar.id',
      password: hashedPassword,
      name: 'Administrator',
      role: 'ADMIN',
      isActive: true
    }
  })

  // Create staff user
  const staffPassword = await bcrypt.hash('staff123', 12)
  
  const staffUser = await prisma.user.upsert({
    where: { username: 'staff' },
    update: {},
    create: {
      username: 'staff',
      email: 'staff@ponimsy-blitar.id',
      password: staffPassword,
      name: 'Staff Pondok',
      role: 'STAFF',
      isActive: true
    }
  })

  // Sample transactions
  const sampleTransactions = [
    {
      type: 'INCOME' as const,
      category: 'SPP',
      amount: 2500000,
      description: 'Pembayaran SPP bulan Maret 2024',
      date: new Date('2024-03-01'),
      createdBy: adminUser.id
    },
    {
      type: 'DONATION' as const,
      category: 'Infaq',
      amount: 5000000,
      description: 'Donasi dari alumni untuk renovasi masjid',
      date: new Date('2024-03-05'),
      createdBy: adminUser.id
    },
    {
      type: 'EXPENSE' as const,
      category: 'Operasional',
      amount: 500000,
      description: 'Pembelian alat tulis dan perlengkapan kelas',
      date: new Date('2024-03-08'),
      createdBy: staffUser.id
    },
    {
      type: 'EXPENSE' as const,
      category: 'Maintenance',
      amount: 1200000,
      description: 'Perbaikan AC ruang kelas dan sound system masjid',
      date: new Date('2024-03-10'),
      createdBy: staffUser.id
    }
  ]

  for (const transaction of sampleTransactions) {
    await prisma.transaction.create({
      data: transaction
    })
  }

  // Sample activities
  const sampleActivities = [
    {
      title: 'Kajian Rutin Mingguan',
      description: 'Kajian rutin setiap hari Jumat dengan tema Fiqih Muamalah dan Akhlaq Islami',
      type: 'kajian',
      date: new Date('2024-03-22'),
      location: 'Masjid Pondok Imam Syafi\'i',
      photos: '[]',
      status: 'planned',
      createdBy: adminUser.id
    },
    {
      title: 'Pelatihan Komputer dan Internet Sehat',
      description: 'Pelatihan komputer dasar dan edukasi penggunaan internet yang sehat untuk santri',
      type: 'pelatihan',
      date: new Date('2024-03-20'),
      location: 'Lab Komputer Pondok',
      photos: '[]',
      status: 'completed',
      createdBy: staffUser.id
    },
    {
      title: 'Bakti Sosial ke Desa Sekitar',
      description: 'Kegiatan bakti sosial membersihkan lingkungan dan berbagi dengan masyarakat',
      type: 'sosial',
      date: new Date('2024-03-18'),
      location: 'Desa Sumberejo, Blitar',
      photos: '[]',
      status: 'completed',
      createdBy: adminUser.id
    }
  ]

  for (const activity of sampleActivities) {
    await prisma.activity.create({
      data: activity
    })
  }

  // Sample courses
  const sampleCourses = [
    {
      name: 'Tahfidz Al-Quran Tingkat Dasar',
      description: 'Program menghafal Al-Quran untuk tingkat pemula dengan target hafalan 5 juz dalam 6 bulan',
      level: 'beginner',
      schedule: 'Senin-Kamis, 07:00-09:00',
      teacher: 'Ustadz Ahmad Fauzi, S.Pd.I',
      duration: '6 bulan',
      capacity: 20,
      enrolled: 18,
      status: 'active',
      createdBy: adminUser.id
    },
    {
      name: 'Fiqih Muamalah dan Ekonomi Islam',
      description: 'Pembelajaran mendalam tentang hukum Islam dalam bermuamalah dan sistem ekonomi Islam',
      level: 'intermediate',
      schedule: 'Selasa-Jumat, 13:00-15:00',
      teacher: 'Ustadz Muhammad Yusuf, M.A',
      duration: '4 bulan',
      capacity: 25,
      enrolled: 22,
      status: 'active',
      createdBy: adminUser.id
    },
    {
      name: 'Bahasa Arab Praktis',
      description: 'Pembelajaran bahasa Arab dengan fokus pada percakapan sehari-hari dan pemahaman teks keislaman',
      level: 'beginner',
      schedule: 'Senin-Rabu, 15:30-17:00',
      teacher: 'Ustadzah Fatimah Az-Zahra, Lc',
      duration: '8 bulan',
      capacity: 15,
      enrolled: 12,
      status: 'active',
      createdBy: staffUser.id
    }
  ]

  for (const course of sampleCourses) {
    await prisma.course.create({
      data: course
    })
  }

  // Sample videos
  const sampleVideos = [
    {
      title: 'Adab Bermuamalah dalam Islam',
      description: 'Kajian mendalam tentang etika dan adab dalam bermuamalah sesuai dengan ajaran Islam yang benar',
      url: 'https://www.youtube.com/watch?v=example1',
      duration: '45:32',
      category: 'Fiqih',
      teacher: 'Ustadz Muhammad Yusuf, M.A',
      uploadDate: new Date('2024-03-15'),
      views: 245,
      isPublic: true,
      createdBy: adminUser.id
    },
    {
      title: 'Tahfidz Al-Quran: Tips dan Teknik Menghafal',
      description: 'Metode efektif untuk menghafal Al-Quran dengan mudah dan lancar sesuai sunnah Rasulullah',
      url: 'https://www.youtube.com/watch?v=example2',
      duration: '32:15',
      category: 'Tahfidz',
      teacher: 'Ustadz Hafiz Rahman, S.Pd',
      uploadDate: new Date('2024-03-12'),
      views: 189,
      isPublic: true,
      createdBy: staffUser.id
    },
    {
      title: 'Sejarah Peradaban Islam dan Pelajaran Hidup',
      description: 'Perjalanan sejarah peradaban Islam dari masa Rasulullah hingga masa modern dan hikmah yang dapat diambil',
      url: 'https://www.youtube.com/watch?v=example3',
      duration: '58:47',
      category: 'Sejarah',
      teacher: 'Ustadz Dr. Abdullah Mansur',
      uploadDate: new Date('2024-03-10'),
      views: 156,
      isPublic: true,
      createdBy: adminUser.id
    }
  ]

  for (const video of sampleVideos) {
    await prisma.video.create({
      data: video
    })
  }

  // Sample settings
  const settings = [
    { key: 'pondok_name', value: 'Pondok Imam Syafi\'i Blitar' },
    { key: 'pondok_address', value: 'Jl. Raya Pendidikan No. 123, Blitar, Jawa Timur 66137' },
    { key: 'pondok_phone', value: '(0342) 123-456' },
    { key: 'pondok_email', value: 'info@ponimsy-blitar.id' },
    { key: 'pondok_website', value: 'https://ponimsy-blitar.id' },
    { key: 'current_academic_year', value: '2024/2025' },
    { key: 'registration_open', value: 'true' }
  ]

  for (const setting of settings) {
    await prisma.setting.create({
      data: setting
    })
  }

  console.log('✅ Database seeding completed!')
  console.log('👤 Admin user created: admin / admin123')
  console.log('👥 Staff user created: staff / staff123')
  console.log('📊 Sample data created successfully')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })