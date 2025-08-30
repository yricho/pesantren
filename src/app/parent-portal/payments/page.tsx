'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { StatsCard } from '@/components/ui/stats-card';

interface Student {
  id: string;
  fullName: string;
  nis: string;
  institutionType: string;
  grade: string;
}

interface Bill {
  id: string;
  billNo: string;
  billType: {
    name: string;
    category: string;
  };
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  period: string;
  dueDate: string;
  status: string;
  isOverdue: boolean;
  daysPastDue: number;
  discounts: any[];
  totalDiscount: number;
}

interface Payment {
  id: string;
  paymentNo: string;
  amount: number;
  paymentDate: string;
  method: string;
  channel: string;
  verificationStatus: string;
  proofUrl: string;
  bill: {
    billNo: string;
    billType: {
      name: string;
    };
  };
}

export default function ParentPaymentsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<string>('');
  const [children, setChildren] = useState<Student[]>([]);
  const [outstandingBills, setOutstandingBills] = useState<Bill[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [totalOutstanding, setTotalOutstanding] = useState(0);
  
  // Upload payment proof form state
  const [uploadForm, setUploadForm] = useState({
    billId: '',
    amount: 0,
    method: 'BANK_TRANSFER',
    channel: '',
    reference: '',
    notes: '',
    proofFile: null as File | null,
  });

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  useEffect(() => {
    if (session) {
      fetchChildren();
    }
  }, [session]);

  useEffect(() => {
    if (selectedChild) {
      fetchChildBillingData();
    }
  }, [selectedChild]);

  const fetchChildren = async () => {
    try {
      const response = await fetch('/api/parent/children');
      if (response.ok) {
        const data = await response.json();
        setChildren(data.data);
        if (data.data.length > 0) {
          setSelectedChild(data.data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching children:', error);
      toast({
        title: 'Error',
        description: 'Failed to load children data',
        variant: 'destructive',
      });
    }
  };

  const fetchChildBillingData = async () => {
    if (!selectedChild) return;
    
    try {
      setLoading(true);
      
      // Fetch outstanding bills
      const billsResponse = await fetch(`/api/billing/outstanding?studentId=${selectedChild}`);
      if (billsResponse.ok) {
        const billsData = await billsResponse.json();
        setOutstandingBills(billsData.data);
        setTotalOutstanding(billsData.summary?.totalOutstanding || 0);
      }

      // Fetch payment history
      const paymentsResponse = await fetch(`/api/billing/payment?studentId=${selectedChild}`);
      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json();
        setPaymentHistory(paymentsData.data);
      }
    } catch (error) {
      console.error('Error fetching billing data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load billing data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPaymentProof = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.billId || uploadForm.amount <= 0 || !uploadForm.proofFile) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields and upload payment proof',
        variant: 'destructive',
      });
      return;
    }

    try {
      // First upload the file
      const formData = new FormData();
      formData.append('file', uploadForm.proofFile);
      formData.append('type', 'payment_proof');
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload payment proof');
      }

      const uploadData = await uploadResponse.json();
      
      // Then submit the payment
      const paymentResponse = await fetch('/api/billing/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...uploadForm,
          proofUrl: uploadData.url,
          autoVerify: false, // Parent submissions require verification
        }),
      });

      const paymentData = await paymentResponse.json();

      if (paymentResponse.ok) {
        toast({
          title: 'Success',
          description: 'Payment proof uploaded successfully. It will be verified by admin.',
        });
        
        // Reset form and close dialog
        setUploadForm({
          billId: '',
          amount: 0,
          method: 'BANK_TRANSFER',
          channel: '',
          reference: '',
          notes: '',
          proofFile: null,
        });
        setUploadDialogOpen(false);
        
        // Refresh data
        fetchChildBillingData();
      } else {
        throw new Error(paymentData.error || 'Failed to submit payment');
      }
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload payment proof',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadInvoice = async (billId: string) => {
    try {
      const response = await fetch(`/api/billing/invoice/${billId}`, {
        method: 'GET',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${billId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to download invoice');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to download invoice',
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

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <Badge variant="default" className="bg-green-500">Verified</Badge>;
      case 'PENDING':
        return <Badge variant="secondary">Pending Verification</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading && !children.length) {
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
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <p className="text-gray-600">View bills and manage payments for your children</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!selectedChild || outstandingBills.length === 0}>
              Upload Payment Proof
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Payment Proof</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUploadPaymentProof} className="space-y-4">
              <div>
                <Label htmlFor="billId">Select Bill</Label>
                <select
                  id="billId"
                  value={uploadForm.billId}
                  onChange={(e) => setUploadForm({ ...uploadForm, billId: e.target.value })}
                  className="w-full mt-1 p-2 border rounded-md"
                  required
                >
                  <option value="">Select a bill...</option>
                  {outstandingBills.map((bill) => (
                    <option key={bill.id} value={bill.id}>
                      {bill.billType.name} - {bill.period} - {formatCurrency(bill.remainingAmount)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="amount">Payment Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={uploadForm.amount}
                  onChange={(e) => setUploadForm({ ...uploadForm, amount: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="method">Payment Method</Label>
                <select
                  id="method"
                  value={uploadForm.method}
                  onChange={(e) => setUploadForm({ ...uploadForm, method: e.target.value })}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="QRIS">QRIS</option>
                  <option value="VIRTUAL_ACCOUNT">Virtual Account</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="channel">Bank/Channel</Label>
                <Input
                  id="channel"
                  value={uploadForm.channel}
                  onChange={(e) => setUploadForm({ ...uploadForm, channel: e.target.value })}
                  placeholder="e.g., BCA, Mandiri, GoPay"
                />
              </div>
              <div>
                <Label htmlFor="reference">Transaction Reference</Label>
                <Input
                  id="reference"
                  value={uploadForm.reference}
                  onChange={(e) => setUploadForm({ ...uploadForm, reference: e.target.value })}
                  placeholder="Transaction ID or reference number"
                />
              </div>
              <div>
                <Label htmlFor="proofFile">Payment Proof</Label>
                <Input
                  id="proofFile"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setUploadForm({ ...uploadForm, proofFile: e.target.files?.[0] || null })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="uploadNotes">Notes (Optional)</Label>
                <Textarea
                  id="uploadNotes"
                  value={uploadForm.notes}
                  onChange={(e) => setUploadForm({ ...uploadForm, notes: e.target.value })}
                  placeholder="Additional notes about the payment..."
                />
              </div>
              <Button type="submit" className="w-full">
                Upload Payment Proof
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Child Selector */}
      {children.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Child</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {children.map((child) => (
                <Button
                  key={child.id}
                  variant={selectedChild === child.id ? "default" : "outline"}
                  onClick={() => setSelectedChild(child.id)}
                >
                  {child.fullName} - {child.institutionType} {child.grade}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedChild && (
        <Tabs defaultValue="outstanding" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="outstanding">Outstanding Bills</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="outstanding">
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard
                  title="Outstanding Bills"
                  value={outstandingBills.length}
                  icon="📄"
                />
                <StatsCard
                  title="Total Outstanding"
                  value={formatCurrency(totalOutstanding)}
                  icon="💰"
                  variant="warning"
                />
                <StatsCard
                  title="Overdue Bills"
                  value={outstandingBills.filter(b => b.isOverdue).length}
                  icon="⚠️"
                  variant="destructive"
                />
              </div>

              {/* Outstanding Bills Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Outstanding Bills</CardTitle>
                  <CardDescription>Bills that require payment</CardDescription>
                </CardHeader>
                <CardContent>
                  {outstandingBills.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No outstanding bills found.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Bill No</th>
                            <th className="text-left p-2">Bill Type</th>
                            <th className="text-left p-2">Period</th>
                            <th className="text-left p-2">Amount</th>
                            <th className="text-left p-2">Due Date</th>
                            <th className="text-left p-2">Status</th>
                            <th className="text-left p-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {outstandingBills.map((bill) => (
                            <tr key={bill.id} className="border-b hover:bg-gray-50">
                              <td className="p-2 font-mono text-sm">{bill.billNo}</td>
                              <td className="p-2">
                                <div>
                                  <div className="font-medium">{bill.billType.name}</div>
                                  <div className="text-sm text-gray-500">{bill.billType.category}</div>
                                </div>
                              </td>
                              <td className="p-2">{bill.period}</td>
                              <td className="p-2">
                                <div>
                                  <div className="font-medium">{formatCurrency(bill.remainingAmount)}</div>
                                  {bill.paidAmount > 0 && (
                                    <div className="text-sm text-gray-500">
                                      Paid: {formatCurrency(bill.paidAmount)}
                                    </div>
                                  )}
                                  {bill.totalDiscount > 0 && (
                                    <div className="text-sm text-green-600">
                                      Discount: -{formatCurrency(bill.totalDiscount)}
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
                                    onClick={() => handleDownloadInvoice(bill.id)}
                                  >
                                    Download
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setUploadForm({ 
                                        ...uploadForm, 
                                        billId: bill.id,
                                        amount: bill.remainingAmount
                                      });
                                      setUploadDialogOpen(true);
                                    }}
                                  >
                                    Pay
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>All payments made for this child</CardDescription>
              </CardHeader>
              <CardContent>
                {paymentHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No payment history found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Payment No</th>
                          <th className="text-left p-2">Bill</th>
                          <th className="text-left p-2">Amount</th>
                          <th className="text-left p-2">Payment Date</th>
                          <th className="text-left p-2">Method</th>
                          <th className="text-left p-2">Status</th>
                          <th className="text-left p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentHistory.map((payment) => (
                          <tr key={payment.id} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-mono text-sm">{payment.paymentNo}</td>
                            <td className="p-2">
                              <div>
                                <div className="font-medium">{payment.bill.billNo}</div>
                                <div className="text-sm text-gray-500">{payment.bill.billType.name}</div>
                              </div>
                            </td>
                            <td className="p-2 font-medium">{formatCurrency(payment.amount)}</td>
                            <td className="p-2">
                              {new Date(payment.paymentDate).toLocaleDateString()}
                            </td>
                            <td className="p-2">
                              <div>
                                <div>{payment.method}</div>
                                {payment.channel && (
                                  <div className="text-sm text-gray-500">{payment.channel}</div>
                                )}
                              </div>
                            </td>
                            <td className="p-2">
                              {getPaymentStatusBadge(payment.verificationStatus)}
                            </td>
                            <td className="p-2">
                              {payment.proofUrl && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(payment.proofUrl, '_blank')}
                                >
                                  View Proof
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                  <CardDescription>Overview of payment status for selected child</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Current Month</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Outstanding Bills:</span>
                          <span>{outstandingBills.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Outstanding:</span>
                          <span className="font-medium">{formatCurrency(totalOutstanding)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Overdue Bills:</span>
                          <span className="text-red-600">
                            {outstandingBills.filter(b => b.isOverdue).length}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Payment History</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Total Payments:</span>
                          <span>{paymentHistory.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Verified Payments:</span>
                          <span className="text-green-600">
                            {paymentHistory.filter(p => p.verificationStatus === 'VERIFIED').length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pending Verification:</span>
                          <span className="text-yellow-600">
                            {paymentHistory.filter(p => p.verificationStatus === 'PENDING').length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Bank Transfer</h4>
                      <p className="text-sm text-gray-600">
                        Transfer to BCA: 1234567890 a.n. Pondok Pesantren Imam Syafi'i
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Payment Proof</h4>
                      <p className="text-sm text-gray-600">
                        Please upload clear photo of transfer receipt including transaction reference number.
                        Payment will be verified within 1-2 business days.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Contact</h4>
                      <p className="text-sm text-gray-600">
                        For payment inquiries, contact finance department at (031) 123-4567 or email finance@pondok.ac.id
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}