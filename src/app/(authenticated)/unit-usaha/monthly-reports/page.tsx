'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Plus,
  Edit,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  RefreshCcw,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

interface BusinessUnit {
  id: string;
  code: string;
  name: string;
  description?: string;
  managerName?: string;
  _count?: {
    monthlyReports: number;
  };
}

interface MonthlyReport {
  id: string;
  unitId: string;
  unit?: BusinessUnit;
  year: number;
  month: number;
  period: string;
  initialCapital: number;
  revenue: number;
  expenses: number;
  purchaseCost: number;
  operationalCost: number;
  salaryCost: number;
  maintenanceCost: number;
  otherCost: number;
  salesRevenue: number;
  serviceRevenue: number;
  otherRevenue: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  inventoryValue?: number;
  totalTransactions: number;
  totalCustomers: number;
  totalItems: number;
  revenueTarget?: number;
  targetAchievement?: number;
  status: string;
  notes?: string;
  highlights?: string;
  submittedAt?: string;
  approvedAt?: string;
}

export default function MonthlyReportsPage() {
  const [units, setUnits] = useState<BusinessUnit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<MonthlyReport | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    initialCapital: '',
    purchaseCost: '',
    operationalCost: '',
    salaryCost: '',
    maintenanceCost: '',
    otherCost: '',
    salesRevenue: '',
    serviceRevenue: '',
    otherRevenue: '',
    inventoryValue: '',
    totalTransactions: '',
    totalCustomers: '',
    totalItems: '',
    revenueTarget: '',
    notes: '',
    highlights: '',
  });

  useEffect(() => {
    fetchUnits();
  }, []);

  useEffect(() => {
    if (selectedUnit) {
      fetchReports();
    }
  }, [selectedUnit, selectedYear]);

  const fetchUnits = async () => {
    try {
      const response = await fetch('/api/unit-usaha/units');
      if (response.ok) {
        const data = await response.json();
        setUnits(data);
        if (data.length > 0) {
          setSelectedUnit(data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching units:', error);
      toast.error('Gagal memuat data unit usaha');
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        unitId: selectedUnit,
        year: selectedYear.toString(),
      });
      
      const response = await fetch(`/api/unit-usaha/reports?${params}`);
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Gagal memuat laporan');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        unitId: selectedUnit,
        year: selectedYear,
        month: selectedMonth,
        ...Object.fromEntries(
          Object.entries(formData).map(([key, value]) => [
            key,
            value === '' ? 0 : parseFloat(value)
          ])
        ),
      };

      const response = await fetch('/api/unit-usaha/reports', {
        method: editingReport ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          editingReport ? { id: editingReport.id, ...payload } : payload
        ),
      });

      if (response.ok) {
        toast.success(editingReport ? 'Laporan berhasil diperbarui' : 'Laporan berhasil dibuat');
        setIsDialogOpen(false);
        resetForm();
        fetchReports();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Gagal menyimpan laporan');
      }
    } catch (error) {
      console.error('Error saving report:', error);
      toast.error('Gagal menyimpan laporan');
    }
  };

  const handleStatusChange = async (reportId: string, action: 'submit' | 'approve') => {
    try {
      const response = await fetch('/api/unit-usaha/reports', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reportId, action }),
      });

      if (response.ok) {
        toast.success(
          action === 'submit' ? 'Laporan berhasil disubmit' : 'Laporan berhasil disetujui'
        );
        fetchReports();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Gagal mengubah status');
    }
  };

  const resetForm = () => {
    setFormData({
      initialCapital: '',
      purchaseCost: '',
      operationalCost: '',
      salaryCost: '',
      maintenanceCost: '',
      otherCost: '',
      salesRevenue: '',
      serviceRevenue: '',
      otherRevenue: '',
      inventoryValue: '',
      totalTransactions: '',
      totalCustomers: '',
      totalItems: '',
      revenueTarget: '',
      notes: '',
      highlights: '',
    });
    setEditingReport(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getMonthName = (month: number) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[month - 1];
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { label: 'Draft', variant: 'secondary' as const, icon: Clock },
      SUBMITTED: { label: 'Diajukan', variant: 'warning' as const, icon: AlertCircle },
      APPROVED: { label: 'Disetujui', variant: 'success' as const, icon: CheckCircle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const currentUnit = units.find(u => u.id === selectedUnit);
  const currentYearReports = reports.filter(r => r.year === selectedYear);
  
  // Calculate yearly summary
  const yearlySummary = currentYearReports.reduce(
    (acc, report) => ({
      totalRevenue: acc.totalRevenue + report.revenue,
      totalExpenses: acc.totalExpenses + report.expenses,
      totalNetProfit: acc.totalNetProfit + report.netProfit,
      avgProfitMargin: acc.avgProfitMargin + report.profitMargin / currentYearReports.length,
    }),
    { totalRevenue: 0, totalExpenses: 0, totalNetProfit: 0, avgProfitMargin: 0 }
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Laporan Bulanan Unit Usaha</h1>
          <p className="text-gray-600 mt-1">Kelola laporan keuangan bulanan setiap unit usaha</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Buat Laporan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingReport ? 'Edit Laporan Bulanan' : 'Buat Laporan Bulanan'}
              </DialogTitle>
              <DialogDescription>
                Masukkan data keuangan untuk periode {getMonthName(selectedMonth)} {selectedYear}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              {/* Capital & Revenue Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Modal Awal</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.initialCapital}
                    onChange={(e) => setFormData({ ...formData, initialCapital: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Target Pendapatan</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.revenueTarget}
                    onChange={(e) => setFormData({ ...formData, revenueTarget: e.target.value })}
                  />
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div>
                <h3 className="font-semibold mb-2">Pendapatan</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Penjualan</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.salesRevenue}
                      onChange={(e) => setFormData({ ...formData, salesRevenue: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Jasa/Layanan</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.serviceRevenue}
                      onChange={(e) => setFormData({ ...formData, serviceRevenue: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lain-lain</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.otherRevenue}
                      onChange={(e) => setFormData({ ...formData, otherRevenue: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Expense Breakdown */}
              <div>
                <h3 className="font-semibold mb-2">Pengeluaran</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Pembelian Barang</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.purchaseCost}
                      onChange={(e) => setFormData({ ...formData, purchaseCost: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Biaya Operasional</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.operationalCost}
                      onChange={(e) => setFormData({ ...formData, operationalCost: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gaji Karyawan</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.salaryCost}
                      onChange={(e) => setFormData({ ...formData, salaryCost: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Biaya Maintenance</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.maintenanceCost}
                      onChange={(e) => setFormData({ ...formData, maintenanceCost: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Biaya Lain-lain</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.otherCost}
                      onChange={(e) => setFormData({ ...formData, otherCost: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nilai Inventory</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.inventoryValue}
                      onChange={(e) => setFormData({ ...formData, inventoryValue: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h3 className="font-semibold mb-2">Statistik</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Total Transaksi</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.totalTransactions}
                      onChange={(e) => setFormData({ ...formData, totalTransactions: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Customer</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.totalCustomers}
                      onChange={(e) => setFormData({ ...formData, totalCustomers: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Item</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.totalItems}
                      onChange={(e) => setFormData({ ...formData, totalItems: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>Catatan</Label>
                <Textarea
                  placeholder="Catatan tambahan..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Highlights</Label>
                <Textarea
                  placeholder="Pencapaian atau masalah penting..."
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleSubmit}>
                {editingReport ? 'Perbarui' : 'Simpan'} Laporan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Unit Usaha</Label>
              <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih unit usaha" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Tahun</Label>
              <Select 
                value={selectedYear.toString()} 
                onValueChange={(v) => setSelectedYear(parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2023, 2024, 2025].map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Bulan (untuk laporan baru)</Label>
              <Select 
                value={selectedMonth.toString()} 
                onValueChange={(v) => setSelectedMonth(parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      {getMonthName(month)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {currentUnit && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Pendapatan {selectedYear}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {formatCurrency(yearlySummary.totalRevenue)}
                </span>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Pengeluaran {selectedYear}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {formatCurrency(yearlySummary.totalExpenses)}
                </span>
                <TrendingDown className="w-5 h-5 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Profit {selectedYear}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {formatCurrency(yearlySummary.totalNetProfit)}
                </span>
                <DollarSign className="w-5 h-5 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Rata-rata Margin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {yearlySummary.avgProfitMargin.toFixed(1)}%
                </span>
                <Package className="w-5 h-5 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Laporan Bulanan - {currentUnit?.name}</CardTitle>
          <CardDescription>
            Tahun {selectedYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : currentYearReports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Belum ada laporan untuk tahun ini
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bulan</TableHead>
                  <TableHead>Modal</TableHead>
                  <TableHead>Pendapatan</TableHead>
                  <TableHead>Pengeluaran</TableHead>
                  <TableHead>Profit</TableHead>
                  <TableHead>Margin</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentYearReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      {getMonthName(report.month)}
                    </TableCell>
                    <TableCell>{formatCurrency(report.initialCapital)}</TableCell>
                    <TableCell className="text-green-600">
                      {formatCurrency(report.revenue)}
                    </TableCell>
                    <TableCell className="text-red-600">
                      {formatCurrency(report.expenses)}
                    </TableCell>
                    <TableCell className={report.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(report.netProfit)}
                    </TableCell>
                    <TableCell>{report.profitMargin.toFixed(1)}%</TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingReport(report);
                            setFormData({
                              initialCapital: report.initialCapital.toString(),
                              purchaseCost: report.purchaseCost.toString(),
                              operationalCost: report.operationalCost.toString(),
                              salaryCost: report.salaryCost.toString(),
                              maintenanceCost: report.maintenanceCost.toString(),
                              otherCost: report.otherCost.toString(),
                              salesRevenue: report.salesRevenue.toString(),
                              serviceRevenue: report.serviceRevenue.toString(),
                              otherRevenue: report.otherRevenue.toString(),
                              inventoryValue: report.inventoryValue?.toString() || '',
                              totalTransactions: report.totalTransactions.toString(),
                              totalCustomers: report.totalCustomers.toString(),
                              totalItems: report.totalItems.toString(),
                              revenueTarget: report.revenueTarget?.toString() || '',
                              notes: report.notes || '',
                              highlights: report.highlights || '',
                            });
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        
                        {report.status === 'DRAFT' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStatusChange(report.id, 'submit')}
                          >
                            Submit
                          </Button>
                        )}
                        
                        {report.status === 'SUBMITTED' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStatusChange(report.id, 'approve')}
                          >
                            Approve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}