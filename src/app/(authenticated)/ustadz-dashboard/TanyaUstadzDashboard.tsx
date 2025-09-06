'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircleQuestion,
  Clock,
  CheckCircle,
  Search,
  Filter,
  Eye,
  Edit,
  Send,
  AlertCircle,
  Calendar,
  User,
  Tag,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { QuestionCategory, QUESTION_CATEGORIES, PaginatedResponse } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface UstadzUser {
  id: string;
  name: string;
  role: string;
  isUstadz: boolean;
}

interface Question {
  id: string;
  question: string;
  category: QuestionCategory;
  categoryLabel: string;
  categoryColor: string;
  askerName: string;
  isAnonymous: boolean;
  status: 'pending' | 'answered';
  createdAt: string;
  updatedAt: string;
}

interface QuestionWithAnswer extends Question {
  answer?: {
    id: string;
    answer: string;
    ustadz: {
      id: string;
      name: string;
    };
    createdAt: string;
    updatedAt: string;
  };
}

interface TanyaUstadzDashboardProps {
  user: UstadzUser;
}

export default function TanyaUstadzDashboard({ user }: TanyaUstadzDashboardProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'answered'>('pending');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionWithAnswer | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [answer, setAnswer] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  const [stats, setStats] = useState({
    totalPending: 0,
    totalAnswered: 0,
    myAnswers: 0
  });

  useEffect(() => {
    fetchQuestions();
    fetchStats();
  }, [activeTab, selectedCategory, searchTerm, pagination.page]);

  const fetchStats = async () => {
    try {
      const [pendingRes, publicRes] = await Promise.all([
        fetch('/api/questions/pending?limit=1'),
        fetch('/api/questions/public?limit=1')
      ]);

      if (pendingRes.ok) {
        const pendingData = await pendingRes.json();
        setStats(prev => ({ ...prev, totalPending: pendingData.pagination?.total || 0 }));
      }

      if (publicRes.ok) {
        const publicData = await publicRes.json();
        setStats(prev => ({ ...prev, totalAnswered: publicData.pagination?.total || 0 }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'pending' ? '/api/questions/pending' : '/api/questions/public';
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      if (selectedCategory) params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`${endpoint}?${params}`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.data || []);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestionDetails = async (questionId: string) => {
    try {
      const response = await fetch(`/api/questions/${questionId}/answer`);
      if (response.ok) {
        const data = await response.json();
        setSelectedQuestion(data.data);
        setAnswer(data.data.answer?.answer || '');
      }
    } catch (error) {
      console.error('Error fetching question details:', error);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedQuestion || !answer.trim()) return;

    setSubmitting(true);
    try {
      const method = selectedQuestion.answer ? 'PUT' : 'POST';
      const response = await fetch(`/api/questions/${selectedQuestion.id}/answer`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer: answer.trim() }),
      });

      if (response.ok) {
        // Refresh questions list and close modal
        fetchQuestions();
        fetchStats();
        setSelectedQuestion(null);
        setAnswer('');
        
        // Show success message
        alert(selectedQuestion.answer ? 'Jawaban berhasil diperbarui!' : 'Jawaban berhasil dikirim!');
      } else {
        const data = await response.json();
        alert(data.message || 'Terjadi kesalahan');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Terjadi kesalahan saat mengirim jawaban');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const formatDate = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: id });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Tanya Ustadz Dashboard
        </h1>
        <p className="text-gray-600">
          Kelola pertanyaan dan jawaban dari jamaah
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.totalPending}</div>
              <div className="text-gray-600 text-sm">Menunggu Jawaban</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.totalAnswered}</div>
              <div className="text-gray-600 text-sm">Sudah Dijawab</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.myAnswers}</div>
              <div className="text-gray-600 text-sm">Jawaban Saya</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'pending' ? 'default' : 'outline'}
          onClick={() => setActiveTab('pending')}
          className="flex items-center gap-2"
        >
          <Clock className="w-4 h-4" />
          Belum Dijawab ({stats.totalPending})
        </Button>
        <Button
          variant={activeTab === 'answered' ? 'default' : 'outline'}
          onClick={() => setActiveTab('answered')}
          className="flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Sudah Dijawab ({stats.totalAnswered})
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as QuestionCategory | '')}
          >
            <option value="">Semua Kategori</option>
            {QUESTION_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Questions List */}
      <Card className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Memuat pertanyaan...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircleQuestion className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {activeTab === 'pending' ? 'Tidak ada pertanyaan yang menunggu jawaban' : 'Tidak ada pertanyaan yang dijawab'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className={question.categoryColor}>
                      <Tag className="w-3 h-3 mr-1" />
                      {question.categoryLabel}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-1" />
                      {question.askerName}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(question.createdAt)}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fetchQuestionDetails(question.id)}
                    className="flex items-center gap-2"
                  >
                    {activeTab === 'pending' ? (
                      <>
                        <Send className="w-4 h-4" />
                        Jawab
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Lihat
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-gray-700 mb-2">
                  {truncateText(question.question)}
                </p>
                {question.status === 'answered' && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Sudah dijawab
                  </div>
                )}
              </div>
            ))}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                >
                  Sebelumnya
                </Button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Halaman {pagination.page} dari {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                >
                  Selanjutnya
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Answer Modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedQuestion.answer ? 'Edit Jawaban' : 'Jawab Pertanyaan'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedQuestion(null)}
                >
                  ✕
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Question Details */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className={QUESTION_CATEGORIES.find(c => c.value === selectedQuestion.category)?.color || 'bg-gray-100'}>
                    <Tag className="w-3 h-3 mr-1" />
                    {QUESTION_CATEGORIES.find(c => c.value === selectedQuestion.category)?.label}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="w-4 h-4 mr-1" />
                    {selectedQuestion.askerName}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(selectedQuestion.createdAt)}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <h3 className="font-medium text-gray-900 mb-2">Pertanyaan:</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedQuestion.question}</p>
                </div>
              </div>

              {/* Existing Answer (if editing) */}
              {selectedQuestion.answer && (
                <div className="mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <h3 className="font-medium text-gray-900 mb-2">Jawaban Saat Ini:</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedQuestion.answer.answer}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Dijawab oleh {selectedQuestion.answer.ustadz.name} • {formatDate(selectedQuestion.answer.createdAt)}
                    </p>
                  </div>
                </div>
              )}

              {/* Answer Form */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedQuestion.answer ? 'Jawaban Baru:' : 'Jawaban Anda:'}
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                  rows={8}
                  placeholder="Tulis jawaban Anda di sini..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  minLength={10}
                  maxLength={5000}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    Minimal 10 karakter, maksimal 5000 karakter
                  </p>
                  <p className="text-xs text-gray-500">
                    {answer.length}/5000
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedQuestion(null)}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={submitting || !answer.trim() || answer.length < 10}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {submitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {selectedQuestion.answer ? 'Memperbarui...' : 'Mengirim...'}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="w-4 h-4 mr-2" />
                      {selectedQuestion.answer ? 'Perbarui Jawaban' : 'Kirim Jawaban'}
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}