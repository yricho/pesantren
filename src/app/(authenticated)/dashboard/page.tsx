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
  Legend
} from 'recharts';
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

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Sample data for charts
  const revenueData = [
    { month: 'Jan', pendapatan: 45000000, pengeluaran: 32000000 },
    { month: 'Feb', pendapatan: 52000000, pengeluaran: 35000000 },
    { month: 'Mar', pendapatan: 48000000, pengeluaran: 30000000 },
    { month: 'Apr', pendapatan: 61000000, pengeluaran: 38000000 },
    { month: 'Mei', pendapatan: 55000000, pengeluaran: 33000000 },
    { month: 'Jun', pendapatan: 67000000, pengeluaran: 40000000 },
  ];

  const studentData = [
    { name: 'TK', value: 45, color: '#10B981' },
    { name: 'SD', value: 120, color: '#3B82F6' },
    { name: 'Pondok', value: 185, color: '#8B5CF6' },
  ];

  const activityData = [
    { day: 'Sen', kegiatan: 8 },
    { day: 'Sel', kegiatan: 12 },
    { day: 'Rab', kegiatan: 15 },
    { day: 'Kam', kegiatan: 10 },
    { day: 'Jum', kegiatan: 18 },
    { day: 'Sab', kegiatan: 6 },
    { day: 'Min', kegiatan: 4 },
  ];

  const stats = [
    {
      title: 'Total Santri',
      value: 350,
      change: '+12%',
      trend: 'up',
      icon: UsersIcon,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Pendapatan Bulan Ini',
      value: 67000000,
      change: '+22%',
      trend: 'up',
      icon: CurrencyDollarIcon,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      prefix: 'Rp ',
    },
    {
      title: 'Kegiatan Bulan Ini',
      value: 24,
      change: '+8%',
      trend: 'up',
      icon: CalendarIcon,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Video Kajian',
      value: 156,
      change: '+15%',
      trend: 'up',
      icon: VideoCameraIcon,
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

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
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard <span className="text-green-600">Overview</span>
            </h1>
            <p className="text-gray-600 mt-1">Selamat datang kembali, Admin!</p>
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-colors"
            >
              Download Report
            </motion.button>
          </div>
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Grafik Keuangan</h2>
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
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
              <Area 
                type="monotone" 
                dataKey="pendapatan" 
                stroke="#10B981" 
                fillOpacity={1} 
                fill="url(#colorPendapatan)" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="pengeluaran" 
                stroke="#EF4444" 
                fillOpacity={1} 
                fill="url(#colorPengeluaran)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Student Distribution */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Distribusi Siswa</h2>
          
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={studentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {studentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            {studentData.map((item, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{item.value}</p>
                <p className="text-xs text-gray-500">Siswa</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

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