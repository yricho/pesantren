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
  Send, 
  Bot, 
  Shield, 
  Webhook,
  MessageSquare,
  Users,
  Hash,
  AtSign,
  Globe,
  Key,
  Link2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  RefreshCw,
  TestTube,
  Settings
} from 'lucide-react'

interface TelegramConfig {
  enabled: boolean
  botToken: string
  botUsername: string
  webhookUrl: string
  webhookSecret: string
  adminChatIds: string[]
  features: {
    payments: boolean
    broadcasts: boolean
    autoReply: boolean
    groupManagement: boolean
    inlineQueries: boolean
    commands: boolean
  }
  commands: {
    start: string
    help: string
    info: string
    payment: string
    attendance: string
    schedule: string
  }
  autoReply: {
    greeting: string
    unknown: string
    error: string
  }
  rateLimits: {
    messagesPerMinute: number
    broadcastDelay: number
  }
}

export default function TelegramSettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [webhookStatus, setWebhookStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected')
  const [showToken, setShowToken] = useState(false)
  
  const [config, setConfig] = useState<TelegramConfig>({
    enabled: false,
    botToken: '',
    botUsername: '',
    webhookUrl: '',
    webhookSecret: '',
    adminChatIds: [],
    features: {
      payments: false,
      broadcasts: true,
      autoReply: true,
      groupManagement: false,
      inlineQueries: false,
      commands: true
    },
    commands: {
      start: 'Selamat datang di Bot Pondok Imam Syafii! 🎓\n\nGunakan /help untuk melihat daftar perintah.',
      help: 'Daftar Perintah:\n/info - Informasi sekolah\n/payment - Cek tagihan\n/attendance - Cek kehadiran\n/schedule - Jadwal pelajaran',
      info: 'Pondok Imam Syafii Blitar\n📍 Jl. Example No. 123\n📞 0342-123456\n🌐 www.pondokimamsyafii.sch.id',
      payment: 'Untuk mengecek tagihan, silakan masukkan NIS siswa.',
      attendance: 'Untuk mengecek kehadiran, silakan masukkan NIS siswa.',
      schedule: 'Jadwal pelajaran akan ditampilkan sesuai kelas.'
    },
    autoReply: {
      greeting: 'Assalamualaikum! Ada yang bisa kami bantu?',
      unknown: 'Maaf, perintah tidak dikenali. Ketik /help untuk bantuan.',
      error: 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.'
    },
    rateLimits: {
      messagesPerMinute: 30,
      broadcastDelay: 1000
    }
  })

  useEffect(() => {
    fetchConfig()
    if (config.botToken) {
      checkWebhookStatus()
    }
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/settings/telegram')
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      }
    } catch (error) {
      console.error('Failed to fetch config:', error)
    }
  }

  const checkWebhookStatus = async () => {
    if (!config.botToken) return
    
    try {
      const response = await fetch(`https://api.telegram.org/bot${config.botToken}/getWebhookInfo`)
      const data = await response.json()
      
      if (data.ok && data.result.url) {
        setWebhookStatus('connected')
      } else {
        setWebhookStatus('disconnected')
      }
    } catch (error) {
      setWebhookStatus('error')
    }
  }

  const handleSetWebhook = async () => {
    if (!config.botToken || !config.webhookUrl) {
      toast({
        title: 'Error',
        description: 'Bot token dan webhook URL harus diisi',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`https://api.telegram.org/bot${config.botToken}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: config.webhookUrl,
          secret_token: config.webhookSecret
        })
      })
      
      const data = await response.json()
      if (data.ok) {
        setWebhookStatus('connected')
        toast({
          title: 'Success',
          description: 'Webhook berhasil diset'
        })
      } else {
        throw new Error(data.description)
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
    if (!config.botToken) {
      toast({
        title: 'Error',
        description: 'Bot token harus diisi',
        variant: 'destructive'
      })
      return
    }

    setTesting(true)
    try {
      const response = await fetch(`https://api.telegram.org/bot${config.botToken}/getMe`)
      const data = await response.json()
      
      if (data.ok) {
        toast({
          title: 'Bot Connected',
          description: `Bot @${data.result.username} aktif!`
        })
        setConfig(prev => ({ ...prev, botUsername: `@${data.result.username}` }))
      } else {
        throw new Error(data.description)
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
      const response = await fetch('/api/settings/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Pengaturan Telegram berhasil disimpan'
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
    const webhookUrl = `${domain}/api/webhooks/telegram`
    setConfig(prev => ({ ...prev, webhookUrl }))
    
    navigator.clipboard.writeText(webhookUrl)
    toast({
      title: 'Copied',
      description: 'Webhook URL berhasil disalin'
    })
  }

  const generateWebhookSecret = () => {
    const secret = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    setConfig(prev => ({ ...prev, webhookSecret: secret }))
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Telegram Bot Settings</h1>
          <p className="text-gray-600">Konfigurasi bot Telegram untuk notifikasi dan automasi</p>
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
          <TabsTrigger value="commands">Commands</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="webhook">Webhook</TabsTrigger>
          <TabsTrigger value="test">Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Bot className="w-4 h-4 mr-2" />
              Bot Configuration
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Bot Token</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showToken ? 'text' : 'password'}
                      value={config.botToken}
                      onChange={(e) => setConfig(prev => ({ ...prev, botToken: e.target.value }))}
                      placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowToken(!showToken)}
                    >
                      {showToken ? '🙈' : '👁️'}
                    </Button>
                  </div>
                  <Button onClick={handleTestBot} disabled={testing}>
                    {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <TestTube className="w-4 h-4" />}
                    Test
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Dapatkan dari @BotFather di Telegram
                </p>
              </div>

              <div className="space-y-2">
                <Label>Bot Username</Label>
                <Input
                  value={config.botUsername}
                  onChange={(e) => setConfig(prev => ({ ...prev, botUsername: e.target.value }))}
                  placeholder="@pondok_syafii_bot"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label>Admin Chat IDs</Label>
                <Input
                  value={config.adminChatIds.join(', ')}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    adminChatIds: e.target.value.split(',').map(id => id.trim()).filter(Boolean)
                  }))}
                  placeholder="123456789, 987654321"
                />
                <p className="text-xs text-gray-500">
                  Chat ID admin yang bisa menggunakan perintah khusus (pisahkan dengan koma)
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
            <h3 className="font-semibold mb-4">Quick Setup Guide</h3>
            <ol className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="font-medium mr-2">1.</span>
                <div>
                  <p>Buka Telegram dan cari <code className="bg-gray-100 px-1 rounded">@BotFather</code></p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">2.</span>
                <div>
                  <p>Kirim <code className="bg-gray-100 px-1 rounded">/newbot</code> untuk membuat bot baru</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">3.</span>
                <div>
                  <p>Ikuti instruksi untuk memberi nama dan username bot</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">4.</span>
                <div>
                  <p>Copy token yang diberikan dan paste di field Bot Token</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">5.</span>
                <div>
                  <p>Klik Test untuk memverifikasi bot</p>
                </div>
              </li>
            </ol>
          </Card>
        </TabsContent>

        <TabsContent value="commands" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Command Messages
            </h3>
            <div className="space-y-4">
              {Object.entries(config.commands).map(([command, message]) => (
                <div key={command} className="space-y-2">
                  <Label className="capitalize">/{command} Response</Label>
                  <textarea
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    value={message}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      commands: { ...prev.commands, [command]: e.target.value }
                    }))}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Auto Reply Messages</h3>
            <div className="space-y-4">
              {Object.entries(config.autoReply).map(([key, message]) => (
                <div key={key} className="space-y-2">
                  <Label className="capitalize">{key} Message</Label>
                  <Input
                    value={message}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      autoReply: { ...prev.autoReply, [key]: e.target.value }
                    }))}
                  />
                </div>
              ))}
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
                      {feature === 'payments' && 'Enable payment notifications and queries'}
                      {feature === 'broadcasts' && 'Allow broadcasting messages to all users'}
                      {feature === 'autoReply' && 'Automatically reply to common questions'}
                      {feature === 'groupManagement' && 'Manage groups and channels'}
                      {feature === 'inlineQueries' && 'Support inline bot queries'}
                      {feature === 'commands' && 'Enable bot commands'}
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
                    placeholder="https://yourdomain.com/api/webhooks/telegram"
                  />
                  <Button onClick={generateWebhookUrl} variant="outline">
                    <Copy className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Webhook Secret</Label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    value={config.webhookSecret}
                    onChange={(e) => setConfig(prev => ({ ...prev, webhookSecret: e.target.value }))}
                    placeholder="Secret token for webhook verification"
                  />
                  <Button onClick={generateWebhookSecret} variant="outline">
                    <Key className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                </div>
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
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Webhook Info</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Status:</strong> {webhookStatus}</p>
              <p><strong>URL:</strong> {config.webhookUrl || 'Not set'}</p>
              <p><strong>Secret:</strong> {config.webhookSecret ? '••••••••' : 'Not set'}</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <TestTube className="w-4 h-4 mr-2" />
              Test Bot Functions
            </h3>
            <div className="space-y-4">
              <Button 
                onClick={async () => {
                  setLoading(true)
                  try {
                    await fetch('/api/test/telegram/send', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        chatId: config.adminChatIds[0],
                        message: 'Test message from Pondok Imam Syafii System'
                      })
                    })
                    toast({ title: 'Success', description: 'Test message sent!' })
                  } catch (error) {
                    toast({ title: 'Error', description: 'Failed to send test message', variant: 'destructive' })
                  } finally {
                    setLoading(false)
                  }
                }}
                disabled={loading || !config.adminChatIds.length}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Test Message
              </Button>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-2">Test Commands:</p>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Send <code>/start</code> to your bot</li>
                  <li>• Send <code>/help</code> to see commands</li>
                  <li>• Send <code>/info</code> for school info</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Integration Examples</h3>
            <div className="space-y-2">
              <a 
                href="https://core.telegram.org/bots/api" 
                target="_blank" 
                className="flex items-center text-blue-600 hover:underline"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Telegram Bot API Documentation
              </a>
              <a 
                href="https://core.telegram.org/bots/webhooks" 
                target="_blank" 
                className="flex items-center text-blue-600 hover:underline"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Webhook Guide
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