// Define enums as string unions since we removed them from schema
export type Role = 'ADMIN' | 'STAFF'
export type TransactionType = 'INCOME' | 'EXPENSE' | 'DONATION'

// Payment related types
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'REFUNDED'
export type PaymentMethod = 'TRANSFER' | 'CASH' | 'VA' | 'EWALLET' | 'QRIS'
export type RegistrationStatus = 'DRAFT' | 'SUBMITTED' | 'DOCUMENT_CHECK' | 'VERIFIED' | 'TEST_SCHEDULED' | 'TEST_TAKEN' | 'PASSED' | 'FAILED' | 'REGISTERED'
export type PaymentStatusType = 'UNPAID' | 'PAID' | 'VERIFIED'

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

// Financial Management Types
export type FinancialAccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE'
export type TransactionStatus = 'DRAFT' | 'POSTED' | 'CANCELLED' | 'REVERSED'
export type BudgetType = 'MONTHLY' | 'QUARTERLY' | 'ANNUAL'
export type BudgetStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED'
export type ReportType = 'INCOME_STATEMENT' | 'BALANCE_SHEET' | 'CASH_FLOW' | 'BUDGET_VARIANCE'
export type ReportPeriod = 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'CUSTOM'
export type ReportStatus = 'DRAFT' | 'GENERATED' | 'EXPORTED'
export type JournalStatus = 'DRAFT' | 'POSTED' | 'REVERSED'

export interface FinancialAccount {
  id: string
  code: string
  name: string
  type: FinancialAccountType
  subtype?: string
  parentId?: string
  isActive: boolean
  balance: number
  description?: string
  createdAt: Date
  updatedAt: Date
  parent?: FinancialAccount
  children?: FinancialAccount[]
  categories?: FinancialCategory[]
}

export interface FinancialCategory {
  id: string
  name: string
  type: TransactionType
  code?: string
  accountId: string
  color?: string
  icon?: string
  isActive: boolean
  description?: string
  parentId?: string
  createdAt: Date
  updatedAt: Date
  account?: FinancialAccount
  parent?: FinancialCategory
  children?: FinancialCategory[]
  transactions?: Transaction[]
  budgetItems?: BudgetItem[]
  _count?: {
    transactions: number
    budgetItems: number
    children?: number
  }
}

export interface Transaction {
  id: string
  transactionNo: string
  type: TransactionType
  categoryId: string
  amount: number
  description: string
  reference?: string
  date: Date
  dueDate?: Date
  status: TransactionStatus
  tags: string[]
  attachments: string[]
  notes?: string
  createdBy: string
  approvedBy?: string
  approvedAt?: Date
  createdAt: Date
  updatedAt: Date
  category?: FinancialCategory
  creator?: User
  journalEntry?: JournalEntry
}

export interface JournalEntry {
  id: string
  entryNo: string
  transactionId?: string
  description: string
  date: Date
  reference?: string
  status: JournalStatus
  totalDebit: number
  totalCredit: number
  isBalanced: boolean
  createdBy: string
  approvedBy?: string
  approvedAt?: Date
  reversedBy?: string
  reversedAt?: Date
  createdAt: Date
  updatedAt: Date
  transaction?: Transaction
  creator?: User
  entries?: JournalEntryLine[]
}

export interface JournalEntryLine {
  id: string
  journalId: string
  accountId: string
  debitAmount: number
  creditAmount: number
  description?: string
  lineOrder: number
  createdAt: Date
  journal?: JournalEntry
  account?: FinancialAccount
}

export interface Budget {
  id: string
  name: string
  type: BudgetType
  startDate: Date
  endDate: Date
  totalBudget: number
  status: BudgetStatus
  description?: string
  createdBy: string
  approvedBy?: string
  approvedAt?: Date
  createdAt: Date
  updatedAt: Date
  creator?: User
  items?: BudgetItem[]
  reports?: FinancialReport[]
  _count?: {
    items: number
    reports: number
  }
}

export interface BudgetItem {
  id: string
  budgetId: string
  categoryId: string
  budgetAmount: number
  actualAmount: number
  variance: number
  percentage: number
  notes?: string
  createdAt: Date
  updatedAt: Date
  budget?: Budget
  category?: FinancialCategory
}

export interface FinancialReport {
  id: string
  name: string
  type: ReportType
  period: ReportPeriod
  startDate: Date
  endDate: Date
  budgetId?: string
  data: any
  fileUrl?: string
  status: ReportStatus
  createdBy: string
  createdAt: Date
  updatedAt: Date
  creator?: User
  budget?: Budget
}

