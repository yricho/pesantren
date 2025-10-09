'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Database, Server, Shield, Clock, HardDrive, Wifi, Settings as SettingsIcon, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface SystemInfo {
  version: string
  uptime: string
  serverTime: string
  timezone: string
  environment: 'development' | 'staging' | 'production'
  resources: {
    cpu: number
    memory: number
    disk: number
    network: number
  }
  database: {
    status: 'connected' | 'disconnected' | 'error'
    version: string
    connections: number
    maxConnections: number
  }
  services: {
    name: string
    status: 'running' | 'stopped' | 'error'
    port?: number
    memory?: number
  }[]
}

export default function SystemSettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    version: '1.0.0',
    uptime: '5 days, 12 hours',
    serverTime: new Date().toLocaleString('id-ID'),
    timezone: 'Asia/Jakarta',
    environment: 'production',
    resources: {
      cpu: 45,
      memory: 68,
      disk: 32,
      network: 12
    },
    database: {
      status: 'connected',
      version: 'PostgreSQL 15.3',
      connections: 15,
      maxConnections: 100
    },
    services: [
      { name: 'Web Server', status: 'running', port: 3000, memory: 256 },
      { name: 'Database', status: 'running', port: 5432, memory: 512 },
      { name: 'Redis Cache', status: 'running', port: 6379, memory: 64 },
      { name: 'Background Jobs', status: 'running', memory: 128 },
      { name: 'File Storage', status: 'running', memory: 32 }
    ]
  })

  const [systemSettings, setSystemSettings] = useState({
    general: {
      schoolName: 'Pondok Imam Syafi\'i',
      schoolAddress: 'Jl. Pendidikan No. 123, Jakarta',
      schoolPhone: '(021) 1234567',
      schoolEmail: 'info@pondokimamsyafii.com',
      schoolWebsite: 'https://pondokimamsyafii.com',
      academicYear: '2024/2025',
      timezone: 'Asia/Jakarta',
      language: 'id',
      currency: 'IDR'
    },
    security: {
      sessionTimeout: 30, // minutes
      maxLoginAttempts: 5,
      lockoutDuration: 15, // minutes
      passwordMinLength: 8,
      requireSpecialChar: true,
      requireNumber: true,
      requireUppercase: true,
      twoFactorRequired: false,
      ipWhitelist: '',
      allowedFileTypes: 'jpg,jpeg,png,pdf,doc,docx,xls,xlsx',
      maxFileSize: 10, // MB
      enableAuditLog: true,
      logRetentionDays: 90
    },
    maintenance: {
      maintenanceMode: false,
      maintenanceMessage: 'Sistem sedang dalam pemeliharaan. Mohon coba lagi nanti.',
      allowedIPs: '',
      autoBackup: true,
      backupFrequency: 'daily',
      backupTime: '02:00',
      backupRetention: 30, // days
      cleanupOldFiles: true,
      cleanupFrequency: 'weekly',
      logCleanup: true,
      logRetentionDays: 30
    },
    performance: {
      cacheDuration: 300, // seconds
      enableCompression: true,
      enableCDN: false,
      cdnUrl: '',
      maxConcurrentUsers: 1000,
      rateLimitRequests: 100,
      rateLimitWindow: 15, // minutes
      enableOptimization: true,
      lazyLoading: true,
      imageOptimization: true,
      minifyAssets: true
    }
  })

  const refreshSystemInfo = async () => {
    setLoading(true)
    try {
      // Simulate API call to get system info
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSystemInfo(prev => ({
        ...prev,
        serverTime: new Date().toLocaleString('id-ID'),
        resources: {
          cpu: Math.floor(Math.random() * 20) + 30,
          memory: Math.floor(Math.random() * 20) + 60,
          disk: Math.floor(Math.random() * 10) + 30,
          network: Math.floor(Math.random() * 15) + 5
        }
      }))
      
      toast({
        title: 'System Info Updated',
        description: 'System information has been refreshed.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to refresh system information.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Settings Saved',
        description: 'System settings have been saved successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save system settings.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleMaintenanceMode = async () => {
    setLoading(true)
    try {
      const newMode = !systemSettings.maintenance.maintenanceMode
      setSystemSettings(prev => ({
        ...prev,
        maintenance: { ...prev.maintenance, maintenanceMode: newMode }
      }))
      
      toast({
        title: `Maintenance Mode ${newMode ? 'Enabled' : 'Disabled'}`,
        description: newMode 
          ? 'System is now in maintenance mode.' 
          : 'System is back online.',
        variant: newMode ? 'destructive' : 'default'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to toggle maintenance mode.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
      case 'connected':
        return 'text-green-600 bg-green-100'
      case 'stopped':
      case 'disconnected':
        return 'text-red-600 bg-red-100'
      case 'error':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getResourceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-red-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">
            Configure system-wide settings and monitor system health
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={refreshSystemInfo} 
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={saveSettings} disabled={loading}>
            <SettingsIcon className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* System Overview */}
        <TabsContent value="overview" className="space-y-6">
          {/* System Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Server className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Version</p>
                    <p className="text-2xl font-bold">{systemInfo.version}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                    <p className="text-2xl font-bold">{systemInfo.uptime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Database className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Database</p>
                    <div className="flex items-center gap-1">
                      <Badge className={getStatusColor(systemInfo.database.status)}>
                        {systemInfo.database.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Environment</p>
                    <Badge variant="outline" className="capitalize">
                      {systemInfo.environment}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                System Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>CPU Usage</Label>
                  <span className={`font-medium ${getResourceColor(systemInfo.resources.cpu)}`}>
                    {systemInfo.resources.cpu}%
                  </span>
                </div>
                <Progress value={systemInfo.resources.cpu} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Memory Usage</Label>
                  <span className={`font-medium ${getResourceColor(systemInfo.resources.memory)}`}>
                    {systemInfo.resources.memory}%
                  </span>
                </div>
                <Progress value={systemInfo.resources.memory} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Disk Usage</Label>
                  <span className={`font-medium ${getResourceColor(systemInfo.resources.disk)}`}>
                    {systemInfo.resources.disk}%
                  </span>
                </div>
                <Progress value={systemInfo.resources.disk} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Network Usage</Label>
                  <span className={`font-medium ${getResourceColor(systemInfo.resources.network)}`}>
                    {systemInfo.resources.network}%
                  </span>
                </div>
                <Progress value={systemInfo.resources.network} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Services Status */}
          <Card>
            <CardHeader>
              <CardTitle>Services Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemInfo.services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        service.status === 'running' ? 'bg-green-500' :
                        service.status === 'stopped' ? 'bg-gray-400' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="font-medium">{service.name}</p>
                        {service.port && (
                          <p className="text-sm text-muted-foreground">Port: {service.port}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {service.memory && (
                        <span>{service.memory}MB RAM</span>
                      )}
                      <Badge className={getStatusColor(service.status)}>
                        {service.status === 'running' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {service.status === 'error' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {service.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Mode Alert */}
          {systemSettings.maintenance.maintenanceMode && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Maintenance Mode Active:</strong> The system is currently in maintenance mode. 
                Only administrators can access the system.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>School Name</Label>
                  <Input
                    value={systemSettings.general.schoolName}
                    onChange={(e) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, schoolName: e.target.value }
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Academic Year</Label>
                  <Input
                    value={systemSettings.general.academicYear}
                    onChange={(e) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, academicYear: e.target.value }
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={systemSettings.general.schoolPhone}
                    onChange={(e) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, schoolPhone: e.target.value }
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={systemSettings.general.schoolEmail}
                    onChange={(e) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, schoolEmail: e.target.value }
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input
                    value={systemSettings.general.schoolWebsite}
                    onChange={(e) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, schoolWebsite: e.target.value }
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    value={systemSettings.general.timezone}
                    onValueChange={(value) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, timezone: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Jakarta">WIB (UTC+7)</SelectItem>
                      <SelectItem value="Asia/Makassar">WITA (UTC+8)</SelectItem>
                      <SelectItem value="Asia/Jayapura">WIT (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={systemSettings.general.language}
                    onValueChange={(value) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, language: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="id">Bahasa Indonesia</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select
                    value={systemSettings.general.currency}
                    onValueChange={(value) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, currency: value }
                      }))
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
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={systemSettings.general.schoolAddress}
                  onChange={(e) => 
                    setSystemSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, schoolAddress: e.target.value }
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={systemSettings.security.sessionTimeout}
                    onChange={(e) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, sessionTimeout: parseInt(e.target.value) || 30 }
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Login Attempts</Label>
                  <Input
                    type="number"
                    value={systemSettings.security.maxLoginAttempts}
                    onChange={(e) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, maxLoginAttempts: parseInt(e.target.value) || 5 }
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Lockout Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={systemSettings.security.lockoutDuration}
                    onChange={(e) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, lockoutDuration: parseInt(e.target.value) || 15 }
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Password Min Length</Label>
                  <Input
                    type="number"
                    value={systemSettings.security.passwordMinLength}
                    onChange={(e) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, passwordMinLength: parseInt(e.target.value) || 8 }
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max File Size (MB)</Label>
                  <Input
                    type="number"
                    value={systemSettings.security.maxFileSize}
                    onChange={(e) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, maxFileSize: parseInt(e.target.value) || 10 }
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Log Retention (days)</Label>
                  <Input
                    type="number"
                    value={systemSettings.security.logRetentionDays}
                    onChange={(e) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, logRetentionDays: parseInt(e.target.value) || 90 }
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Allowed File Types</Label>
                <Input
                  value={systemSettings.security.allowedFileTypes}
                  onChange={(e) => 
                    setSystemSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, allowedFileTypes: e.target.value }
                    }))
                  }
                  placeholder="jpg,jpeg,png,pdf,doc,docx"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Special Characters</Label>
                    <p className="text-sm text-muted-foreground">Password must contain special characters</p>
                  </div>
                  <Switch
                    checked={systemSettings.security.requireSpecialChar}
                    onCheckedChange={(checked) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, requireSpecialChar: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Numbers</Label>
                    <p className="text-sm text-muted-foreground">Password must contain numbers</p>
                  </div>
                  <Switch
                    checked={systemSettings.security.requireNumber}
                    onCheckedChange={(checked) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, requireNumber: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Uppercase</Label>
                    <p className="text-sm text-muted-foreground">Password must contain uppercase letters</p>
                  </div>
                  <Switch
                    checked={systemSettings.security.requireUppercase}
                    onCheckedChange={(checked) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, requireUppercase: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Audit Log</Label>
                    <p className="text-sm text-muted-foreground">Log all system activities</p>
                  </div>
                  <Switch
                    checked={systemSettings.security.enableAuditLog}
                    onCheckedChange={(checked) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, enableAuditLog: checked }
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Settings */}
        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className={`border ${systemSettings.maintenance.maintenanceMode ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <div>
                      <strong>Maintenance Mode</strong>
                      <p className="text-sm">Enable to restrict access to administrators only</p>
                    </div>
                    <Button
                      variant={systemSettings.maintenance.maintenanceMode ? 'destructive' : 'default'}
                      onClick={toggleMaintenanceMode}
                      disabled={loading}
                    >
                      {systemSettings.maintenance.maintenanceMode ? 'Disable' : 'Enable'} Maintenance
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Backup Time</Label>
                  <Input
                    type="time"
                    value={systemSettings.maintenance.backupTime}
                    onChange={(e) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        maintenance: { ...prev.maintenance, backupTime: e.target.value }
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Backup Retention (days)</Label>
                  <Input
                    type="number"
                    value={systemSettings.maintenance.backupRetention}
                    onChange={(e) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        maintenance: { ...prev.maintenance, backupRetention: parseInt(e.target.value) || 30 }
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Backup</Label>
                    <p className="text-sm text-muted-foreground">Automatically backup database daily</p>
                  </div>
                  <Switch
                    checked={systemSettings.maintenance.autoBackup}
                    onCheckedChange={(checked) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        maintenance: { ...prev.maintenance, autoBackup: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Clean Up Old Files</Label>
                    <p className="text-sm text-muted-foreground">Remove old temporary files automatically</p>
                  </div>
                  <Switch
                    checked={systemSettings.maintenance.cleanupOldFiles}
                    onCheckedChange={(checked) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        maintenance: { ...prev.maintenance, cleanupOldFiles: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Log Cleanup</Label>
                    <p className="text-sm text-muted-foreground">Automatically remove old log files</p>
                  </div>
                  <Switch
                    checked={systemSettings.maintenance.logCleanup}
                    onCheckedChange={(checked) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        maintenance: { ...prev.maintenance, logCleanup: checked }
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Settings */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cache Duration (seconds)</Label>
                  <Input
                    type="number"
                    value={systemSettings.performance.cacheDuration}
                    onChange={(e) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        performance: { ...prev.performance, cacheDuration: parseInt(e.target.value) || 300 }
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Concurrent Users</Label>
                  <Input
                    type="number"
                    value={systemSettings.performance.maxConcurrentUsers}
                    onChange={(e) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        performance: { ...prev.performance, maxConcurrentUsers: parseInt(e.target.value) || 1000 }
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rate Limit (requests)</Label>
                  <Input
                    type="number"
                    value={systemSettings.performance.rateLimitRequests}
                    onChange={(e) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        performance: { ...prev.performance, rateLimitRequests: parseInt(e.target.value) || 100 }
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rate Limit Window (minutes)</Label>
                  <Input
                    type="number"
                    value={systemSettings.performance.rateLimitWindow}
                    onChange={(e) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        performance: { ...prev.performance, rateLimitWindow: parseInt(e.target.value) || 15 }
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Compression</Label>
                    <p className="text-sm text-muted-foreground">Compress responses to reduce bandwidth</p>
                  </div>
                  <Switch
                    checked={systemSettings.performance.enableCompression}
                    onCheckedChange={(checked) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        performance: { ...prev.performance, enableCompression: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Lazy Loading</Label>
                    <p className="text-sm text-muted-foreground">Load content only when needed</p>
                  </div>
                  <Switch
                    checked={systemSettings.performance.lazyLoading}
                    onCheckedChange={(checked) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        performance: { ...prev.performance, lazyLoading: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Image Optimization</Label>
                    <p className="text-sm text-muted-foreground">Optimize images for faster loading</p>
                  </div>
                  <Switch
                    checked={systemSettings.performance.imageOptimization}
                    onCheckedChange={(checked) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        performance: { ...prev.performance, imageOptimization: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Minify Assets</Label>
                    <p className="text-sm text-muted-foreground">Reduce file sizes of CSS and JavaScript</p>
                  </div>
                  <Switch
                    checked={systemSettings.performance.minifyAssets}
                    onCheckedChange={(checked) => 
                      setSystemSettings(prev => ({
                        ...prev,
                        performance: { ...prev.performance, minifyAssets: checked }
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}