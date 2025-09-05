'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CreditCard, Wallet, Building2, Smartphone, Globe, Shield, CheckCircle, XCircle, Settings, Eye, EyeOff } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface PaymentGateway {
  id: string
  name: string
  type: 'bank_transfer' | 'e_wallet' | 'virtual_account' | 'qris' | 'credit_card'
  enabled: boolean
  config: Record<string, any>
  fees: {
    fixed: number
    percentage: number
  }
  status: 'active' | 'inactive' | 'testing'
}

export default function PaymentSettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([
    {
      id: 'midtrans',
      name: 'Midtrans',
      type: 'virtual_account',
      enabled: true,
      config: {
        serverKey: '',
        clientKey: '',
        merchantId: '',
        environment: 'sandbox',
        enabledPaymentMethods: ['bank_transfer', 'credit_card', 'gopay', 'shopeepay']
      },
      fees: {
        fixed: 0,
        percentage: 2.9
      },
      status: 'active'
    },
    {
      id: 'xendit',
      name: 'Xendit',
      type: 'virtual_account',
      enabled: false,
      config: {
        secretKey: '',
        publicKey: '',
        webhookToken: '',
        environment: 'test'
      },
      fees: {
        fixed: 0,
        percentage: 2.9
      },
      status: 'inactive'
    },
    {
      id: 'doku',
      name: 'DOKU',
      type: 'virtual_account',
      enabled: false,
      config: {
        clientId: '',
        sharedKey: '',
        environment: 'sandbox'
      },
      fees: {
        fixed: 0,
        percentage: 2.5
      },
      status: 'inactive'
    }
  ])

  const [generalSettings, setGeneralSettings] = useState({
    defaultCurrency: 'IDR',
    allowPartialPayment: false,
    autoGenerateInvoice: true,
    invoicePrefix: 'INV',
    paymentDueDays: 30,
    latePaymentFee: 50000,
    enableLateFeeCalculation: false,
    sendPaymentReminder: true,
    reminderDaysBefore: 3,
    maxPaymentAttempts: 3
  })

  const [webhookSettings, setWebhookSettings] = useState({
    webhookUrl: '',
    webhookSecret: '',
    enableSignatureVerification: true,
    retryAttempts: 3,
    timeoutSeconds: 30
  })

  const updateGateway = async (gatewayId: string, updates: Partial<PaymentGateway>) => {
    setLoading(true)
    try {
      setPaymentGateways(prev => 
        prev.map(gateway => 
          gateway.id === gatewayId 
            ? { ...gateway, ...updates }
            : gateway
        )
      )
      
      toast({
        title: 'Payment Gateway Updated',
        description: 'Payment gateway settings have been updated successfully.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update payment gateway settings.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async (gatewayId: string) => {
    setLoading(true)
    try {
      // Simulate API call to test gateway connection
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: 'Connection Test Successful',
        description: 'Payment gateway connection is working properly.'
      })
    } catch (error) {
      toast({
        title: 'Connection Test Failed',
        description: 'Unable to connect to payment gateway. Please check your credentials.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleShowSecret = (gatewayId: string, field: string) => {
    const key = `${gatewayId}_${field}`
    setShowSecrets(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const getGatewayIcon = (type: string) => {
    switch (type) {
      case 'virtual_account':
        return <Building2 className="w-5 h-5" />
      case 'e_wallet':
        return <Smartphone className="w-5 h-5" />
      case 'credit_card':
        return <CreditCard className="w-5 h-5" />
      case 'qris':
        return <Wallet className="w-5 h-5" />
      default:
        return <Globe className="w-5 h-5" />
    }
  }

  const saveSettings = async () => {
    setLoading(true)
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Settings Saved',
        description: 'Payment settings have been saved successfully.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save payment settings.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment Settings</h1>
        <p className="text-muted-foreground">
          Configure payment gateways, fees, and processing options for your institution.
        </p>
      </div>

      <Tabs defaultValue="gateways" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="gateways">Payment Gateways</TabsTrigger>
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="fees">Fees & Charges</TabsTrigger>
        </TabsList>

        <TabsContent value="gateways" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Gateway Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {paymentGateways.map((gateway) => (
                <Card key={gateway.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getGatewayIcon(gateway.type)}
                        <div>
                          <CardTitle className="text-lg">{gateway.name}</CardTitle>
                          <p className="text-sm text-muted-foreground capitalize">
                            {gateway.type.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={gateway.status === 'active' ? 'default' : 'secondary'}>
                          {gateway.status === 'active' ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {gateway.status}
                        </Badge>
                        <Switch
                          checked={gateway.enabled}
                          onCheckedChange={(enabled) => 
                            updateGateway(gateway.id, { enabled })
                          }
                        />
                      </div>
                    </div>
                  </CardHeader>
                  
                  {gateway.enabled && (
                    <CardContent className="space-y-4">
                      {/* Midtrans Configuration */}
                      {gateway.id === 'midtrans' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Server Key</Label>
                            <div className="relative">
                              <Input
                                type={showSecrets[`${gateway.id}_serverKey`] ? 'text' : 'password'}
                                value={gateway.config.serverKey}
                                onChange={(e) => 
                                  updateGateway(gateway.id, {
                                    config: { ...gateway.config, serverKey: e.target.value }
                                  })
                                }
                                placeholder="SB-Mid-server-..."
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => toggleShowSecret(gateway.id, 'serverKey')}
                              >
                                {showSecrets[`${gateway.id}_serverKey`] ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Client Key</Label>
                            <Input
                              value={gateway.config.clientKey}
                              onChange={(e) => 
                                updateGateway(gateway.id, {
                                  config: { ...gateway.config, clientKey: e.target.value }
                                })
                              }
                              placeholder="SB-Mid-client-..."
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Merchant ID</Label>
                            <Input
                              value={gateway.config.merchantId}
                              onChange={(e) => 
                                updateGateway(gateway.id, {
                                  config: { ...gateway.config, merchantId: e.target.value }
                                })
                              }
                              placeholder="G123456789"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Environment</Label>
                            <Select
                              value={gateway.config.environment}
                              onValueChange={(value) => 
                                updateGateway(gateway.id, {
                                  config: { ...gateway.config, environment: value }
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                                <SelectItem value="production">Production</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="col-span-full space-y-3">
                            <Label>Enabled Payment Methods</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {['bank_transfer', 'credit_card', 'gopay', 'shopeepay', 'dana', 'ovo', 'qris'].map((method) => (
                                <div key={method} className="flex items-center space-x-2">
                                  <Switch
                                    id={`${gateway.id}_${method}`}
                                    checked={gateway.config.enabledPaymentMethods?.includes(method) || false}
                                    onCheckedChange={(checked) => {
                                      const methods = gateway.config.enabledPaymentMethods || []
                                      const updatedMethods = checked
                                        ? [...methods, method]
                                        : methods.filter((m: string) => m !== method)
                                      
                                      updateGateway(gateway.id, {
                                        config: { ...gateway.config, enabledPaymentMethods: updatedMethods }
                                      })
                                    }}
                                  />
                                  <Label 
                                    htmlFor={`${gateway.id}_${method}`} 
                                    className="text-sm capitalize"
                                  >
                                    {method.replace('_', ' ')}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Xendit Configuration */}
                      {gateway.id === 'xendit' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Secret Key</Label>
                            <div className="relative">
                              <Input
                                type={showSecrets[`${gateway.id}_secretKey`] ? 'text' : 'password'}
                                value={gateway.config.secretKey}
                                onChange={(e) => 
                                  updateGateway(gateway.id, {
                                    config: { ...gateway.config, secretKey: e.target.value }
                                  })
                                }
                                placeholder="xnd_development_..."
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => toggleShowSecret(gateway.id, 'secretKey')}
                              >
                                {showSecrets[`${gateway.id}_secretKey`] ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Public Key</Label>
                            <Input
                              value={gateway.config.publicKey}
                              onChange={(e) => 
                                updateGateway(gateway.id, {
                                  config: { ...gateway.config, publicKey: e.target.value }
                                })
                              }
                              placeholder="xnd_public_development_..."
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Webhook Token</Label>
                            <div className="relative">
                              <Input
                                type={showSecrets[`${gateway.id}_webhookToken`] ? 'text' : 'password'}
                                value={gateway.config.webhookToken}
                                onChange={(e) => 
                                  updateGateway(gateway.id, {
                                    config: { ...gateway.config, webhookToken: e.target.value }
                                  })
                                }
                                placeholder="Webhook verification token"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => toggleShowSecret(gateway.id, 'webhookToken')}
                              >
                                {showSecrets[`${gateway.id}_webhookToken`] ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Environment</Label>
                            <Select
                              value={gateway.config.environment}
                              onValueChange={(value) => 
                                updateGateway(gateway.id, {
                                  config: { ...gateway.config, environment: value }
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="test">Test</SelectItem>
                                <SelectItem value="live">Live</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}

                      {/* DOKU Configuration */}
                      {gateway.id === 'doku' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Client ID</Label>
                            <Input
                              value={gateway.config.clientId}
                              onChange={(e) => 
                                updateGateway(gateway.id, {
                                  config: { ...gateway.config, clientId: e.target.value }
                                })
                              }
                              placeholder="Your DOKU Client ID"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Shared Key</Label>
                            <div className="relative">
                              <Input
                                type={showSecrets[`${gateway.id}_sharedKey`] ? 'text' : 'password'}
                                value={gateway.config.sharedKey}
                                onChange={(e) => 
                                  updateGateway(gateway.id, {
                                    config: { ...gateway.config, sharedKey: e.target.value }
                                  })
                                }
                                placeholder="Shared key for signature"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => toggleShowSecret(gateway.id, 'sharedKey')}
                              >
                                {showSecrets[`${gateway.id}_sharedKey`] ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Environment</Label>
                            <Select
                              value={gateway.config.environment}
                              onValueChange={(value) => 
                                updateGateway(gateway.id, {
                                  config: { ...gateway.config, environment: value }
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sandbox">Sandbox</SelectItem>
                                <SelectItem value="production">Production</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}

                      {/* Fee Configuration */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Fee Configuration</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Fixed Fee (Rp)</Label>
                            <Input
                              type="number"
                              value={gateway.fees.fixed}
                              onChange={(e) => 
                                updateGateway(gateway.id, {
                                  fees: { ...gateway.fees, fixed: parseFloat(e.target.value) || 0 }
                                })
                              }
                              placeholder="0"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Percentage Fee (%)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={gateway.fees.percentage}
                              onChange={(e) => 
                                updateGateway(gateway.id, {
                                  fees: { ...gateway.fees, percentage: parseFloat(e.target.value) || 0 }
                                })
                              }
                              placeholder="2.9"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Test Connection */}
                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={() => testConnection(gateway.id)}
                          disabled={loading}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Test Connection
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Payment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Select
                    value={generalSettings.defaultCurrency}
                    onValueChange={(value) => 
                      setGeneralSettings(prev => ({ ...prev, defaultCurrency: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDR">Indonesian Rupiah (IDR)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Invoice Prefix</Label>
                  <Input
                    value={generalSettings.invoicePrefix}
                    onChange={(e) => 
                      setGeneralSettings(prev => ({ ...prev, invoicePrefix: e.target.value }))
                    }
                    placeholder="INV"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Payment Due Days</Label>
                  <Input
                    type="number"
                    value={generalSettings.paymentDueDays}
                    onChange={(e) => 
                      setGeneralSettings(prev => ({ ...prev, paymentDueDays: parseInt(e.target.value) || 30 }))
                    }
                    placeholder="30"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Late Payment Fee (Rp)</Label>
                  <Input
                    type="number"
                    value={generalSettings.latePaymentFee}
                    onChange={(e) => 
                      setGeneralSettings(prev => ({ ...prev, latePaymentFee: parseInt(e.target.value) || 0 }))
                    }
                    placeholder="50000"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Reminder Days Before Due</Label>
                  <Input
                    type="number"
                    value={generalSettings.reminderDaysBefore}
                    onChange={(e) => 
                      setGeneralSettings(prev => ({ ...prev, reminderDaysBefore: parseInt(e.target.value) || 3 }))
                    }
                    placeholder="3"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Payment Attempts</Label>
                  <Input
                    type="number"
                    value={generalSettings.maxPaymentAttempts}
                    onChange={(e) => 
                      setGeneralSettings(prev => ({ ...prev, maxPaymentAttempts: parseInt(e.target.value) || 3 }))
                    }
                    placeholder="3"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Partial Payment</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow students to make partial payments on invoices
                    </p>
                  </div>
                  <Switch
                    checked={generalSettings.allowPartialPayment}
                    onCheckedChange={(checked) => 
                      setGeneralSettings(prev => ({ ...prev, allowPartialPayment: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Generate Invoice</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically generate invoices for recurring payments
                    </p>
                  </div>
                  <Switch
                    checked={generalSettings.autoGenerateInvoice}
                    onCheckedChange={(checked) => 
                      setGeneralSettings(prev => ({ ...prev, autoGenerateInvoice: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Late Fee Calculation</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically add late fees for overdue payments
                    </p>
                  </div>
                  <Switch
                    checked={generalSettings.enableLateFeeCalculation}
                    onCheckedChange={(checked) => 
                      setGeneralSettings(prev => ({ ...prev, enableLateFeeCalculation: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Send Payment Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Send automatic payment reminder notifications
                    </p>
                  </div>
                  <Switch
                    checked={generalSettings.sendPaymentReminder}
                    onCheckedChange={(checked) => 
                      setGeneralSettings(prev => ({ ...prev, sendPaymentReminder: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure webhook endpoints for payment notifications
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Make sure your webhook endpoint is accessible from the internet and can handle POST requests.
                  Your webhook URL should be: <code>{`${typeof window !== 'undefined' ? window.location.origin : 'https://yourschool.com'}/api/webhooks/payment`}</code>
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <Input
                    value={webhookSettings.webhookUrl}
                    onChange={(e) => 
                      setWebhookSettings(prev => ({ ...prev, webhookUrl: e.target.value }))
                    }
                    placeholder="https://yourschool.com/api/webhooks/payment"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Webhook Secret</Label>
                  <div className="relative">
                    <Input
                      type={showSecrets['webhook_secret'] ? 'text' : 'password'}
                      value={webhookSettings.webhookSecret}
                      onChange={(e) => 
                        setWebhookSettings(prev => ({ ...prev, webhookSecret: e.target.value }))
                      }
                      placeholder="Your secret key for webhook verification"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => toggleShowSecret('webhook', 'secret')}
                    >
                      {showSecrets['webhook_secret'] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Retry Attempts</Label>
                    <Input
                      type="number"
                      value={webhookSettings.retryAttempts}
                      onChange={(e) => 
                        setWebhookSettings(prev => ({ ...prev, retryAttempts: parseInt(e.target.value) || 3 }))
                      }
                      placeholder="3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Timeout (seconds)</Label>
                    <Input
                      type="number"
                      value={webhookSettings.timeoutSeconds}
                      onChange={(e) => 
                        setWebhookSettings(prev => ({ ...prev, timeoutSeconds: parseInt(e.target.value) || 30 }))
                      }
                      placeholder="30"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Signature Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Verify webhook signatures for enhanced security
                    </p>
                  </div>
                  <Switch
                    checked={webhookSettings.enableSignatureVerification}
                    onCheckedChange={(checked) => 
                      setWebhookSettings(prev => ({ ...prev, enableSignatureVerification: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fee Structure</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure transaction fees and charges
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {paymentGateways.map((gateway) => (
                  <div key={gateway.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      {getGatewayIcon(gateway.type)}
                      <h4 className="font-medium">{gateway.name}</h4>
                      <Badge variant={gateway.enabled ? 'default' : 'secondary'}>
                        {gateway.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm">Fixed Fee (Rp)</Label>
                        <p className="text-2xl font-bold">
                          {gateway.fees.fixed.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm">Percentage Fee</Label>
                        <p className="text-2xl font-bold">
                          {gateway.fees.percentage}%
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm">Example Fee (for Rp 500,000)</Label>
                        <p className="text-lg font-semibold text-orange-600">
                          Rp {(gateway.fees.fixed + (500000 * gateway.fees.percentage / 100)).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={loading}>
          <Settings className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}