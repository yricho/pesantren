'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressRing } from './progress-ring';
import { Book, Calendar, Trophy, Clock, Target, TrendingUp } from 'lucide-react';

interface Student {
  id: string;
  fullName: string;
  nickname?: string;
  photo?: string;
  grade?: string;
  institutionType: string;
}

interface Progress {
  totalSurah: number;
  totalAyat: number;
  totalJuz: number;
  juz30Progress: number;
  overallProgress: number;
  level: string;
  currentStreak: number;
  totalSessions: number;
  avgQuality: number;
}

interface StudentCardProps {
  student: Student;
  progress?: Progress;
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
  achievementCount?: number;
  daysSinceLastActivity?: number;
  status: string;
  onClick?: (student: Student) => void;
  showDetailedStats?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const LEVEL_CONFIG = {
  PEMULA: { color: 'bg-gray-100 text-gray-800', icon: '🌱' },
  MENENGAH: { color: 'bg-blue-100 text-blue-800', icon: '📚' },
  LANJUT: { color: 'bg-purple-100 text-purple-800', icon: '⭐' },
  HAFIDZ: { color: 'bg-gold-100 text-gold-800', icon: '👑' }
};

const STATUS_CONFIG = {
  BELUM_MULAI: { color: 'bg-gray-100 text-gray-600', label: 'Belum Mulai' },
  AKTIF_HARI_INI: { color: 'bg-green-100 text-green-700', label: 'Aktif Hari Ini' },
  AKTIF: { color: 'bg-blue-100 text-blue-700', label: 'Aktif' },
  KURANG_AKTIF: { color: 'bg-yellow-100 text-yellow-700', label: 'Kurang Aktif' },
  TIDAK_AKTIF: { color: 'bg-red-100 text-red-700', label: 'Tidak Aktif' }
};

export function StudentCard({
  student,
  progress,
  recentRecord,
  currentTarget,
  achievementCount = 0,
  daysSinceLastActivity,
  status,
  onClick,
  showDetailedStats = false,
  size = 'md'
}: StudentCardProps) {

  const levelConfig = LEVEL_CONFIG[progress?.level as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG.PEMULA;
  const statusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.BELUM_MULAI;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getActivityText = () => {
    if (!daysSinceLastActivity) return 'Belum ada aktivitas';
    if (daysSinceLastActivity === 0) return 'Aktif hari ini';
    if (daysSinceLastActivity === 1) return 'Aktif kemarin';
    return `${daysSinceLastActivity} hari lalu`;
  };

  const cardSizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <Card 
      className={`
        hover:shadow-lg transition-all duration-200 cursor-pointer
        ${onClick ? 'hover:scale-105' : ''}
      `}
      onClick={() => onClick?.(student)}
    >
      <CardContent className={cardSizes[size]}>
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          {student.photo ? (
            <img
              src={student.photo}
              alt={student.fullName}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
              {student.fullName.charAt(0)}
            </div>
          )}
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {student.fullName}
            </h3>
            {student.nickname && (
              <p className="text-sm text-gray-500 truncate">({student.nickname})</p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {student.grade} - {student.institutionType}
              </Badge>
              <Badge className={`text-xs ${levelConfig.color}`}>
                {levelConfig.icon} {progress?.level || 'PEMULA'}
              </Badge>
            </div>
          </div>

          {/* Progress Ring */}
          <div className="flex-shrink-0">
            <ProgressRing 
              progress={progress?.overallProgress || 0}
              size={size === 'lg' ? 80 : size === 'md' ? 70 : 60}
              showText={size !== 'sm'}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{progress?.totalSurah || 0}</div>
            <div className="text-xs text-gray-500">Surah</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{progress?.totalAyat || 0}</div>
            <div className="text-xs text-gray-500">Ayat</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{Math.round(progress?.juz30Progress || 0)}%</div>
            <div className="text-xs text-gray-500">Juz 30</div>
          </div>
        </div>

        {/* Detailed Stats */}
        {showDetailedStats && (
          <div className="space-y-3 mb-4">
            {/* Quality Average */}
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">Rata-rata Kualitas</span>
              </div>
              <Badge variant="outline">
                {progress?.avgQuality ? (
                  progress.avgQuality >= 3.5 ? 'A' : 
                  progress.avgQuality >= 2.5 ? 'B' : 'C'
                ) : 'N/A'}
              </Badge>
            </div>

            {/* Current Streak */}
            {progress?.currentStreak && progress.currentStreak > 0 && (
              <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">Streak</span>
                </div>
                <Badge variant="outline" className="text-orange-600">
                  {progress.currentStreak} hari
                </Badge>
              </div>
            )}

            {/* Total Sessions */}
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
              <div className="flex items-center gap-2">
                <Book className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Total Sesi</span>
              </div>
              <Badge variant="outline" className="text-blue-600">
                {progress?.totalSessions || 0}
              </Badge>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="space-y-2">
          {/* Status */}
          <div className="flex items-center justify-between">
            <Badge className={`text-xs ${statusConfig.color}`}>
              {statusConfig.label}
            </Badge>
            <span className="text-xs text-gray-500">
              {getActivityText()}
            </span>
          </div>

          {/* Recent Record */}
          {recentRecord && (
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              <div className="flex items-center gap-1 mb-1">
                <Book className="w-3 h-3" />
                <span className="font-medium">{recentRecord.surah.name}</span>
                <Badge variant="outline" className="text-xs">
                  {recentRecord.status}
                </Badge>
              </div>
              <div className="text-gray-500">
                {formatDate(recentRecord.date)}
              </div>
            </div>
          )}

          {/* Current Target */}
          {currentTarget && (
            <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
              <div className="flex items-center gap-1 mb-1">
                <Target className="w-3 h-3 text-blue-500" />
                <span className="font-medium">Target: {currentTarget.surah.name}</span>
              </div>
              <div className="text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(currentTarget.targetDate)}
              </div>
            </div>
          )}
        </div>

        {/* Achievement Count */}
        {achievementCount > 0 && (
          <div className="mt-3 pt-3 border-t flex items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-yellow-600">
              <Trophy className="w-4 h-4" />
              <span>{achievementCount} Pencapaian</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}