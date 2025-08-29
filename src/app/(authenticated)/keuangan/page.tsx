'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Plus, TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Filter, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Transaction, TransactionType, FinancialSummary, FinancialCategory } from '@/types'
import { TransactionForm } from '@/components/keuangan/transaction-form'
import Link from 'next/link'

export default function Keuangan() {
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('current-month')
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<FinancialCategory[]>([])

  useEffect(() => {
    fetchFinancialData()
  }, [selectedPeriod])

  const fetchFinancialData = async () => {
    setLoading(true)
    try {
      // Calculate date range based on selected period
      const now = new Date()
      let startDate: Date
      let endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0) // Last day of current month

      switch (selectedPeriod) {
        case 'current-month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case 'last-month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
          endDate = new Date(now.getFullYear(), now.getMonth(), 0)
          break
        case 'current-year':
          startDate = new Date(now.getFullYear(), 0, 1)
          endDate = new Date(now.getFullYear(), 11, 31)
          break
        case 'last-year':
          startDate = new Date(now.getFullYear() - 1, 0, 1)
          endDate = new Date(now.getFullYear() - 1, 11, 31)
          break
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      }

      // Fetch transactions for the period
      const transactionResponse = await fetch(
        `/api/finance/transactions?dateFrom=${startDate.toISOString()}&dateTo=${endDate.toISOString()}&limit=10&sortBy=date&sortOrder=desc`
      )
      
      if (transactionResponse.ok) {
        const transactionData = await transactionResponse.json()
        setRecentTransactions(transactionData.transactions || [])
        
        // Calculate financial summary from transactions
        const income = transactionData.transactions?.filter((t: Transaction) => 
          t.type === 'INCOME' || t.type === 'DONATION'
        ).reduce((sum: number, t: Transaction) => sum + t.amount, 0) || 0
        
        const expenses = transactionData.transactions?.filter((t: Transaction) => 
          t.type === 'EXPENSE'
        ).reduce((sum: number, t: Transaction) => sum + t.amount, 0) || 0
        
        const donations = transactionData.transactions?.filter((t: Transaction) => 
          t.type === 'DONATION'
        ).reduce((sum: number, t: Transaction) => sum + t.amount, 0) || 0
        
        // Calculate monthly data for charts (last 12 months)
        const monthlyIncome: number[] = Array(12).fill(0)
        const monthlyExpenses: number[] = Array(12).fill(0)
        
        // Get category breakdown
        const categoryMap = new Map<string, number>()
        transactionData.transactions?.forEach((t: Transaction) => {
          if (t.category) {
            const categoryName = t.category.name || 'Unknown'
            categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + t.amount)
          }
        })
        
        const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, amount]) => ({
          category,
          amount,
          percentage: income + expenses > 0 ? (amount / (income + expenses)) * 100 : 0
        }))

        setFinancialSummary({
          totalIncome: income,
          totalExpenses: expenses,
          totalDonations: donations,
          netIncome: income - expenses,
          cashBalance: 15000000, // This should come from cash account balance
          monthlyIncome,
          monthlyExpenses,
          categoryBreakdown
        })
      }

      // Fetch categories
      const categoryResponse = await fetch('/api/finance/categories?includeChildren=true')
      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json()
        setCategories(categoryData.categories || [])
      }

    } catch (error) {
      console.error('Error fetching financial data:', error)
    } finally {
      setLoading(false)
    }
  }

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
      <Header title="Dashboard Keuangan" />
      
      <main className="p-6 space-y-6">
        {/* Period Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="current-month">Bulan Ini</option>
              <option value="last-month">Bulan Lalu</option>
              <option value="current-year">Tahun Ini</option>
              <option value="last-year">Tahun Lalu</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <Link href="/keuangan/transaksi">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Kelola Transaksi
              </Button>
            </Link>
            <Link href="/keuangan/laporan">
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Laporan
              </Button>
            </Link>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Transaksi
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Pemasukan
              </CardTitle>
              <ArrowUpRight className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(financialSummary?.totalIncome || 0)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                +12% dari periode sebelumnya
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Pengeluaran
              </CardTitle>
              <ArrowDownRight className="w-4 h-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(financialSummary?.totalExpenses || 0)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                +5% dari periode sebelumnya
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Saldo Bersih
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                (financialSummary?.netIncome || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(financialSummary?.netIncome || 0)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Laba/rugi periode ini
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Saldo Kas
              </CardTitle>
              <DollarSign className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(financialSummary?.cashBalance || 0)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Tersedia di kas dan bank
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cash Flow Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Arus Kas Bulanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                <div className="text-center text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Grafik arus kas akan ditampilkan di sini</p>
                  <p className="text-sm">(Implementasi chart library diperlukan)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Breakdown Kategori
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {financialSummary?.categoryBreakdown?.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full`} 
                           style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }} />
                      <span className="text-sm font-medium">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{formatCurrency(item.amount)}</div>
                      <div className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center text-gray-500 py-8">
                    Tidak ada data kategori
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transaksi Terbaru</CardTitle>
            <Link href="/keuangan/transaksi">
              <Button variant="outline" size="sm">
                Lihat Semua
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada transaksi terbaru
                </div>
              ) : (
                recentTransactions.slice(0, 5).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
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
                          {transaction.category?.name || 'Tidak ada kategori'}
                        </span>
                        {transaction.transactionNo && (
                          <span className="text-xs text-gray-400">
                            {transaction.transactionNo}
                          </span>
                        )}
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/keuangan/transaksi" className="block">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-2">
                  <Filter className="w-6 h-6" />
                  <span>Kelola Transaksi</span>
                </Button>
              </Link>
              <Link href="/keuangan/laporan" className="block">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  <span>Generate Laporan</span>
                </Button>
              </Link>
              <Button 
                onClick={() => setShowForm(true)} 
                className="w-full h-16 flex flex-col items-center gap-2"
              >
                <Plus className="w-6 h-6" />
                <span>Transaksi Baru</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Transaction Form Modal */}
      {showForm && (
        <TransactionForm
          categories={categories}
          onClose={() => setShowForm(false)}
          onSubmit={async (data) => {
            try {
              const response = await fetch('/api/finance/transactions', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
              })
              
              if (response.ok) {
                setShowForm(false)
                fetchFinancialData() // Refresh data
              }
            } catch (error) {
              console.error('Error creating transaction:', error)
            }
          }}
        />
      )}
    </div>
  )
}