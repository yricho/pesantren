'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Shield,
  ShieldCheck,
  ShieldX,
  Key,
  Smartphone,
  QrCode,
  AlertCircle,
  CheckCircle,
  Download,
  Copy,
  Eye,
  EyeOff,
  Settings,
  Lock,
  Unlock,
} from 'lucide-react'

interface TwoFactorStatus {
  enabled: boolean
  phoneVerified: boolean
  backupCodesCount: number
  canDisable: boolean
}

interface SetupData {
  secret: string
  qrCode: string
  manualEntryKey: string
  appName: string
}

export default function SecurityPage() {
  const { data: session } = useSession()
  const [status, setStatus] = useState<TwoFactorStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [setupData, setSetupData] = useState<SetupData | null>(null)
  const [showSetupDialog, setShowSetupDialog] = useState(false)
  const [showDisableDialog, setShowDisableDialog] = useState(false)
  const [showBackupCodesDialog, setShowBackupCodesDialog] = useState(false)
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  
  const [forms, setForms] = useState({
    setup: {
      password: '',
      totpCode: '',
      showPassword: false,
    },
    disable: {
      password: '',
      showPassword: false,
    },
    backupCodes: {
      password: '',
      showPassword: false,
    }
  })

  useEffect(() => {
    fetchStatus()
  }, [])

  const fetchStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/2fa/status')
      if (!response.ok) throw new Error('Failed to fetch 2FA status')

      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error('Error fetching 2FA status:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch security status',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const initiate2FASetup = async () => {
    try {
      const response = await fetch('/api/auth/2fa/enable')
      if (!response.ok) throw new Error('Failed to initiate 2FA setup')

      const data = await response.json()
      setSetupData(data)
      setShowSetupDialog(true)
    } catch (error) {
      console.error('Error initiating 2FA setup:', error)
      toast({
        title: 'Error',
        description: 'Failed to initiate 2FA setup',
        variant: 'destructive',
      })
    }
  }

  const complete2FASetup = async () => {
    try {
      if (!setupData || !forms.setup.password || !forms.setup.totpCode) {
        toast({
          title: 'Error',
          description: 'Please fill in all fields',
          variant: 'destructive',
        })
        return
      }

      const response = await fetch('/api/auth/2fa/enable', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-2FA-Secret': setupData.secret
        },
        body: JSON.stringify({
          password: forms.setup.password,
          totpToken: forms.setup.totpCode,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to enable 2FA')
      }

      setBackupCodes(data.backupCodes)
      setShowBackupCodes(true)
      setShowSetupDialog(false)
      setForms(prev => ({
        ...prev,
        setup: { password: '', totpCode: '', showPassword: false }
      }))
      
      await fetchStatus()

      toast({
        title: 'Success',
        description: '2FA has been enabled successfully',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to enable 2FA',
        variant: 'destructive',
      })
    }
  }

  const disable2FA = async () => {
    try {
      if (!forms.disable.password) {
        toast({
          title: 'Error',
          description: 'Please enter your password',
          variant: 'destructive',
        })
        return
      }

      const response = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: forms.disable.password,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to disable 2FA')
      }

      setShowDisableDialog(false)
      setForms(prev => ({
        ...prev,
        disable: { password: '', showPassword: false }
      }))
      
      await fetchStatus()

      toast({
        title: 'Success',
        description: '2FA has been disabled',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to disable 2FA',
        variant: 'destructive',
      })
    }
  }

  const generateNewBackupCodes = async () => {
    try {
      if (!forms.backupCodes.password) {
        toast({
          title: 'Error',
          description: 'Please enter your password',
          variant: 'destructive',
        })
        return
      }

      const response = await fetch('/api/auth/2fa/backup-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: forms.backupCodes.password,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate backup codes')
      }

      setBackupCodes(data.backupCodes)
      setShowBackupCodes(true)
      setShowBackupCodesDialog(false)
      setForms(prev => ({
        ...prev,
        backupCodes: { password: '', showPassword: false }
      }))
      
      await fetchStatus()

      toast({
        title: 'Success',
        description: 'New backup codes generated',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate backup codes',
        variant: 'destructive',
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied',
      description: 'Copied to clipboard',
    })
  }

  const downloadBackupCodes = () => {
    const content = backupCodes.join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `backup-codes-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading security settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account security and two-factor authentication</p>
      </div>

      {/* 2FA Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {status?.enabled ? (
                <ShieldCheck className="w-6 h-6 text-green-600" />
              ) : (
                <ShieldX className="w-6 h-6 text-gray-400" />
              )}
              <div>
                <p className="font-medium">
                  {status?.enabled ? '2FA Enabled' : '2FA Disabled'}
                </p>
                <p className="text-sm text-gray-500">
                  {status?.enabled 
                    ? 'Your account is protected with two-factor authentication'
                    : 'Enable 2FA to secure your account'
                  }
                </p>
              </div>
            </div>
            <Badge variant={status?.enabled ? 'default' : 'secondary'}>
              {status?.enabled ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          {status?.enabled && (
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Key className="w-4 h-4" />
                <span>Backup codes available: {status.backupCodesCount}</span>
              </div>
              {status.phoneVerified && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Smartphone className="w-4 h-4" />
                  <span>Phone verified for SMS backup</span>
                </div>
              )}
            </div>
          )}

          <Separator />

          <div className="flex gap-3">
            {!status?.enabled ? (
              <Button onClick={initiate2FASetup} className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Enable 2FA
              </Button>
            ) : (
              <>
                <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center gap-2">
                      <Unlock className="w-4 h-4" />
                      Disable 2FA
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
                      <DialogDescription>
                        This will remove the extra security layer from your account. Enter your password to confirm.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="disable-password">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="disable-password"
                            type={forms.disable.showPassword ? 'text' : 'password'}
                            value={forms.disable.password}
                            onChange={(e) => setForms(prev => ({
                              ...prev,
                              disable: { ...prev.disable, password: e.target.value }
                            }))}
                            placeholder="Enter your current password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setForms(prev => ({
                              ...prev,
                              disable: { ...prev.disable, showPassword: !prev.disable.showPassword }
                            }))}
                          >
                            {forms.disable.showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowDisableDialog(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={disable2FA}>
                        Disable 2FA
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={showBackupCodesDialog} onOpenChange={setShowBackupCodesDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      New Backup Codes
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Generate New Backup Codes</DialogTitle>
                      <DialogDescription>
                        This will invalidate your current backup codes and generate new ones. Enter your password to confirm.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Make sure to save your new backup codes in a secure location.
                        </AlertDescription>
                      </Alert>
                      <div>
                        <Label htmlFor="backup-password">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="backup-password"
                            type={forms.backupCodes.showPassword ? 'text' : 'password'}
                            value={forms.backupCodes.password}
                            onChange={(e) => setForms(prev => ({
                              ...prev,
                              backupCodes: { ...prev.backupCodes, password: e.target.value }
                            }))}
                            placeholder="Enter your current password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setForms(prev => ({
                              ...prev,
                              backupCodes: { ...prev.backupCodes, showPassword: !prev.backupCodes.showPassword }
                            }))}
                          >
                            {forms.backupCodes.showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowBackupCodesDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={generateNewBackupCodes}>
                        Generate Codes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 2FA Setup Dialog */}
      <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Follow these steps to secure your account with 2FA
            </DialogDescription>
          </DialogHeader>
          
          {setupData && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <img
                      src={setupData.qrCode}
                      alt="2FA QR Code"
                      className="w-48 h-48"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Scan this QR code with your authenticator app
                </p>
                <div className="flex items-center gap-2 justify-center">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {setupData.manualEntryKey}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(setupData.manualEntryKey)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label htmlFor="setup-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="setup-password"
                      type={forms.setup.showPassword ? 'text' : 'password'}
                      value={forms.setup.password}
                      onChange={(e) => setForms(prev => ({
                        ...prev,
                        setup: { ...prev.setup, password: e.target.value }
                      }))}
                      placeholder="Enter your current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setForms(prev => ({
                        ...prev,
                        setup: { ...prev.setup, showPassword: !prev.setup.showPassword }
                      }))}
                    >
                      {forms.setup.showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="totp-code">Verification Code</Label>
                  <Input
                    id="totp-code"
                    value={forms.setup.totpCode}
                    onChange={(e) => setForms(prev => ({
                      ...prev,
                      setup: { ...prev.setup, totpCode: e.target.value }
                    }))}
                    placeholder="Enter the 6-digit code from your app"
                    maxLength={6}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSetupDialog(false)}>
              Cancel
            </Button>
            <Button onClick={complete2FASetup}>
              Enable 2FA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Backup Codes Display Dialog */}
      <Dialog open={showBackupCodes} onOpenChange={setShowBackupCodes}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Your Backup Codes</DialogTitle>
            <DialogDescription>
              Save these backup codes in a secure place. Each code can only be used once.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                These codes are your only way to access your account if you lose your authenticator device.
              </AlertDescription>
            </Alert>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                {backupCodes.map((code, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <code className="bg-white px-2 py-1 rounded">{code}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(code)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={downloadBackupCodes}
                className="flex items-center gap-2 flex-1"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button
                variant="outline"
                onClick={() => copyToClipboard(backupCodes.join('\n'))}
                className="flex items-center gap-2 flex-1"
              >
                <Copy className="w-4 h-4" />
                Copy All
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowBackupCodes(false)}>
              I've Saved My Codes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Security Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Security Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Use a strong authenticator app</p>
                <p className="text-gray-600">Google Authenticator, Authy, or 1Password are recommended</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Store backup codes securely</p>
                <p className="text-gray-600">Keep them in a password manager or secure physical location</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Don't share your codes</p>
                <p className="text-gray-600">Never share your 2FA codes with anyone, including support staff</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}