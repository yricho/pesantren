'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import {
  Shield,
  Key,
  Smartphone,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react'

interface TwoFactorVerificationProps {
  onVerified: () => void
  onBack?: () => void
  userEmail?: string
}

export default function TwoFactorVerification({ 
  onVerified, 
  onBack, 
  userEmail 
}: TwoFactorVerificationProps) {
  const [code, setCode] = useState('')
  const [isBackupCode, setIsBackupCode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [smsLoading, setSmsLoading] = useState(false)
  const [smsMode, setSmsMode] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [smsSent, setSmsSent] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) {
      setError('Please enter a verification code')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: code.trim(),
          isBackupCode: isBackupCode
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      if (data.backupCodeUsed) {
        toast({
          title: 'Backup Code Used',
          description: 'This backup code has been consumed and cannot be used again.',
        })
      }

      onVerified()
    } catch (error: any) {
      setError(error.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSendSMS = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your phone number',
        variant: 'destructive',
      })
      return
    }

    setSmsLoading(true)

    try {
      const response = await fetch('/api/auth/2fa/verify-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: phoneNumber.trim(),
          action: 'send'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send SMS')
      }

      setSmsSent(true)
      toast({
        title: 'SMS Sent',
        description: 'Verification code sent to your phone',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send SMS',
        variant: 'destructive',
      })
    } finally {
      setSmsLoading(false)
    }
  }

  const handleSMSVerify = async () => {
    if (!code.trim()) {
      setError('Please enter the SMS code')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/2fa/verify-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otp: code.trim(),
          action: 'verify'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'SMS verification failed')
      }

      onVerified()
    } catch (error: any) {
      setError(error.message || 'SMS verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen islamic-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary-800">
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            {smsMode 
              ? 'Enter the code sent to your phone'
              : isBackupCode 
                ? 'Enter one of your backup codes'
                : 'Enter the code from your authenticator app'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {smsMode && !smsSent && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+62812345678"
                  required
                />
              </div>
              <Button
                onClick={handleSendSMS}
                disabled={smsLoading}
                className="w-full"
              >
                {smsLoading ? 'Sending...' : 'Send SMS Code'}
              </Button>
            </div>
          )}

          {(!smsMode || smsSent) && (
            <form onSubmit={smsMode ? handleSMSVerify : handleVerify} className="space-y-4">
              <div>
                <Label htmlFor="code">
                  {smsMode 
                    ? 'SMS Verification Code'
                    : isBackupCode 
                      ? 'Backup Code' 
                      : 'Verification Code'
                  }
                </Label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={
                    smsMode 
                      ? 'Enter 6-digit SMS code'
                      : isBackupCode 
                        ? 'Enter 8-character backup code'
                        : 'Enter 6-digit code'
                  }
                  maxLength={isBackupCode ? 8 : 6}
                  className="text-center font-mono text-lg"
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </Button>
            </form>
          )}

          <div className="space-y-3">
            <Separator />
            
            {!smsMode && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsBackupCode(!isBackupCode)}
                className="w-full flex items-center gap-2"
              >
                <Key className="w-4 h-4" />
                {isBackupCode ? 'Use Authenticator App' : 'Use Backup Code'}
              </Button>
            )}

            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSmsMode(!smsMode)
                setSmsSent(false)
                setCode('')
                setError('')
                setIsBackupCode(false)
              }}
              className="w-full flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              {smsMode ? 'Use Authenticator App' : 'Use SMS Code'}
            </Button>

            {onBack && (
              <Button
                type="button"
                variant="ghost"
                onClick={onBack}
                className="w-full flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}