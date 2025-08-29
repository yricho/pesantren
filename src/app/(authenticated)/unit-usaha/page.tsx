'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { StatsCard } from '@/components/ui/stats-card'
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  Users,
  Calendar,
  Receipt
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface DashboardStats {
  todaySales: {
    count: number
    revenue: number
  }
  monthlySales: {
    count: number
    revenue: number
  }
  totalProducts: number
  lowStockCount: number
  totalSuppliers: number
  pendingOrders: number
}

export default function UnitUsahaDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real implementation, you would fetch this from your API
    // For now, we'll use mock data
    const mockStats: DashboardStats = {
      todaySales: {
        count: 42,
        revenue: 2500000
      },
      monthlySales: {
        count: 1250,
        revenue: 85000000
      },
      totalProducts: 156,
      lowStockCount: 8,
      totalSuppliers: 15,
      pendingOrders: 3
    }
    
    setTimeout(() => {
      setStats(mockStats)
      setIsLoading(false)
    }, 1000)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Unit Usaha Dashboard</h1>
        <p className="text-gray-600">Ringkasan aktivitas bisnis dan kinerja penjualan</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Link href="/unit-usaha/pos">
          <Button className="w-full h-16 text-lg" size="lg">
            <Receipt className="w-6 h-6 mr-2" />
            Buka POS
          </Button>
        </Link>
        <Link href="/unit-usaha/products">
          <Button variant="outline" className="w-full h-16 text-lg" size="lg">
            <Package className="w-6 h-6 mr-2" />
            Kelola Produk
          </Button>
        </Link>
        <Link href="/unit-usaha/inventory">
          <Button variant="outline" className="w-full h-16 text-lg" size="lg">
            <AlertTriangle className="w-6 h-6 mr-2" />
            Cek Stok
          </Button>
        </Link>
        <Link href="/unit-usaha/reports">
          <Button variant="outline" className="w-full h-16 text-lg" size="lg">
            <TrendingUp className="w-6 h-6 mr-2" />
            Lihat Laporan
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Penjualan Hari Ini"
          value={formatCurrency(stats?.todaySales.revenue || 0)}
          subtitle={`${stats?.todaySales.count || 0} transaksi`}
          icon={<DollarSign className="w-6 h-6" />}
          trend={{ value: 12, isPositive: true }}
          color="green"
        />
        <StatsCard
          title="Penjualan Bulan Ini"
          value={formatCurrency(stats?.monthlySales.revenue || 0)}
          subtitle={`${stats?.monthlySales.count || 0} transaksi`}
          icon={<Calendar className="w-6 h-6" />}
          trend={{ value: 8, isPositive: true }}
          color="blue"
        />
        <StatsCard
          title="Total Produk"
          value={stats?.totalProducts.toString() || '0'}
          subtitle={`${stats?.lowStockCount || 0} stok menipis`}
          icon={<Package className="w-6 h-6" />}
          color="purple"
        />
        <StatsCard
          title="Supplier Aktif"
          value={stats?.totalSuppliers.toString() || '0'}
          subtitle={`${stats?.pendingOrders || 0} order pending`}
          icon={<Users className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Peringatan Stok Rendah</h3>
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          {stats?.lowStockCount ? (
            <div>
              <p className="text-gray-600 mb-4">
                Ada {stats.lowStockCount} produk yang stoknya di bawah batas minimum
              </p>
              <Link href="/unit-usaha/inventory?lowStock=true">
                <Button size="sm" variant="outline">
                  Lihat Detail
                </Button>
              </Link>
            </div>
          ) : (
            <p className="text-gray-600">Semua produk memiliki stok yang cukup</p>
          )}
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h3>
            <ShoppingCart className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Penjualan terakhir</span>
              <span className="font-medium">2 menit lalu</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Stok masuk</span>
              <span className="font-medium">1 jam lalu</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Produk baru ditambah</span>
              <span className="font-medium">3 jam lalu</span>
            </div>
            <Link href="/unit-usaha/reports">
              <Button size="sm" variant="outline" className="w-full mt-4">
                Lihat Semua
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}