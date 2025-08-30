'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyDollarIcon,
  UsersIcon,
  AcademicCapIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  UserGroupIcon,
  VideoCameraIcon,
  BookOpenIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  TrophyIcon,
  CreditCardIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import {
  StarIcon,
  SparklesIcon,
} from '@heroicons/react/24/solid';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  ComposedChart,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import CountUp from 'react-countup';
import type { DashboardAnalytics } from '@/lib/dashboard-analytics';

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

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get stats from analytics or use defaults
  const getStats = () => {
    if (!analytics) {
      return [
        {
          title: 'Total Santri',
          value: 350,
          change: '+12%',
          trend: 'up' as const,
          icon: UsersIcon,
          color: 'from-blue-400 to-blue-600',
          bgColor: 'bg-blue-50',
        },
        {
          title: 'Pendapatan Bulan Ini',
          value: 67000000,
          change: '+22%',
          trend: 'up' as const,
          icon: CurrencyDollarIcon,
          color: 'from-green-400 to-green-600',
          bgColor: 'bg-green-50',
          prefix: 'Rp ',
        },
        {
          title: 'Kegiatan Bulan Ini',
          value: 24,
          change: '+8%',
          trend: 'up' as const,
          icon: CalendarIcon,
          color: 'from-purple-400 to-purple-600',
          bgColor: 'bg-purple-50',
        },
        {
          title: 'Pengajar Aktif',
          value: 156,
          change: '+15%',
          trend: 'up' as const,
          icon: UserGroupIcon,
          color: 'from-orange-400 to-orange-600',
          bgColor: 'bg-orange-50',
        },
      ];
    }

    return [
      {
        title: 'Total Santri',
        value: analytics.overview.totalStudents,
        change: `${analytics.overview.studentGrowth >= 0 ? '+' : ''}${analytics.overview.studentGrowth.toFixed(1)}%`,
        trend: analytics.overview.studentGrowth >= 0 ? 'up' as const : 'down' as const,
        icon: UsersIcon,
        color: 'from-blue-400 to-blue-600',
        bgColor: 'bg-blue-50',
      },
      {
        title: 'Pendapatan Bulan Ini',
        value: analytics.overview.totalRevenue,
        change: `${analytics.overview.revenueGrowth >= 0 ? '+' : ''}${analytics.overview.revenueGrowth.toFixed(1)}%`,
        trend: analytics.overview.revenueGrowth >= 0 ? 'up' as const : 'down' as const,
        icon: CurrencyDollarIcon,
        color: 'from-green-400 to-green-600',
        bgColor: 'bg-green-50',
        prefix: 'Rp ',
      },
      {
        title: 'Kegiatan Bulan Ini',
        value: analytics.overview.totalActivities,
        change: '+8%',
        trend: 'up' as const,
        icon: CalendarIcon,
        color: 'from-purple-400 to-purple-600',
        bgColor: 'bg-purple-50',
      },
      {
        title: 'Pengajar Aktif',
        value: analytics.overview.totalTeachers,
        change: '+5%',
        trend: 'up' as const,
        icon: UserGroupIcon,
        color: 'from-orange-400 to-orange-600',
        bgColor: 'bg-orange-50',
      },
    ];
  };

  const stats = getStats();


  const recentActivities = [
    {
      title: 'Kajian Bulanan',
      date: '2024-03-22',
      status: 'completed',
      type: 'kajian',
    },
    {
      title: 'Wisuda Tahfidz',
      date: '2024-03-20',
      status: 'completed',
      type: 'event',
    },
    {
      title: 'Pembayaran SPP',
      date: '2024-03-19',
      status: 'pending',
      type: 'finance',
    },
    {
      title: 'Pelatihan Guru',
      date: '2024-03-18',
      status: 'in-progress',
      type: 'training',
    },
  ];

  const upcomingEvents = [
    {
      title: 'Maulid Nabi Muhammad SAW',
      date: '2024-04-08',
      time: '08:00',
      location: 'Masjid Baiturrahman',
    },
    {
      title: 'Wisuda Santri',
      date: '2024-04-15',
      time: '09:00',
      location: 'Aula Pondok',
    },
    {
      title: 'Kajian Kitab Kuning',
      date: '2024-03-25',
      time: '19:30',
      location: 'Ruang Kajian',
    },
  ];

  // Activity data for weekly chart
  const activityData = [
    { day: 'Sen', kegiatan: 8 },
    { day: 'Sel', kegiatan: 12 },
    { day: 'Rab', kegiatan: 6 },
    { day: 'Kam', kegiatan: 15 },
    { day: 'Jum', kegiatan: 10 },
    { day: 'Sab', kegiatan: 14 },
    { day: 'Min', kegiatan: 4 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 p-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard <span className="text-green-600">Analytics</span>
            </h1>
            <p className="text-gray-600 mt-1">Selamat datang kembali! Berikut ringkasan aktivitas sistem.</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="outline-none text-sm font-medium text-gray-700"
              >
                <option value="day">Hari Ini</option>
                <option value="week">Minggu Ini</option>
                <option value="month">Bulan Ini</option>
                <option value="year">Tahun Ini</option>
              </select>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchAnalytics}
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <ArrowTrendingUpIcon className="w-4 h-4" />
              Refresh Data
            </motion.button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-6">
          {[
            { key: 'overview', label: 'Overview', icon: ChartBarIcon },
            { key: 'academic', label: 'Akademik', icon: AcademicCapIcon },
            { key: 'financial', label: 'Keuangan', icon: CurrencyDollarIcon },
            { key: 'hafalan', label: 'Hafalan', icon: BookOpenIcon },
            { key: 'teachers', label: 'Pengajar', icon: UserGroupIcon },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === tab.key
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-16 -mt-16`} />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="w-3 h-3" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-3 h-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">
                {stat.prefix}
                <CountUp end={stat.value} duration={2} separator="," />
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dynamic Content Based on Selected Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-8">
          {/* Revenue and Enrollment Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Financial Overview */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Trend Keuangan</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-sm text-gray-600">Pendapatan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="text-sm text-gray-600">Pengeluaran</span>
                  </div>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={analytics?.financialOverview || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, '']}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px' 
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    fill="#10B981" 
                    stroke="#10B981" 
                    fillOpacity={0.3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    fill="#EF4444" 
                    stroke="#EF4444" 
                    fillOpacity={0.3}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Enrollment Trends */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Trend Pendaftaran</h2>
              
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics?.enrollmentTrends || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px' 
                    }}
                  />
                  <Legend />
                  <Bar dataKey="newEnrollments" fill="#10B981" name="Pendaftaran Baru" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="graduations" fill="#EF4444" name="Kelulusan" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="netGrowth" fill="#3B82F6" name="Pertumbuhan Bersih" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      )}

      {selectedTab === 'academic' && analytics && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Academic Performance by Level */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Performa Akademik per Jenjang</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.academicPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="level" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="averageGrade" fill="#10B981" name="Nilai Rata-rata" />
                  <Bar dataKey="passingRate" fill="#3B82F6" name="Tingkat Kelulusan %" />
                  <Bar dataKey="attendanceRate" fill="#F59E0B" name="Tingkat Kehadiran %" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Partisipasi Kegiatan</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.activityParticipation}
                    dataKey="participationRate"
                    nameKey="activityType"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {analytics.activityParticipation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {selectedTab === 'financial' && analytics && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Payment Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik Pembayaran</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tepat Waktu</span>
                  <span className="text-green-600 font-semibold">{analytics.paymentAnalytics.onTimeRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Terlambat</span>
                  <span className="text-red-600 font-semibold">{analytics.paymentAnalytics.latePaymentRate.toFixed(1)}%</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Terkumpul</span>
                    <span className="text-blue-600 font-semibold">
                      Rp {analytics.paymentAnalytics.totalCollection.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">Tunggakan</span>
                    <span className="text-orange-600 font-semibold">
                      Rp {analytics.paymentAnalytics.outstandingAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Metode Pembayaran</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analytics.paymentAnalytics.paymentMethods}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="method" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {selectedTab === 'hafalan' && analytics && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Hafalan Progress by Level */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Progress Hafalan per Jenjang</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.hafalanProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="level" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="averageProgress" fill="#10B981" name="Progress Rata-rata %" />
                  <Bar dataKey="completedSurahs" fill="#3B82F6" name="Total Surah Selesai" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Top Performers</h2>
              <div className="space-y-4">
                {analytics.hafalanProgress[0]?.topPerformers?.slice(0, 5).map((performer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{performer.name}</p>
                        <p className="text-sm text-gray-600">{performer.surahs} Surah</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">{performer.progress.toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {selectedTab === 'teachers' && analytics && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Teacher Workload */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Distribusi Beban Kerja Pengajar</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Nama Pengajar</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Jumlah Kelas</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Jumlah Siswa</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Mata Pelajaran</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Skor Beban</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.teacherWorkload.slice(0, 10).map((teacher, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">{teacher.teacherName}</td>
                      <td className="py-3 px-4 text-gray-600">{teacher.totalClasses}</td>
                      <td className="py-3 px-4 text-gray-600">{teacher.totalStudents}</td>
                      <td className="py-3 px-4 text-gray-600">
                        <div className="flex flex-wrap gap-1">
                          {teacher.subjects.slice(0, 2).map((subject, i) => (
                            <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {subject}
                            </span>
                          ))}
                          {teacher.subjects.length > 2 && (
                            <span className="text-gray-500 text-xs">+{teacher.subjects.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${Math.min(teacher.workloadScore / 100 * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{teacher.workloadScore}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Activity & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Aktivitas Terkini</h2>
            <ClockIcon className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activity.status === 'completed' ? 'bg-green-100' :
                  activity.status === 'pending' ? 'bg-yellow-100' : 'bg-blue-100'
                }`}>
                  {activity.status === 'completed' ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  ) : activity.status === 'pending' ? (
                    <ClockIcon className="w-5 h-5 text-yellow-600" />
                  ) : (
                    <ExclamationCircleIcon className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.date}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                  activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {activity.status === 'completed' ? 'Selesai' :
                   activity.status === 'pending' ? 'Menunggu' : 'Proses'}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Activities Chart */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Kegiatan Mingguan</h2>
          
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px' 
                }}
              />
              <Bar dataKey="kegiatan" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Agenda Mendatang</h2>
            <CalendarIcon className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 5 }}
                className="border-l-4 border-green-500 pl-4 py-2"
              >
                <h3 className="font-medium text-gray-900">{event.title}</h3>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    {event.date}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    {event.time}
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-1">{event.location}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        variants={fadeInUp}
        className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Quick Actions</h2>
            <p className="text-green-100">Akses cepat ke fitur-fitur penting</p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
            >
              Tambah Santri
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
            >
              Input Keuangan
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
            >
              Buat Kegiatan
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}