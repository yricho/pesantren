'use client'

import React, { useState, useEffect } from 'react'
import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { Separator } from './separator'
import { RefreshCw, ExternalLink, Copy, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface PaymentStatusTrackerProps {
  paymentId: string
  onStatusChange?: (status: string) => void
  refreshInterval?: number // in seconds
  showHeader?: boolean
}

interface PaymentStatus {
  id: string
  paymentNo: string
  externalId?: string
  transactionId?: string
  amount: number
  paymentType: string
  description?: string
  method: string
  channel?: string
  status: string
  vaNumber?: string
  qrString?: string
  deeplink?: string
  paymentUrl?: string
  expiredAt?: string
  paidAt?: string
  createdAt: string
  updatedAt: string
  gatewayStatus?: any
  gatewayData?: any
}

export function PaymentStatusTracker({ 
  paymentId, 
  onStatusChange,
  refreshInterval = 30,
  showHeader = true
}: PaymentStatusTrackerProps) {
  const [payment, setPayment] = useState<PaymentStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const fetchPaymentStatus = async () => {
    try {
      setError(null)
      const response = await fetch(`/api/payments/status/${paymentId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch payment status')
      }

      const data = await response.json()
      setPayment(data.payment)
      setLastChecked(new Date())
      
      // Call callback if status changed
      if (onStatusChange && payment && payment.status !== data.payment.status) {
        onStatusChange(data.payment.status)
      }
    } catch (error: any) {
      console.error('Error fetching payment status:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPaymentStatus()
  }, [paymentId])

  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchPaymentStatus, refreshInterval * 1000)
      return () => clearInterval(interval)
    }
  }, [refreshInterval, paymentId])

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

  const formatExpiry = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    
    if (diff < 0) {
      return { text: 'Expired', color: 'text-red-600', expired: true }
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return { 
        text: `${hours}h ${minutes}m remaining`, 
        color: hours < 2 ? 'text-yellow-600' : 'text-green-600',
        expired: false
      }
    } else {
      return { 
        text: `${minutes}m remaining`, 
        color: minutes < 30 ? 'text-red-600' : 'text-yellow-600',
        expired: false
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'FAILED':
      case 'EXPIRED':
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied!',
        description: `${label} copied to clipboard`
      })
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            <span>Loading payment status...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchPaymentStatus} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!payment) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Payment not found
          </div>
        </CardContent>
      </Card>
    )
  }

  const expiryInfo = payment.expiredAt ? formatExpiry(payment.expiredAt) : null

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(payment.status)}
              Payment Status
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={fetchPaymentStatus}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
      )}
      
      <CardContent className="space-y-6">
        {/* Payment Summary */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">Status:</span>
            {getStatusBadge(payment.status)}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Payment No:</span>
              <div className="font-mono font-medium">{payment.paymentNo}</div>
            </div>
            <div>
              <span className="text-gray-600">Amount:</span>
              <div className="font-medium">{formatCurrency(payment.amount)}</div>
            </div>
            <div>
              <span className="text-gray-600">Method:</span>
              <div className="capitalize">{payment.method} {payment.channel && `(${payment.channel})`}</div>
            </div>
            <div>
              <span className="text-gray-600">Created:</span>
              <div>{formatDateTime(payment.createdAt)}</div>
            </div>
          </div>

          {payment.paidAt && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-sm text-green-800">
                <strong>Payment Completed:</strong> {formatDateTime(payment.paidAt)}
              </div>
            </div>
          )}

          {payment.expiredAt && !payment.paidAt && expiryInfo && (
            <div className={`border rounded-lg p-3 ${
              expiryInfo.expired 
                ? 'bg-red-50 border-red-200' 
                : expiryInfo.color === 'text-red-600' 
                  ? 'bg-red-50 border-red-200'
                  : expiryInfo.color === 'text-yellow-600'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-green-50 border-green-200'
            }`}>
              <div className={`text-sm font-medium ${expiryInfo.color}`}>
                {expiryInfo.expired ? '⏰ Payment Expired' : `⏰ ${expiryInfo.text}`}
              </div>
            </div>
          )}
        </div>

        {/* Payment Details */}
        {(payment.vaNumber || payment.qrString || payment.deeplink || payment.paymentUrl) && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-medium">Payment Details</h4>
              
              {payment.vaNumber && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Virtual Account Number:</div>
                  <div className="flex items-center justify-between bg-white p-3 rounded border">
                    <span className="font-mono text-lg font-bold">{payment.vaNumber}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(payment.vaNumber!, 'Virtual Account number')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {payment.qrString && (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-600 mb-2">QRIS Payment Available</div>
                  <div className="text-xs text-gray-500">
                    QR Code can be scanned in supported payment apps
                  </div>
                </div>
              )}

              {payment.deeplink && (
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => window.open(payment.deeplink, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in Payment App
                  </Button>
                </div>
              )}

              {payment.paymentUrl && (
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => window.open(payment.paymentUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Complete Payment
                  </Button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Transaction IDs */}
        {(payment.externalId || payment.transactionId) && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Transaction References</h4>
              <div className="text-xs text-gray-500 space-y-1">
                {payment.externalId && (
                  <div>
                    <span className="font-medium">Order ID:</span> {payment.externalId}
                  </div>
                )}
                {payment.transactionId && (
                  <div>
                    <span className="font-medium">Transaction ID:</span> {payment.transactionId}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Last Updated */}
        <div className="text-xs text-gray-500 text-center">
          {lastChecked && (
            <>Last checked: {formatDateTime(lastChecked.toISOString())}</>
          )}
        </div>
      </CardContent>
    </Card>
  )
}