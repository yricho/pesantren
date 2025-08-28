'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'
import { TransactionType } from '@/types'

interface TransactionFormProps {
  onClose: () => void
  onSubmit: (data: {
    type: TransactionType
    category: string
    amount: number
    description: string
    date: Date
  }) => void
}

export function TransactionForm({ onClose, onSubmit }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    type: 'INCOME' as TransactionType,
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.category || !formData.amount || !formData.description) {
      alert('Mohon lengkapi semua field')
      return
    }

    onSubmit({
      type: formData.type,
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: new Date(formData.date)
    })
  }

  const categories = {
    INCOME: ['SPP', 'Pendaftaran', 'Sewa', 'Jasa', 'Lainnya'],
    EXPENSE: ['Operasional', 'Gaji', 'Maintenance', 'Utilitas', 'Konsumsi', 'Transport', 'Lainnya'],
    DONATION: ['Donasi Umum', 'Infaq', 'Zakat', 'Wakaf', 'Lainnya']
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tambah Transaksi</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Jenis Transaksi
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType, category: '' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="INCOME">Pemasukan</option>
                <option value="EXPENSE">Pengeluaran</option>
                <option value="DONATION">Donasi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Pilih Kategori</option>
                {categories[formData.type].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Jumlah (Rp)
              </label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0"
                min="0"
                step="1000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Deskripsi
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                rows={3}
                placeholder="Deskripsi transaksi..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tanggal
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Batal
              </Button>
              <Button type="submit" className="flex-1">
                Simpan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}