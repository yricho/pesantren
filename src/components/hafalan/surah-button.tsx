'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Book, Clock, AlertCircle, Star } from 'lucide-react';

interface Surah {
  number: number;
  name: string;
  nameArabic: string;
  totalAyat: number;
  juz: number;
  type: string;
}

interface SurahStatus {
  status: string;
  progress: number;
  completedAyatsCount: number;
  lastRecord?: {
    quality: string;
    date: string;
  };
}

interface SurahButtonProps {
  surah: Surah;
  status?: SurahStatus;
  onClick: (surah: Surah) => void;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

export function SurahButton({ 
  surah, 
  status, 
  onClick, 
  size = 'md',
  showProgress = true 
}: SurahButtonProps) {
  
  const getStatusColor = () => {
    if (!status) return 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300';
    
    switch (status.status) {
      case 'MUTQIN':
        return 'bg-green-500 text-white hover:bg-green-600 border-green-500 shadow-green-200';
      case 'LANCAR':
        return 'bg-blue-500 text-white hover:bg-blue-600 border-blue-500 shadow-blue-200';
      case 'MURAJA\'AH':
      case 'SEDANG_DIHAFAL':
        return 'bg-yellow-500 text-white hover:bg-yellow-600 border-yellow-500 shadow-yellow-200';
      case 'BARU':
        return 'bg-orange-500 text-white hover:bg-orange-600 border-orange-500 shadow-orange-200';
      case 'PERLU_MURAJA\'AH':
        return 'bg-red-500 text-white hover:bg-red-600 border-red-500 shadow-red-200';
      default:
        return 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300';
    }
  };

  const getStatusIcon = () => {
    if (!status) return null;
    
    const iconClass = 'w-4 h-4';
    switch (status.status) {
      case 'MUTQIN':
        return <CheckCircle className={`${iconClass} text-green-100`} />;
      case 'LANCAR':
        return <Book className={`${iconClass} text-blue-100`} />;
      case 'SEDANG_DIHAFAL':
        return <Clock className={`${iconClass} text-yellow-100`} />;
      case 'PERLU_MURAJA\'AH':
        return <AlertCircle className={`${iconClass} text-red-100`} />;
      default:
        return null;
    }
  };

  const getQualityStars = () => {
    if (!status?.lastRecord?.quality) return null;
    
    const quality = status.lastRecord.quality;
    const stars = quality === 'A' ? 3 : quality === 'B' ? 2 : 1;
    
    return (
      <div className="flex items-center gap-1 absolute top-1 left-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < stars 
                ? 'text-yellow-300 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const sizeClasses = {
    sm: 'p-2 h-auto gap-1 text-xs min-h-[80px]',
    md: 'p-3 h-auto gap-2 text-sm min-h-[100px]',
    lg: 'p-4 h-auto gap-3 text-base min-h-[120px]'
  };

  const numberSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <Button
      variant="outline"
      className={`
        ${sizeClasses[size]}
        ${getStatusColor()}
        flex-col items-center relative transition-all duration-200 
        shadow-lg hover:shadow-xl transform hover:scale-105
        border-2 rounded-xl
      `}
      onClick={() => onClick(surah)}
    >
      {/* Quality Stars */}
      {getQualityStars()}
      
      {/* Status Icon */}
      <div className="absolute top-2 right-2">
        {getStatusIcon()}
      </div>

      {/* Surah Number */}
      <div className={`${numberSizes[size]} font-bold`}>
        {surah.number}
      </div>

      {/* Surah Names */}
      <div className="text-center leading-tight flex-1 flex flex-col justify-center">
        <div className="font-semibold truncate w-full">{surah.name}</div>
        <div className="text-xs opacity-75 font-arabic leading-relaxed">
          {surah.nameArabic}
        </div>
        <div className="text-xs opacity-75">
          {surah.totalAyat} ayat
        </div>
      </div>

      {/* Progress Bar */}
      {showProgress && status && status.progress > 0 && (
        <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mt-1">
          <div
            className="bg-white bg-opacity-80 h-2 rounded-full transition-all duration-300"
            style={{ width: `${status.progress}%` }}
          />
        </div>
      )}

      {/* Juz Badge */}
      <Badge 
        variant="secondary" 
        className={`
          text-xs absolute bottom-1 left-1 right-1 
          ${status?.status === 'MUTQIN' ? 'bg-green-700 text-green-100' :
            status?.status === 'LANCAR' ? 'bg-blue-700 text-blue-100' :
            status?.status ? 'bg-black bg-opacity-20 text-white' :
            'bg-gray-200 text-gray-700'
          }
        `}
      >
        Juz {surah.juz}
      </Badge>

      {/* Completion Indicator */}
      {status?.progress === 100 && (
        <div className="absolute inset-0 bg-green-500 bg-opacity-10 rounded-xl border-2 border-green-400 border-dashed animate-pulse" />
      )}
    </Button>
  );
}