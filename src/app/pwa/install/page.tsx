'use client'

import { useState, useEffect } from 'react'
import { Smartphone, Monitor, Tablet, Download, Share, MoreHorizontal, Plus, ArrowRight, CheckCircle, Globe, Wifi, Bell, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { InstallButton } from '@/components/pwa/install-prompt'

interface DeviceInstructions {
  icon: React.ReactNode
  name: string
  instructions: {
    step: number
    title: string
    description: string
    icon?: React.ReactNode
  }[]
}

export default function PWAInstallPage() {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const [isInstalled, setIsInstalled] = useState(false)
  const [canInstall, setCanInstall] = useState(false)

  useEffect(() => {
    // Detect device type
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const isTablet = window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches
    
    if (isMobile) setDeviceType('mobile')
    else if (isTablet) setDeviceType('tablet')
    else setDeviceType('desktop')

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true)
    }

    // Check if can be installed
    const handleBeforeInstallPrompt = () => {
      setCanInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const deviceInstructions: Record<string, DeviceInstructions> = {
    mobile: {
      icon: <Smartphone className="h-6 w-6" />,
      name: 'Smartphone',
      instructions: [
        {
          step: 1,
          title: 'Buka Browser',
          description: 'Pastikan Anda menggunakan Chrome, Safari, atau Firefox di smartphone',
          icon: <Globe className="h-5 w-5" />
        },
        {
          step: 2,
          title: 'Kunjungi Website',
          description: 'Buka website Pondok Imam Syafi\'i di browser smartphone Anda'
        },
        {
          step: 3,
          title: 'Cari Menu Browser',
          description: 'Ketuk menu browser (⋮ untuk Chrome, □ untuk Safari)',
          icon: <MoreHorizontal className="h-5 w-5" />
        },
        {
          step: 4,
          title: 'Pilih "Add to Home Screen"',
          description: 'Cari opsi "Tambahkan ke Layar Utama" atau "Add to Home Screen"',
          icon: <Plus className="h-5 w-5" />
        },
        {
          step: 5,
          title: 'Konfirmasi Instalasi',
          description: 'Ketuk "Add" atau "Tambah" untuk menginstal aplikasi',
          icon: <CheckCircle className="h-5 w-5" />
        }
      ]
    },
    tablet: {
      icon: <Tablet className="h-6 w-6" />,
      name: 'Tablet',
      instructions: [
        {
          step: 1,
          title: 'Buka Browser',
          description: 'Gunakan Chrome, Safari, atau Firefox di tablet Anda',
          icon: <Globe className="h-5 w-5" />
        },
        {
          step: 2,
          title: 'Kunjungi Website',
          description: 'Akses website Pondok Imam Syafi\'i melalui browser'
        },
        {
          step: 3,
          title: 'Cari Tombol Install',
          description: 'Lihat notification bar atau cari tombol install di address bar',
          icon: <Download className="h-5 w-5" />
        },
        {
          step: 4,
          title: 'Klik Install',
          description: 'Ketuk tombol "Install" atau "Add to Home Screen"'
        },
        {
          step: 5,
          title: 'Selesai',
          description: 'Aplikasi akan muncul di home screen atau app drawer',
          icon: <CheckCircle className="h-5 w-5" />
        }
      ]
    },
    desktop: {
      icon: <Monitor className="h-6 w-6" />,
      name: 'Desktop/Laptop',
      instructions: [
        {
          step: 1,
          title: 'Buka Browser',
          description: 'Gunakan Chrome, Edge, atau Firefox (terbaru) di komputer',
          icon: <Globe className="h-5 w-5" />
        },
        {
          step: 2,
          title: 'Kunjungi Website',
          description: 'Buka website Pondok Imam Syafi\'i di browser desktop'
        },
        {
          step: 3,
          title: 'Cari Icon Install',
          description: 'Lihat icon install (⊕) di address bar atau notification',
          icon: <Download className="h-5 w-5" />
        },
        {
          step: 4,
          title: 'Klik Install',
          description: 'Klik tombol "Install" atau "Add to Desktop"'
        },
        {
          step: 5,
          title: 'Selesai',
          description: 'Aplikasi akan tersedia di start menu atau desktop',
          icon: <CheckCircle className="h-5 w-5" />
        }
      ]
    }
  }

  const features = [
    {
      icon: <Wifi className="h-6 w-6" />,
      title: 'Akses Offline',
      description: 'Gunakan aplikasi tanpa koneksi internet untuk fitur yang sudah dimuat'
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: 'Notifikasi Real-time',
      description: 'Dapatkan pemberitahuan langsung tentang nilai, hafalan, dan pengumuman'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Loading Super Cepat',
      description: 'Aplikasi dimuat lebih cepat dengan teknologi caching canggih'
    },
    {
      icon: <Monitor className="h-6 w-6" />,
      title: 'Seperti Aplikasi Native',
      description: 'Pengalaman menggunakan seperti aplikasi yang diunduh dari app store'
    }
  ]

  const currentInstructions = deviceInstructions[deviceType]

  if (isInstalled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Aplikasi Sudah Terinstal!
            </h1>
            <p className="text-xl text-gray-600">
              Terima kasih telah menginstal aplikasi Pondok Imam Syafi'i
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="text-green-500 mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            onClick={() => window.location.href = '/dashboard'}
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Buka Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Install Aplikasi Pondok Imam Syafi'i
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Nikmati pengalaman terbaik dengan menginstal aplikasi di perangkat Anda
          </p>

          {canInstall && (
            <div className="mb-8">
              <InstallButton />
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-green-500 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Device Specific Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-2 text-green-600">
                {currentInstructions.icon}
                <CardTitle>Cara Install di {currentInstructions.name}</CardTitle>
              </div>
            </div>
            <CardDescription className="text-center">
              Ikuti langkah-langkah berikut untuk menginstal aplikasi di {currentInstructions.name.toLowerCase()} Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {currentInstructions.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {instruction.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {instruction.icon && (
                        <div className="text-green-500">
                          {instruction.icon}
                        </div>
                      )}
                      <h3 className="font-semibold text-gray-900">
                        {instruction.title}
                      </h3>
                    </div>
                    <p className="text-gray-600">
                      {instruction.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Type Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Perangkat Lain</CardTitle>
            <CardDescription className="text-center">
              Pilih perangkat yang Anda gunakan untuk melihat instruksi yang sesuai
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(deviceInstructions).map(([type, device]) => (
                <Button
                  key={type}
                  variant={deviceType === type ? 'default' : 'outline'}
                  className={`p-4 h-auto flex flex-col items-center space-y-2 ${
                    deviceType === type ? 'bg-green-500 hover:bg-green-600' : 'hover:bg-green-50'
                  }`}
                  onClick={() => setDeviceType(type as any)}
                >
                  {device.icon}
                  <span>{device.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Butuh Bantuan?</CardTitle>
            <CardDescription>
              Jika Anda mengalami masalah saat instalasi, coba langkah-langkah berikut
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-0.5">1</Badge>
                <div>
                  <p className="font-medium">Pastikan browser up-to-date</p>
                  <p className="text-sm text-gray-600">Gunakan versi terbaru Chrome, Safari, Firefox, atau Edge</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-0.5">2</Badge>
                <div>
                  <p className="font-medium">Periksa koneksi internet</p>
                  <p className="text-sm text-gray-600">Pastikan koneksi internet stabil saat proses instalasi</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-0.5">3</Badge>
                <div>
                  <p className="font-medium">Kosongkan cache browser</p>
                  <p className="text-sm text-gray-600">Bersihkan cache dan reload halaman jika instalasi gagal</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}