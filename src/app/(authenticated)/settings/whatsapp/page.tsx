'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MessageSquare, Send, Users, Bell, Settings, Zap, CheckCircle, XCircle, Eye, EyeOff, QrCode, Smartphone, Globe } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface WhatsAppProvider {
  id: string
  name: string
  type: 'official_api' | 'unofficial_api' | 'web_api'
  enabled: boolean
  config: Record<string, any>
  status: 'connected' | 'disconnected' | 'pending'
  features: string[]
}

interface MessageTemplate {
  id: string
  name: string
  type: 'payment_reminder' | 'payment_confirmation' | 'general_notification' | 'welcome' | 'custom'
  content: string
  variables: string[]
  enabled: boolean
}

export default function WhatsAppSettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [qrCode, setQrCode] = useState<string | null>(null)
  
  const [providers, setProviders] = useState<WhatsAppProvider[]>([
    {
      id: 'whatsapp_business_api',
      name: 'WhatsApp Business API',
      type: 'official_api',
      enabled: true,
      config: {
        phoneNumberId: '',
        accessToken: '',
        webhookVerifyToken: '',
        appSecret: '',
        businessAccountId: '',
        apiVersion: 'v17.0'
      },
      status: 'disconnected',
      features: ['messages', 'templates', 'media', 'webhooks', 'analytics']
    },
    {
      id: 'fonnte',
      name: 'Fonnte',
      type: 'unofficial_api',
      enabled: false,
      config: {
        token: '',
        device: '',
        apiUrl: 'https://api.fonnte.com'
      },
      status: 'disconnected',
      features: ['messages', 'media', 'groups']
    },
    {
      id: 'wablas',
      name: 'Wablas',
      type: 'unofficial_api',
      enabled: false,
      config: {
        token: '',
        domain: '',
        deviceId: ''
      },
      status: 'disconnected',
      features: ['messages', 'media', 'groups', 'scheduled']
    },
    {
      id: 'whatsapp_web',
      name: 'WhatsApp Web (Baileys)',
      type: 'web_api',
      enabled: false,
      config: {
        sessionName: 'school_session',
        multiDevice: true,
        printQRInTerminal: false
      },
      status: 'disconnected',
      features: ['messages', 'media', 'groups', 'presence']
    }
  ])

  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>([
    {
      id: 'payment_reminder',
      name: 'Payment Reminder',
      type: 'payment_reminder',
      content: `Assalamu'alaikum {student_name},\n\nKami mengingatkan bahwa ada tagihan SPP yang belum dibayar:\n\n💳 Jumlah: Rp {amount}\n📅 Jatuh Tempo: {due_date}\n🏫 Untuk: {description}\n\nSilakan lakukan pembayaran sebelum tanggal jatuh tempo.\n\nJazakallahu khairan\n{school_name}`,
      variables: ['student_name', 'amount', 'due_date', 'description', 'school_name'],
      enabled: true
    },
    {
      id: 'payment_confirmation',
      name: 'Payment Confirmation',
      type: 'payment_confirmation',
      content: `Assalamu'alaikum {student_name},\n\nAlhamdulillah, pembayaran Anda telah berhasil diterima:\n\n✅ Jumlah: Rp {amount}\n📋 Untuk: {description}\n🗓️ Tanggal: {payment_date}\n🧾 No. Referensi: {reference_number}\n\nJazakallahu khairan atas pembayarannya.\n\n{school_name}`,
      variables: ['student_name', 'amount', 'description', 'payment_date', 'reference_number', 'school_name'],
      enabled: true
    },
    {
      id: 'welcome_message',
      name: 'Welcome Message',
      type: 'welcome',
      content: `Assalamu'alaikum wa rahmatullahi wa barakatuh\n\nSelamat datang {student_name} di {school_name}! 🎓\n\nTerima kasih telah mempercayakan pendidikan kepada kami. Semoga Allah SWT memberkahi perjalanan menuntut ilmu Anda.\n\nUntuk informasi lebih lanjut, jangan ragu untuk menghubungi kami.\n\nBarakallahu fiikum\n{school_name}`,
      variables: ['student_name', 'school_name'],
      enabled: true
    }
  ])

  const [generalSettings, setGeneralSettings] = useState({
    autoSendReminders: true,
    reminderIntervalDays: 3,
    maxReminderAttempts: 3,
    sendConfirmations: true,
    enableGroupMessages: false,
    rateLimitPerMinute: 60,
    enableScheduledMessages: true,
    businessHoursOnly: false,
    businessStartTime: '08:00',
    businessEndTime: '17:00',
    enableDeliveryReports: true,
    enableReadReceipts: false
  })

  const updateProvider = async (providerId: string, updates: Partial<WhatsAppProvider>) => {
    setLoading(true)
    try {
      setProviders(prev => 
        prev.map(provider => 
          provider.id === providerId 
            ? { ...provider, ...updates }
            : provider
        )
      )
      
      toast({
        title: 'Provider Updated',
        description: 'WhatsApp provider settings have been updated successfully.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update WhatsApp provider settings.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const connectProvider = async (providerId: string) => {
    setLoading(true)
    try {
      const provider = providers.find(p => p.id === providerId)
      
      if (provider?.type === 'web_api') {
        // For web API, generate QR code
        setQrCode('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==') // Placeholder
        
        updateProvider(providerId, { status: 'pending' })
        
        // Simulate QR scanning
        setTimeout(() => {
          updateProvider(providerId, { status: 'connected' })
          setQrCode(null)
          toast({
            title: 'Connected Successfully',
            description: 'WhatsApp Web connection established.'
          })
        }, 10000)
      } else {
        // For API providers, test connection
        await new Promise(resolve => setTimeout(resolve, 2000))
        updateProvider(providerId, { status: 'connected' })
        
        toast({
          title: 'Connected Successfully',
          description: 'WhatsApp API connection established.'
        })
      }
    } catch (error) {
      updateProvider(providerId, { status: 'disconnected' })
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect to WhatsApp provider. Please check your configuration.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const testMessage = async (providerId: string) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: 'Test Message Sent',
        description: 'Test message has been sent successfully.'
      })
    } catch (error) {
      toast({
        title: 'Failed to Send',
        description: 'Failed to send test message. Please check your connection.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateTemplate = (templateId: string, updates: Partial<MessageTemplate>) => {
    setMessageTemplates(prev => 
      prev.map(template => 
        template.id === templateId 
          ? { ...template, ...updates }
          : template
      )
    )
  }

  const toggleShowSecret = (providerId: string, field: string) => {
    const key = `${providerId}_${field}`
    setShowSecrets(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'official_api':
        return <Globe className="w-5 h-5" />
      case 'unofficial_api':
        return <Smartphone className="w-5 h-5" />
      case 'web_api':
        return <QrCode className="w-5 h-5" />
      default:
        return <MessageSquare className="w-5 h-5" />
    }
  }

  const saveSettings = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Settings Saved',
        description: 'WhatsApp settings have been saved successfully.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save WhatsApp settings.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">WhatsApp Settings</h1>
        <p className="text-muted-foreground">
          Configure WhatsApp integration for automated notifications and messaging.
        </p>
      </div>

      <Tabs defaultValue="providers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="templates">Message Templates</TabsTrigger>
          <TabsTrigger value="settings">General Settings</TabsTrigger>
          <TabsTrigger value="logs">Message Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                WhatsApp Provider Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {providers.map((provider) => (
                <Card key={provider.id} className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getProviderIcon(provider.type)}
                        <div>
                          <CardTitle className="text-lg">{provider.name}</CardTitle>
                          <p className="text-sm text-muted-foreground capitalize">
                            {provider.type.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={provider.status === 'connected' ? 'default' : provider.status === 'pending' ? 'secondary' : 'destructive'}>
                          {provider.status === 'connected' ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : provider.status === 'pending' ? (
                            <Zap className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {provider.status}
                        </Badge>
                        <Switch
                          checked={provider.enabled}
                          onCheckedChange={(enabled) => 
                            updateProvider(provider.id, { enabled })
                          }
                        />
                      </div>
                    </div>
                  </CardHeader>
                  
                  {provider.enabled && (
                    <CardContent className="space-y-4">
                      {/* WhatsApp Business API Configuration */}
                      {provider.id === 'whatsapp_business_api' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Phone Number ID</Label>
                            <Input
                              value={provider.config.phoneNumberId}
                              onChange={(e) => 
                                updateProvider(provider.id, {
                                  config: { ...provider.config, phoneNumberId: e.target.value }
                                })
                              }
                              placeholder="123456789012345"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Access Token</Label>
                            <div className="relative">
                              <Input
                                type={showSecrets[`${provider.id}_accessToken`] ? 'text' : 'password'}
                                value={provider.config.accessToken}
                                onChange={(e) => 
                                  updateProvider(provider.id, {
                                    config: { ...provider.config, accessToken: e.target.value }
                                  })
                                }
                                placeholder="EAAxxxxxxxxxx"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => toggleShowSecret(provider.id, 'accessToken')}
                              >
                                {showSecrets[`${provider.id}_accessToken`] ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Webhook Verify Token</Label>
                            <div className="relative">
                              <Input
                                type={showSecrets[`${provider.id}_webhookVerifyToken`] ? 'text' : 'password'}
                                value={provider.config.webhookVerifyToken}
                                onChange={(e) => 
                                  updateProvider(provider.id, {
                                    config: { ...provider.config, webhookVerifyToken: e.target.value }
                                  })
                                }
                                placeholder="your_webhook_verify_token"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => toggleShowSecret(provider.id, 'webhookVerifyToken')}
                              >
                                {showSecrets[`${provider.id}_webhookVerifyToken`] ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>App Secret</Label>
                            <div className="relative">
                              <Input
                                type={showSecrets[`${provider.id}_appSecret`] ? 'text' : 'password'}
                                value={provider.config.appSecret}
                                onChange={(e) => 
                                  updateProvider(provider.id, {
                                    config: { ...provider.config, appSecret: e.target.value }
                                  })
                                }
                                placeholder="your_app_secret"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => toggleShowSecret(provider.id, 'appSecret')}
                              >
                                {showSecrets[`${provider.id}_appSecret`] ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Business Account ID</Label>
                            <Input
                              value={provider.config.businessAccountId}
                              onChange={(e) => 
                                updateProvider(provider.id, {
                                  config: { ...provider.config, businessAccountId: e.target.value }
                                })
                              }
                              placeholder="123456789012345"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>API Version</Label>
                            <Select
                              value={provider.config.apiVersion}
                              onValueChange={(value) => 
                                updateProvider(provider.id, {
                                  config: { ...provider.config, apiVersion: value }
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="v17.0">v17.0 (Latest)</SelectItem>
                                <SelectItem value="v16.0">v16.0</SelectItem>
                                <SelectItem value="v15.0">v15.0</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}

                      {/* Fonnte Configuration */}
                      {provider.id === 'fonnte' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>API Token</Label>
                            <div className="relative">
                              <Input
                                type={showSecrets[`${provider.id}_token`] ? 'text' : 'password'}
                                value={provider.config.token}
                                onChange={(e) => 
                                  updateProvider(provider.id, {
                                    config: { ...provider.config, token: e.target.value }
                                  })
                                }
                                placeholder="Your Fonnte API token"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => toggleShowSecret(provider.id, 'token')}
                              >
                                {showSecrets[`${provider.id}_token`] ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Device Name</Label>
                            <Input
                              value={provider.config.device}
                              onChange={(e) => 
                                updateProvider(provider.id, {
                                  config: { ...provider.config, device: e.target.value }
                                })
                              }
                              placeholder="Your device name"
                            />
                          </div>
                        </div>
                      )}

                      {/* Wablas Configuration */}
                      {provider.id === 'wablas' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>API Token</Label>
                            <div className="relative">
                              <Input
                                type={showSecrets[`${provider.id}_token`] ? 'text' : 'password'}
                                value={provider.config.token}
                                onChange={(e) => 
                                  updateProvider(provider.id, {
                                    config: { ...provider.config, token: e.target.value }
                                  })
                                }
                                placeholder="Your Wablas API token"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => toggleShowSecret(provider.id, 'token')}
                              >
                                {showSecrets[`${provider.id}_token`] ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Domain</Label>
                            <Input
                              value={provider.config.domain}
                              onChange={(e) => 
                                updateProvider(provider.id, {
                                  config: { ...provider.config, domain: e.target.value }
                                })
                              }
                              placeholder="https://yourdomain.wablas.com"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Device ID</Label>
                            <Input
                              value={provider.config.deviceId}
                              onChange={(e) => 
                                updateProvider(provider.id, {
                                  config: { ...provider.config, deviceId: e.target.value }
                                })
                              }
                              placeholder="Your device ID"
                            />
                          </div>
                        </div>
                      )}

                      {/* WhatsApp Web Configuration */}
                      {provider.id === 'whatsapp_web' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Session Name</Label>
                              <Input
                                value={provider.config.sessionName}
                                onChange={(e) => 
                                  updateProvider(provider.id, {
                                    config: { ...provider.config, sessionName: e.target.value }
                                  })
                                }
                                placeholder="school_session"
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label>Multi Device</Label>
                                <p className="text-sm text-muted-foreground">
                                  Enable multi-device support
                                </p>
                              </div>
                              <Switch
                                checked={provider.config.multiDevice}
                                onCheckedChange={(checked) => 
                                  updateProvider(provider.id, {
                                    config: { ...provider.config, multiDevice: checked }
                                  })
                                }
                              />
                            </div>
                          </div>

                          {qrCode && provider.status === 'pending' && (
                            <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg">
                              <QrCode className="w-12 h-12 text-muted-foreground" />
                              <p className="text-center text-sm text-muted-foreground">
                                Scan the QR code with WhatsApp Web to connect
                              </p>
                              <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                                <p className="text-xs text-muted-foreground">QR Code will appear here</p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                QR Code expires in 60 seconds
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Features */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Available Features</h4>
                        <div className="flex flex-wrap gap-2">
                          {provider.features.map((feature) => (
                            <Badge key={feature} variant="secondary" className="capitalize">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t">
                        {provider.status === 'disconnected' ? (
                          <Button
                            onClick={() => connectProvider(provider.id)}
                            disabled={loading}
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            Connect
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={() => testMessage(provider.id)}
                            disabled={loading}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Send Test Message
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Message Templates</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure message templates for automated notifications
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {messageTemplates.map((template) => (
                <Card key={template.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <p className="text-sm text-muted-foreground capitalize">
                          {template.type.replace('_', ' ')}
                        </p>
                      </div>
                      <Switch
                        checked={template.enabled}
                        onCheckedChange={(enabled) => 
                          updateTemplate(template.id, { enabled })
                        }
                      />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Message Content</Label>
                      <Textarea
                        value={template.content}
                        onChange={(e) => 
                          updateTemplate(template.id, { content: e.target.value })
                        }
                        rows={6}
                        placeholder="Enter your message template..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Available Variables</Label>
                      <div className="flex flex-wrap gap-2">
                        {template.variables.map((variable) => (
                          <Badge key={variable} variant="outline" className="text-xs">
                            {`{${variable}}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General WhatsApp Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Reminder Interval (days)</Label>
                  <Input
                    type="number"
                    value={generalSettings.reminderIntervalDays}
                    onChange={(e) => 
                      setGeneralSettings(prev => ({ ...prev, reminderIntervalDays: parseInt(e.target.value) || 3 }))
                    }
                    placeholder="3"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Reminder Attempts</Label>
                  <Input
                    type="number"
                    value={generalSettings.maxReminderAttempts}
                    onChange={(e) => 
                      setGeneralSettings(prev => ({ ...prev, maxReminderAttempts: parseInt(e.target.value) || 3 }))
                    }
                    placeholder="3"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rate Limit (messages per minute)</Label>
                  <Input
                    type="number"
                    value={generalSettings.rateLimitPerMinute}
                    onChange={(e) => 
                      setGeneralSettings(prev => ({ ...prev, rateLimitPerMinute: parseInt(e.target.value) || 60 }))
                    }
                    placeholder="60"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Business Start Time</Label>
                  <Input
                    type="time"
                    value={generalSettings.businessStartTime}
                    onChange={(e) => 
                      setGeneralSettings(prev => ({ ...prev, businessStartTime: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Business End Time</Label>
                  <Input
                    type="time"
                    value={generalSettings.businessEndTime}
                    onChange={(e) => 
                      setGeneralSettings(prev => ({ ...prev, businessEndTime: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Send Payment Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically send payment reminder messages
                    </p>
                  </div>
                  <Switch
                    checked={generalSettings.autoSendReminders}
                    onCheckedChange={(checked) => 
                      setGeneralSettings(prev => ({ ...prev, autoSendReminders: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Send Payment Confirmations</Label>
                    <p className="text-sm text-muted-foreground">
                      Send confirmation messages when payments are received
                    </p>
                  </div>
                  <Switch
                    checked={generalSettings.sendConfirmations}
                    onCheckedChange={(checked) => 
                      setGeneralSettings(prev => ({ ...prev, sendConfirmations: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Group Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow sending messages to WhatsApp groups
                    </p>
                  </div>
                  <Switch
                    checked={generalSettings.enableGroupMessages}
                    onCheckedChange={(checked) => 
                      setGeneralSettings(prev => ({ ...prev, enableGroupMessages: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Scheduled Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow scheduling messages for later delivery
                    </p>
                  </div>
                  <Switch
                    checked={generalSettings.enableScheduledMessages}
                    onCheckedChange={(checked) => 
                      setGeneralSettings(prev => ({ ...prev, enableScheduledMessages: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Business Hours Only</Label>
                    <p className="text-sm text-muted-foreground">
                      Only send messages during business hours
                    </p>
                  </div>
                  <Switch
                    checked={generalSettings.businessHoursOnly}
                    onCheckedChange={(checked) => 
                      setGeneralSettings(prev => ({ ...prev, businessHoursOnly: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Delivery Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Track message delivery status
                    </p>
                  </div>
                  <Switch
                    checked={generalSettings.enableDeliveryReports}
                    onCheckedChange={(checked) => 
                      setGeneralSettings(prev => ({ ...prev, enableDeliveryReports: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Read Receipts</Label>
                    <p className="text-sm text-muted-foreground">
                      Track when messages are read
                    </p>
                  </div>
                  <Switch
                    checked={generalSettings.enableReadReceipts}
                    onCheckedChange={(checked) => 
                      setGeneralSettings(prev => ({ ...prev, enableReadReceipts: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Message Logs</CardTitle>
              <p className="text-sm text-muted-foreground">
                View recent WhatsApp message activity
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Bell className="h-4 w-4" />
                  <AlertDescription>
                    Message logs will appear here once you start sending WhatsApp messages.
                    Logs are retained for 30 days.
                  </AlertDescription>
                </Alert>
                
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No messages sent yet</p>
                  <p className="text-sm">Configure a provider and send test messages to see logs here</p>
                </div>
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