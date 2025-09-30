'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { Table } from '@/components/ui/table';
import { StatsCard } from '@/components/ui/stats-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import BulkOperationsModal from '@/components/bulk-operations/bulk-operations-modal';
import { PaymentResult } from '@/components/ui/payment-result';
import { Download, CreditCard, QrCode, Smartphone, Building2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

interface BillType {
  id: string;
  name: string;
  category: string;
  defaultAmount: number;
  isRecurring: boolean;
  frequency: string;
  priceByGrade: Record<string, number>;
  isActive: boolean;
}

interface Bill {
  id: string;
  billNo: string;
  student: {
    fullName: string;
    nis: string;
    institutionType: string;
    grade: string;
  };
  billType: {
    name: string;
    category: string;
  };
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: string;
  isOverdue: boolean;
  daysPastDue: number;
}

interface DashboardStats {
  totalBills: number;
  totalOutstanding: number;
  totalOverdue: number;
  totalCollected: number;
  paymentRate: number;
  averagePaymentTime: number;
}

export default function SPPManagementPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [billTypes, setBillTypes] = useState<BillType[]>([]);
  const [outstandingBills, setOutstandingBills] = useState<Bill[]>([]);
  const [selectedBillType, setSelectedBillType] = useState<string>('');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [exportData, setExportData] = useState<any[]>([]);
  const [exportColumns, setExportColumns] = useState<any[]>([]);
  
  // Bill Generation Form State
  const [generateBillForm, setGenerateBillForm] = useState({
    billTypeId: '',
    period: '',
    dueDate: '',
    institutionTypes: [] as string[],
    grades: [] as string[],
    applyDiscounts: true,
    notes: '',
  });

  // Payment Recording Form State
  const [paymentForm, setPaymentForm] = useState({
    billId: '',
    amount: 0,
    method: 'CASH',
    channel: '',
    reference: '',
    notes: '',
    autoVerify: true,
  });

  // Online Payment Form State
  const [onlinePaymentForm, setOnlinePaymentForm] = useState({
    billId: '',
    amount: 0,
    paymentMethod: 'bank_transfer',
    paymentChannel: 'bca',
    customerEmail: '',
    customerPhone: '',
    customerName: '',
  });

  const [showOnlinePayment, setShowOnlinePayment] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const statsResponse = await fetch('/api/billing/analytics/dashboard');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setDashboardStats(statsData.data);
      }

      // Fetch bill types
      const billTypesResponse = await fetch('/api/billing/bill-types');
      if (billTypesResponse.ok) {
        const billTypesData = await billTypesResponse.json();
        setBillTypes(billTypesData.data);
      }

      // Fetch outstanding bills
      const billsResponse = await fetch('/api/billing/outstanding?limit=20');
      if (billsResponse.ok) {
        const billsData = await billsResponse.json();
        setOutstandingBills(billsData.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBills = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!generateBillForm.billTypeId || !generateBillForm.period || !generateBillForm.dueDate) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/billing/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generateBillForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: data.message,
        });
        
        // Reset form
        setGenerateBillForm({
          billTypeId: '',
          period: '',
          dueDate: '',
          institutionTypes: [],
          grades: [],
          applyDiscounts: true,
          notes: '',
        });
        
        // Refresh data
        fetchDashboardData();
      } else {
        throw new Error(data.error || 'Failed to generate bills');
      }
    } catch (error) {
      console.error('Error generating bills:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate bills',
        variant: 'destructive',
      });
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentForm.billId || paymentForm.amount <= 0) {
      toast({
        title: 'Error',
        description: 'Please select a bill and enter a valid amount',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/billing/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: data.message,
        });
        
        // Reset form
        setPaymentForm({
          billId: '',
          amount: 0,
          method: 'CASH',
          channel: '',
          reference: '',
          notes: '',
          autoVerify: true,
        });
        
        // Refresh data
        fetchDashboardData();
      } else {
        throw new Error(data.error || 'Failed to record payment');
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to record payment',
        variant: 'destructive',
      });
    }
  };

  const handleOnlinePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!onlinePaymentForm.billId || onlinePaymentForm.amount <= 0) {
      toast({
        title: 'Error',
        description: 'Please select a bill and enter a valid amount',
        variant: 'destructive',
      });
      return;
    }

    if (!onlinePaymentForm.customerEmail || !onlinePaymentForm.customerPhone || !onlinePaymentForm.customerName) {
      toast({
        title: 'Error',
        description: 'Please fill in all customer details',
        variant: 'destructive',
      });
      return;
    }

    try {
      setPaymentLoading(true);
      
      // Find the selected bill for customer details
      const selectedBill = outstandingBills.find(bill => bill.id === onlinePaymentForm.billId);
      if (!selectedBill) {
        throw new Error('Selected bill not found');
      }

      const response = await fetch('/api/payments/create-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          billId: onlinePaymentForm.billId,
          amount: onlinePaymentForm.amount,
          paymentType: 'SPP',
          description: `SPP Payment - ${selectedBill.billType.name}`,
          paymentMethod: onlinePaymentForm.paymentMethod,
          paymentChannel: onlinePaymentForm.paymentChannel,
          customerDetails: {
            firstName: onlinePaymentForm.customerName.split(' ')[0],
            lastName: onlinePaymentForm.customerName.split(' ').slice(1).join(' ') || '',
            email: onlinePaymentForm.customerEmail,
            phone: onlinePaymentForm.customerPhone
          },
          autoRedirect: false
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPaymentResult(data);
        toast({
          title: 'Success',
          description: 'Payment transaction created successfully',
        });
        
        // Refresh data
        fetchDashboardData();
      } else {
        throw new Error(data.error || 'Failed to create payment transaction');
      }
    } catch (error) {
      console.error('Error creating online payment:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create payment transaction',
        variant: 'destructive',
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleExportBills = async (reportType: string = 'bills') => {
    try {
      const params = new URLSearchParams();
      if (selectedBillType) params.set('billTypeId', selectedBillType);
      params.set('reportType', reportType);
      
      const response = await fetch(`/api/export/billing?${params}`);
      if (response.ok) {
        const data = await response.json();
        setExportData(data.data || []);
        setExportColumns(data.columns || []);
        setShowBulkModal(true);
      }
    } catch (error) {
      console.error('Error preparing export:', error);
      toast({
        title: 'Error',
        description: 'Gagal menyiapkan data export',
        variant: 'destructive',
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string, isOverdue: boolean) => {
    if (isOverdue) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    
    switch (status) {
      case 'PAID':
        return <Badge variant="default" className="bg-green-500">Paid</Badge>;
      case 'PARTIAL':
        return <Badge variant="secondary">Partial</Badge>;
      case 'OUTSTANDING':
        return <Badge variant="outline">Outstanding</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">SPP & Billing Management</h1>
          <p className="text-gray-600">Manage student payments and billing</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showOnlinePayment} onOpenChange={setShowOnlinePayment}>
            <DialogTrigger asChild>
              <Button variant="default">
                <CreditCard className="w-4 h-4 mr-2" />
                Online Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-gray-900">Create Online Payment</DialogTitle>
              </DialogHeader>
              {!paymentResult ? (
                <form onSubmit={handleOnlinePayment} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="onlineBillId">Select Bill</Label>
                      <select
                        id="onlineBillId"
                        value={onlinePaymentForm.billId}
                        onChange={(e) => {
                          const selectedBill = outstandingBills.find(b => b.id === e.target.value);
                          setOnlinePaymentForm({ 
                            ...onlinePaymentForm, 
                            billId: e.target.value,
                            amount: selectedBill ? selectedBill.remainingAmount : 0
                          });
                        }}
                        className="w-full mt-1 p-2 border rounded-md"
                        required
                      >
                        <option value="">Select a bill...</option>
                        {(outstandingBills || []).map((bill) => (
                          <option key={bill.id} value={bill.id}>
                            {bill.student.fullName} - {bill.billType.name} - {formatCurrency(bill.remainingAmount)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="onlineAmount">Amount</Label>
                      <Input
                        id="onlineAmount"
                        type="number"
                        value={onlinePaymentForm.amount}
                        onChange={(e) => setOnlinePaymentForm({ ...onlinePaymentForm, amount: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Payment Method</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        <Button
                          type="button"
                          variant={onlinePaymentForm.paymentMethod === 'bank_transfer' ? 'default' : 'outline'}
                          onClick={() => setOnlinePaymentForm({ ...onlinePaymentForm, paymentMethod: 'bank_transfer' })}
                          className="flex flex-col items-center p-4"
                        >
                          <Building2 className="w-6 h-6 mb-1" />
                          <span className="text-xs">Bank Transfer</span>
                        </Button>
                        <Button
                          type="button"
                          variant={onlinePaymentForm.paymentMethod === 'e_wallet' ? 'default' : 'outline'}
                          onClick={() => setOnlinePaymentForm({ ...onlinePaymentForm, paymentMethod: 'e_wallet' })}
                          className="flex flex-col items-center p-4"
                        >
                          <Smartphone className="w-6 h-6 mb-1" />
                          <span className="text-xs">E-Wallet</span>
                        </Button>
                        <Button
                          type="button"
                          variant={onlinePaymentForm.paymentMethod === 'qris' ? 'default' : 'outline'}
                          onClick={() => setOnlinePaymentForm({ ...onlinePaymentForm, paymentMethod: 'qris' })}
                          className="flex flex-col items-center p-4"
                        >
                          <QrCode className="w-6 h-6 mb-1" />
                          <span className="text-xs">QRIS</span>
                        </Button>
                        <Button
                          type="button"
                          variant={onlinePaymentForm.paymentMethod === 'credit_card' ? 'default' : 'outline'}
                          onClick={() => setOnlinePaymentForm({ ...onlinePaymentForm, paymentMethod: 'credit_card' })}
                          className="flex flex-col items-center p-4"
                        >
                          <CreditCard className="w-6 h-6 mb-1" />
                          <span className="text-xs">Credit Card</span>
                        </Button>
                      </div>
                    </div>

                    {(onlinePaymentForm.paymentMethod === 'bank_transfer' || onlinePaymentForm.paymentMethod === 'e_wallet') && (
                      <div>
                        <Label htmlFor="paymentChannel">
                          {onlinePaymentForm.paymentMethod === 'bank_transfer' ? 'Bank' : 'E-Wallet'} Selection
                        </Label>
                        <select
                          id="paymentChannel"
                          value={onlinePaymentForm.paymentChannel}
                          onChange={(e) => setOnlinePaymentForm({ ...onlinePaymentForm, paymentChannel: e.target.value })}
                          className="w-full mt-1 p-2 border rounded-md"
                          required
                        >
                          {onlinePaymentForm.paymentMethod === 'bank_transfer' ? (
                            <>
                              <option value="bca">BCA Virtual Account</option>
                              <option value="bni">BNI Virtual Account</option>
                              <option value="bri">BRI Virtual Account</option>
                              <option value="permata">Permata Virtual Account</option>
                              <option value="echannel">Mandiri Bill Payment</option>
                            </>
                          ) : (
                            <>
                              <option value="gopay">GoPay</option>
                              <option value="ovo">OVO</option>
                              <option value="dana">DANA</option>
                              <option value="linkaja">LinkAja</option>
                              <option value="shopeepay">ShopeePay</option>
                            </>
                          )}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="customerName">Customer Name</Label>
                      <Input
                        id="customerName"
                        value={onlinePaymentForm.customerName}
                        onChange={(e) => setOnlinePaymentForm({ ...onlinePaymentForm, customerName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerEmail">Email</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={onlinePaymentForm.customerEmail}
                        onChange={(e) => setOnlinePaymentForm({ ...onlinePaymentForm, customerEmail: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerPhone">Phone</Label>
                      <Input
                        id="customerPhone"
                        value={onlinePaymentForm.customerPhone}
                        onChange={(e) => setOnlinePaymentForm({ ...onlinePaymentForm, customerPhone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={paymentLoading}>
                    {paymentLoading ? 'Creating Payment...' : 'Create Payment'}
                  </Button>
                </form>
              ) : (
                <PaymentResult 
                  result={paymentResult}
                  onClose={() => {
                    setPaymentResult(null);
                    setShowOnlinePayment(false);
                    setOnlinePaymentForm({
                      billId: '',
                      amount: 0,
                      paymentMethod: 'bank_transfer',
                      paymentChannel: 'bca',
                      customerEmail: '',
                      customerPhone: '',
                      customerName: '',
                    });
                  }}
                />
              )}
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Record Manual Payment</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-white">
              <DialogHeader>
                <DialogTitle className="text-gray-900">Record Payment</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleRecordPayment} className="space-y-4">
                <div>
                  <Label htmlFor="billId">Select Bill</Label>
                  <select
                    id="billId"
                    value={paymentForm.billId}
                    onChange={(e) => setPaymentForm({ ...paymentForm, billId: e.target.value })}
                    className="w-full mt-1 p-2 border rounded-md"
                    required
                  >
                    <option value="">Select a bill...</option>
                    {(outstandingBills || []).map((bill) => (
                      <option key={bill.id} value={bill.id}>
                        {bill.student.fullName} - {bill.billType.name} - {formatCurrency(bill.remainingAmount)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="method">Payment Method</Label>
                  <select
                    id="method"
                    value={paymentForm.method}
                    onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="QRIS">QRIS</option>
                    <option value="VIRTUAL_ACCOUNT">Virtual Account</option>
                    <option value="CARD">Card</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="reference">Reference Number (Optional)</Label>
                  <Input
                    id="reference"
                    value={paymentForm.reference}
                    onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="paymentNotes">Notes (Optional)</Label>
                  <Textarea
                    id="paymentNotes"
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Record Payment
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="generate">Generate Bills</TabsTrigger>
          <TabsTrigger value="outstanding">Outstanding</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="bill-types">Bill Types</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid gap-6">
            {/* Dashboard Stats */}
            {dashboardStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                  title="Total Bills"
                  value={dashboardStats.totalBills}
                />
                <StatsCard
                  title="Outstanding Amount"
                  value={formatCurrency(dashboardStats.totalOutstanding)}
                />
                <StatsCard
                  title="Overdue Bills"
                  value={dashboardStats.totalOverdue}
                />
                <StatsCard
                  title="Collection Rate"
                  value={`${dashboardStats.paymentRate.toFixed(1)}%`}
                />
              </div>
            )}

            {/* Recent Outstanding Bills */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Outstanding Bills</CardTitle>
                <CardDescription>Bills that require attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Student</th>
                        <th className="text-left p-2">Bill Type</th>
                        <th className="text-left p-2">Amount</th>
                        <th className="text-left p-2">Due Date</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {outstandingBills.slice(0, 10).map((bill) => (
                        <tr key={bill.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            <div>
                              <div className="font-medium">{bill.student.fullName}</div>
                              <div className="text-sm text-gray-500">
                                {bill.student.nis} - {bill.student.institutionType} {bill.student.grade}
                              </div>
                            </div>
                          </td>
                          <td className="p-2">{bill.billType.name}</td>
                          <td className="p-2">
                            <div>
                              <div>{formatCurrency(bill.remainingAmount)}</div>
                              {bill.paidAmount > 0 && (
                                <div className="text-sm text-gray-500">
                                  Paid: {formatCurrency(bill.paidAmount)}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-2">
                            <div>
                              {new Date(bill.dueDate).toLocaleDateString()}
                              {bill.isOverdue && (
                                <div className="text-sm text-red-500">
                                  {bill.daysPastDue} days overdue
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-2">
                            {getStatusBadge(bill.status, bill.isOverdue)}
                          </td>
                          <td className="p-2">
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setPaymentForm({ ...paymentForm, billId: bill.id })}
                              >
                                Record Payment
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setOnlinePaymentForm({ 
                                    ...onlinePaymentForm, 
                                    billId: bill.id,
                                    amount: bill.remainingAmount,
                                    customerName: bill.student.fullName
                                  });
                                  setShowOnlinePayment(true);
                                }}
                              >
                                <CreditCard className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Generate Monthly Bills</CardTitle>
              <CardDescription>Generate bills for students based on selected criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerateBills} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="billType">Bill Type</Label>
                    <select
                      id="billType"
                      value={generateBillForm.billTypeId}
                      onChange={(e) => setGenerateBillForm({ ...generateBillForm, billTypeId: e.target.value })}
                      className="w-full mt-1 p-2 border rounded-md"
                      required
                    >
                      <option value="">Select bill type...</option>
                      {billTypes
                        .filter(bt => bt.isActive)
                        .map((billType) => (
                          <option key={billType.id} value={billType.id}>
                            {billType.name} - {billType.category}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="period">Period</Label>
                    <Input
                      id="period"
                      type="month"
                      value={generateBillForm.period}
                      onChange={(e) => setGenerateBillForm({ ...generateBillForm, period: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={generateBillForm.dueDate}
                      onChange={(e) => setGenerateBillForm({ ...generateBillForm, dueDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Institution Types (Optional)</Label>
                    <div className="flex space-x-2 mt-2">
                      {['TK', 'SD', 'PONDOK'].map((type) => (
                        <label key={type} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={generateBillForm.institutionTypes.includes(type)}
                            onChange={(e) => {
                              const types = e.target.checked
                                ? [...generateBillForm.institutionTypes, type]
                                : generateBillForm.institutionTypes.filter(t => t !== type);
                              setGenerateBillForm({ ...generateBillForm, institutionTypes: types });
                            }}
                          />
                          <span>{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="applyDiscounts">Apply Discounts</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="checkbox"
                        id="applyDiscounts"
                        checked={generateBillForm.applyDiscounts}
                        onChange={(e) => setGenerateBillForm({ ...generateBillForm, applyDiscounts: e.target.checked })}
                      />
                      <span>Apply sibling and scholarship discounts</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="generateNotes">Notes (Optional)</Label>
                  <Textarea
                    id="generateNotes"
                    value={generateBillForm.notes}
                    onChange={(e) => setGenerateBillForm({ ...generateBillForm, notes: e.target.value })}
                    placeholder="Add notes about this bill generation..."
                  />
                </div>

                <Button type="submit" className="w-full">
                  Generate Bills
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outstanding">
          <Card>
            <CardHeader>
              <CardTitle>Outstanding Bills</CardTitle>
              <CardDescription>All unpaid and partially paid bills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Filters would go here */}
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Bill No</th>
                        <th className="text-left p-2">Student</th>
                        <th className="text-left p-2">Bill Type</th>
                        <th className="text-left p-2">Amount</th>
                        <th className="text-left p-2">Remaining</th>
                        <th className="text-left p-2">Due Date</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {outstandingBills.map((bill) => (
                        <tr key={bill.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">{bill.billNo}</td>
                          <td className="p-2">
                            <div>
                              <div className="font-medium">{bill.student.fullName}</div>
                              <div className="text-sm text-gray-500">{bill.student.nis}</div>
                            </div>
                          </td>
                          <td className="p-2">{bill.billType.name}</td>
                          <td className="p-2">{formatCurrency(bill.amount)}</td>
                          <td className="p-2">
                            <div className="font-medium">
                              {formatCurrency(bill.remainingAmount)}
                            </div>
                          </td>
                          <td className="p-2">
                            <div>
                              {new Date(bill.dueDate).toLocaleDateString()}
                              {bill.isOverdue && (
                                <div className="text-sm text-red-500">
                                  {bill.daysPastDue} days overdue
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-2">
                            {getStatusBadge(bill.status, bill.isOverdue)}
                          </td>
                          <td className="p-2">
                            <div className="flex space-x-1">
                              <Button size="sm" variant="outline">
                                View
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setOnlinePaymentForm({ 
                                    ...onlinePaymentForm, 
                                    billId: bill.id,
                                    amount: bill.remainingAmount,
                                    customerName: bill.student.fullName
                                  });
                                  setShowOnlinePayment(true);
                                }}
                              >
                                <CreditCard className="w-4 h-4 mr-1" />
                                Pay
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>All recorded payments and their verification status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Payment history will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bill-types">
          <Card>
            <CardHeader>
              <CardTitle>Bill Types</CardTitle>
              <CardDescription>Manage different types of bills and their settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button>Add New Bill Type</Button>
                </div>
                
                <div className="grid gap-4">
                  {billTypes.map((billType) => (
                    <div key={billType.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{billType.name}</h3>
                          <p className="text-sm text-gray-600">{billType.category}</p>
                          <div className="mt-2">
                            <Badge variant={billType.isActive ? "default" : "secondary"}>
                              {billType.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            {billType.isRecurring && (
                              <Badge variant="outline" className="ml-2">
                                {billType.frequency}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">Configure</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports & Analytics</CardTitle>
              <CardDescription>Generate detailed reports for billing and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Export Data Tagihan</h3>
                    <p className="text-sm text-gray-600">
                      Export data tagihan untuk analisis atau pencatatan
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleExportBills('bills')}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Export Tagihan
                      </Button>
                      <Button 
                        onClick={() => handleExportBills('payments')}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Export Pembayaran
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Filter Export</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="reportBillType">Jenis Tagihan</Label>
                        <select
                          id="reportBillType"
                          value={selectedBillType}
                          onChange={(e) => setSelectedBillType(e.target.value)}
                          className="w-full mt-1 p-2 border rounded-md"
                        >
                          <option value="">Semua Jenis</option>
                          {billTypes.map((billType) => (
                            <option key={billType.id} value={billType.id}>
                              {billType.name} - {billType.category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bulk Operations Modal */}
      <BulkOperationsModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        title="Data Tagihan & Pembayaran"
        exportData={exportData}
        exportColumns={exportColumns}
      />
    </div>
  );
}