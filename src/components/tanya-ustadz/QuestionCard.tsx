'use client';

import { useState } from 'react';
import { QuestionWithAnswer, QUESTION_CATEGORIES } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  User, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp,
  Tag,
  UserCheck,
  CheckCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface QuestionCardProps {
  question: QuestionWithAnswer;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryInfo = QUESTION_CATEGORIES.find(cat => cat.value === question.category);
  
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: id });
  };

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      {/* Question Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <Badge 
              variant="secondary" 
              className={`${categoryInfo?.color || 'bg-gray-100 text-gray-800'} border-0`}
            >
              <Tag className="w-3 h-3 mr-1" />
              {categoryInfo?.label || question.category}
            </Badge>
            <div className="flex items-center text-sm text-gray-500">
              <User className="w-4 h-4 mr-1" />
              {question.askerName || 'Anonim'}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(question.createdAt)}
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Pertanyaan:</h3>
        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-emerald-500">
          <p className="text-gray-700 whitespace-pre-wrap">
            {isExpanded ? question.question : truncateText(question.question)}
          </p>
          {question.question.length > 200 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-emerald-600 hover:text-emerald-700 p-0 h-auto font-normal"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Tampilkan lebih sedikit
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Baca selengkapnya
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Answer Content */}
      {question.answer && (
        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <h3 className="font-medium text-gray-900">Jawaban:</h3>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center">
                <UserCheck className="w-4 h-4 mr-1" />
                {question.answer.ustadz.name}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(question.answer.createdAt)}
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
            <p className="text-gray-700 whitespace-pre-wrap">
              {question.answer.answer}
            </p>
          </div>

          {/* Answer Updated Info */}
          {question.answer.updatedAt && 
           new Date(question.answer.updatedAt).getTime() !== new Date(question.answer.createdAt).getTime() && (
            <p className="text-xs text-gray-500 mt-2 italic">
              Jawaban diperbarui {formatDate(question.answer.updatedAt)}
            </p>
          )}
        </div>
      )}

      {/* Footer with additional info if needed */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>ID: {question.id.substring(0, 8)}</span>
          {question.answer && (
            <span className="flex items-center">
              <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
              Terjawab
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}