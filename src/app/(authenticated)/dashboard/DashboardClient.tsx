'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyDollarIcon,
  UsersIcon,
  AcademicCapIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BookOpenIcon,
  VideoCameraIcon,
  DocumentCheckIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import CountUp from 'react-countup';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface DashboardStats {
  students: {
    total: number;
    active: number;
    newThisMonth: number;
    growth: string;
  };
  teachers: {
    total: number;
  };
  finance: {
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlyProfit: number;
    monthlyDonations: number;
    totalOutstanding: number;
    incomeGrowth: string;
  };
  academic: {
    totalClasses: number;
    totalSubjects: number;
    totalActivities: number;
    monthlyActivities: number;
  };
  hafalan: {
    monthlySessions: number;
  };
  businessUnits: {
    total: number;
    monthlyRevenue: number;
    monthlyExpenses: number;
    monthlyProfit: number;
    units: Array<{
      name: string;
      code: string;
      reportCount: number;
    }>;
  };
  ppdb: {
    totalRegistrations: number;
  };
  spp: {
    monthlyBills: number;
    collectionRate: string;
    totalBilled: number;
    totalCollected: number;
  };
  library: {
    totalEbooks: number;
    totalVideos: number;
  };
}

export default function DashboardClient() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const jenisPondok = process.env.NEXT_PUBLIC_JENIS
  const nmPondok = process.env.NEXT_PUBLIC_PONDOK

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/dashboard/stats');
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard statistics');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Gagal memuat data dashboard. Silakan refresh halaman.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-16 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: 'Total Santri',
      value: stats.students.total,
      change: `${stats.students.growth}%`,
      trend: parseFloat(stats.students.growth) >= 0 ? 'up' : 'down',
      icon: UsersIcon,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      description: `${stats.students.active} santri aktif`,
    },
    {
      title: 'Pendapatan Bulanan',
      value: stats.finance.monthlyIncome,
      change: `${stats.finance.incomeGrowth}%`,
      trend: parseFloat(stats.finance.incomeGrowth) >= 0 ? 'up' : 'down',
      icon: CurrencyDollarIcon,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      isCurrency: true,
      description: `Profit: ${formatCurrency(stats.finance.monthlyProfit)}`,
    },
    {
      title: 'SPP Collection',
      value: stats.spp.totalCollected,
      change: `${stats.spp.collectionRate}%`,
      trend: parseFloat(stats.spp.collectionRate) >= 70 ? 'up' : 'down',
      icon: BanknotesIcon,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      isCurrency: true,
      description: `${stats.spp.collectionRate}% collected`,
    },
    {
      title: 'Unit Usaha',
      value: stats.businessUnits.monthlyRevenue,
      change: stats.businessUnits.monthlyProfit >= 0 ? '+' : '-',
      trend: stats.businessUnits.monthlyProfit >= 0 ? 'up' : 'down',
      icon: BuildingStorefrontIcon,
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-50',
      isCurrency: true,
      description: `${stats.businessUnits.total} unit aktif`,
    },
    {
      title: 'Total Ustadz',
      value: stats.teachers.total,
      icon: AcademicCapIcon,
      color: 'from-indigo-400 to-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Pengajar aktif',
    },
    {
      title: 'Kegiatan',
      value: stats.academic.totalActivities,
      change: `+${stats.academic.monthlyActivities}`,
      trend: 'up',
      icon: ChartBarIcon,
      color: 'from-cyan-400 to-cyan-600',
      bgColor: 'bg-cyan-50',
      description: 'Bulan ini',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Selamat datang di Sistem Manajemen {jenisPondok} {nmPondok}
        </p>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
          
          return (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-16 -mt-16`} />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                      <Icon className={`w-5 h-5 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {stat.isCurrency ? (
                          formatCurrency(stat.value)
                        ) : (
                          <CountUp end={stat.value} duration={2} separator="," />
                        )}
                      </div>
                      {stat.description && (
                        <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                      )}
                    </div>
                    {stat.change && (
                      <div className={`flex items-center text-xs ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendIcon className="w-3 h-3 mr-1" />
                        {stat.change}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Keuangan Bulanan</CardTitle>
            <CardDescription>Overview keuangan bulan ini</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pemasukan</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(stats.finance.monthlyIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pengeluaran</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(stats.finance.monthlyExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm font-medium">Net Profit</span>
              <span className={`font-bold ${
                stats.finance.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(stats.finance.monthlyProfit)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Donasi</span>
              <span className="font-semibold text-blue-600">
                {formatCurrency(stats.finance.monthlyDonations)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Outstanding</span>
              <span className="font-semibold text-orange-600">
                {formatCurrency(stats.finance.totalOutstanding)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Business Units Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Unit Usaha</CardTitle>
            <CardDescription>Performa unit usaha bulan ini</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.businessUnits.units.map((unit) => (
              <div key={unit.code} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{unit.name}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {unit.reportCount} laporan
                </span>
              </div>
            ))}
            <div className="pt-2 border-t space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(stats.businessUnits.monthlyRevenue)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Profit</span>
                <span className={`font-semibold ${
                  stats.businessUnits.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(stats.businessUnits.monthlyProfit)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Akademik</CardTitle>
            <CardDescription>Statistik pendidikan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Kelas</span>
              <span className="font-semibold">{stats.academic.totalClasses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Mata Pelajaran</span>
              <span className="font-semibold">{stats.academic.totalSubjects}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Hafalan Bulan Ini</span>
              <span className="font-semibold">{stats.hafalan.monthlySessions} sesi</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm text-gray-600">SPP Collection Rate</span>
              <span className={`font-semibold ${
                parseFloat(stats.spp.collectionRate) >= 70 ? 'text-green-600' : 'text-orange-600'
              }`}>
                {stats.spp.collectionRate}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Tagihan SPP</span>
              <span className="font-semibold">{stats.spp.monthlyBills} bills</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}