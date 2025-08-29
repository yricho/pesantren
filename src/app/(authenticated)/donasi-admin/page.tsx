'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { DonationSummary, DonationCampaign, Donation, DonationCategory } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatsCard } from '@/components/ui/stats-card'
import { 
  Heart,
  DollarSign,
  Users,
  BarChart3,
  Plus,
  Eye,
  Pencil,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Filter,
  Flame
} from 'lucide-react'

interface DonasiAdminPageProps {}

export default function DonasiAdminPage({}: DonasiAdminPageProps) {
  const [summary, setSummary] = useState<DonationSummary | null>(null)
  const [campaigns, setCampaigns] = useState<DonationCampaign[]>([])
  const [donations, setDonations] = useState<Donation[]>([])
  const [categories, setCategories] = useState<DonationCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'donations' | 'reports'>('overview')
  
  // Filters
  const [campaignFilter, setCampaignFilter] = useState<'all' | 'active' | 'completed' | 'draft'>('all')
  const [donationFilter, setDonationFilter] = useState<'all' | 'pending' | 'verified' | 'failed'>('all')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, campaignsRes, donationsRes, categoriesRes] = await Promise.all([
        fetch('/api/donations/reports/summary'),
        fetch('/api/donations/campaigns?limit=50'),
        fetch('/api/donations/list?limit=100'),
        fetch('/api/donations/categories')
      ])

      if (summaryRes.ok) {
        const summaryData = await summaryRes.json()
        setSummary(summaryData)
      }

      if (campaignsRes.ok) {
        const campaignsData = await campaignsRes.json()
        setCampaigns(campaignsData.campaigns || [])
      }

      if (donationsRes.ok) {
        const donationsData = await donationsRes.json()
        setDonations(donationsData.donations || [])
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'verified':
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleVerifyDonation = async (donationId: string) => {
    try {
      const response = await fetch(`/api/donations/${donationId}/verify`, {
        method: 'POST',
      })

      if (response.ok) {
        // Refresh donations
        fetchDashboardData()
        alert('Donasi berhasil diverifikasi')
      } else {
        alert('Gagal memverifikasi donasi')
      }
    } catch (error) {
      console.error('Error verifying donation:', error)
      alert('Terjadi kesalahan sistem')
    }
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    if (campaignFilter === 'all') return true
    if (campaignFilter === 'active') return campaign.status === 'ACTIVE'
    if (campaignFilter === 'completed') return campaign.status === 'COMPLETED'
    if (campaignFilter === 'draft') return campaign.status === 'DRAFT'
    return true
  })

  const filteredDonations = donations.filter(donation => {
    if (donationFilter === 'all') return true
    if (donationFilter === 'pending') return donation.paymentStatus === 'PENDING'
    if (donationFilter === 'verified') return donation.paymentStatus === 'VERIFIED'
    if (donationFilter === 'failed') return donation.paymentStatus === 'FAILED'
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="bg-gray-300 h-8 w-64 mb-4 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-300 h-32 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Donasi</h1>
              <p className="text-gray-600 mt-2">Kelola kampanye dan donasi masuk</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Link href="/donasi-admin/campaigns/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Campaign
                </Button>
              </Link>
              <Link href="/donasi-admin/categories">
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Kelola Kategori
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Donasi"
              value={formatCurrency(summary.totalAmount)}
              icon={Heart}
              trend={{ value: 12, isPositive: true }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white"
            />
            <StatsCard
              title="Jumlah Donatur"
              value={summary.totalDonations.toString()}
              icon={Users}
              trend={{ value: 8, isPositive: true }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white"
            />
            <StatsCard
              title="Campaign Aktif"
              value={summary.campaignStats.active.toString()}
              icon={BarChart3}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white"
            />
            <StatsCard
              title="Campaign Selesai"
              value={summary.campaignStats.completed.toString()}
              icon={CheckCircle}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white"
            />
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'campaigns', label: 'Campaigns', icon: Heart },
              { key: 'donations', label: 'Donasi', icon: DollarSign },
              { key: 'reports', label: 'Laporan', icon: FileText }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === key
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top Campaigns */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Top Campaigns</h2>
                  <Link href="#campaigns">
                    <Button variant="outline" size="sm">Lihat Semua</Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {summary?.topCampaigns.slice(0, 5).map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{campaign.title}</h3>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="text-sm text-gray-600">
                            {formatCurrency(campaign.currentAmount)} / {formatCurrency(campaign.targetAmount)}
                          </span>
                          <span className="text-sm text-gray-600">
                            {campaign.donorCount} donatur
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${campaign.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round(campaign.percentage)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Donations */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Donasi Terbaru</h2>
                  <Link href="#donations">
                    <Button variant="outline" size="sm">Lihat Semua</Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {summary?.recentDonations.slice(0, 10).map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {donation.isAnonymous ? '?' : (donation.donorName?.[0] || '?')}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {donation.isAnonymous ? 'Hamba Allah' : donation.donorName || 'Anonim'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {donation.campaign?.title || donation.category?.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          {formatCurrency(donation.amount)}
                        </div>
                        <Badge className={getStatusColor(donation.paymentStatus)}>
                          {donation.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div>
              {/* Filter */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <select
                    value={campaignFilter}
                    onChange={(e) => setCampaignFilter(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="all">Semua Campaign</option>
                    <option value="active">Aktif</option>
                    <option value="completed">Selesai</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <Link href="/donasi-admin/campaigns/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Campaign Baru
                  </Button>
                </Link>
              </div>

              {/* Campaigns Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns.map((campaign) => (
                  <Card key={campaign.id} className="overflow-hidden">
                    <div className="relative">
                      {campaign.mainImage ? (
                        <Image
                          src={campaign.mainImage}
                          alt={campaign.title}
                          width={400}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <Heart className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="absolute top-3 left-3">
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>

                      {campaign.isUrgent && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-red-500 text-white">
                            <Flame className="w-3 h-3 mr-1" />
                            Mendesak
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{campaign.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>
                      
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {formatCurrency(campaign.currentAmount)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatCurrency(campaign.targetAmount)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${calculateProgress(campaign.currentAmount, campaign.targetAmount)}%` }}
                          ></div>
                        </div>
                        <div className="text-right mt-1">
                          <span className="text-xs text-gray-500">
                            {Math.round(calculateProgress(campaign.currentAmount, campaign.targetAmount))}%
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          <span>{campaign._count?.donations || 0} donatur</span>
                        </div>
                        <div className="flex space-x-2">
                          <Link href={`/donasi/campaign/${campaign.slug}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              Lihat
                            </Button>
                          </Link>
                          <Link href={`/donasi-admin/campaigns/${campaign.id}/edit`}>
                            <Button size="sm">
                              <Pencil className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredCampaigns.length === 0 && (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Campaign</h3>
                  <p className="text-gray-500 mb-6">Buat campaign pertama Anda untuk mulai mengumpulkan donasi.</p>
                  <Link href="/donasi-admin/campaigns/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Buat Campaign
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'donations' && (
            <div>
              {/* Filter */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <select
                    value={donationFilter}
                    onChange={(e) => setDonationFilter(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="all">Semua Donasi</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Terverifikasi</option>
                    <option value="failed">Gagal</option>
                  </select>
                </div>
                <div className="text-sm text-gray-600">
                  Total: {filteredDonations.length} donasi
                </div>
              </div>

              {/* Donations Table */}
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Donatur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Campaign/Kategori
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jumlah
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredDonations.map((donation) => (
                        <tr key={donation.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                {donation.isAnonymous ? '?' : (donation.donorName?.[0] || '?')}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {donation.isAnonymous ? 'Hamba Allah' : donation.donorName || 'Anonim'}
                                </div>
                                {!donation.isAnonymous && donation.donorEmail && (
                                  <div className="text-sm text-gray-500">{donation.donorEmail}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {donation.campaign?.title || donation.category?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {donation.donationNo}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {formatCurrency(donation.amount)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getStatusColor(donation.paymentStatus)}>
                              {donation.paymentStatus}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(donation.createdAt).toLocaleDateString('id-ID')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Link href={`/donasi-admin/donations/${donation.id}`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4 mr-1" />
                                  Detail
                                </Button>
                              </Link>
                              {donation.paymentStatus === 'PENDING' && (
                                <Button 
                                  size="sm"
                                  onClick={() => handleVerifyDonation(donation.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Verifikasi
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredDonations.length === 0 && (
                  <div className="text-center py-12">
                    <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Donasi</h3>
                    <p className="text-gray-500">Donasi akan muncul di sini setelah ada yang berdonasi.</p>
                  </div>
                )}
              </Card>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              {/* Category Breakdown */}
              {summary && (
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Breakdown per Kategori</h2>
                  <div className="space-y-4">
                    {summary.categoryBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{item.category}</span>
                            <span className="text-sm text-gray-600">{item.percentage}%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>{formatCurrency(item.amount)}</span>
                            <span>{item.count} donasi</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Export Options */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Laporan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Export Excel
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}