'use client'

import React from 'react'
import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { Copy, ExternalLink, QrCode, Smartphone, CreditCard } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface PaymentResultProps {
  result: {
    transaction: {
      id: string
      paymentNo: string
      orderId: string
      transactionId?: string
      amount: number
      paymentType: string
      paymentMethod: string
      paymentChannel?: string
      status: string
      expiredAt: string
      createdAt: string
    }
    payment: {
      url?: string
      token?: string
      vaNumber?: string
      qrString?: string
      deeplink?: string
      instructions: {
        method: string
        channel?: string
        title: string
        steps: string[]
        deeplink?: string
        qrString?: string
        redirectUrl?: string
      }
    }
  }
  onClose: () => void
}

export function PaymentResult({ result, onClose }: PaymentResultProps) {
  const { transaction, payment } = result

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied!',
        description: `${label} copied to clipboard`
      })
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatExpiry = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('id-ID', {
      dateStyle: 'full',
      timeStyle: 'short'
    })
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return <CreditCard className="w-5 h-5" />
      case 'e_wallet':
        return <Smartphone className="w-5 h-5" />
      case 'qris':
        return <QrCode className="w-5 h-5" />
      default:
        return <CreditCard className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Transaction Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getMethodIcon(transaction.paymentMethod)}
            Payment Created Successfully
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Payment No:</span>
              <div className="font-mono font-medium">{transaction.paymentNo}</div>
            </div>
            <div>
              <span className="text-gray-600">Amount:</span>
              <div className="font-medium">{formatCurrency(transaction.amount)}</div>
            </div>
            <div>
              <span className="text-gray-600">Method:</span>
              <div className="capitalize">{transaction.paymentMethod.replace('_', ' ')}</div>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <Badge variant="secondary">{transaction.status}</Badge>
            </div>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Expires:</span>
            <div className="text-sm text-red-600 font-medium">
              {formatExpiry(transaction.expiredAt)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>{payment.instructions.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Virtual Account Number */}
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

          {/* QR Code */}
          {(payment.qrString || payment.instructions.qrString) && (
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-600 mb-2">Scan QR Code to Pay:</div>
              <div className="bg-white p-4 rounded-lg inline-block">
                <QrCode className="w-32 h-32 mx-auto text-gray-800" />
              </div>
              <div className="text-xs text-gray-500 mt-2">
                QR Code will be displayed in the actual payment gateway
              </div>
            </div>
          )}

          {/* Deep Link Button */}
          {(payment.deeplink || payment.instructions.deeplink) && (
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => {
                  const link = payment.deeplink || payment.instructions.deeplink
                  if (link) window.open(link, '_blank')
                }}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Open in {transaction.paymentChannel?.toUpperCase()} App
              </Button>
            </div>
          )}

          {/* Redirect to Payment Page */}
          {payment.url && (
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => window.open(payment.url, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Complete Payment
              </Button>
            </div>
          )}

          {/* Step by Step Instructions */}
          <div className="space-y-2">
            <h4 className="font-medium">Payment Steps:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              {payment.instructions.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Important Notes:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Payment will be automatically verified once completed</li>
              <li>• Keep this information until payment is confirmed</li>
              <li>• Contact admin if payment is not reflected within 2 hours</li>
              <li>• Do not refresh or close this page until payment is complete</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Close
        </Button>
        <Button
          onClick={() => copyToClipboard(
            `Payment: ${transaction.paymentNo}\nAmount: ${formatCurrency(transaction.amount)}\n${payment.vaNumber ? `VA Number: ${payment.vaNumber}` : ''}\nExpires: ${formatExpiry(transaction.expiredAt)}`,
            'Payment details'
          )}
          className="flex-1"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Details
        </Button>
      </div>
    </div>
  )
}