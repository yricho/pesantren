'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/ui/loading';
import { QuickRecordModal } from '@/components/hafalan/quick-record-modal';
import { Mic, Search, Book, Users, Target, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Student {
  id: string;
  fullName: string;
  nickname?: string;
  photo?: string;
  grade?: string;
  institutionType: string;
}

interface Surah {
  id: string;
  number: number;
  name: string;
  nameArabic: string;
  totalAyat: number;
  juz: number;
  type: string;
}

interface StudentProgress {
  surahStatus: Array<{
    surah: Surah;
    status: string;
    progress: number;
    completedAyatsCount: number;
  }>;
  statistics: {
    overallProgress: number;
    juz30Progress: number;
    completedSurahs: number;
    totalAyatsMemorized: number;
  };
}

export default function HafalanSetoranPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentProgress, setStudentProgress] = useState<StudentProgress | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [recordType, setRecordType] = useState<'SETORAN_BARU' | 'MURAJA\'AH' | 'TES_HAFALAN'>('SETORAN_BARU');

  // Load initial data
  useEffect(() => {
    loadStudents();
    loadSurahs();
  }, []);

  // Load student progress when student is selected
  useEffect(() => {
    if (selectedStudent) {
      loadStudentProgress(selectedStudent.id);
    }
  }, [selectedStudent]);

  const loadStudents = async () => {
    try {
      const response = await fetch('/api/students?limit=100');
      const data = await response.json();
      setStudents(data.students || []);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const loadSurahs = async () => {
    try {
      const response = await fetch('/api/hafalan/surah');
      const data = await response.json();
      setSurahs(data.surahs || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading surahs:', error);
      setLoading(false);
    }
  };

  const loadStudentProgress = async (studentId: string) => {
    try {
      const response = await fetch(`/api/hafalan/student/${studentId}`);
      const data = await response.json();
      setStudentProgress(data);
    } catch (error) {
      console.error('Error loading student progress:', error);
    }
  };

  const getSurahStatusColor = (surah: Surah) => {
    if (!studentProgress) return 'bg-gray-200 text-gray-600';
    
    const surahData = studentProgress.surahStatus?.find(s => s.surah.number === surah.number);
    if (!surahData) return 'bg-gray-200 text-gray-600';

    switch (surahData.status) {
      case 'MUTQIN':
        return 'bg-green-500 text-white hover:bg-green-600';
      case 'LANCAR':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'MURAJA\'AH':
      case 'SEDANG_DIHAFAL':
        return 'bg-yellow-500 text-white hover:bg-yellow-600';
      case 'BARU':
        return 'bg-orange-500 text-white hover:bg-orange-600';
      case 'PERLU_MURAJA\'AH':
        return 'bg-red-500 text-white hover:bg-red-600';
      default:
        return 'bg-gray-200 text-gray-600 hover:bg-gray-300';
    }
  };

  const getSurahStatusIcon = (surah: Surah) => {
    if (!studentProgress) return null;
    
    const surahData = studentProgress.surahStatus?.find(s => s.surah.number === surah.number);
    if (!surahData) return null;

    switch (surahData.status) {
      case 'MUTQIN':
        return <CheckCircle className="w-4 h-4" />;
      case 'LANCAR':
        return <Book className="w-4 h-4" />;
      case 'SEDANG_DIHAFAL':
        return <Clock className="w-4 h-4" />;
      case 'PERLU_MURAJA\'AH':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.nickname && student.nickname.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openRecordingModal = (surah: Surah, type: 'SETORAN_BARU' | 'MURAJA\'AH' | 'TES_HAFALAN' = 'SETORAN_BARU') => {
    setSelectedSurah(surah);
    setRecordType(type);
    setShowRecordModal(true);
  };

  const closeRecordModal = () => {
    setShowRecordModal(false);
    setSelectedSurah(null);
    // Refresh student progress after recording
    if (selectedStudent) {
      loadStudentProgress(selectedStudent.id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Setoran Hafalan Al-Quran
          </h1>
          <p className="text-gray-600">
            Sistem pencatatan hafalan yang mudah dan intuitif untuk para ustadz
          </p>
        </div>

        {/* Student Selector */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Search className="w-6 h-6 text-gray-500" />
              <Input
                placeholder="Cari nama santri..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-lg p-4"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-60 overflow-y-auto">
              {filteredStudents.map((student) => (
                <Button
                  key={student.id}
                  variant={selectedStudent?.id === student.id ? "default" : "outline"}
                  className="p-4 h-auto justify-start text-left"
                  onClick={() => setSelectedStudent(student)}
                >
                  <div className="flex items-center gap-3 w-full">
                    {student.photo ? (
                      <img
                        src={student.photo}
                        alt={student.fullName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {student.fullName.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{student.fullName}</p>
                      {student.nickname && (
                        <p className="text-sm text-gray-500 truncate">({student.nickname})</p>
                      )}
                      <p className="text-xs text-gray-400">
                        {student.grade} - {student.institutionType}
                      </p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Student Progress Summary */}
        {selectedStudent && studentProgress && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  {selectedStudent.photo ? (
                    <img
                      src={selectedStudent.photo}
                      alt={selectedStudent.fullName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                      {selectedStudent.fullName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">{selectedStudent.fullName}</h2>
                    <p className="text-gray-600">
                      {selectedStudent.grade} - {selectedStudent.institutionType}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Progress Keseluruhan</p>
                  <p className="text-3xl font-bold text-green-600">
                    {Math.round(studentProgress.statistics.overallProgress)}%
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <Book className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">
                    {studentProgress.statistics.completedSurahs}
                  </p>
                  <p className="text-sm text-gray-600">Surah Selesai</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">
                    {studentProgress.statistics.totalAyatsMemorized}
                  </p>
                  <p className="text-sm text-gray-600">Ayat Hafal</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round(studentProgress.statistics.juz30Progress)}%
                  </p>
                  <p className="text-sm text-gray-600">Juz 30</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">
                    {studentProgress.statistics.inProgressSurahs}
                  </p>
                  <p className="text-sm text-gray-600">Sedang Proses</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Surah Grid */}
        {selectedStudent && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Pilih Surah untuk Setoran</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                {surahs.map((surah) => (
                  <Button
                    key={surah.id}
                    variant="outline"
                    className={`p-4 h-auto flex-col items-center gap-2 relative transition-all duration-200 ${getSurahStatusColor(surah)}`}
                    onClick={() => openRecordingModal(surah)}
                  >
                    <div className="absolute top-2 right-2">
                      {getSurahStatusIcon(surah)}
                    </div>
                    <div className="text-2xl font-bold">{surah.number}</div>
                    <div className="text-xs text-center leading-tight">
                      <div className="font-semibold">{surah.name}</div>
                      <div className="text-xs opacity-75">{surah.nameArabic}</div>
                      <div className="text-xs opacity-75">{surah.totalAyat} ayat</div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="text-xs absolute bottom-1 left-1 right-1"
                    >
                      Juz {surah.juz}
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Action Buttons */}
        {selectedStudent && (
          <div className="fixed bottom-6 right-6 flex flex-col gap-3">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-full shadow-lg"
              onClick={() => {
                if (selectedStudent) {
                  setRecordType('SETORAN_BARU');
                  setShowRecordModal(true);
                }
              }}
            >
              <Book className="w-6 h-6 mr-2" />
              Setoran Baru
            </Button>
            <Button
              size="lg"
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-4 rounded-full shadow-lg"
              onClick={() => {
                if (selectedStudent) {
                  setRecordType('MURAJA\'AH');
                  setShowRecordModal(true);
                }
              }}
            >
              <Clock className="w-6 h-6 mr-2" />
              Muraja'ah
            </Button>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-full shadow-lg"
              onClick={() => {
                if (selectedStudent) {
                  setRecordType('TES_HAFALAN');
                  setShowRecordModal(true);
                }
              }}
            >
              <Target className="w-6 h-6 mr-2" />
              Tes Hafalan
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-red-600 border-red-600 hover:bg-red-50 px-4 py-4 rounded-full shadow-lg"
              onClick={() => setRecording(!recording)}
            >
              <Mic className={`w-6 h-6 ${recording ? 'animate-pulse text-red-600' : ''}`} />
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!selectedStudent && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Pilih Santri untuk Memulai
              </h3>
              <p className="text-gray-500">
                Gunakan pencarian di atas untuk menemukan santri dan mulai pencatatan hafalan
              </p>
            </CardContent>
          </Card>
        )}

        {/* Recording Modal */}
        <QuickRecordModal
          isOpen={showRecordModal}
          onClose={closeRecordModal}
          surah={selectedSurah}
          student={selectedStudent}
          type={recordType}
        />
      </div>
    </div>
  );
}