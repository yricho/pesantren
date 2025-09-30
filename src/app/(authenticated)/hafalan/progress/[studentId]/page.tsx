'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/ui/loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressRing, JuzProgressRing } from '@/components/hafalan/progress-ring';
import { SurahButton } from '@/components/hafalan/surah-button';
import { 
  ArrowLeft, Book, Calendar, Trophy, Target, TrendingUp, 
  Clock, Star, Award, Activity, MessageSquare, FileText 
} from 'lucide-react';

interface StudentProgress {
  student: {
    id: string;
    fullName: string;
    nickname?: string;
    photo?: string;
    grade?: string;
    institutionType: string;
    enrollmentDate: string;
  };
  progress?: {
    totalSurah: number;
    totalAyat: number;
    totalJuz: number;
    juz30Progress: number;
    overallProgress: number;
    level: string;
    currentStreak: number;
    longestStreak: number;
    totalSessions: number;
    avgQuality: number;
    lastSetoranDate?: string;
    lastMurajaahDate?: string;
  };
  currentTargets: Array<{
    id: string;
    targetSurah: number;
    targetDate: string;
    progress: number;
    status: string;
    surah: {
      name: string;
      nameArabic: string;
      totalAyat: number;
    };
  }>;
  achievements: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    level: string;
    points: number;
    earnedAt: string;
    icon?: string;
  }>;
  surahStatus: Array<{
    surah: {
      number: number;
      name: string;
      nameArabic: string;
      totalAyat: number;
      juz: number;
      type: string;
    };
    status: string;
    progress: number;
    completedAyatsCount: number;
    lastRecord?: {
      quality: string;
      date: string;
    };
  }>;
  juzProgress: Record<number, {
    juz: number;
    progress: number;
    totalAyats: number;
    completedAyats: number;
    surahs: number;
  }>;
  recentRecords?: Array<{
    id: string;
    date: string;
    status: string;
    quality: string;
    startAyat: number;
    endAyat: number;
    surah: {
      number: number;
      name: string;
      nameArabic: string;
    };
    teacher: {
      name: string;
    };
  }>;
}

