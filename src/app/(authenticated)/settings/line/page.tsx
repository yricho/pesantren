'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { 
  MessageCircle,
  Key,
  Shield,
  Webhook,
  QrCode,
  Users,
  Settings,
  Copy,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  TestTube,
  Send,
  Image,
  Menu,
  Zap,
  Globe
} from 'lucide-react'

interface LineConfig {
  enabled: boolean
  channelId: string
  channelSecret: string
  channelAccessToken: string
  webhookUrl: string
  liffId: string
  features: {
    richMenu: boolean
    flexMessages: boolean
    quickReply: boolean
    broadcast: boolean
    liff: boolean
    multicast: boolean
    pushMessages: boolean
  }
  richMenu: {
    enabled: boolean
    menuId: string
    items: Array<{
      bounds: { x: number; y: number; width: number; height: number }
      action: { type: string; data: string }
    }>
  }
  messages: {
    welcome: string
    unknown: string
    error: string
    payment: string
    attendance: string
    schedule: string
  }
  quickReplies: Array<{
    label: string
    text: string
  }>
  rateLimits: {
    messagesPerMinute: number
    broadcastDelay: number
  }
}

export default function LineSettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [webhookStatus, setWebhookStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected')
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  
  const [config, setConfig] = useState<LineConfig>({
    enabled: false,
    channelId: '',
    channelSecret: '',
    channelAccessToken: '',
    webhookUrl: '',
    liffId: '',
    features: {
      richMenu: true,
      flexMessages: true,
      quickReply: true,
      broadcast: true,
      liff: false,
      multicast: true,
      pushMessages: true
    },
    richMenu: {
      enabled: false,
      menuId: '',
      items: []
    },
    messages: {
      welcome: 'Selamat datang di LINE Official Account Pondok Imam Syafii! 🎓\n\nSilakan pilih menu untuk melanjutkan.',
      unknown: 'Maaf, pesan tidak dikenali. Silakan pilih dari menu yang tersedia.',
      error: 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.',
      payment: 'Untuk mengecek tagihan SPP, silakan masukkan NIS siswa.',
      attendance: 'Untuk mengecek kehadiran, silakan masukkan NIS siswa.',
      schedule: 'Jadwal pelajaran akan ditampilkan sesuai kelas.'
    },
    quickReplies: [
      { label: '📚 Info Sekolah', text: 'info' },
      { label: '💰 Cek Tagihan', text: 'payment' },
      { label: '📅 Jadwal', text: 'schedule' },
      { label: '✅ Kehadiran', text: 'attendance' },
      { label: '💬 Bantuan', text: 'help' }
    ],
    rateLimits: {
      messagesPerMinute: 60,
      broadcastDelay: 500
    }
  })

  useEffect(() => {
    fetchConfig()
    if (config.channelId) {
      generateQrCode()
      checkWebhookStatus()
    }
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/settings/line')
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      }
    } catch (error) {
      console.error('Failed to fetch config:', error)
    }
  }

  const generateQrCode = () => {
    if (config.channelId) {
      setQrCodeUrl(`https://line.me/R/ti/p/@${config.channelId}`)
    }
  }

  const checkWebhookStatus = async () => {
    try {
      const response = await fetch('/api/line/webhook/status', {
        headers: {
          'Authorization': `Bearer ${config.channelAccessToken}`
        }
      })
      
      if (response.ok) {
        setWebhookStatus('connected')
      } else {
        setWebhookStatus('disconnected')
      }
    } catch (error) {
      setWebhookStatus('error')
    }
  }

  const handleSetWebhook = async () => {
    if (!config.channelAccessToken || !config.webhookUrl) {
      toast({
        title: 'Error',
        description: 'Channel Access Token dan Webhook URL harus diisi',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('https://api.line.me/v2/bot/channel/webhook/endpoint', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${config.channelAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          endpoint: config.webhookUrl
        })
      })
      
      if (response.ok) {
        setWebhookStatus('connected')
        toast({
          title: 'Success',
          description: 'Webhook berhasil diset'
        })
      } else {
        throw new Error('Failed to set webhook')
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTestBot = async () => {
    if (!config.channelAccessToken) {
      toast({
        title: 'Error',
        description: 'Channel Access Token harus diisi',
        variant: 'destructive'
      })
      return
    }

    setTesting(true)
    try {
      const response = await fetch('https://api.line.me/v2/bot/info', {
        headers: {
          'Authorization': `Bearer ${config.channelAccessToken}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        toast({
          title: 'Bot Connected',
          description: `Bot ${data.displayName} aktif!`
        })
      } else {
        throw new Error('Invalid access token')
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setTesting(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/settings/line', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Pengaturan LINE berhasil disimpan'
        })
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menyimpan pengaturan',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const generateWebhookUrl = () => {
    const domain = window.location.origin
    const webhookUrl = `${domain}/api/webhooks/line`
    setConfig(prev => ({ ...prev, webhookUrl }))
    
    navigator.clipboard.writeText(webhookUrl)
    toast({
      title: 'Copied',
      description: 'Webhook URL berhasil disalin'
    })
  }

  const toggleSecret = (field: string) => {
    setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }))
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">LINE Messaging API Settings</h1>
          <p className="text-gray-600">Konfigurasi LINE Official Account untuk notifikasi dan automasi</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {webhookStatus === 'connected' && (
              <span className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                Connected
              </span>
            )}
            {webhookStatus === 'disconnected' && (
              <span className="flex items-center text-gray-500">
                <XCircle className="w-4 h-4 mr-1" />
                Disconnected
              </span>
            )}
            {webhookStatus === 'error' && (
              <span className="flex items-center text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                Error
              </span>
            )}
          </div>
          <Switch
            checked={config.enabled}
            onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enabled: checked }))}
          />
        </div>
      </div>

      <Tabs defaultValue="config" className="space-y-4">
        <TabsList>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="richmenu">Rich Menu</TabsTrigger>
          <TabsTrigger value="webhook">Webhook</TabsTrigger>
          <TabsTrigger value="test">Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              LINE Configuration
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Channel ID</Label>
                <Input
                  value={config.channelId}
                  onChange={(e) => setConfig(prev => ({ ...prev, channelId: e.target.value }))}
                  placeholder="1234567890"
                />
              </div>

              <div className="space-y-2">
                <Label>Channel Secret</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showSecrets['channelSecret'] ? 'text' : 'password'}
                      value={config.channelSecret}
                      onChange={(e) => setConfig(prev => ({ ...prev, channelSecret: e.target.value }))}
                      placeholder="a1b2c3d4e5f6..."
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => toggleSecret('channelSecret')}
                    >
                      {showSecrets['channelSecret'] ? '🙈' : '👁️'}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Channel Access Token</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showSecrets['channelAccessToken'] ? 'text' : 'password'}
                      value={config.channelAccessToken}
                      onChange={(e) => setConfig(prev => ({ ...prev, channelAccessToken: e.target.value }))}
                      placeholder="Bearer token..."
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => toggleSecret('channelAccessToken')}
                    >
                      {showSecrets['channelAccessToken'] ? '🙈' : '👁️'}
                    </Button>
                  </div>
                  <Button onClick={handleTestBot} disabled={testing}>
                    {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <TestTube className="w-4 h-4" />}
                    Test
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Issue token di LINE Developers Console > Messaging API
                </p>
              </div>

              <div className="space-y-2">
                <Label>LIFF ID (Optional)</Label>
                <Input
                  value={config.liffId}
                  onChange={(e) => setConfig(prev => ({ ...prev, liffId: e.target.value }))}
                  placeholder="1234567890-abcdefgh"
                />
                <p className="text-xs text-gray-500">
                  Untuk integrasi LINE Front-end Framework (web apps dalam LINE)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rate Limit (msg/menit)</Label>
                  <Input
                    type="number"
                    value={config.rateLimits.messagesPerMinute}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      rateLimits: { ...prev.rateLimits, messagesPerMinute: parseInt(e.target.value) }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Broadcast Delay (ms)</Label>
                  <Input
                    type="number"
                    value={config.rateLimits.broadcastDelay}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      rateLimits: { ...prev.rateLimits, broadcastDelay: parseInt(e.target.value) }
                    }))}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <QrCode className="w-4 h-4 mr-2" />
              Add Friend QR Code
            </h3>
            {config.channelId ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <img 
                    src={`https://qr-official.line.me/sid/L/${config.channelId}.png`}
                    alt="LINE QR Code"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <p className="text-sm text-center text-gray-600">
                  Scan untuk add Official Account
                </p>
              </div>
            ) : (
              <p className="text-gray-500">Masukkan Channel ID untuk generate QR Code</p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              Auto Reply Messages
            </h3>
            <div className="space-y-4">
              {Object.entries(config.messages).map(([key, message]) => (
                <div key={key} className="space-y-2">
                  <Label className="capitalize">{key} Message</Label>
                  <textarea
                    className="w-full min-h-[80px] p-2 border rounded-md"
                    value={message}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      messages: { ...prev.messages, [key]: e.target.value }
                    }))}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Quick Reply Items
            </h3>
            <div className="space-y-4">
              {config.quickReplies.map((reply, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={reply.label}
                    onChange={(e) => {
                      const newReplies = [...config.quickReplies]
                      newReplies[index].label = e.target.value
                      setConfig(prev => ({ ...prev, quickReplies: newReplies }))
                    }}
                    placeholder="Label"
                    className="flex-1"
                  />
                  <Input
                    value={reply.text}
                    onChange={(e) => {
                      const newReplies = [...config.quickReplies]
                      newReplies[index].text = e.target.value
                      setConfig(prev => ({ ...prev, quickReplies: newReplies }))
                    }}
                    placeholder="Text"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const newReplies = config.quickReplies.filter((_, i) => i !== index)
                      setConfig(prev => ({ ...prev, quickReplies: newReplies }))
                    }}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  setConfig(prev => ({
                    ...prev,
                    quickReplies: [...prev.quickReplies, { label: '', text: '' }]
                  }))
                }}
              >
                Add Quick Reply
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Feature Toggles
            </h3>
            <div className="space-y-4">
              {Object.entries(config.features).map(([feature, enabled]) => (
                <div key={feature} className="flex items-center justify-between">
                  <div>
                    <Label className="capitalize">{feature.replace(/([A-Z])/g, ' $1').trim()}</Label>
                    <p className="text-xs text-gray-500">
                      {feature === 'richMenu' && 'Enable rich menu with custom buttons'}
                      {feature === 'flexMessages' && 'Use flex messages for rich content'}
                      {feature === 'quickReply' && 'Show quick reply buttons'}
                      {feature === 'broadcast' && 'Allow broadcasting to all followers'}
                      {feature === 'liff' && 'Enable LINE Front-end Framework'}
                      {feature === 'multicast' && 'Send messages to multiple users'}
                      {feature === 'pushMessages' && 'Send push notifications'}
                    </p>
                  </div>
                  <Switch
                    checked={enabled}
                    onCheckedChange={(checked) => setConfig(prev => ({
                      ...prev,
                      features: { ...prev.features, [feature]: checked }
                    }))}
                  />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="richmenu" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Menu className="w-4 h-4 mr-2" />
              Rich Menu Configuration
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Rich Menu</Label>
                <Switch
                  checked={config.richMenu.enabled}
                  onCheckedChange={(checked) => setConfig(prev => ({
                    ...prev,
                    richMenu: { ...prev.richMenu, enabled: checked }
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Rich Menu ID</Label>
                <Input
                  value={config.richMenu.menuId}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    richMenu: { ...prev.richMenu, menuId: e.target.value }
                  }))}
                  placeholder="richmenu-xxxxx"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-2">Rich Menu Template</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm">Info Sekolah</Button>
                  <Button variant="outline" size="sm">Cek SPP</Button>
                  <Button variant="outline" size="sm">Jadwal</Button>
                  <Button variant="outline" size="sm">Kehadiran</Button>
                  <Button variant="outline" size="sm">Pengumuman</Button>
                  <Button variant="outline" size="sm">Bantuan</Button>
                </div>
              </div>

              <a 
                href="https://developers.line.biz/console/channel/${config.channelId}/rich-menu" 
                target="_blank"
                className="inline-flex items-center text-blue-600 hover:underline"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Design Rich Menu di LINE Console
              </a>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="webhook" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Webhook className="w-4 h-4 mr-2" />
              Webhook Configuration
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={config.webhookUrl}
                    onChange={(e) => setConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                    placeholder="https://yourdomain.com/api/webhooks/line"
                  />
                  <Button onClick={generateWebhookUrl} variant="outline">
                    <Copy className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Set this URL in LINE Developers Console > Messaging API > Webhook settings
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSetWebhook} disabled={loading}>
                  <Link2 className="w-4 h-4 mr-2" />
                  Set Webhook
                </Button>
                <Button onClick={checkWebhookStatus} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Check Status
                </Button>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm font-medium text-amber-800 mb-2">Important Settings di LINE Console:</p>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>✓ Use webhook: ON</li>
                  <li>✓ Auto-reply messages: OFF</li>
                  <li>✓ Greeting messages: OFF</li>
                  <li>✓ Webhook redelivery: ON</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <TestTube className="w-4 h-4 mr-2" />
              Test LINE Functions
            </h3>
            <div className="space-y-4">
              <Button 
                onClick={async () => {
                  setLoading(true)
                  try {
                    await fetch('/api/test/line/broadcast', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        message: 'Test broadcast from Pondok Imam Syafii System'
                      })
                    })
                    toast({ title: 'Success', description: 'Test broadcast sent!' })
                  } catch (error) {
                    toast({ title: 'Error', description: 'Failed to send broadcast', variant: 'destructive' })
                  } finally {
                    setLoading(false)
                  }
                }}
                disabled={loading}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Test Broadcast
              </Button>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-2">Test Steps:</p>
                <ol className="text-sm space-y-1 text-gray-600">
                  <li>1. Add bot as friend using QR code</li>
                  <li>2. Send any message to test auto-reply</li>
                  <li>3. Try quick reply buttons</li>
                  <li>4. Test rich menu items</li>
                </ol>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">LINE Resources</h3>
            <div className="space-y-2">
              <a 
                href="https://developers.line.biz/console" 
                target="_blank" 
                className="flex items-center text-blue-600 hover:underline"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                LINE Developers Console
              </a>
              <a 
                href="https://developers.line.biz/en/docs/messaging-api/" 
                target="_blank" 
                className="flex items-center text-blue-600 hover:underline"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Messaging API Documentation
              </a>
              <a 
                href="https://developers.line.biz/flex-simulator/" 
                target="_blank" 
                className="flex items-center text-blue-600 hover:underline"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Flex Message Simulator
              </a>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={fetchConfig}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}