export interface AuditTrail {
  id: string
  tableName: string
  recordId: string
  action: string
  oldValues?: any
  newValues?: any
  userId: string
  ipAddress?: string
  userAgent?: string
  timestamp: Date
  user?: User
}

// Dashboard and Summary Types
export interface FinancialSummary {
  totalIncome: number
  totalExpenses: number
  totalDonations: number
  netIncome: number
  cashBalance: number
  monthlyIncome: number[]
  monthlyExpenses: number[]
  categoryBreakdown: {
    category: string
    amount: number
    percentage: number
  }[]
}

export interface BudgetSummary {
  totalBudget: number
  totalActual: number
  variance: number
  variancePercentage: number
  itemsOverBudget: number
  itemsUnderBudget: number
}

export interface ReportData {
  type: ReportType
  period?: {
    startDate: Date
    endDate: Date
  }
  asOfDate?: Date
  summary: any
  details?: any
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

// PPDB and Payment related interfaces
export interface Registration {
  id: string
  registrationNo: string
  fullName: string
  nickname?: string
  gender: string
  birthPlace: string
  birthDate: Date
  nik?: string
  nisn?: string
  address: string
  rt?: string
  rw?: string
  village: string
  district: string
  city: string
  province: string
  postalCode?: string
  level: string
  previousSchool?: string
  gradeTarget?: string
  programType?: string
  boardingType?: string
  fatherName: string
  fatherNik?: string
  fatherJob?: string
  fatherPhone?: string
  fatherEducation?: string
  fatherIncome?: string
  motherName: string
  motherNik?: string
  motherJob?: string
  motherPhone?: string
  motherEducation?: string
  motherIncome?: string
  guardianName?: string
  guardianRelation?: string
  guardianPhone?: string
  guardianAddress?: string
  phoneNumber: string
  whatsapp: string
  email?: string
  bloodType?: string
  height?: number
  weight?: number
  specialNeeds?: string
  medicalHistory?: string
  status: RegistrationStatus
  paymentStatus: PaymentStatusType
  documents: string
  testSchedule?: Date
  testVenue?: string
  testScore?: string
  testResult?: string
  ranking?: number
  registrationFee: number
  paymentMethod?: string
  paymentDate?: Date
  paymentProof?: string
  reregStatus?: string
  reregDate?: Date
  reregPayment?: string
  notes?: string
  verifiedBy?: string
  verifiedAt?: Date
  rejectionReason?: string
  createdAt: Date
  updatedAt: Date
  submittedAt?: Date
  payments?: Payment[]
  student?: Student
}

export interface Payment {
  id: string
  paymentNo: string
  registrationId?: string
  registration?: Registration
  studentId?: string
  student?: Student
  amount: number
  paymentType: string
  description?: string
  method: PaymentMethod
  channel?: string
  status: PaymentStatus
  proofUrl?: string
  verifiedBy?: string
  verifiedAt?: Date
  externalId?: string
  vaNumber?: string
  expiredAt?: Date
  paidAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Student {
  id: string
  nisn?: string
  nis: string
  fullName: string
  nickname?: string
  birthPlace: string
  birthDate: Date
  gender: string
  bloodType?: string
  religion: string
  nationality: string
  address: string
  village?: string
  district?: string
  city: string
  province: string
  postalCode?: string
  phone?: string
  email?: string
  fatherName: string
  fatherJob?: string
  fatherPhone?: string
  fatherEducation?: string
  motherName: string
  motherJob?: string
  motherPhone?: string
  motherEducation?: string
  guardianName?: string
  guardianJob?: string
  guardianPhone?: string
  guardianRelation?: string
  institutionType: string
  grade?: string
  enrollmentDate: Date
  enrollmentYear: string
  previousSchool?: string
  specialNeeds?: string
  achievements: string
  notes?: string
  photo?: string
  documents: string
  status: string
  isActive: boolean
  graduationDate?: Date
  createdBy: string
  createdAt: Date
  updatedAt: Date
  creator?: User
  registrationId?: string
  registration?: Registration
  payments?: Payment[]
}

// ==========================================
// DONATION SYSTEM TYPES
// ==========================================

export type DonationStatus = 'PENDING' | 'PAID' | 'VERIFIED' | 'FAILED'
export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'
export type ZakatType = 'FITRAH' | 'MAL' | 'EMAS' | 'PERAK' | 'PERDAGANGAN'

export interface DonationCategory {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
  campaigns?: DonationCampaign[]
  donations?: Donation[]
  _count?: {
    campaigns: number
    donations: number
  }
}

export interface DonationCampaign {
  id: string
  title: string
  slug: string
  description: string
  story?: string
  categoryId: string
  targetAmount: number
  currentAmount: number
  startDate: Date
  endDate?: Date
  mainImage?: string
  images: string[]
  video?: string
  status: CampaignStatus
  isFeatured: boolean
  isUrgent: boolean
  allowAnonymous: boolean
  shareCount: number
  createdBy: string
  approvedBy?: string
  approvedAt?: Date
  createdAt: Date
  updatedAt: Date
  category?: DonationCategory
  creator?: User
  donations?: Donation[]
  updates?: CampaignUpdate[]
  _count?: {
    donations: number
    updates: number
  }
}

export interface CampaignUpdate {
  id: string
  campaignId: string
  title: string
  content: string
  images: string[]
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  campaign?: DonationCampaign
}

export interface Donation {
  id: string
  donationNo: string
  campaignId?: string
  categoryId: string
  amount: number
  message?: string
  donorName?: string
  donorEmail?: string
  donorPhone?: string
  isAnonymous: boolean
  paymentMethod?: string
  paymentChannel?: string
  paymentStatus: DonationStatus
  externalId?: string
  vaNumber?: string
  qrisCode?: string
  paymentUrl?: string
  expiredAt?: Date
  paidAt?: Date
  proofUrl?: string
  verifiedBy?: string
  verifiedAt?: Date
  certificateNo?: string
  certificateUrl?: string
  source: string
  ipAddress?: string
  userAgent?: string
  referrer?: string
  createdAt: Date
  updatedAt: Date
  campaign?: DonationCampaign
  category?: DonationCategory
}

export interface ZakatCalculation {
  id: string
  calculationType: ZakatType
  inputs: any
  zakatAmount: number
  nisabAmount?: number
  donorName?: string
  donorEmail?: string
  donorPhone?: string
  donationId?: string
  createdAt: Date
}

export interface DonorProfile {
  id: string
  email: string
  name: string
  phone?: string
  preferredCategories: string[]
  allowMarketing: boolean
  allowNewsletter: boolean
  totalDonated: number
  donationCount: number
  lastDonationAt?: Date
  isVerified: boolean
  verificationToken?: string
  verifiedAt?: Date
  createdAt: Date
  updatedAt: Date
}

// Dashboard summaries
export interface DonationSummary {
  totalDonations: number
  totalAmount: number
  monthlyAmount: number[]
  categoryBreakdown: {
    category: string
    amount: number
    count: number
    percentage: number
  }[]
  campaignStats: {
    active: number
    completed: number
    totalCampaigns: number
  }
  topCampaigns: {
    id: string
    title: string
    currentAmount: number
    targetAmount: number
    percentage: number
    donorCount: number
  }[]
  recentDonations: Donation[]
}

export interface ZakatCalculationInputs {
  fitrah?: {
    personCount: number
    ricePrice: number
  }
  mal?: {
    totalWealth: number
    debt: number
    savings: number
    investments: number
  }
  emas?: {
    goldWeight: number // in grams
    goldPrice: number // per gram
  }
  perak?: {
    silverWeight: number // in grams
    silverPrice: number // per gram
  }
  perdagangan?: {
    inventory: number
    receivables: number
    cash: number
    debt: number
  }
}

export interface ShareData {
  title: string
  text: string
  url: string
  hashtags?: string[]
}

export interface CertificateData {
  donorName: string
  amount: number
  donationNo: string
  campaignTitle?: string
  categoryName: string
  date: string
  certificateNo: string
}

// Form types
export interface DonationFormData {
  campaignId?: string
  categoryId: string
  amount: number
  message?: string
  donorName?: string
  donorEmail?: string
  donorPhone?: string
  isAnonymous: boolean
  paymentMethod: string
  paymentChannel?: string
}

export interface CampaignFormData {
  title: string
  slug: string
  description: string
  story?: string
  categoryId: string
  targetAmount: number
  startDate: Date
  endDate?: Date
  mainImage?: string
  images: string[]
  video?: string
  isFeatured: boolean
  isUrgent: boolean
  allowAnonymous: boolean
}