'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Book, Hash, Minus } from 'lucide-react';

interface AyatSelectorProps {
  totalAyat: number;
  startAyat: number;
  endAyat: number;
  onRangeChange: (start: number, end: number) => void;
  className?: string;
}

export function AyatSelector({
  totalAyat,
  startAyat,
  endAyat,
  onRangeChange,
  className = ''
}: AyatSelectorProps) {
  const [expanded, setExpanded] = useState(false);

  // Common ayat ranges for quick selection
  const commonRanges = [
    { label: '1-5', start: 1, end: Math.min(5, totalAyat) },
    { label: '1-10', start: 1, end: Math.min(10, totalAyat) },
    { label: '1-20', start: 1, end: Math.min(20, totalAyat) },
    { label: 'Seluruh Surah', start: 1, end: totalAyat },
  ].filter(range => range.end <= totalAyat);

  if (totalAyat <= 10) {
    commonRanges.push(
      { label: 'Setengah Awal', start: 1, end: Math.ceil(totalAyat / 2) },
      { label: 'Setengah Akhir', start: Math.ceil(totalAyat / 2) + 1, end: totalAyat }
    );
  }

  const handleStartChange = (value: string) => {
    const start = Math.max(1, Math.min(parseInt(value) || 1, totalAyat));
    const end = Math.max(start, endAyat);
    onRangeChange(start, end);
  };

  const handleEndChange = (value: string) => {
    const end = Math.max(startAyat, Math.min(parseInt(value) || totalAyat, totalAyat));
    onRangeChange(startAyat, end);
  };

  const selectRange = (start: number, end: number) => {
    onRangeChange(start, end);
  };

  const adjustRange = (startDelta: number, endDelta: number) => {
    const newStart = Math.max(1, Math.min(startAyat + startDelta, totalAyat));
    const newEnd = Math.max(newStart, Math.min(endAyat + endDelta, totalAyat));
    onRangeChange(newStart, newEnd);
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        {/* Header */}
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-2">
            <Book className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Pilih Range Ayat</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              Ayat {startAyat}-{endAyat} ({endAyat - startAyat + 1} ayat)
            </Badge>
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="mt-4 space-y-4">
            {/* Quick Selection Buttons */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Pilihan Cepat:
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {commonRanges.map((range, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className={`
                      ${startAyat === range.start && endAyat === range.end 
                        ? 'bg-blue-100 border-blue-500 text-blue-700' 
                        : 'hover:bg-gray-50'
                      }
                    `}
                    onClick={() => selectRange(range.start, range.end)}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Manual Input */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startAyat" className="text-sm font-medium text-gray-700">
                  Ayat Mulai
                </Label>
                <div className="mt-1 relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="startAyat"
                    type="number"
                    min="1"
                    max={totalAyat}
                    value={startAyat}
                    onChange={(e) => handleStartChange(e.target.value)}
                    className="pl-10 text-center text-lg font-semibold"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="endAyat" className="text-sm font-medium text-gray-700">
                  Ayat Akhir
                </Label>
                <div className="mt-1 relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="endAyat"
                    type="number"
                    min={startAyat}
                    max={totalAyat}
                    value={endAyat}
                    onChange={(e) => handleEndChange(e.target.value)}
                    className="pl-10 text-center text-lg font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Range Adjustment Buttons */}
            <div className="flex justify-center">
              <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => adjustRange(-1, 0)}
                  disabled={startAyat <= 1}
                  className="h-8 w-8 p-0"
                  title="Kurangi ayat awal"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600 px-2">Awal</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => adjustRange(1, 0)}
                  disabled={startAyat >= endAyat}
                  className="h-8 w-8 p-0"
                  title="Tambah ayat awal"
                >
                  +
                </Button>
                
                <div className="w-4" />
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => adjustRange(0, -1)}
                  disabled={endAyat <= startAyat}
                  className="h-8 w-8 p-0"
                  title="Kurangi ayat akhir"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600 px-2">Akhir</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => adjustRange(0, 1)}
                  disabled={endAyat >= totalAyat}
                  className="h-8 w-8 p-0"
                  title="Tambah ayat akhir"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Visual Range Indicator */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Ayat 1</span>
                <span>Ayat {totalAyat}</span>
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-200"
                  style={{
                    left: `${((startAyat - 1) / totalAyat) * 100}%`,
                    width: `${((endAyat - startAyat + 1) / totalAyat) * 100}%`
                  }}
                />
              </div>
              <div className="text-center mt-2">
                <span className="text-sm font-medium text-gray-700">
                  {endAyat - startAyat + 1} ayat dari {totalAyat} ayat total
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  ({Math.round(((endAyat - startAyat + 1) / totalAyat) * 100)}%)
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}