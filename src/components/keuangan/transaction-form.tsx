'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Plus, Minus, Paperclip, Tag, FileText, Calendar, AlertCircle } from 'lucide-react'
import { TransactionType, TransactionStatus, FinancialCategory, Transaction } from '@/types'

interface TransactionFormProps {
  transaction?: Transaction | null
  categories?: FinancialCategory[]
  onClose: () => void
  onSubmit: (data: {
    type: TransactionType
    categoryId: string
    amount: number
    description: string
    reference?: string
    date: string
    dueDate?: string
    status?: TransactionStatus
    tags?: string[]
    attachments?: string[]
    notes?: string
  }) => void
}

export function TransactionForm({ transaction, categories = [], onClose, onSubmit }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    type: 'INCOME' as TransactionType,
    categoryId: '',
    amount: '',
    description: '',
    reference: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'POSTED' as TransactionStatus,
    tags: [] as string[],
    attachments: [] as string[],
    notes: ''
  })

  const [newTag, setNewTag] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  // Populate form with transaction data for editing
  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        categoryId: transaction.categoryId,
        amount: transaction.amount.toString(),
        description: transaction.description,
        reference: transaction.reference || '',
        date: new Date(transaction.date).toISOString().split('T')[0],
        dueDate: transaction.dueDate ? new Date(transaction.dueDate).toISOString().split('T')[0] : '',
        status: transaction.status,
        tags: transaction.tags || [],
        attachments: transaction.attachments || [],
        notes: transaction.notes || ''
      })
    }
  }, [transaction])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.categoryId) {
      newErrors.categoryId = 'Kategori harus dipilih'
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Jumlah harus lebih dari 0'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi tidak boleh kosong'
    }

    if (!formData.date) {
      newErrors.date = 'Tanggal harus diisi'
    }

    if (formData.dueDate && new Date(formData.dueDate) <= new Date(formData.date)) {
      newErrors.dueDate = 'Tanggal jatuh tempo harus setelah tanggal transaksi'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        type: formData.type,
        categoryId: formData.categoryId,
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        reference: formData.reference.trim() || undefined,
        date: new Date(formData.date).toISOString(),
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
        status: formData.status,
        tags: formData.tags,
        attachments: formData.attachments,
        notes: formData.notes.trim() || undefined,
      })
    } catch (error) {
      console.error('Error submitting transaction:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      })
      setNewTag('')
    }
  }

  const handleRemoveTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index)
    })
  }

  const getFilteredCategories = () => {
    return categories.filter(cat => cat.type === formData.type && cat.isActive)
  }

  const formatCurrency = (value: string) => {
    const number = value.replace(/[^\d]/g, '')
    return new Intl.NumberFormat('id-ID').format(parseInt(number) || 0)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '')
    setFormData({ ...formData, amount: rawValue })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {transaction ? 'Edit Transaksi' : 'Transaksi Baru'}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Transaksi *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    type: e.target.value as TransactionType, 
                    categoryId: '' // Reset category when type changes
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="INCOME">Pemasukan</option>
                  <option value="EXPENSE">Pengeluaran</option>
                  <option value="DONATION">Donasi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as TransactionStatus })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="POSTED">Posted</option>
                </select>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.categoryId ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Pilih Kategori</option>
                {getFilteredCategories().map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                    {category.account && ` (${category.account.code})`}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.categoryId}
                </div>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah (Rp) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">Rp</span>
                <Input
                  type="text"
                  value={formatCurrency(formData.amount)}
                  onChange={handleAmountChange}
                  className={`pl-10 ${errors.amount ? 'border-red-500' : ''}`}
                  placeholder="0"
                  required
                />
              </div>
              {errors.amount && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.amount}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={3}
                placeholder="Deskripsi transaksi..."
                required
              />
              {errors.description && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </div>
              )}
            </div>

            {/* Reference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referensi/No. Faktur
              </label>
              <Input
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                placeholder="Nomor invoice, kwitansi, atau referensi lainnya"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Tanggal Transaksi *
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={errors.date ? 'border-red-500' : ''}
                  required
                />
                {errors.date && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.date}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Tanggal Jatuh Tempo
                </label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className={errors.dueDate ? 'border-red-500' : ''}
                />
                {errors.dueDate && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.dueDate}
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Tambah tag..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                placeholder="Catatan tambahan..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={loading}
              >
                Batal
              </Button>
              <Button 
                type="submit"
                disabled={loading}
                className="min-w-[100px]"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    {transaction ? 'Update' : 'Simpan'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}