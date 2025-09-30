'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/ui/loading';
import { StudentCard } from '@/components/hafalan/student-card';
import { 
  Search, Filter, Download, Users, TrendingUp, 
  Book, Star, BarChart3, RefreshCw, Eye 
} from 'lucide-react';

interface Student {
  id: string;
  fullName: string;
  nickname?: string;
  photo?: string;
  grade?: string;
  institutionType: string;
  progress?: {
    totalSurah: number;
    totalAyat: number;
    totalJuz: number;
    juz30Progress: number;
    overallProgress: number;
    level: string;
    currentStreak: number;
    totalSessions: number;
    avgQuality: number;
  };
  recentRecord?: {
    date: string;
    surah: {
      name: string;
      nameArabic: string;
    };
    status: string;
  };
  currentTarget?: {
    surah: {
      name: string;
    };
    targetDate: string;
  };
  achievementCount: number;
  daysSinceLastActivity?: number;
  status: string;
}

interface ClassData {
  students: Student[];
  statistics: {
    totalStudents: number;
    activeStudents: number;
    averageProgress: number;
    averageJuz30Progress: number;
    totalCompletedSurahs: number;
    totalAyatsMemorized: number;
    levelDistribution: {
      PEMULA: number;
      MENENGAH: number;
      LANJUT: number;
      HAFIDZ: number;
    };
    activityStatus: {
      BELUM_MULAI: number;
      AKTIF_HARI_INI: number;
      AKTIF: number;
      KURANG_AKTIF: number;
      TIDAK_AKTIF: number;
    };
  };
}

export default function HafalanKelasPage() {
  const router = useRouter();
  const [data, setData] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [sortBy, setSortBy] = useState('progress');

  useEffect(() => {
    loadClassData();
  }, []);

  const loadClassData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/hafalan/progress?limit=100');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error loading class data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    // Implementation for Excel export
    console.log('Export to Excel');
  };

  const filteredStudents = data?.students.filter(student => {
    const matchesSearch = !searchTerm || 
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.nickname && student.nickname.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLevel = !selectedLevel || student.progress?.level === selectedLevel;
    const matchesStatus = !selectedStatus || student.status === selectedStatus;
    
    return matchesSearch && matchesLevel && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'progress':
        return (b.progress?.overallProgress || 0) - (a.progress?.overallProgress || 0);
      case 'name':
        return a.fullName.localeCompare(b.fullName);
      case 'activity':
        return (a.daysSinceLastActivity || 999) - (b.daysSinceLastActivity || 999);
      case 'surah':
        return (b.progress?.totalSurah || 0) - (a.progress?.totalSurah || 0);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto mt-16">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <Users className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Gagal Memuat Data
              </h3>
              <Button onClick={loadClassData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Coba Lagi
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Overview Kelas Hafalan
            </h1>
            <p className="text-gray-600">
              Monitoring progress hafalan seluruh santri
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadClassData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={exportToExcel}>
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {data.statistics.totalStudents}
              </div>
              <div className="text-xs text-gray-600">Total Santri</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {data.statistics.activeStudents}
              </div>
              <div className="text-xs text-gray-600">Santri Aktif</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(data.statistics.averageProgress)}%
              </div>
              <div className="text-xs text-gray-600">Rata-rata Progress</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Book className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">
                {data.statistics.totalCompletedSurahs}
              </div>
              <div className="text-xs text-gray-600">Total Surah Selesai</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">
                {data.statistics.totalAyatsMemorized}
              </div>
              <div className="text-xs text-gray-600">Total Ayat Hafal</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-6 h-6 mx-auto mb-2 text-indigo-600">🎯</div>
              <div className="text-2xl font-bold text-indigo-600">
                {Math.round(data.statistics.averageJuz30Progress)}%
              </div>
              <div className="text-xs text-gray-600">Rata-rata Juz 30</div>
            </CardContent>
          </Card>
        </div>

        {/* Distribution Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Distribusi Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(data.statistics.levelDistribution).map(([level, count]) => (
                  <div key={level} className="flex justify-between items-center">
                    <span className="capitalize">{level.toLowerCase()}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ 
                            width: `${data.statistics.totalStudents > 0 ? (count / data.statistics.totalStudents) * 100 : 0}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Aktivitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(data.statistics.activityStatus).map(([status, count]) => (
                  <div key={status} className="flex justify-between items-center">
                    <span className="text-sm">{status.replace(/_/g, ' ')}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ 
                            width: `${data.statistics.totalStudents > 0 ? (count / data.statistics.totalStudents) * 100 : 0}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid md:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari nama santri..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Semua Level</option>
                <option value="PEMULA">Pemula</option>
                <option value="MENENGAH">Menengah</option>
                <option value="LANJUT">Lanjut</option>
                <option value="HAFIDZ">Hafidz</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Semua Status</option>
                <option value="AKTIF_HARI_INI">Aktif Hari Ini</option>
                <option value="AKTIF">Aktif</option>
                <option value="KURANG_AKTIF">Kurang Aktif</option>
                <option value="TIDAK_AKTIF">Tidak Aktif</option>
                <option value="BELUM_MULAI">Belum Mulai</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="progress">Urutkan: Progress</option>
                <option value="name">Urutkan: Nama</option>
                <option value="activity">Urutkan: Aktivitas</option>
                <option value="surah">Urutkan: Jumlah Surah</option>
              </select>

              {/* Result Count */}
              <div className="flex items-center justify-center text-sm text-gray-600">
                {filteredStudents?.length || 0} dari {data.statistics.totalStudents} santri
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Grid */}
        {filteredStudents && filteredStudents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                progress={student.progress}
                recentRecord={student.recentRecord}
                currentTarget={student.currentTarget}
                achievementCount={student.achievementCount}
                daysSinceLastActivity={student.daysSinceLastActivity}
                status={student.status}
                showDetailedStats={true}
                onClick={(student) => router.push(`/hafalan/progress/${student.id}`)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Tidak Ada Santri Ditemukan
              </h3>
              <p className="text-gray-500">
                Coba ubah filter pencarian untuk melihat hasil yang berbeda
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}