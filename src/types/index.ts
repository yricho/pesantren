import { Role, TransactionType } from '@prisma/client'

export interface User {
  id: string
  username: string
  email: string
  name: string
  role: Role
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Transaction {
  id: string
  type: TransactionType
  category: string
  amount: number
  description: string
  date: Date
  createdBy: string
  createdAt: Date
  updatedAt: Date
  creator?: User
}

export interface Activity {
  id: string
  title: string
  description: string
  type: string
  date: Date
  location?: string
  photos: string[]
  status: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
  creator?: User
}

export interface Course {
  id: string
  name: string
  description: string
  level: string
  schedule: string
  teacher: string
  duration: string
  capacity: number
  enrolled: number
  status: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
  creator?: User
}

export interface Video {
  id: string
  title: string
  description: string
  url: string
  thumbnail?: string
  duration?: string
  category: string
  teacher: string
  uploadDate: Date
  views: number
  isPublic: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
  creator?: User
}

export interface DashboardStats {
  totalStudents: number
  totalIncome: number
  totalExpenses: number
  totalDonations: number
  upcomingActivities: number
  activeCourses: number
  totalVideos: number
  recentTransactions: Transaction[]
  recentActivities: Activity[]
}

export interface OfflineData {
  lastSync: string
  pendingChanges: any[]
  cachedData: {
    transactions: Transaction[]
    activities: Activity[]
    courses: Course[]
    videos: Video[]
  }
}