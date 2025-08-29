'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/layout/header'
import { 
  Plus, Download, Eye, Trash2, FileText, BarChart3, TrendingUp, 
  DollarSign, Calendar, Filter, PieChart, Activity, BookOpen,
  AlertCircle, CheckCircle, Clock
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { FinancialReport, ReportType, ReportPeriod, Budget } from '@/types'

interface ReportTemplate {
  id: string
  name: string
  type: ReportType
  description: string
  icon: any
  color: string
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'income-statement',
    name: 'Laporan Laba Rugi',
    type: 'INCOME_STATEMENT',
    description: 'Menampilkan pendapatan, beban, dan laba bersih dalam periode tertentu',
    icon: TrendingUp,
    color: 'bg-green-500'
  },
  {
    id: 'balance-sheet',
    name: 'Neraca',
    type: 'BALANCE_SHEET',
    description: 'Menampilkan aset, kewajiban, dan ekuitas pada tanggal tertentu',
    icon: BarChart3,
    color: 'bg-blue-500'
  },
  {
    id: 'cash-flow',
    name: 'Laporan Arus Kas',
    type: 'CASH_FLOW',
    description: 'Menampilkan aliran kas masuk dan keluar dalam periode tertentu',
    icon: DollarSign,
    color: 'bg-purple-500'
  },
  {
    id: 'budget-variance',
    name: 'Laporan Anggaran vs Realisasi',
    type: 'BUDGET_VARIANCE',
    description: 'Membandingkan anggaran dengan realisasi pengeluaran',
    icon: PieChart,
    color: 'bg-orange-500'
  }
]

