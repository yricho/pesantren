'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { QuestionCategory, QUESTION_CATEGORIES, QuestionFormData } from '@/types';
import { Send, User, UserX, CheckCircle } from 'lucide-react';

interface QuestionFormProps {
  onSuccess?: () => void;
}

export default function QuestionForm({ onSuccess }: QuestionFormProps) {
  const [formData, setFormData] = useState<QuestionFormData>({
    question: '',
    category: 'fiqih_ibadah',
    askerName: '',
    isAnonymous: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare submission data
      const submissionData = {
        question: formData.question,
        category: formData.category,
        isAnonymous: formData.isAnonymous,
        askerName: formData.isAnonymous ? null : (formData.askerName || null)
      };

      const response = await fetch('/api/questions/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
        setFormData({
          question: '',
          category: 'fiqih_ibadah',
          askerName: '',
          isAnonymous: false
        });
        onSuccess?.();
      } else {
        setError(data.message || 'Terjadi kesalahan saat mengirim pertanyaan');
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      setError('Terjadi kesalahan saat mengirim pertanyaan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof QuestionFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-6">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Pertanyaan Berhasil Dikirim!
        </h3>
        <p className="text-gray-600 mb-6">
          Terima kasih telah mengajukan pertanyaan. Ustadz kami akan menjawab dalam 1-3 hari kerja.
        </p>
        <Button
          onClick={() => setSubmitted(false)}
          variant="outline"
        >
          Ajukan Pertanyaan Lain
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kategori Pertanyaan *
        </label>
        <select
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          value={formData.category}
          onChange={(e) => handleInputChange('category', e.target.value as QuestionCategory)}
        >
          {QUESTION_CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          {QUESTION_CATEGORIES.find(c => c.value === formData.category)?.description}
        </p>
      </div>

      {/* Anonymous Toggle */}
      <div>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            checked={formData.isAnonymous}
            onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
          />
          <div className="flex items-center space-x-2">
            {formData.isAnonymous ? (
              <UserX className="w-4 h-4 text-gray-500" />
            ) : (
              <User className="w-4 h-4 text-gray-500" />
            )}
            <span className="text-sm font-medium text-gray-700">
              Ajukan secara anonim
            </span>
          </div>
        </label>
        <p className="text-xs text-gray-500 mt-1 ml-7">
          {formData.isAnonymous 
            ? 'Pertanyaan Anda akan ditampilkan tanpa nama'
            : 'Nama Anda akan ditampilkan bersama pertanyaan'
          }
        </p>
      </div>

      {/* Name Input (if not anonymous) */}
      {!formData.isAnonymous && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Anda
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Masukkan nama Anda"
            value={formData.askerName || ''}
            onChange={(e) => handleInputChange('askerName', e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Opsional. Jika kosong, akan ditampilkan sebagai "Anonim"
          </p>
        </div>
      )}

      {/* Question Textarea */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pertanyaan Anda *
        </label>
        <textarea
          required
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-vertical"
          placeholder="Tulis pertanyaan Anda di sini. Jelaskan dengan detail dan jelas agar ustadz dapat memberikan jawaban yang tepat..."
          value={formData.question}
          onChange={(e) => handleInputChange('question', e.target.value)}
          minLength={10}
          maxLength={2000}
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500">
            Minimal 10 karakter, maksimal 2000 karakter
          </p>
          <p className="text-xs text-gray-500">
            {formData.question.length}/2000
          </p>
        </div>
      </div>

      {/* Guidelines */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-emerald-900 mb-2">
          Panduan Bertanya:
        </h4>
        <ul className="text-xs text-emerald-800 space-y-1">
          <li>• Gunakan bahasa yang sopan dan santun</li>
          <li>• Berikan konteks yang cukup untuk pertanyaan Anda</li>
          <li>• Hindari pertanyaan yang bersifat pribadi atau sensitif</li>
          <li>• Pastikan pertanyaan berkaitan dengan ajaran Islam</li>
        </ul>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || !formData.question.trim()}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        size="lg"
      >
        {isSubmitting ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Mengirim...
          </div>
        ) : (
          <div className="flex items-center">
            <Send className="w-4 h-4 mr-2" />
            Kirim Pertanyaan
          </div>
        )}
      </Button>
    </form>
  );
}