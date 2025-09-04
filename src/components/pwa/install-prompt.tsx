'use client'

import { useState, useEffect } from 'react'
import { X, Download, Smartphone, Monitor, Tablet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
}

interface InstallPromptProps {
  onInstall?: () => void
  onDismiss?: () => void
}

export function InstallPrompt({ onInstall, onDismiss }: InstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [platform, setPlatform] = useState<'desktop' | 'mobile' | 'tablet'>('desktop')

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true)
      return
    }

    // Detect platform
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const isTablet = window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches
    
    if (isMobile) setPlatform('mobile')
    else if (isTablet) setPlatform('tablet')
    else setPlatform('desktop')

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)
      setIsInstallable(true)
      
      // Show prompt after a short delay if not dismissed recently
      const lastDismissed = localStorage.getItem('pwa-install-dismissed')
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000)
      
      if (!lastDismissed || parseInt(lastDismissed) < oneDayAgo) {
        setTimeout(() => {
          setShowPrompt(true)
        }, 3000) // Show after 3 seconds
      }
    }

    // Handle app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
      onInstall?.()
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [onInstall])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA installation accepted')
        setShowPrompt(false)
        setDeferredPrompt(null)
      } else {
        console.log('PWA installation dismissed')
      }
    } catch (error) {
      console.error('Error during PWA installation:', error)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
    onDismiss?.()
  }

  const getPlatformIcon = () => {
    switch (platform) {
      case 'mobile':
        return <Smartphone className="h-6 w-6" />
      case 'tablet':
        return <Tablet className="h-6 w-6" />
      default:
        return <Monitor className="h-6 w-6" />
    }
  }

  const getPlatformText = () => {
    switch (platform) {
      case 'mobile':
        return 'smartphone Anda'
      case 'tablet':
        return 'tablet Anda'
      default:
        return 'desktop Anda'
    }
  }

  // Don't show if not installable or already installed
  if (!isInstallable || isInstalled || !showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card className="bg-white shadow-lg border-0 ring-1 ring-gray-200">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 bg-green-500 rounded-full p-2 text-white">
                {getPlatformIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  Instal Aplikasi Pondok Imam
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Instal aplikasi di {getPlatformText()} untuk akses yang lebih cepat dan mudah
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="flex-shrink-0 -mr-2 -mt-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <Button
              onClick={handleInstallClick}
              size="sm"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Instal Sekarang
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Nanti Saja
            </Button>
          </div>
          
          <div className="mt-3 text-xs text-gray-500">
            <ul className="space-y-1">
              <li>• Akses offline tanpa internet</li>
              <li>• Notifikasi real-time</li>
              <li>• Launching yang lebih cepat</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Mini install button for header/navbar
export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true)
      return
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null)
      }
    } catch (error) {
      console.error('Error during PWA installation:', error)
    }
  }

  if (!isInstallable || isInstalled) {
    return null
  }

  return (
    <Button
      onClick={handleInstallClick}
      size="sm"
      variant="outline"
      className="hidden md:flex items-center space-x-2 border-green-500 text-green-600 hover:bg-green-50"
    >
      <Download className="h-4 w-4" />
      <span>Install App</span>
    </Button>
  )
}