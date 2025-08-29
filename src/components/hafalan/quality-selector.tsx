'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Star, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface QualityScore {
  overall: string;
  fluency?: string;
  tajweed?: string;
  makharijul?: string;
}

interface QualitySelectorProps {
  quality: QualityScore;
  onChange: (quality: QualityScore) => void;
  simple?: boolean; // Simple mode shows only overall quality
  className?: string;
}

const QUALITY_OPTIONS = [
  {
    value: 'A',
    label: 'Sangat Baik',
    description: 'Lancar, tajweed benar, makharijul tepat',
    icon: CheckCircle2,
    color: 'bg-green-500 hover:bg-green-600 text-white',
    stars: 3
  },
  {
    value: 'B',
    label: 'Baik',
    description: 'Cukup lancar, sedikit kesalahan kecil',
    icon: CheckCircle2,
    color: 'bg-blue-500 hover:bg-blue-600 text-white',
    stars: 2
  },
  {
    value: 'C',
    label: 'Perlu Perbaikan',
    description: 'Masih banyak kesalahan, perlu latihan',
    icon: AlertTriangle,
    color: 'bg-orange-500 hover:bg-orange-600 text-white',
    stars: 1
  }
];

const FLUENCY_OPTIONS = [
  { value: 'LANCAR', label: 'Lancar', color: 'bg-green-100 text-green-800' },
  { value: 'TERBATA', label: 'Terbata-bata', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'TERPUTUS', label: 'Sering Terputus', color: 'bg-red-100 text-red-800' }
];

const TAJWEED_OPTIONS = [
  { value: 'SANGAT_BAIK', label: 'Sangat Baik', color: 'bg-green-100 text-green-800' },
  { value: 'BAIK', label: 'Baik', color: 'bg-blue-100 text-blue-800' },
  { value: 'CUKUP', label: 'Cukup', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'KURANG', label: 'Kurang', color: 'bg-red-100 text-red-800' }
];

const MAKHARIJUL_OPTIONS = [
  { value: 'SANGAT_BAIK', label: 'Sangat Baik', color: 'bg-green-100 text-green-800' },
  { value: 'BAIK', label: 'Baik', color: 'bg-blue-100 text-blue-800' },
  { value: 'CUKUP', label: 'Cukup', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'KURANG', label: 'Kurang', color: 'bg-red-100 text-red-800' }
];

export function QualitySelector({ 
  quality, 
  onChange, 
  simple = false, 
  className = '' 
}: QualitySelectorProps) {

  const updateQuality = (field: keyof QualityScore, value: string) => {
    onChange({ ...quality, [field]: value });
  };

  const getStars = (count: number) => {
    return Array.from({ length: 3 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < count 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (simple) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Penilaian Kualitas Hafalan:
          </Label>
          <div className="grid grid-cols-1 gap-2">
            {QUALITY_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <Button
                  key={option.value}
                  variant={quality.overall === option.value ? "default" : "outline"}
                  className={`
                    p-4 h-auto justify-start text-left
                    ${quality.overall === option.value ? option.color : 'hover:bg-gray-50'}
                  `}
                  onClick={() => updateQuality('overall', option.value)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <Icon className="w-6 h-6" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{option.label}</span>
                        <div className="flex">{getStars(option.stars)}</div>
                      </div>
                      <p className="text-sm opacity-80 mt-1">{option.description}</p>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-6">
        {/* Overall Quality */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Kualitas Keseluruhan:
          </Label>
          <div className="grid grid-cols-1 gap-2">
            {QUALITY_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <Button
                  key={option.value}
                  variant={quality.overall === option.value ? "default" : "outline"}
                  className={`
                    p-3 h-auto justify-start text-left text-sm
                    ${quality.overall === option.value ? option.color : 'hover:bg-gray-50'}
                  `}
                  onClick={() => updateQuality('overall', option.value)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <Icon className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{option.label}</span>
                        <div className="flex">{getStars(option.stars)}</div>
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Fluency Assessment */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Kelancaran:
          </Label>
          <div className="flex flex-wrap gap-2">
            {FLUENCY_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                size="sm"
                className={`
                  ${quality.fluency === option.value ? option.color : 'hover:bg-gray-50'}
                `}
                onClick={() => updateQuality('fluency', option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tajweed Assessment */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Tajweed:
          </Label>
          <div className="flex flex-wrap gap-2">
            {TAJWEED_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                size="sm"
                className={`
                  ${quality.tajweed === option.value ? option.color : 'hover:bg-gray-50'}
                `}
                onClick={() => updateQuality('tajweed', option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Makharijul Huruf Assessment */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Makharijul Huruf:
          </Label>
          <div className="flex flex-wrap gap-2">
            {MAKHARIJUL_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                size="sm"
                className={`
                  ${quality.makharijul === option.value ? option.color : 'hover:bg-gray-50'}
                `}
                onClick={() => updateQuality('makharijul', option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Summary */}
        {quality.overall && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Ringkasan Penilaian:</h4>
            <div className="space-y-1 text-sm text-gray-700">
              <div>Kualitas: <span className="font-medium">{QUALITY_OPTIONS.find(o => o.value === quality.overall)?.label}</span></div>
              {quality.fluency && (
                <div>Kelancaran: <span className="font-medium">{FLUENCY_OPTIONS.find(o => o.value === quality.fluency)?.label}</span></div>
              )}
              {quality.tajweed && (
                <div>Tajweed: <span className="font-medium">{TAJWEED_OPTIONS.find(o => o.value === quality.tajweed)?.label}</span></div>
              )}
              {quality.makharijul && (
                <div>Makharijul Huruf: <span className="font-medium">{MAKHARIJUL_OPTIONS.find(o => o.value === quality.makharijul)?.label}</span></div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}