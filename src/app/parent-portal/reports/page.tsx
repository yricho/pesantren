'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  TrendingUp,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  FileText,
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  Award,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface ReportChild {
  id: string;
  fullName: string;
  nickname?: string;
  nis: string;
  class: string;
  academic: {
    average: number;
    trend: number;
    subjects: number;
    attendance: number;
  };
  hafalan: {
    totalSurah: number;
    totalAyat: number;
    level: string;
    progress: number;
  };
  payments: {
    totalPaid: number;
    pending: number;
    status: string;
  };
}

interface ReportsData {
  children: ReportChild[];
  semester: {
    id: string;
    name: string;
    academicYear: string;
  };
  summary: {
    totalChildren: number;
    averageGrades: number;
    averageAttendance: number;
    totalHafalan: number;
    totalPayments: number;
    pendingPayments: number;
  };
  monthlyTrends: Array<{
    month: string;
    grades: number;
    attendance: number;
    hafalan: number;
  }>;
  comparativeAnalysis: {
    academic: {
      above80: number;
      between70And80: number;
      below70: number;
    };
    attendance: {
      excellent: number;
      good: number;
      needsImprovement: number;
    };
    hafalan: {
      advanced: number;
      intermediate: number;
      beginner: number;
    };
  };
}

export default function ReportsAnalytics() {
  const { data: session } = useSession();
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('current_semester');
  const [selectedCategory, setSelectedCategory] = useState<string>('comprehensive');
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({
          period: selectedPeriod,
          category: selectedCategory
        });
        if (selectedChildId !== 'all') {
          params.append('studentId', selectedChildId);
        }
        
        const response = await fetch(`/api/parent/reports?${params}`);
        if (response.ok) {
          const data = await response.json();
          setReportsData(data);
        }
      } catch (error) {
        console.error('Error fetching reports data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchReportsData();
    }
  }, [session, selectedChildId, selectedPeriod, selectedCategory]);

  const handleDownloadReport = async (format: 'pdf' | 'excel') => {
    try {
      setIsGenerating(true);
      const params = new URLSearchParams({
        format,
        period: selectedPeriod,
        category: selectedCategory
      });
      if (selectedChildId !== 'all') {
        params.append('studentId', selectedChildId);
      }

      const response = await fetch(`/api/parent/reports/download?${params}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `laporan-${selectedPeriod}-${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!reportsData) return null;

  const selectedChild = reportsData.children.find(c => c.id === selectedChildId);

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend < 0) return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
    return <div className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold mb-2">Laporan & Analisis</h1>
            <p className="text-purple-100">
              Analisis komprehensif perkembangan anak dan download laporan
            </p>
            {reportsData.semester && (
              <div className="mt-4 bg-white/20 rounded-lg p-3 inline-block">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">
                    {reportsData.semester.name} - {reportsData.semester.academicYear}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <label className="text-sm text-purple-100 block mb-2">Periode:</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-48 bg-white text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current_semester">Semester Ini</SelectItem>
                  <SelectItem value="last_semester">Semester Lalu</SelectItem>
                  <SelectItem value="current_year">Tahun Ini</SelectItem>
                  <SelectItem value="last_year">Tahun Lalu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4">
              <label className="text-sm text-purple-100 block mb-2">Anak:</label>
              <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                <SelectTrigger className="w-48 bg-white text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Anak</SelectItem>
                  {reportsData.children.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.nickname || child.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <GraduationCap className="w-8 h-8 text-blue-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-600">Rata-rata Akademik</p>
                <p className="text-2xl font-bold text-blue-600">
                  {selectedChild ? selectedChild.academic.average.toFixed(1) : reportsData.summary.averageGrades.toFixed(1)}
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
                <p className="text-sm font-medium text-gray-600">Rata-rata Kehadiran</p>
                <p className="text-2xl font-bold text-green-600">
                  {selectedChild ? selectedChild.academic.attendance : reportsData.summary.averageAttendance}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-purple-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Surah</p>
                <p className="text-2xl font-bold text-purple-600">
                  {selectedChild ? selectedChild.hafalan.totalSurah : reportsData.summary.totalHafalan}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className={`w-8 h-8 mr-4 ${reportsData.summary.pendingPayments > 0 ? 'text-red-600' : 'text-green-600'}`} />
              <div>
                <p className="text-sm font-medium text-gray-600">Status Pembayaran</p>
                <p className={`text-2xl font-bold ${reportsData.summary.pendingPayments > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {reportsData.summary.pendingPayments > 0 ? `${reportsData.summary.pendingPayments} Pending` : 'Lunas'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
            <TabsTrigger value="trends">Tren</TabsTrigger>
            <TabsTrigger value="comparative">Komparasi</TabsTrigger>
          </TabsList>
          
          {/* Download Buttons */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => handleDownloadReport('pdf')}
              disabled={isGenerating}
              className="flex items-center space-x-2"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>PDF</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDownloadReport('excel')}
              disabled={isGenerating}
              className="flex items-center space-x-2"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>Excel</span>
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          {selectedChild ? (
            /* Individual Child Report */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Profil Siswa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nama Lengkap:</span>
                      <span className="font-medium">{selectedChild.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">NIS:</span>
                      <span className="font-medium">{selectedChild.nis}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kelas:</span>
                      <span className="font-medium">{selectedChild.class}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Level Hafalan:</span>
                      <Badge variant="outline">{selectedChild.hafalan.level}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Performa Akademik
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Rata-rata Nilai</span>
                        <span className="font-medium">{selectedChild.academic.average.toFixed(1)}</span>
                      </div>
                      <Progress value={(selectedChild.academic.average / 100) * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Kehadiran</span>
                        <span className="font-medium">{selectedChild.academic.attendance}%</span>
                      </div>
                      <Progress value={selectedChild.academic.attendance} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Progress Hafalan</span>
                        <span className="font-medium">{selectedChild.hafalan.progress}%</span>
                      </div>
                      <Progress value={selectedChild.hafalan.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{selectedChild.academic.subjects}</div>
                        <div className="text-sm text-gray-600">Mata Pelajaran</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{selectedChild.hafalan.totalSurah}</div>
                        <div className="text-sm text-gray-600">Surah Hafal</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* All Children Overview */
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ringkasan Semua Anak</CardTitle>
                  <CardDescription>Performa keseluruhan dari semua anak</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportsData.children.map((child) => (
                      <div key={child.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">{child.nickname || child.fullName}</h4>
                            <p className="text-sm text-gray-600">{child.nis} • {child.class}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(child.academic.trend)}
                            <span className={`text-sm font-medium ${
                              child.academic.trend > 0 ? 'text-green-600' : 
                              child.academic.trend < 0 ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {child.academic.trend > 0 ? '+' : ''}{child.academic.trend.toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <div className="text-lg font-bold text-blue-600">{child.academic.average.toFixed(1)}</div>
                            <div className="text-xs text-gray-600">Akademik</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <div className="text-lg font-bold text-green-600">{child.academic.attendance}%</div>
                            <div className="text-xs text-gray-600">Kehadiran</div>
                          </div>
                          <div className="text-center p-2 bg-purple-50 rounded">
                            <div className="text-lg font-bold text-purple-600">{child.hafalan.totalSurah}</div>
                            <div className="text-xs text-gray-600">Surah</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Tren Perkembangan Bulanan
              </CardTitle>
              <CardDescription>Perkembangan akademik dan hafalan dalam beberapa bulan terakhir</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reportsData.monthlyTrends.map((month, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{month.month}</h4>
                      <div className="text-sm text-gray-500">Bulan ke-{index + 1}</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Akademik</span>
                          <span>{month.grades.toFixed(1)}</span>
                        </div>
                        <Progress value={(month.grades / 100) * 100} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Kehadiran</span>
                          <span>{month.attendance}%</span>
                        </div>
                        <Progress value={month.attendance} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Hafalan</span>
                          <span>{month.hafalan}%</span>
                        </div>
                        <Progress value={month.hafalan} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparative" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Academic Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Analisis Akademik
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Nilai ≥ 80</span>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      <span className="font-medium text-green-600">
                        {reportsData.comparativeAnalysis.academic.above80}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Nilai 70-80</span>
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-medium text-yellow-600">
                        {reportsData.comparativeAnalysis.academic.between70And80}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Nilai < 70</span>
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                      <span className="font-medium text-red-600">
                        {reportsData.comparativeAnalysis.academic.below70}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Analisis Kehadiran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sangat Baik (≥90%)</span>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      <span className="font-medium text-green-600">
                        {reportsData.comparativeAnalysis.attendance.excellent}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Baik (80-89%)</span>
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-medium text-yellow-600">
                        {reportsData.comparativeAnalysis.attendance.good}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Perlu Perbaikan (<80%)</span>
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                      <span className="font-medium text-red-600">
                        {reportsData.comparativeAnalysis.attendance.needsImprovement}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hafalan Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Analisis Hafalan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Lanjut/Hafidz</span>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 text-purple-500 mr-1" />
                      <span className="font-medium text-purple-600">
                        {reportsData.comparativeAnalysis.hafalan.advanced}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Menengah</span>
                    <div className="flex items-center">
                      <Target className="w-4 h-4 text-blue-500 mr-1" />
                      <span className="font-medium text-blue-600">
                        {reportsData.comparativeAnalysis.hafalan.intermediate}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pemula</span>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-green-500 mr-1" />
                      <span className="font-medium text-green-600">
                        {reportsData.comparativeAnalysis.hafalan.beginner}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Template Laporan Cepat</CardTitle>
          <CardDescription>Download laporan dengan format yang telah ditentukan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="flex items-center justify-center p-6 h-auto flex-col space-y-2"
              onClick={() => setSelectedCategory('academic')}
            >
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <span className="font-medium">Rapor Akademik</span>
              <span className="text-xs text-gray-500">Nilai & Kehadiran</span>
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-center p-6 h-auto flex-col space-y-2"
              onClick={() => setSelectedCategory('hafalan')}
            >
              <BookOpen className="w-8 h-8 text-green-600" />
              <span className="font-medium">Laporan Hafalan</span>
              <span className="text-xs text-gray-500">Progress & Pencapaian</span>
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-center p-6 h-auto flex-col space-y-2"
              onClick={() => setSelectedCategory('financial')}
            >
              <CreditCard className="w-8 h-8 text-purple-600" />
              <span className="font-medium">Laporan Keuangan</span>
              <span className="text-xs text-gray-500">Pembayaran & Tagihan</span>
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-center p-6 h-auto flex-col space-y-2"
              onClick={() => setSelectedCategory('comprehensive')}
            >
              <FileText className="w-8 h-8 text-orange-600" />
              <span className="font-medium">Laporan Lengkap</span>
              <span className="text-xs text-gray-500">Semua Aspek</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}