'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  GraduationCap,
  Calendar,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Award,
  FileText,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ChildData {
  id: string;
  fullName: string;
  nickname?: string;
  nis: string;
  currentClass?: {
    name: string;
    teacher?: {
      name: string;
    };
  };
  attendance: {
    percentage: number;
    totalDays: number;
    presentDays: number;
    absentDays: number;
    sickDays: number;
    permittedDays: number;
    lateDays: number;
  };
  grades: {
    average: number;
    totalSubjects: number;
    subjects: Array<{
      name: string;
      score: number;
      grade: string;
      category: string;
    }>;
  };
}

interface AcademicData {
  children: ChildData[];
  semester: {
    id: string;
    name: string;
    academicYear: string;
  };
  upcomingExams: Array<{
    id: string;
    subject: string;
    date: string;
    type: string;
    description?: string;
  }>;
  recentGrades: Array<{
    id: string;
    studentName: string;
    subject: string;
    score: number;
    grade: string;
    date: string;
    type: string;
  }>;
  teacherFeedback: Array<{
    id: string;
    studentName: string;
    teacher: string;
    subject: string;
    message: string;
    date: string;
    type: 'positive' | 'neutral' | 'concern';
  }>;
}

export default function AcademicMonitoring() {
  const { data: session } = useSession();
  const [academicData, setAcademicData] = useState<AcademicData | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchAcademicData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/parent/academic');
        if (response.ok) {
          const data = await response.json();
          setAcademicData(data);
          if (data.children.length > 0 && selectedChildId === 'all') {
            setSelectedChildId(data.children[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching academic data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchAcademicData();
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!academicData) return null;

  const selectedChild = academicData.children.find(c => c.id === selectedChildId);
  const displayChildren = selectedChildId === 'all' ? academicData.children : selectedChild ? [selectedChild] : [];

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'B':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'C':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'concern':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold mb-2">Monitoring Akademik</h1>
            <p className="text-blue-100">
              Pantau perkembangan akademik anak Anda secara real-time
            </p>
            {academicData.semester && (
              <div className="mt-4 bg-white/20 rounded-lg p-3 inline-block">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">
                    {academicData.semester.name} - {academicData.semester.academicYear}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* Child Selection */}
          <div className="bg-white/10 rounded-lg p-4">
            <label className="text-sm text-blue-100 block mb-2">Pilih Anak:</label>
            <Select value={selectedChildId} onValueChange={setSelectedChildId}>
              <SelectTrigger className="w-48 bg-white text-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Anak</SelectItem>
                {academicData.children.map((child) => (
                  <SelectItem key={child.id} value={child.id}>
                    {child.nickname || child.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Academic Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <GraduationCap className="w-8 h-8 text-blue-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-600">Rata-rata Nilai</p>
                <p className="text-2xl font-bold text-blue-600">
                  {displayChildren.length > 0 
                    ? (displayChildren.reduce((sum, child) => sum + child.grades.average, 0) / displayChildren.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-green-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-600">Kehadiran</p>
                <p className="text-2xl font-bold text-green-600">
                  {displayChildren.length > 0 
                    ? Math.round(displayChildren.reduce((sum, child) => sum + child.attendance.percentage, 0) / displayChildren.length)
                    : 0
                  }%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-purple-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-600">Ujian Mendatang</p>
                <p className="text-2xl font-bold text-purple-600">
                  {academicData.upcomingExams.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-orange-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-600">Mata Pelajaran</p>
                <p className="text-2xl font-bold text-orange-600">
                  {displayChildren.length > 0 
                    ? Math.max(...displayChildren.map(child => child.grades.totalSubjects))
                    : 0
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Ringkasan</TabsTrigger>
          <TabsTrigger value="grades">Nilai</TabsTrigger>
          <TabsTrigger value="attendance">Kehadiran</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Guru</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Performa Akademik</CardTitle>
                <CardDescription>Ringkasan performa per mata pelajaran</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedChild?.grades.subjects.slice(0, 5).map((subject, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{subject.name}</p>
                        <p className="text-xs text-gray-500">{subject.category}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{subject.score}</span>
                        <Badge variant="outline" className={getGradeColor(subject.grade)}>
                          {subject.grade}
                        </Badge>
                      </div>
                    </div>
                  )) || <p className="text-gray-500 text-sm">Pilih anak untuk melihat detail nilai</p>}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Exams */}
            <Card>
              <CardHeader>
                <CardTitle>Ujian Mendatang</CardTitle>
                <CardDescription>Jadwal ujian dan tes yang akan datang</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {academicData.upcomingExams.slice(0, 4).map((exam) => (
                    <div key={exam.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <Clock className="w-4 h-4 text-gray-500 mr-3" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{exam.subject}</p>
                        <p className="text-xs text-gray-500">{exam.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{new Date(exam.date).toLocaleDateString('id-ID')}</p>
                        <Badge variant="secondary" className="text-xs">
                          {Math.ceil((new Date(exam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} hari lagi
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
              <CardDescription>Nilai dan feedback terbaru dari guru</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {academicData.recentGrades.slice(0, 5).map((grade) => (
                  <div key={grade.id} className="flex items-center p-3 border-l-4 border-blue-400 bg-blue-50 rounded">
                    <GraduationCap className="w-5 h-5 text-blue-600 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {grade.studentName} - {grade.subject}
                      </p>
                      <p className="text-xs text-gray-600">{grade.type}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={getGradeColor(grade.grade)}>
                        {grade.score} ({grade.grade})
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(grade.date).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades">
          <Card>
            <CardHeader>
              <CardTitle>Detail Nilai</CardTitle>
              <CardDescription>Rincian nilai per mata pelajaran dan kategori</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedChild ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{selectedChild.grades.average.toFixed(1)}</p>
                      <p className="text-sm text-gray-600">Rata-rata Keseluruhan</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{selectedChild.grades.totalSubjects}</p>
                      <p className="text-sm text-gray-600">Total Mata Pelajaran</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">
                        {selectedChild.grades.subjects.filter(s => s.score >= 80).length}
                      </p>
                      <p className="text-sm text-gray-600">Nilai ≥ 80</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Mata Pelajaran</th>
                          <th className="text-left p-3">Kategori</th>
                          <th className="text-center p-3">Nilai</th>
                          <th className="text-center p-3">Grade</th>
                          <th className="text-center p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedChild.grades.subjects.map((subject, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{subject.name}</td>
                            <td className="p-3 text-sm text-gray-600">{subject.category}</td>
                            <td className="p-3 text-center font-bold">{subject.score}</td>
                            <td className="p-3 text-center">
                              <Badge variant="outline" className={getGradeColor(subject.grade)}>
                                {subject.grade}
                              </Badge>
                            </td>
                            <td className="p-3 text-center">
                              {subject.score >= 75 ? (
                                <CheckCircle className="w-4 h-4 text-green-500 inline" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500 inline" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">Pilih anak untuk melihat detail nilai</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Detail Kehadiran</CardTitle>
              <CardDescription>Rincian kehadiran dan ketidakhadiran</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedChild ? (
                <div className="space-y-6">
                  {/* Attendance Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-xl font-bold text-green-600">{selectedChild.attendance.presentDays}</p>
                      <p className="text-sm text-gray-600">Hadir</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-xl font-bold text-red-600">{selectedChild.attendance.absentDays}</p>
                      <p className="text-sm text-gray-600">Alpha</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <p className="text-xl font-bold text-yellow-600">{selectedChild.attendance.sickDays}</p>
                      <p className="text-sm text-gray-600">Sakit</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-xl font-bold text-blue-600">{selectedChild.attendance.permittedDays}</p>
                      <p className="text-sm text-gray-600">Izin</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-xl font-bold text-orange-600">{selectedChild.attendance.lateDays}</p>
                      <p className="text-sm text-gray-600">Terlambat</p>
                    </div>
                  </div>

                  {/* Attendance Percentage */}
                  <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Persentase Kehadiran</h3>
                        <p className="text-sm text-gray-600">
                          {selectedChild.attendance.presentDays} dari {selectedChild.attendance.totalDays} hari
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-green-600">{selectedChild.attendance.percentage}%</p>
                      </div>
                    </div>
                    <Progress value={selectedChild.attendance.percentage} className="h-3" />
                  </div>

                  {/* Attendance Status */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      {selectedChild.attendance.percentage >= 85 ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="font-medium text-green-700">Kehadiran Sangat Baik</span>
                        </>
                      ) : selectedChild.attendance.percentage >= 70 ? (
                        <>
                          <AlertCircle className="w-5 h-5 text-yellow-500" />
                          <span className="font-medium text-yellow-700">Kehadiran Cukup</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-500" />
                          <span className="font-medium text-red-700">Kehadiran Perlu Perbaikan</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {selectedChild.attendance.percentage >= 85 
                        ? 'Pertahankan kehadiran yang baik ini!'
                        : selectedChild.attendance.percentage >= 70
                        ? 'Tingkatkan kehadiran untuk hasil belajar yang optimal.'
                        : 'Kehadiran rendah dapat mempengaruhi prestasi akademik. Konsultasi dengan wali kelas direkomendasikan.'
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">Pilih anak untuk melihat detail kehadiran</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Guru</CardTitle>
              <CardDescription>Catatan dan evaluasi dari guru mata pelajaran</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {academicData.teacherFeedback
                  .filter(feedback => selectedChildId === 'all' || feedback.studentName === selectedChild?.fullName)
                  .map((feedback) => (
                    <div key={feedback.id} className={`p-4 border-l-4 rounded-lg ${
                      feedback.type === 'positive' ? 'border-green-400 bg-green-50' :
                      feedback.type === 'concern' ? 'border-red-400 bg-red-50' :
                      'border-blue-400 bg-blue-50'
                    }`}>
                      <div className="flex items-start space-x-3">
                        {getFeedbackIcon(feedback.type)}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{feedback.subject}</p>
                              <p className="text-sm text-gray-600">
                                {feedback.teacher} • {feedback.studentName}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(feedback.date).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                          <p className="text-sm">{feedback.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                
                {academicData.teacherFeedback.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Belum ada feedback dari guru</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/parent-portal/academic/report-cards"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <p className="font-medium">Rapor Online</p>
                <p className="text-sm text-gray-600">Download rapor semester</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
            </Link>

            <Link
              href="/parent-portal/academic/schedule"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Calendar className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <p className="font-medium">Jadwal Pelajaran</p>
                <p className="text-sm text-gray-600">Lihat jadwal harian</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
            </Link>

            <Link
              href="/parent-portal/messages/new?to=teacher"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="w-6 h-6 text-purple-600 mr-3" />
              <div>
                <p className="font-medium">Hubungi Guru</p>
                <p className="text-sm text-gray-600">Kirim pesan ke wali kelas</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}