export default function StudentProgressPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.studentId as string;
  
  const [data, setData] = useState<StudentProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (studentId) {
      loadStudentProgress();
    }
  }, [studentId]);

  const loadStudentProgress = async () => {
    try {
      const response = await fetch(`/api/hafalan/student/${studentId}?includeRecords=true&recordLimit=20`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        setError('Student not found');
      }
    } catch (err) {
      console.error('Error loading student progress:', err);
      setError('Failed to load student progress');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'MUTQIN': return 'bg-green-100 text-green-800';
      case 'LANCAR': return 'bg-blue-100 text-blue-800';
      case 'MURAJA\'AH': case 'SEDANG_DIHAFAL': return 'bg-yellow-100 text-yellow-800';
      case 'BARU': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'SURAH_COMPLETE': return '📖';
      case 'JUZ_COMPLETE': return '🎯';
      case 'STREAK': return '🔥';
      case 'QUALITY_EXCELLENCE': return '⭐';
      default: return '🏆';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto mt-16">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <FileText className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {error || 'Data tidak ditemukan'}
              </h3>
              <Button onClick={() => router.back()}>
                Kembali
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              Progress Hafalan - {data.student.fullName}
            </h1>
            <p className="text-gray-600">
              {data.student.grade} - {data.student.institutionType}
            </p>
          </div>
        </div>

        {/* Student Header Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              {data.student.photo ? (
                <img
                  src={data.student.photo}
                  alt={data.student.fullName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                  {data.student.fullName.charAt(0)}
                </div>
              )}

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900">{data.student.fullName}</h2>
                {data.student.nickname && (
                  <p className="text-lg text-gray-600">({data.student.nickname})</p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="outline">{data.student.grade}</Badge>
                  <Badge variant="outline">{data.student.institutionType}</Badge>
                  <Badge className="bg-blue-100 text-blue-800">
                    {data.progress?.level || 'PEMULA'}
                  </Badge>
                </div>
              </div>

              {/* Overall Progress Ring */}
              <div className="flex-shrink-0">
                <ProgressRing 
                  progress={data.progress?.overallProgress || 0}
                  size={120}
                  strokeWidth={10}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Book className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-blue-600">
                {data.progress?.totalSurah || 0}
              </div>
              <div className="text-sm text-gray-600">Surah Selesai</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-600">
                {data.progress?.totalAyat || 0}
              </div>
              <div className="text-sm text-gray-600">Total Ayat</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(data.progress?.juz30Progress || 0)}%
              </div>
              <div className="text-sm text-gray-600">Juz 30</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-orange-600">
                {data.progress?.currentStreak || 0}
              </div>
              <div className="text-sm text-gray-600">Hari Berturut</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="surahs">Per Surah</TabsTrigger>
            <TabsTrigger value="juz">Per Juz</TabsTrigger>
            <TabsTrigger value="achievements">Pencapaian</TabsTrigger>
            <TabsTrigger value="history">Riwayat</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Current Targets */}
            {data.currentTargets.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Target Saat Ini
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.currentTargets.map((target) => (
                    <div key={target.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{target.surah.name}</h4>
                          <p className="text-sm text-gray-600 font-arabic">
                            {target.surah.nameArabic}
                          </p>
                        </div>
                        <Badge className={getStatusColor(target.status)}>
                          {target.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Target: {formatDate(target.targetDate)}
                        </span>
                        <div className="text-sm font-medium">
                          {Math.round(target.progress)}% selesai
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${target.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Quality and Activity Stats */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Statistik Kualitas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Rata-rata Kualitas</span>
                    <Badge variant="outline">
                      {data.progress?.avgQuality ? (
                        data.progress.avgQuality >= 3.5 ? 'A' : 
                        data.progress.avgQuality >= 2.5 ? 'B' : 'C'
                      ) : 'N/A'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Sesi</span>
                    <span className="font-medium">{data.progress?.totalSessions || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Streak Terpanjang</span>
                    <span className="font-medium">{data.progress?.longestStreak || 0} hari</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Aktivitas Terakhir
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.progress?.lastSetoranDate && (
                    <div className="flex justify-between items-center">
                      <span>Setoran Terakhir</span>
                      <span className="text-sm text-gray-600">
                        {formatDate(data.progress.lastSetoranDate)}
                      </span>
                    </div>
                  )}
                  {data.progress?.lastMurajaahDate && (
                    <div className="flex justify-between items-center">
                      <span>Muraja'ah Terakhir</span>
                      <span className="text-sm text-gray-600">
                        {formatDate(data.progress.lastMurajaahDate)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span>Bergabung</span>
                    <span className="text-sm text-gray-600">
                      {formatDate(data.student.enrollmentDate)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Surahs Tab */}
          <TabsContent value="surahs">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {data.surahStatus.map((surahData) => (
                <SurahButton
                  key={surahData.surah.number}
                  surah={surahData.surah}
                  status={{
                    status: surahData.status,
                    progress: surahData.progress,
                    completedAyatsCount: surahData.completedAyatsCount,
                    lastRecord: surahData.lastRecord
                  }}
                  onClick={() => {}}
                  showProgress={true}
                />
              ))}
            </div>
          </TabsContent>

          {/* Juz Tab */}
          <TabsContent value="juz">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {Object.values(data.juzProgress).map((juzData) => (
                <Card key={juzData.juz} className="text-center">
                  <CardContent className="p-6">
                    <JuzProgressRing
                      progress={juzData.progress}
                      juzNumber={juzData.juz}
                      size={100}
                    />
                    <div className="mt-4 space-y-1 text-sm text-gray-600">
                      <div>{juzData.completedAyats} / {juzData.totalAyats} ayat</div>
                      <div>{juzData.surahs} surah</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            {data.achievements.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {data.achievements.map((achievement) => (
                  <Card key={achievement.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">
                          {achievement.icon || getAchievementIcon(achievement.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{achievement.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {achievement.level}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {achievement.description}
                          </p>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>{formatDate(achievement.earnedAt)}</span>
                            <span>{achievement.points} poin</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Belum Ada Pencapaian
                  </h3>
                  <p className="text-gray-500">
                    Pencapaian akan muncul saat santri menyelesaikan target tertentu
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            {data.recentRecords && data.recentRecords.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Riwayat Setoran Terbaru</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.recentRecords.map((record) => (
                    <div key={record.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">
                            {record.surah.name} - Ayat {record.startAyat}-{record.endAyat}
                          </h4>
                          <p className="text-sm text-gray-600 font-arabic">
                            {record.surah.nameArabic}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                          <div className="text-xs text-gray-500 mt-1">
                            Kualitas: {record.quality}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>Ustadz: {record.teacher.name}</span>
                        <span>{formatDate(record.date)}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Belum Ada Riwayat
                  </h3>
                  <p className="text-gray-500">
                    Riwayat setoran akan muncul setelah santri mulai hafalan
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}