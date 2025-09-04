'use client'

import React, { useState } from 'react'
import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog'
import { PaymentStatusTracker } from './payment-status-tracker'
import { Eye, RefreshCw, ExternalLink, Copy } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Payment {
  id: string
  paymentNo: string
  amount: number
  paymentType: string
  description?: string
  method: string
  channel?: string
  status: string
  paidAt?: string
  createdAt: string
  vaNumber?: string
  paymentUrl?: string
  expiredAt?: string
}

interface PaymentHistoryCardProps {
  payments: Payment[]
  title?: string
  emptyMessage?: string
  showActions?: boolean
  onPaymentUpdate?: () => void
}

export function PaymentHistoryCard({ 
  payments, 
  title = "Payment History",
  emptyMessage = "No payments found",
  showActions = true,
  onPaymentUpdate
}: PaymentHistoryCardProps) {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('id-ID', {
      dateStyle: 'short',
      timeStyle: 'short'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
      case 'COMPLETED':
        return <Badge className="bg-green-500">Success</Badge>
      case 'PENDING':
        return <Badge variant="secondary">Pending</Badge>
      case 'FAILED':
        return <Badge variant="destructive">Failed</Badge>
      case 'EXPIRED':
        return <Badge variant="destructive">Expired</Badge>
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
      case 'COMPLETED':
        return 'bg-green-50 border-green-200'
      case 'PENDING':
        return 'bg-yellow-50 border-yellow-200'
      case 'FAILED':
      case 'EXPIRED':
      case 'CANCELLED':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const isExpired = (payment: Payment) => {
    if (!payment.expiredAt || payment.status === 'SUCCESS') return false
    return new Date(payment.expiredAt) < new Date()
  }

  const canRetry = (payment: Payment) => {
    return payment.status === 'FAILED' || (payment.status === 'PENDING' && isExpired(payment))
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied!',
        description: `${label} copied to clipboard`
      })
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {emptyMessage}
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className={`border rounded-lg p-4 ${getStatusColor(payment.status)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{payment.paymentNo}</div>
                        {getStatusBadge(payment.status)}
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>
                          <span className="font-medium">Amount:</span> {formatCurrency(payment.amount)}
                        </div>
                        <div>
                          <span className="font-medium">Type:</span> {payment.paymentType}
                        </div>
                        <div>
                          <span className="font-medium">Method:</span> {payment.method}
                          {payment.channel && ` (${payment.channel})`}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> {formatDateTime(payment.createdAt)}
                        </div>
                        {payment.paidAt && (
                          <div className="text-green-600">
                            <span className="font-medium">Paid:</span> {formatDateTime(payment.paidAt)}
                          </div>
                        )}
                        {payment.description && (
                          <div>
                            <span className="font-medium">Description:</span> {payment.description}
                          </div>
                        )}
                      </div>

                      {/* VA Number Display */}
                      {payment.vaNumber && payment.status === 'PENDING' && (
                        <div className="mt-3 bg-white p-3 rounded border">
                          <div className="text-xs text-gray-500 mb-1">Virtual Account:</div>
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-sm">{payment.vaNumber}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(payment.vaNumber!, 'Virtual Account number')}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Expiry Warning */}
                      {payment.expiredAt && payment.status === 'PENDING' && (
                        <div className={`mt-2 text-xs ${
                          isExpired(payment) ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {isExpired(payment) 
                            ? '⚠️ Payment expired' 
                            : `⏰ Expires: ${formatDateTime(payment.expiredAt)}`
                          }
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {showActions && (
                      <div className="flex flex-col gap-1 ml-3">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedPayment(payment.id)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-white">
                            <DialogHeader>
                              <DialogTitle>Payment Details - {payment.paymentNo}</DialogTitle>
                            </DialogHeader>
                            {selectedPayment && (
                              <PaymentStatusTracker
                                paymentId={selectedPayment}
                                onStatusChange={(status) => {
                                  if (onPaymentUpdate) onPaymentUpdate()
                                }}
                                refreshInterval={10}
                                showHeader={false}
                              />
                            )}
                          </DialogContent>
                        </Dialog>

                        {payment.paymentUrl && payment.status === 'PENDING' && (
                          <Button
                            size="sm"
                            onClick={() => window.open(payment.paymentUrl, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Pay
                          </Button>
                        )}

                        {canRetry(payment) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // TODO: Implement retry logic
                              toast({
                                title: 'Retry Payment',
                                description: 'This feature will be available soon'
                              })
                            }}
                          >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Retry
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}