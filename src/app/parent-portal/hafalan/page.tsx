'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  BookOpen,
  Award,
  Target,
  Clock,
  TrendingUp,
  Play,
  Calendar,
  Star,
  Trophy,
  Volume2,
  BarChart3,
  ChevronRight,
  CheckCircle2,
  Circle,
  Users,
  Headphones
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HafalanStudent {
  student: {
    id: string;
    nis: string;
    fullName: string;
    nickname?: string;
    photo?: string;
  };
  progress: {
    totalSurah: number;
    totalAyat: number;
    totalJuz: number;
    currentSurah?: number;
    currentAyat: number;
    level: string;
    badge: string[];
    juz30Progress: number;
    overallProgress: number;
    lastSetoranDate?: string;
    lastMurajaahDate?: string;
    currentStreak: number;
    longestStreak: number;
    totalSessions: number;
    avgQuality: number;
    avgFluency: number;
    avgTajweed: number;
  };
  surahProgress: Array<{
    surah: {
      number: number;
      name: string;
      nameArabic: string;
      totalAyat: number;
    };
    completedAyat: number;
    status: string;
    quality: string;
  }>;
  recentRecords: Array<{
    id: string;
    surah: {
      number: number;
      name: string;
      nameArabic: string;
    };
    startAyat: number;
    endAyat: number;
    status: string;
    quality: string;
    teacher: string;
    date: string;
    voiceNoteUrl?: string;
  }>;
  currentTarget?: {
    id: string;
    surah: {
      name: string;
      nameArabic: string;
    };
    targetDate: string;
    progress: number;
  };
  recentSessions: Array<{
    id: string;
    type: string;
    duration: number;
    date: string;
    teacher: string;
    overallQuality: string;
    totalAyat: number;
    studentMood: string;
    engagement: string;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    level: string;
    points: number;
    earnedAt: string;
    icon?: string;
    color: string;
  }>;
  allSurahs: Array<{
    number: number;
    name: string;
    nameArabic: string;
    totalAyat: number;
    juz: number;
    type: string;
  }>;
}

interface HafalanData {
  children: HafalanStudent[];
  summary: {
    totalChildren: number;
    totalSurahCompleted: number;
    totalAyatMemorized: number;
    averageProgress: number;
  };
}

