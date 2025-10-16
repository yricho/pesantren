'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/ui/stats-card';
import Link from 'next/link';
import {
  BookOpen,
  Users,
  Calendar,
  BarChart3,
  FileText,
  Clock,
  TrendingUp,
  Award,
  UserCheck,
  GraduationCap,
  ChevronRight,
} from 'lucide-react';

interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  totalSubjects: number;
  totalTeachers: number;
  attendanceToday: number;
  upcomingExams: number;
  pendingGrades: number;
  reportCardsGenerated: number;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  icon: any;
}

export default function AcademicDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalClasses: 0,
    totalSubjects: 0,
    totalTeachers: 0,
    attendanceToday: 0,
    upcomingExams: 0,
    pendingGrades: 0,
    reportCardsGenerated: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
       // Fetch basic stats (placeholder - you would implement these endpoints)
       const [studentsRes, classesRes, subjectsRes] = await Promise.all([
         fetch('/api/students?count=true'),
         fetch('/api/academic/classes?count=true'),
         fetch('/api/academic/subjects?count=true'),
       ]);

       console.log("Total Student Fetch: ", studentsRes);
       console.log("Total Class Fetch: ", classesRes);
       console.log("Total Subject Fetch: ", subjectsRes);


      // For now, using mock data
      setStats({
        totalStudents: 425,
        totalClasses: 18,
        totalSubjects: 25,
        totalTeachers: 32,
        attendanceToday: 89,
        upcomingExams: 5,
        pendingGrades: 12,
        reportCardsGenerated: 385,
      });

      setRecentActivities([
        {
          id: '1',
          type: 'grade',
          title: 'Nilai UTS Matematika',
          description: 'Nilai UTS Matematika kelas VII-A telah diinput',
          time: '2 jam yang lalu',
          icon: BarChart3,
        },
        {
          id: '2',
          type: 'attendance',
          title: 'Absensi Harian',
          description: 'Absensi hari ini untuk semua kelas telah selesai',
          time: '4 jam yang lalu',
          icon: UserCheck,
        },
        {
          id: '3',
          type: 'exam',
          title: 'Jadwal Ujian Baru',
          description: 'UAS Semester 1 telah dijadwalkan untuk semua mata pelajaran',
          time: '1 hari yang lalu',
          icon: Calendar,
        },
        {
          id: '4',
          type: 'report',
          title: 'Raport Semester 1',
          description: 'Raport semester 1 kelas IX telah siap dicetak',
          time: '2 hari yang lalu',
          icon: FileText,
        },
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Input Nilai',
      description: 'Input nilai siswa per mata pelajaran',
      href: '/akademik/grades',
      icon: BarChart3,
      color: 'bg-blue-500',
    },
    {
      title: 'Absensi Harian',
      description: 'Catat kehadiran siswa hari ini',
      href: '/akademik/attendance',
      icon: UserCheck,
      color: 'bg-green-500',
    },
    {
      title: 'Jadwal Pelajaran',
      description: 'Kelola jadwal mata pelajaran',
      href: '/akademik/schedules',
      icon: Calendar,
      color: 'bg-purple-500',
    },
    {
      title: 'Generate Raport',
      description: 'Buat dan cetak raport siswa',
      href: '/akademik/report-cards',
      icon: FileText,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Akademik</h1>
        <p className="text-gray-600 mt-2">
          Kelola data akademik, nilai, absensi, dan raport siswa
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Siswa"
          value={stats.totalStudents}
          icon={Users}
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatsCard
          title="Total Kelas"
          value={stats.totalClasses}
          icon={BookOpen}
        />
        <StatsCard
          title="Mata Pelajaran"
          value={stats.totalSubjects}
          icon={GraduationCap}
        />
        <StatsCard
          title="Kehadiran Hari Ini"
          value={`${stats.attendanceToday}%`}
          icon={UserCheck}
          trend={{ value: 2.1, isPositive: true }}
        />
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer group">
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Performance Overview */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Ringkasan Akademik</h2>
            <Link href="/akademik/analytics">
              <Button variant="outline" size="sm">
                Lihat Detail
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Ujian Mendatang</p>
                  <p className="text-sm text-gray-600">{stats.upcomingExams} ujian dalam 7 hari</p>
                </div>
              </div>
              <Button size="sm">Lihat</Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Nilai Pending</p>
                  <p className="text-sm text-gray-600">{stats.pendingGrades} nilai belum diinput</p>
                </div>
              </div>
              <Button size="sm">Input</Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Raport Siap</p>
                  <p className="text-sm text-gray-600">{stats.reportCardsGenerated} raport telah dibuat</p>
                </div>
              </div>
              <Button size="sm">Cetak</Button>
            </div>
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Aktivitas Terbaru</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <activity.icon className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full">
              Lihat Semua Aktivitas
            </Button>
          </div>
        </Card>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/akademik/classes">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Kelola Kelas</h3>
                <p className="text-sm text-gray-600">Atur kelas dan siswa</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalClasses}</p>
            <p className="text-sm text-gray-600">kelas aktif</p>
          </Card>
        </Link>

        <Link href="/akademik/subjects">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Mata Pelajaran</h3>
                <p className="text-sm text-gray-600">Kelola kurikulum</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalSubjects}</p>
            <p className="text-sm text-gray-600">mata pelajaran</p>
          </Card>
        </Link>

        <Link href="/akademik/exams">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Ujian</h3>
                <p className="text-sm text-gray-600">Jadwal dan hasil ujian</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.upcomingExams}</p>
            <p className="text-sm text-gray-600">ujian mendatang</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}