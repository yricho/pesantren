'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { OfflineStorage } from '@/lib/offline-storage'
import { pushNotificationService } from '@/lib/push-notifications'
import { InstallPrompt } from './install-prompt'
import { UpdateNotification } from './update-notification'

interface PWAContextType {
  isOnline: boolean
  isInstalled: boolean
  canInstall: boolean
  isUpdating: boolean
  hasUpdate: boolean
  offlineStorage: OfflineStorage
  pendingSyncCount: number
  installApp: () => Promise<void>
  updateApp: () => Promise<void>
  subscribeToPush: () => Promise<void>
  unsubscribeFromPush: () => Promise<void>
}

const PWAContext = createContext<PWAContextType | null>(null)

interface PWAProviderProps {
  children: ReactNode
  showInstallPrompt?: boolean
  showUpdateNotification?: boolean
}

export function PWAProvider({ 
  children, 
  showInstallPrompt = true,
  showUpdateNotification = true 
}: PWAProviderProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [isInstalled, setIsInstalled] = useState(false)
  const [canInstall, setCanInstall] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [hasUpdate, setHasUpdate] = useState(false)
  const [offlineStorage] = useState(() => new OfflineStorage())
  const [pendingSyncCount, setPendingSyncCount] = useState(0)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Initialize offline storage
    offlineStorage.initNetworkListeners()

    // Check if app is installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone
      setIsInstalled(isStandalone)
    }

    checkInstalled()

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanInstall(true)
    }

    // Handle app installed
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setCanInstall(false)
      setDeferredPrompt(null)
    }

    // Network status listeners
    const handleOnline = () => {
      setIsOnline(true)
      offlineStorage.startSync()
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    // Offline storage event listeners
    const handleSyncQueueUpdate = async () => {
      const queue = await offlineStorage.getSyncQueue()
      setPendingSyncCount(queue.length)
    }

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    offlineStorage.on('syncQueueUpdated', handleSyncQueueUpdate)
    offlineStorage.on('online', handleOnline)
    offlineStorage.on('offline', handleOffline)

    // Initial network status
    setIsOnline(navigator.onLine)

    // Initial sync queue count
    handleSyncQueueUpdate()

    // Initialize push notifications
    if (pushNotificationService.isSupported()) {
      pushNotificationService.initialize().catch(console.error)
    }

    // Service Worker update detection
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setHasUpdate(true)
              }
            })
          }
        })

        // Listen for controlling service worker changes
        let refreshing = false
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!refreshing) {
            refreshing = true
            setIsUpdating(false)
            window.location.reload()
          }
        })
      })
    }

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      
      offlineStorage.off('syncQueueUpdated', handleSyncQueueUpdate)
      offlineStorage.off('online', handleOnline)
      offlineStorage.off('offline', handleOffline)
    }
  }, [offlineStorage])

  const installApp = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null)
        setCanInstall(false)
      }
    } catch (error) {
      console.error('Failed to install app:', error)
    }
  }

  const updateApp = async () => {
    if (!hasUpdate) return

    setIsUpdating(true)

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready
        const waitingWorker = registration.waiting
        
        if (waitingWorker) {
          waitingWorker.postMessage({ type: 'SKIP_WAITING' })
        } else {
          window.location.reload()
        }
      }
    } catch (error) {
      console.error('Failed to update app:', error)
      setIsUpdating(false)
    }
  }

  const subscribeToPush = async () => {
    try {
      await pushNotificationService.subscribe()
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      throw error
    }
  }

  const unsubscribeFromPush = async () => {
    try {
      await pushNotificationService.unsubscribe()
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error)
      throw error
    }
  }

  const contextValue: PWAContextType = {
    isOnline,
    isInstalled,
    canInstall,
    isUpdating,
    hasUpdate,
    offlineStorage,
    pendingSyncCount,
    installApp,
    updateApp,
    subscribeToPush,
    unsubscribeFromPush
  }

  return (
    <PWAContext.Provider value={contextValue}>
      {children}
      
      {/* PWA UI Components */}
      {showInstallPrompt && !isInstalled && canInstall && (
        <InstallPrompt onInstall={installApp} />
      )}
      
      {showUpdateNotification && hasUpdate && (
        <UpdateNotification onUpdate={updateApp} />
      )}
    </PWAContext.Provider>
  )
}

export function usePWA() {
  const context = useContext(PWAContext)
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider')
  }
  return context
}

// Status indicator component
export function PWAStatusIndicator() {
  const { isOnline, pendingSyncCount, isInstalled } = usePWA()

  return (
    <div className="flex items-center space-x-2 text-xs">
      {/* Online/Offline Status */}
      <div className={`flex items-center space-x-1 ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
        <span>{isOnline ? 'Online' : 'Offline'}</span>
      </div>

      {/* Sync Queue Status */}
      {pendingSyncCount > 0 && (
        <div className="text-orange-600 flex items-center space-x-1">
          <span>•</span>
          <span>{pendingSyncCount} pending</span>
        </div>
      )}

      {/* App Status */}
      {isInstalled && (
        <div className="text-blue-600 flex items-center space-x-1">
          <span>•</span>
          <span>App</span>
        </div>
      )}
    </div>
  )
}