export default function FinancialReportsPage() {
  const [reports, setReports] = useState<FinancialReport[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [showGenerateForm, setShowGenerateForm] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null)
  const [generating, setGenerating] = useState(false)

  // Form state for generating reports
  const [reportForm, setReportForm] = useState({
    name: '',
    type: 'INCOME_STATEMENT' as ReportType,
    period: 'MONTHLY' as ReportPeriod,
    startDate: '',
    endDate: '',
    budgetId: '',
    includeDetails: false,
  })

  useEffect(() => {
    fetchReports()
    fetchBudgets()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/finance/reports')
      if (response.ok) {
        const data = await response.json()
        setReports(data.reports || [])
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBudgets = async () => {
    try {
      const response = await fetch('/api/finance/budget?status=ACTIVE')
      if (response.ok) {
        const data = await response.json()
        setBudgets(data.budgets || [])
      }
    } catch (error) {
      console.error('Error fetching budgets:', error)
    }
  }

  const handleGenerateReport = async () => {
    if (!reportForm.name || !reportForm.startDate || !reportForm.endDate) {
      alert('Mohon lengkapi semua field yang diperlukan')
      return
    }

    if (reportForm.type === 'BUDGET_VARIANCE' && !reportForm.budgetId) {
      alert('Mohon pilih budget untuk laporan anggaran vs realisasi')
      return
    }

    setGenerating(true)
    try {
      const response = await fetch('/api/finance/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...reportForm,
          startDate: new Date(reportForm.startDate).toISOString(),
          endDate: new Date(reportForm.endDate).toISOString(),
        }),
      })

      if (response.ok) {
        setShowGenerateForm(false)
        setReportForm({
          name: '',
          type: 'INCOME_STATEMENT',
          period: 'MONTHLY',
          startDate: '',
          endDate: '',
          budgetId: '',
          includeDetails: false,
        })
        fetchReports()
      }
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setGenerating(false)
    }
  }

  const handleDeleteReport = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus laporan ini?')) return

    try {
      const response = await fetch(`/api/finance/reports/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchReports()
      }
    } catch (error) {
      console.error('Error deleting report:', error)
    }
  }

  const handleViewReport = async (id: string) => {
    try {
      const response = await fetch(`/api/finance/reports/${id}`)
      if (response.ok) {
        const report = await response.json()
        // For now, just show the raw data in console
        // In production, this would open a formatted report viewer
        console.log('Report data:', report)
        alert('Laporan akan ditampilkan (implementasi viewer diperlukan)')
      }
    } catch (error) {
      console.error('Error viewing report:', error)
    }
  }

  const handleExportReport = async (id: string, format: 'pdf' | 'excel' = 'pdf') => {
    try {
      // For now, just export as JSON
      const response = await fetch(`/api/finance/reports/${id}`)
      if (response.ok) {
        const report = await response.json()
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${report.name}-${formatDate(new Date())}.json`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error exporting report:', error)
    }
  }

  const openGenerateForm = (template: ReportTemplate) => {
    setSelectedTemplate(template)
    setReportForm({
      ...reportForm,
      name: template.name + ' - ' + new Date().toLocaleDateString('id-ID'),
      type: template.type,
    })
    setShowGenerateForm(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'GENERATED': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'DRAFT': return <Clock className="w-4 h-4 text-yellow-600" />
      case 'EXPORTED': return <Download className="w-4 h-4 text-blue-600" />
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getReportTypeLabel = (type: ReportType) => {
    switch (type) {
      case 'INCOME_STATEMENT': return 'Laporan Laba Rugi'
      case 'BALANCE_SHEET': return 'Neraca'
      case 'CASH_FLOW': return 'Laporan Arus Kas'
      case 'BUDGET_VARIANCE': return 'Anggaran vs Realisasi'
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
      <Header title="Laporan Keuangan" />
      
      <main className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Laporan Keuangan</h1>
            <p className="text-gray-600">Generate dan kelola laporan keuangan</p>
          </div>
        </div>

        {/* Report Templates */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate Laporan Baru</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTemplates.map((template) => {
              const Icon = template.icon
              return (
                <Card 
                  key={template.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => openGenerateForm(template)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`${template.color} p-2 rounded-lg text-white`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{template.name}</h3>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{template.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Existing Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Laporan yang Sudah Dibuat
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada laporan yang dibuat</p>
                <p className="text-sm">Mulai dengan memilih template laporan di atas</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{report.name}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {getReportTypeLabel(report.type)}
                        </span>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(report.status)}
                          <span className="text-xs text-gray-600 capitalize">
                            {report.status.toLowerCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(report.startDate)} - {formatDate(report.endDate)}
                        </span>
                        <span>Dibuat: {formatDate(report.createdAt)}</span>
                        {report.budget && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                            Budget: {report.budget.name}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewReport(report.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Lihat
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportReport(report.id, 'pdf')}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteReport(report.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generate Report Modal */}
        {showGenerateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {selectedTemplate && <selectedTemplate.icon className="w-5 h-5" />}
                  Generate {selectedTemplate?.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Laporan
                  </label>
                  <Input
                    value={reportForm.name}
                    onChange={(e) => setReportForm({ ...reportForm, name: e.target.value })}
                    placeholder="Masukkan nama laporan"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Periode
                    </label>
                    <select
                      value={reportForm.period}
                      onChange={(e) => setReportForm({ ...reportForm, period: e.target.value as ReportPeriod })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                    >
                      <option value="MONTHLY">Bulanan</option>
                      <option value="QUARTERLY">Triwulan</option>
                      <option value="ANNUAL">Tahunan</option>
                      <option value="CUSTOM">Kustom</option>
                    </select>
                  </div>

                  {reportForm.type === 'BUDGET_VARIANCE' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Budget
                      </label>
                      <select
                        value={reportForm.budgetId}
                        onChange={(e) => setReportForm({ ...reportForm, budgetId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                        required
                      >
                        <option value="">Pilih Budget</option>
                        {budgets.map((budget) => (
                          <option key={budget.id} value={budget.id}>
                            {budget.name} ({formatDate(budget.startDate)} - {formatDate(budget.endDate)})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Mulai
                    </label>
                    <Input
                      type="date"
                      value={reportForm.startDate}
                      onChange={(e) => setReportForm({ ...reportForm, startDate: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Akhir
                    </label>
                    <Input
                      type="date"
                      value={reportForm.endDate}
                      onChange={(e) => setReportForm({ ...reportForm, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="includeDetails"
                    checked={reportForm.includeDetails}
                    onChange={(e) => setReportForm({ ...reportForm, includeDetails: e.target.checked })}
                  />
                  <label htmlFor="includeDetails" className="text-sm text-gray-700">
                    Sertakan detail transaksi
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowGenerateForm(false)
                      setSelectedTemplate(null)
                    }}
                    disabled={generating}
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleGenerateReport}
                    disabled={generating}
                  >
                    {generating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Laporan
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}