export default function HafalanProgress() {
  const { data: session } = useSession();
  const [hafalanData, setHafalanData] = useState<HafalanData | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchHafalanData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/parent/hafalan');
        if (response.ok) {
          const data = await response.json();
          setHafalanData(data);
          if (data.children.length > 0 && !selectedChildId) {
            setSelectedChildId(data.children[0].student.id);
          }
        }
      } catch (error) {
        console.error('Error fetching hafalan data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchHafalanData();
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!hafalanData) return null;

  const selectedChild = hafalanData.children.find(c => c.student.id === selectedChildId);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'HAFIDZ':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'LANJUT':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'MENENGAH':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'A':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'B':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'MUTQIN':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'LANCAR':
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      case 'MURAJA\'AH':
        return <Circle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatDaysAgo = (dateString: string) => {
    const days = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Hari ini';
    if (days === 1) return 'Kemarin';
    return `${days} hari yang lalu`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold mb-2">Progress Hafalan Al-Qur'an</h1>
            <p className="text-green-100">
              Pantau perkembangan hafalan dan pencapaian anak Anda
            </p>
            {hafalanData.summary && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="text-2xl font-bold">{hafalanData.summary.totalSurahCompleted}</div>
                  <div className="text-sm text-green-100">Total Surah Selesai</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="text-2xl font-bold">{hafalanData.summary.totalAyatMemorized}</div>
                  <div className="text-sm text-green-100">Total Ayat</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="text-2xl font-bold">{hafalanData.summary.averageProgress.toFixed(1)}%</div>
                  <div className="text-sm text-green-100">Rata-rata Progress</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Child Selection */}
          <div className="bg-white/10 rounded-lg p-4">
            <label className="text-sm text-green-100 block mb-2">Pilih Anak:</label>
            <Select value={selectedChildId} onValueChange={setSelectedChildId}>
              <SelectTrigger className="w-48 bg-white text-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {hafalanData.children.map((child) => (
                  <SelectItem key={child.student.id} value={child.student.id}>
                    {child.student.nickname || child.student.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {selectedChild && (
        <>
          {/* Progress Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BookOpen className="w-8 h-8 text-green-600 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Surah Selesai</p>
                    <p className="text-2xl font-bold text-green-600">{selectedChild.progress.totalSurah}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Star className="w-8 h-8 text-blue-600 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Level</p>
                    <Badge variant="outline" className={getLevelColor(selectedChild.progress.level)}>
                      {selectedChild.progress.level}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-purple-600 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Progress Keseluruhan</p>
                    <p className="text-2xl font-bold text-purple-600">{selectedChild.progress.overallProgress.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-orange-600 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Streak</p>
                    <p className="text-2xl font-bold text-orange-600">{selectedChild.progress.currentStreak}</p>
                    <p className="text-xs text-gray-500">hari berturut-turut</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Ringkasan</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="sessions">Sesi</TabsTrigger>
              <TabsTrigger value="achievements">Prestasi</TabsTrigger>
              <TabsTrigger value="target">Target</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Juz 30 Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Progress Juz 30 (Juz Amma)
                    </CardTitle>
                    <CardDescription>Hafalan surah-surah pendek</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="font-medium">{selectedChild.progress.juz30Progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={selectedChild.progress.juz30Progress} className="h-3" />
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-blue-600">{selectedChild.progress.totalSessions}</div>
                          <div className="text-xs text-gray-500">Total Sesi</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">{selectedChild.progress.avgQuality.toFixed(1)}</div>
                          <div className="text-xs text-gray-500">Kualitas Rata-rata</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">{selectedChild.progress.avgTajweed.toFixed(1)}</div>
                          <div className="text-xs text-gray-500">Tajweed Rata-rata</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Sessions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Sesi Terbaru
                    </CardTitle>
                    <CardDescription>Aktivitas hafalan dalam 30 hari terakhir</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedChild.recentSessions.slice(0, 4).map((session) => (
                        <div key={session.id} className="flex items-center p-3 border rounded-lg">
                          <div className={`w-3 h-3 rounded-full mr-3 ${
                            session.type === 'SETORAN_BARU' ? 'bg-green-400' :
                            session.type === 'MURAJA\'AH' ? 'bg-blue-400' : 'bg-purple-400'
                          }`} />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{session.type.replace('_', ' ')}</p>
                            <p className="text-xs text-gray-500">
                              {session.teacher} • {session.duration} menit
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className={getQualityColor(session.overallQuality)}>
                              {session.overallQuality}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDaysAgo(session.date)}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="text-center pt-2">
                        <button className="text-sm text-green-600 hover:text-green-800 font-medium">
                          Lihat Semua Sesi →
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Current Target */}
              {selectedChild.currentTarget && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      Target Saat Ini
                    </CardTitle>
                    <CardDescription>Target hafalan yang sedang dikerjakan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-blue-900">
                            {selectedChild.currentTarget.surah.name}
                          </h3>
                          <p className="text-sm text-blue-700 font-arabic">
                            {selectedChild.currentTarget.surah.nameArabic}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          Target: {new Date(selectedChild.currentTarget.targetDate).toLocaleDateString('id-ID')}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{selectedChild.currentTarget.progress}%</span>
                        </div>
                        <Progress value={selectedChild.currentTarget.progress} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="progress">
              <Card>
                <CardHeader>
                  <CardTitle>Progress Detail per Surah</CardTitle>
                  <CardDescription>Status hafalan untuk setiap surah yang dipelajari</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedChild.surahProgress.length > 0 ? (
                      <div className="grid gap-4">
                        {selectedChild.surahProgress.map((surah, index) => (
                          <div key={surah.surah.number} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                            <div className="mr-4">
                              {getStatusIcon(surah.status)}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-medium">{surah.surah.number}. {surah.surah.name}</h4>
                                  <p className="text-sm text-gray-600 font-arabic">{surah.surah.nameArabic}</p>
                                </div>
                                <Badge variant="outline" className={getQualityColor(surah.quality)}>
                                  {surah.quality}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                  {surah.completedAyat} / {surah.surah.totalAyat} ayat
                                </span>
                                <Badge variant="secondary">{surah.status}</Badge>
                              </div>
                              <Progress 
                                value={(surah.completedAyat / surah.surah.totalAyat) * 100} 
                                className="h-2 mt-2" 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Belum ada progress hafalan yang tercatat</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Mulai sesi hafalan untuk melihat progress di sini
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions">
              <Card>
                <CardHeader>
                  <CardTitle>Riwayat Sesi Hafalan</CardTitle>
                  <CardDescription>Detail sesi setoran dan muraja'ah</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedChild.recentSessions.map((session) => (
                      <div key={session.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${
                                session.type === 'SETORAN_BARU' ? 'bg-green-400' :
                                session.type === 'MURAJA\'AH' ? 'bg-blue-400' : 'bg-purple-400'
                              }`} />
                              {session.type.replace('_', ' ')}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Bersama {session.teacher} • {session.duration} menit
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {new Date(session.date).toLocaleDateString('id-ID')}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDaysAgo(session.date)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-sm font-medium">{session.overallQuality}</div>
                            <div className="text-xs text-gray-500">Kualitas</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-sm font-medium">{session.totalAyat}</div>
                            <div className="text-xs text-gray-500">Ayat</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-sm font-medium">{session.engagement}</div>
                            <div className="text-xs text-gray-500">Engagement</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-1" />
                            Mood: {session.studentMood}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Pencapaian & Prestasi
                  </CardTitle>
                  <CardDescription>Badge dan penghargaan yang telah diraih</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedChild.achievements.map((achievement) => (
                      <div key={achievement.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg"
                               style={{ backgroundColor: achievement.color }}>
                            {achievement.icon ? achievement.icon : <Trophy className="w-6 h-6" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{achievement.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                            <div className="flex justify-between items-center mt-2">
                              <Badge variant="outline" className="text-xs">
                                {achievement.level} • {achievement.points} pts
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(achievement.earnedAt).toLocaleDateString('id-ID')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {selectedChild.achievements.length === 0 && (
                      <div className="col-span-2 text-center py-8">
                        <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Belum ada pencapaian</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Terus semangat menghafalkan Al-Qur'an untuk meraih prestasi!
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="target">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Target & Rencana Hafalan
                  </CardTitle>
                  <CardDescription>Target hafalan dan timeline yang ditetapkan</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedChild.currentTarget ? (
                    <div className="space-y-6">
                      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-blue-900">
                              Target Aktif: {selectedChild.currentTarget.surah.name}
                            </h3>
                            <p className="text-blue-700 font-arabic text-lg">
                              {selectedChild.currentTarget.surah.nameArabic}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-sm">
                            Deadline: {new Date(selectedChild.currentTarget.targetDate).toLocaleDateString('id-ID')}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-700">Progress Saat Ini</span>
                            <span className="font-medium text-blue-900">
                              {selectedChild.currentTarget.progress}%
                            </span>
                          </div>
                          <Progress value={selectedChild.currentTarget.progress} className="h-3" />
                          <div className="flex justify-between text-xs text-blue-600">
                            <span>Mulai</span>
                            <span>
                              {Math.ceil((new Date(selectedChild.currentTarget.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} hari tersisa
                            </span>
                            <span>Selesai</span>
                          </div>
                        </div>
                      </div>

                      {/* Recent Progress */}
                      <div>
                        <h4 className="font-medium mb-3">Progress Terakhir</h4>
                        <div className="space-y-2">
                          {selectedChild.recentRecords
                            .filter(record => record.surah.number === selectedChild.currentTarget?.surah.number)
                            .slice(0, 5)
                            .map((record) => (
                              <div key={record.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                <div className="mr-3">
                                  {getStatusIcon(record.status)}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">
                                    Ayat {record.startAyat}-{record.endAyat}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {record.teacher} • {formatDaysAgo(record.date)}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className={getQualityColor(record.quality)}>
                                    {record.quality}
                                  </Badge>
                                  {record.voiceNoteUrl && (
                                    <button className="text-blue-600 hover:text-blue-800">
                                      <Volume2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Belum ada target aktif</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Hubungi ustadz untuk menetapkan target hafalan
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href={`/parent-portal/hafalan/schedule?student=${selectedChild.student.id}`}
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Calendar className="w-6 h-6 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium">Jadwal Setoran</p>
                    <p className="text-sm text-gray-600">Lihat jadwal hafalan</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                </Link>

                <Link
                  href={`/parent-portal/hafalan/recordings?student=${selectedChild.student.id}`}
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Headphones className="w-6 h-6 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium">Rekaman Audio</p>
                    <p className="text-sm text-gray-600">Dengar rekaman hafalan</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                </Link>

                <Link
                  href="/parent-portal/messages/new?to=hafalan_teacher"
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Users className="w-6 h-6 text-purple-600 mr-3" />
                  <div>
                    <p className="font-medium">Hubungi Ustadz</p>
                    <p className="text-sm text-gray-600">Konsultasi hafalan</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}