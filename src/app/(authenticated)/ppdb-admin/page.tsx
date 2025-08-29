'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { StatsCard } from '@/components/ui/stats-card'
import { BarChart3, CheckCircle, CreditCard, GraduationCap, FileText, Clock, XCircle, Baby, BookOpen, Home } from 'lucide-react'

interface Registration {
  id: string
  registrationNo: string
  fullName: string
  level: string
  status: string
  paymentStatus: string
  testResult?: string
  createdAt: string
  updatedAt: string
  phoneNumber: string
  email?: string
  birthDate: string
  address: string
}

interface RegistrationStats {
  total: number
  byStatus: Record<string, number>
  byLevel: Record<string, number>
  byPaymentStatus: Record<string, number>
}

interface RegistrationResponse {
  success: boolean
  data: Registration[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface StatsResponse {
  success: boolean
  data: RegistrationStats
}

export default function PPDBAdminPage() {
  const { data: session } = useSession()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [stats, setStats] = useState<RegistrationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [exporting, setExporting] = useState(false)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [levelFilter, setLevelFilter] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  // Check admin access
  useEffect(() => {
    if (session && session.user.role !== 'ADMIN') {
      window.location.href = '/dashboard'
    }
  }, [session])

  // Load data
  useEffect(() => {
    loadData()
  }, [page, statusFilter, levelFilter, paymentFilter])

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== '') {
        handleSearch()
      } else if (searchTerm === '') {
        loadData()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load registrations and stats in parallel
      const [registrationsRes, statsRes] = await Promise.all([
        fetch(`/api/ppdb/admin/registrations?page=${page}&limit=20&status=${statusFilter}&level=${levelFilter}&paymentStatus=${paymentFilter}`),
        fetch('/api/ppdb/admin/stats')
      ])
      
      const registrationsData: RegistrationResponse = await registrationsRes.json()
      const statsData: StatsResponse = await statsRes.json()
      
      if (registrationsData.success) {
        setRegistrations(registrationsData.data)
        setPagination(registrationsData.pagination)
      }
      
      if (statsData.success) {
        setStats(statsData.data)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadData()
      return
    }

    try {
      setSearching(true)
      const response = await fetch(`/api/ppdb/admin/registrations?search=${encodeURIComponent(searchTerm)}&page=1&limit=20`)
      const data: RegistrationResponse = await response.json()
      
      if (data.success) {
        setRegistrations(data.data)
        setPagination(data.pagination)
        setPage(1)
      }
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setSearching(false)
    }
  }

  const handleExport = async () => {
    try {
      setExporting(true)
      const response = await fetch('/api/ppdb/admin/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: statusFilter,
          level: levelFilter,
          paymentStatus: paymentFilter
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `ppdb-registrations-${format(new Date(), 'yyyy-MM-dd')}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        console.error('Export failed')
      }
    } catch (error) {
      console.error('Error exporting:', error)
    } finally {
      setExporting(false)
    }
  }

  const handleQuickAction = async (id: string, action: 'verify' | 'reject' | 'schedule-test') => {
    try {
      let endpoint = ''
      let body: any = { registrationId: id }

      switch (action) {
        case 'verify':
          endpoint = '/api/ppdb/admin/verify'
          body.action = 'VERIFY'
          break
        case 'reject':
          endpoint = '/api/ppdb/admin/verify'
          body.action = 'REJECT'
          body.reason = 'Dokumen tidak lengkap' // Could be made dynamic
          break
        case 'schedule-test':
          endpoint = '/api/ppdb/admin/test-schedule'
          body.testSchedule = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
          body.testVenue = 'Ruang Aula Utama'
          break
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const result = await response.json()
      
      if (result.success) {
        loadData() // Refresh data
      } else {
        console.error('Quick action failed:', result.error)
      }
    } catch (error) {
      console.error('Error performing quick action:', error)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'secondary'
      case 'SUBMITTED': return 'warning'
      case 'DOCUMENT_CHECK': return 'info'
      case 'VERIFIED': return 'success'
      case 'TEST_SCHEDULED': return 'info'
      case 'TEST_TAKEN': return 'warning'
      case 'PASSED': return 'success'
      case 'FAILED': return 'danger'
      case 'REGISTERED': return 'success'
      default: return 'secondary'
    }
  }

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'UNPAID': return 'danger'
      case 'PAID': return 'warning'
      case 'VERIFIED': return 'success'
      default: return 'secondary'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Akses Ditolak</h1>
          <p className="text-gray-600 mb-4">Anda tidak memiliki akses ke halaman admin PPDB.</p>
          <Link href="/dashboard" className="text-primary-600 hover:text-primary-500">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin PPDB</h1>
            <p className="text-gray-600">Kelola pendaftaran peserta didik baru</p>
          </div>
          <Button
            onClick={handleExport}
            disabled={exporting}
            className="bg-green-600 hover:bg-green-700"
          >
            {exporting ? 'Mengekspor...' : 'Export Excel'}
          </Button>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Total Pendaftaran"
              value={stats.total}
              icon={BarChart3}
              className="bg-blue-50 border-blue-200"
            />
            <StatsCard
              title="Sudah Verifikasi"
              value={stats.byStatus.VERIFIED || 0}
              icon={CheckCircle}
              className="bg-green-50 border-green-200"
            />
            <StatsCard
              title="Menunggu Pembayaran"
              value={stats.byPaymentStatus.UNPAID || 0}
              icon={CreditCard}
              className="bg-yellow-50 border-yellow-200"
            />
            <StatsCard
              title="Lulus Tes"
              value={stats.byStatus.PASSED || 0}
              icon={GraduationCap}
              className="bg-purple-50 border-purple-200"
            />
          </div>
        )}

        {/* Level Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatsCard
              title="Pendaftar TK"
              value={stats.byLevel.TK || 0}
              icon={Baby}
              className="bg-pink-50 border-pink-200"
            />
            <StatsCard
              title="Pendaftar SD"
              value={stats.byLevel.SD || 0}
              icon={BookOpen}
              className="bg-orange-50 border-orange-200"
            />
            <StatsCard
              title="Pendaftar Pondok"
              value={stats.byLevel.PONDOK || 0}
              icon={Home}
              className="bg-teal-50 border-teal-200"
            />
          </div>
        )}
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cari
            </label>
            <Input
              type="text"
              placeholder="Nama, no. pendaftaran..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Semua Status</option>
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="DOCUMENT_CHECK">Cek Dokumen</option>
              <option value="VERIFIED">Terverifikasi</option>
              <option value="TEST_SCHEDULED">Jadwal Tes</option>
              <option value="TEST_TAKEN">Sudah Tes</option>
              <option value="PASSED">Lulus</option>
              <option value="FAILED">Tidak Lulus</option>
              <option value="REGISTERED">Terdaftar</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jenjang
            </label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Semua Jenjang</option>
              <option value="TK">TK</option>
              <option value="SD">SD</option>
              <option value="PONDOK">Pondok</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pembayaran
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Semua Status</option>
              <option value="UNPAID">Belum Bayar</option>
              <option value="PAID">Sudah Bayar</option>
              <option value="VERIFIED">Terverifikasi</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('')
                setLevelFilter('')
                setPaymentFilter('')
                setPage(1)
                loadData()
              }}
              variant="outline"
              className="w-full"
            >
              Reset Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Registrations Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Daftar Pendaftaran ({pagination.total} total)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pendaftar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenjang
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pembayaran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Daftar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {registrations.map((registration) => (
                <tr key={registration.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">
                        {registration.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {registration.registrationNo}
                      </div>
                      <div className="text-xs text-gray-400">
                        {registration.phoneNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="outline">
                      {registration.level}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusBadgeVariant(registration.status)}>
                      {registration.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getPaymentStatusBadgeVariant(registration.paymentStatus)}>
                      {registration.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(registration.createdAt), 'dd MMM yyyy', { locale: id })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        href={`/ppdb-admin/${registration.id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Detail
                      </Link>
                      
                      {registration.status === 'SUBMITTED' && (
                        <>
                          <button
                            onClick={() => handleQuickAction(registration.id, 'verify')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Verifikasi
                          </button>
                          <button
                            onClick={() => handleQuickAction(registration.id, 'reject')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Tolak
                          </button>
                        </>
                      )}
                      
                      {registration.status === 'VERIFIED' && (
                        <button
                          onClick={() => handleQuickAction(registration.id, 'schedule-test')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Jadwal Tes
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Halaman {pagination.page} dari {pagination.totalPages}
                ({pagination.total} total)
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  variant="outline"
                  size="sm"
                >
                  Sebelumnya
                </Button>
                <Button
                  onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                  disabled={page === pagination.totalPages}
                  variant="outline"
                  size="sm"
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {registrations.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Tidak ada data pendaftaran ditemukan.</p>
        </div>
      )}
    </div>
  )
}