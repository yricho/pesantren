'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  CreditCard, 
  Bell, 
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import ChildCard from '@/components/parent-portal/child-card';

interface DashboardData {
  overview: {
    totalChildren: number;
    overallAttendance: number;
    overallGradeAverage: number;
    totalPendingPayments: number;
    unreadMessagesCount: number;
    unreadNotificationsCount: number;
  };
  currentSemester: {
    id: string;
    name: string;
    academicYear: string;
    startDate: string;
    endDate: string;
  };
  children: any[];
  recentAnnouncements: any[];
  quickStats: {
    attendanceAlerts: number;
    gradeAlerts: number;
    paymentAlerts: number;
  };
}

export default function ParentDashboard() {
  const { data: session, status } = useSession();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/parent/dashboard');
        
        if (!response.ok) {
          throw new Error('Gagal memuat data dashboard');
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated' && session?.user?.role === 'PARENT') {
      fetchDashboardData();
    }
  }, [session, status]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gagal Memuat Dashboard</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { overview, currentSemester, children, recentAnnouncements, quickStats } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Selamat datang, {session?.user?.name}
        </h1>
        <p className="text-green-100">
          Portal Orang Tua - Pondok Imam Syafi'i
        </p>
        {currentSemester && (
          <div className="mt-4 bg-white/20 rounded-lg p-3 inline-block">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">{currentSemester.name} - {currentSemester.academicYear}</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Jumlah Anak</p>
              <p className="text-2xl font-bold text-gray-900">{overview.totalChildren}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className={`w-8 h-8 ${overview.overallAttendance >= 80 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Kehadiran Rata-rata</p>
              <p className={`text-2xl font-bold ${overview.overallAttendance >= 80 ? 'text-green-600' : 'text-red-600'}`}>
                {overview.overallAttendance}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <GraduationCap className={`w-8 h-8 ${overview.overallGradeAverage >= 75 ? 'text-green-600' : 'text-yellow-600'}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Nilai Rata-rata</p>
              <p className={`text-2xl font-bold ${overview.overallGradeAverage >= 75 ? 'text-green-600' : 'text-yellow-600'}`}>
                {overview.overallGradeAverage.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CreditCard className={`w-8 h-8 ${overview.totalPendingPayments > 0 ? 'text-red-600' : 'text-green-600'}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tagihan Pending</p>
              <p className={`text-2xl font-bold ${overview.totalPendingPayments > 0 ? 'text-red-600' : 'text-green-600'}`}>
                Rp {overview.totalPendingPayments.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {(quickStats.attendanceAlerts > 0 || quickStats.gradeAlerts > 0 || quickStats.paymentAlerts > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="font-semibold text-red-800">Perhatian Diperlukan</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickStats.attendanceAlerts > 0 && (
              <div className="flex items-center text-red-700">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  {quickStats.attendanceAlerts} anak dengan kehadiran < 80%
                </span>
              </div>
            )}
            {quickStats.gradeAlerts > 0 && (
              <div className="flex items-center text-red-700">
                <GraduationCap className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  {quickStats.gradeAlerts} anak dengan nilai < 70
                </span>
              </div>
            )}
            {quickStats.paymentAlerts > 0 && (
              <div className="flex items-center text-red-700">
                <CreditCard className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  {quickStats.paymentAlerts} anak dengan tagihan pending
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Children Overview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Ringkasan Anak</h2>
                <Link
                  href="/parent-portal/children"
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Lihat Semua
                </Link>
              </div>
            </div>
            <div className="p-6">
              {children.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Belum ada data anak</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {children.slice(0, 2).map((child) => (
                    <ChildCard key={child.id} child={child} />
                  ))}
                  {children.length > 2 && (
                    <div className="text-center pt-4">
                      <Link
                        href="/parent-portal/children"
                        className="text-green-600 hover:text-green-700 font-medium"
                      >
                        Lihat {children.length - 2} anak lainnya
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
            <div className="space-y-3">
              <Link
                href="/parent-portal/payments"
                className="flex items-center p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <CreditCard className="w-5 h-5 text-red-600 mr-3" />
                <div>
                  <div className="font-medium text-red-800">Bayar Tagihan</div>
                  <div className="text-sm text-red-600">
                    Rp {overview.totalPendingPayments.toLocaleString('id-ID')} pending
                  </div>
                </div>
              </Link>

              <Link
                href="/parent-portal/messages/new"
                className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <div className="font-medium text-blue-800">Kirim Pesan</div>
                  <div className="text-sm text-blue-600">Hubungi guru/admin</div>
                </div>
              </Link>

              <Link
                href="/parent-portal/announcements"
                className="flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <div className="font-medium text-green-800">Lihat Pengumuman</div>
                  <div className="text-sm text-green-600">Info terbaru sekolah</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Announcements */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Pengumuman Terbaru</h3>
              <Link
                href="/parent-portal/announcements"
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Lihat Semua
              </Link>
            </div>
            
            {recentAnnouncements.length === 0 ? (
              <div className="text-center py-4">
                <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">Belum ada pengumuman</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAnnouncements.slice(0, 3).map((announcement) => (
                  <div key={announcement.id} className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {announcement.title}
                    </h4>
                    {announcement.summary && (
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {announcement.summary}
                      </p>
                    )}
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-white mr-2 ${
                        announcement.priority === 'URGENT' ? 'bg-red-500' :
                        announcement.priority === 'HIGH' ? 'bg-orange-500' :
                        'bg-blue-500'
                      }`}>
                        {announcement.priority}
                      </span>
                      <span>{new Date(announcement.publishDate).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Summary */}
          {(overview.unreadMessagesCount > 0 || overview.unreadNotificationsCount > 0) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Pemberitahuan</h3>
              <div className="space-y-3">
                {overview.unreadMessagesCount > 0 && (
                  <Link
                    href="/parent-portal/messages"
                    className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <MessageSquare className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="font-medium text-blue-800">Pesan Baru</span>
                    </div>
                    <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                      {overview.unreadMessagesCount}
                    </span>
                  </Link>
                )}

                {overview.unreadNotificationsCount > 0 && (
                  <Link
                    href="/parent-portal/notifications"
                    className="flex items-center justify-between p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <Bell className="w-5 h-5 text-yellow-600 mr-3" />
                      <span className="font-medium text-yellow-800">Notifikasi</span>
                    </div>
                    <span className="bg-yellow-600 text-white text-xs rounded-full px-2 py-1">
                      {overview.unreadNotificationsCount}
                    </span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}