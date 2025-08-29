'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Plus, Filter, Download } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Transaction, TransactionType } from '@/types'
import { TransactionForm } from '@/components/keuangan/transaction-form'

export default function Keuangan() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<'all' | TransactionType>('all')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  useEffect(() => {
    // Simulate loading transactions
    setTimeout(() => {
      setTransactions([
        {
          id: '1',
          type: 'INCOME',
          category: 'SPP',
          amount: 2500000,
          description: 'Pembayaran SPP Maret 2024',
          date: new Date('2024-03-15'),
          createdBy: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          type: 'DONATION',
          category: 'Sumbangan',
          amount: 5000000,
          description: 'Donasi dari Alumni',
          date: new Date('2024-03-14'),
          createdBy: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '3',
          type: 'EXPENSE',
          category: 'Operasional',
          amount: 500000,
          description: 'Pembelian alat tulis dan perlengkapan kelas',
          date: new Date('2024-03-13'),
          createdBy: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '4',
          type: 'EXPENSE',
          category: 'Maintenance',
          amount: 1200000,
          description: 'Perbaikan AC ruang kelas',
          date: new Date('2024-03-12'),
          createdBy: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredTransactions = transactions.filter(t => {
    const matchesType = filter === 'all' || t.type === filter
    const transactionDate = new Date(t.date)
    const matchesDate = transactionDate.getMonth() === selectedMonth && 
                       transactionDate.getFullYear() === selectedYear
    return matchesType && matchesDate
  })

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'INCOME' || t.type === 'DONATION')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  const getTransactionTypeLabel = (type: TransactionType) => {
    switch (type) {
      case 'INCOME': return 'Pemasukan'
      case 'EXPENSE': return 'Pengeluaran'
      case 'DONATION': return 'Donasi'
    }
  }

  const getTransactionTypeColor = (type: TransactionType) => {
    switch (type) {
      case 'INCOME': return 'text-green-600'
      case 'EXPENSE': return 'text-red-600'
      case 'DONATION': return 'text-blue-600'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Manajemen Keuangan" />
      
      <main className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-green-600">
                Total Pemasukan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalIncome)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-red-600">
                Total Pengeluaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalExpense)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Saldo Bersih
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(balance)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">Semua Transaksi</option>
              <option value="INCOME">Pemasukan</option>
              <option value="EXPENSE">Pengeluaran</option>
              <option value="DONATION">Donasi</option>
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(2024, i).toLocaleDateString('id-ID', { month: 'long' })}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              {Array.from({ length: 5 }, (_, i) => (
                <option key={i} value={2024 - i}>
                  {2024 - i}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Transaksi
            </Button>
          </div>
        </div>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada transaksi ditemukan
                </div>
              ) : (
                filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'INCOME' ? 'bg-green-100 text-green-800' :
                          transaction.type === 'EXPENSE' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {getTransactionTypeLabel(transaction.type)}
                        </span>
                        <span className="text-sm text-gray-600">
                          {transaction.category}
                        </span>
                      </div>
                      <h3 className="font-medium mt-1">
                        {transaction.description}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                    <div className={`text-lg font-bold ${getTransactionTypeColor(transaction.type)}`}>
                      {transaction.type === 'EXPENSE' ? '-' : '+'}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Transaction Form Modal */}
      {showForm && (
        <TransactionForm
          onClose={() => setShowForm(false)}
          onSubmit={(data) => {
            // Add new transaction
            const newTransaction: Transaction = {
              id: Math.random().toString(),
              ...data,
              createdBy: 'current-user',
              createdAt: new Date(),
              updatedAt: new Date()
            }
            setTransactions([newTransaction, ...transactions])
            setShowForm(false)
          }}
        />
      )}
    </div>
  )
}