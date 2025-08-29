'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/layout/header'
import { 
  Plus, Search, Filter, Download, Edit, Trash2, Eye, 
  Calendar, FileText, Tag, ArrowUpDown, MoreHorizontal,
  CheckCircle, XCircle, Clock, AlertCircle
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Transaction, TransactionType, TransactionStatus, FinancialCategory } from '@/types'
import { TransactionForm } from '@/components/keuangan/transaction-form'
import Link from 'next/link'

interface TransactionFilters {
  search: string
  type: TransactionType | 'all'
  status: TransactionStatus | 'all'
  categoryId: string
  dateFrom: string
  dateTo: string
  sortBy: 'date' | 'amount' | 'createdAt'
  sortOrder: 'asc' | 'desc'
}

export default function TransactionManagement() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<FinancialCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalTransactions, setTotalTransactions] = useState(0)

  const [filters, setFilters] = useState<TransactionFilters>({
    search: '',
    type: 'all',
    status: 'all',
    categoryId: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'date',
    sortOrder: 'desc',
  })

  useEffect(() => {
    fetchTransactions()
  }, [currentPage, filters])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/finance/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      })

      if (filters.search) params.append('search', filters.search)
      if (filters.type !== 'all') params.append('type', filters.type)
      if (filters.status !== 'all') params.append('status', filters.status)
      if (filters.categoryId) params.append('categoryId', filters.categoryId)
      if (filters.dateFrom) params.append('dateFrom', new Date(filters.dateFrom).toISOString())
      if (filters.dateTo) params.append('dateTo', new Date(filters.dateTo).toISOString())

      const response = await fetch(`/api/finance/transactions?${params}`)
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions || [])
        setTotalPages(data.pagination?.totalPages || 1)
        setTotalTransactions(data.pagination?.total || 0)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handleSort = (field: 'date' | 'amount' | 'createdAt') => {
    const newOrder = filters.sortBy === field && filters.sortOrder === 'asc' ? 'desc' : 'asc'
    setFilters(prev => ({ ...prev, sortBy: field, sortOrder: newOrder }))
  }

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) return

    try {
      const response = await fetch(`/api/finance/transactions/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchTransactions()
      }
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedTransactions.length} transaksi yang dipilih?`)) return

    try {
      const promises = selectedTransactions.map(id =>
        fetch(`/api/finance/transactions/${id}`, { method: 'DELETE' })
      )
      await Promise.all(promises)
      setSelectedTransactions([])
      fetchTransactions()
    } catch (error) {
      console.error('Error deleting transactions:', error)
    }
  }

  const handleExport = async (format: 'excel' | 'pdf' = 'excel') => {
    try {
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.type !== 'all') params.append('type', filters.type)
      if (filters.status !== 'all') params.append('status', filters.status)
      if (filters.categoryId) params.append('categoryId', filters.categoryId)
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
      if (filters.dateTo) params.append('dateTo', filters.dateTo)
      params.append('format', format)

      // For now, just download the filtered data as JSON
      // In production, this would generate proper Excel/PDF files
      const response = await fetch(`/api/finance/transactions?${params}&limit=10000`)
      const data = await response.json()
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `transactions-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting transactions:', error)
    }
  }

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case 'POSTED': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'DRAFT': return <Clock className="w-4 h-4 text-yellow-600" />
      case 'CANCELLED': return <XCircle className="w-4 h-4 text-red-600" />
      case 'REVERSED': return <AlertCircle className="w-4 h-4 text-orange-600" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusLabel = (status: TransactionStatus) => {
    switch (status) {
      case 'POSTED': return 'Posted'
      case 'DRAFT': return 'Draft'
      case 'CANCELLED': return 'Dibatalkan'
      case 'REVERSED': return 'Dibalik'
      default: return status
    }
  }

  const getTransactionTypeLabel = (type: TransactionType) => {
    switch (type) {
      case 'INCOME': return 'Pemasukan'
      case 'EXPENSE': return 'Pengeluaran'
      case 'DONATION': return 'Donasi'
    }
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      status: 'all',
      categoryId: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'date',
      sortOrder: 'desc',
    })
    setCurrentPage(1)
  }

  if (loading && currentPage === 1) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Manajemen Transaksi" />
      
      <main className="p-6 space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transaksi</h1>
            <p className="text-gray-600">Kelola semua transaksi keuangan</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('excel')}>
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <FileText className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Transaksi Baru
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Transaksi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTransactions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">
                Posted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {transactions.filter(t => t.status === 'POSTED').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600">
                Draft
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {transactions.filter(t => t.status === 'DRAFT').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">
                Dibatalkan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {transactions.filter(t => t.status === 'CANCELLED').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter & Pencarian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari transaksi..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value as TransactionType | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="all">Semua Tipe</option>
                <option value="INCOME">Pemasukan</option>
                <option value="EXPENSE">Pengeluaran</option>
                <option value="DONATION">Donasi</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value as TransactionStatus | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="all">Semua Status</option>
                <option value="POSTED">Posted</option>
                <option value="DRAFT">Draft</option>
                <option value="CANCELLED">Dibatalkan</option>
                <option value="REVERSED">Dibalik</option>
              </select>

              <select
                value={filters.categoryId}
                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="">Semua Kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({getTransactionTypeLabel(category.type)})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Dari
                </label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Sampai
                </label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={resetFilters}>
                Reset Filter
              </Button>
              
              {selectedTransactions.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {selectedTransactions.length} dipilih
                  </span>
                  <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Hapus
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Tidak ada transaksi ditemukan</p>
                <p className="text-sm">Coba ubah filter atau tambah transaksi baru</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">
                          <input
                            type="checkbox"
                            checked={selectedTransactions.length === transactions.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedTransactions(transactions.map(t => t.id))
                              } else {
                                setSelectedTransactions([])
                              }
                            }}
                          />
                        </th>
                        <th className="text-left p-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort('date')}
                            className="font-medium"
                          >
                            Tanggal
                            <ArrowUpDown className="w-4 h-4 ml-1" />
                          </Button>
                        </th>
                        <th className="text-left p-3 font-medium">No. Transaksi</th>
                        <th className="text-left p-3 font-medium">Tipe</th>
                        <th className="text-left p-3 font-medium">Kategori</th>
                        <th className="text-left p-3 font-medium">Deskripsi</th>
                        <th className="text-left p-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort('amount')}
                            className="font-medium"
                          >
                            Jumlah
                            <ArrowUpDown className="w-4 h-4 ml-1" />
                          </Button>
                        </th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={selectedTransactions.includes(transaction.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedTransactions([...selectedTransactions, transaction.id])
                                } else {
                                  setSelectedTransactions(selectedTransactions.filter(id => id !== transaction.id))
                                }
                              }}
                            />
                          </td>
                          <td className="p-3 text-sm">
                            {formatDate(transaction.date)}
                          </td>
                          <td className="p-3">
                            <span className="font-mono text-sm text-blue-600">
                              {transaction.transactionNo || '-'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.type === 'INCOME' ? 'bg-green-100 text-green-800' :
                              transaction.type === 'EXPENSE' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {getTransactionTypeLabel(transaction.type)}
                            </span>
                          </td>
                          <td className="p-3 text-sm">
                            {transaction.category?.name || 'Tidak ada kategori'}
                          </td>
                          <td className="p-3 max-w-xs truncate" title={transaction.description}>
                            {transaction.description}
                          </td>
                          <td className="p-3">
                            <span className={`font-bold ${
                              transaction.type === 'EXPENSE' ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {transaction.type === 'EXPENSE' ? '-' : '+'}
                              {formatCurrency(transaction.amount)}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(transaction.status)}
                              <span className="text-sm">{getStatusLabel(transaction.status)}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // View transaction details
                                  console.log('View transaction:', transaction.id)
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingTransaction(transaction)
                                  setShowForm(true)
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTransaction(transaction.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      Menampilkan {((currentPage - 1) * 20) + 1} - {Math.min(currentPage * 20, totalTransactions)} dari {totalTransactions} transaksi
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </Button>
                      
                      <span className="text-sm">
                        Halaman {currentPage} dari {totalPages}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Transaction Form Modal */}
      {showForm && (
        <TransactionForm
          categories={categories}
          transaction={editingTransaction}
          onClose={() => {
            setShowForm(false)
            setEditingTransaction(null)
          }}
          onSubmit={async (data) => {
            try {
              const url = editingTransaction 
                ? `/api/finance/transactions/${editingTransaction.id}`
                : '/api/finance/transactions'
              
              const method = editingTransaction ? 'PUT' : 'POST'
              
              const response = await fetch(url, {
                method,
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
              })
              
              if (response.ok) {
                setShowForm(false)
                setEditingTransaction(null)
                fetchTransactions()
              }
            } catch (error) {
              console.error('Error saving transaction:', error)
            }
          }}
        />
      )}
    </div>
  )
}