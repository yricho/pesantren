'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface UpdateNotificationProps {
  onUpdate?: () => void
  onDismiss?: () => void
}

export function UpdateNotification({ onUpdate, onDismiss }: UpdateNotificationProps) {
  const [showUpdate, setShowUpdate] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Check for existing service worker
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg)
        
        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker installed, update available
                setUpdateAvailable(true)
                setShowUpdate(true)
              }
            })
          }
        })

        // Listen for controlling service worker change
        let refreshing = false
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!refreshing) {
            refreshing = true
            window.location.reload()
          }
        })
      })

      // Check for updates periodically (every 5 minutes)
      const checkForUpdates = () => {
        navigator.serviceWorker.ready.then((reg) => {
          reg.update().catch((error) => {
            console.log('Service worker update check failed:', error)
          })
        })
      }

      // Initial check
      setTimeout(checkForUpdates, 30000) // Check after 30 seconds

      // Periodic checks
      const updateInterval = setInterval(checkForUpdates, 5 * 60 * 1000) // Every 5 minutes

      return () => {
        clearInterval(updateInterval)
      }
    }
  }, [])

  const handleUpdate = async () => {
    if (!registration) return

    setIsUpdating(true)

    try {
      const waitingWorker = registration.waiting
      if (waitingWorker) {
        // Send skip waiting message to service worker
        waitingWorker.postMessage({ type: 'SKIP_WAITING' })
        
        // The service worker will become the controller and trigger a reload
        onUpdate?.()
      } else {
        // Fallback: force reload
        window.location.reload()
      }
    } catch (error) {
      console.error('Error during app update:', error)
      setIsUpdating(false)
    }
  }

  const handleDismiss = () => {
    setShowUpdate(false)
    onDismiss?.()
  }

  const handleRefreshClick = () => {
    setIsUpdating(true)
    window.location.reload()
  }

  if (!updateAvailable || !showUpdate) {
    return null
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card className="bg-white shadow-lg border-0 ring-1 ring-blue-200">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 bg-blue-500 rounded-full p-2 text-white">
                <RefreshCw className={`h-5 w-5 ${isUpdating ? 'animate-spin' : ''}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Update Tersedia
                  </h3>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Baru
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Versi terbaru aplikasi tersedia dengan fitur dan perbaikan baru
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="flex-shrink-0 -mr-2 -mt-2"
              disabled={isUpdating}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <Button
              onClick={handleUpdate}
              size="sm"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Mengupdate...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Update Sekarang
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={isUpdating}
            >
              Nanti
            </Button>
          </div>
          
          <div className="mt-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>Update akan memuat ulang aplikasi</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Hook for managing app updates
export function useAppUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg)
        
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true)
              }
            })
          }
        })
      })
    }
  }, [])

  const checkForUpdate = async () => {
    if (registration) {
      try {
        await registration.update()
      } catch (error) {
        console.error('Failed to check for updates:', error)
      }
    }
  }

  const applyUpdate = async () => {
    if (!registration) return

    setIsUpdating(true)

    const waitingWorker = registration.waiting
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' })
    } else {
      window.location.reload()
    }
  }

  return {
    updateAvailable,
    isUpdating,
    checkForUpdate,
    applyUpdate
  }
}

// Minimal update indicator for status bar or header
export function UpdateIndicator() {
  const { updateAvailable, applyUpdate, isUpdating } = useAppUpdate()

  if (!updateAvailable) {
    return null
  }

  return (
    <Button
      onClick={applyUpdate}
      size="sm"
      variant="outline"
      disabled={isUpdating}
      className="border-blue-500 text-blue-600 hover:bg-blue-50 text-xs px-2 py-1 h-7"
    >
      {isUpdating ? (
        <RefreshCw className="h-3 w-3 animate-spin" />
      ) : (
        <>
          <RefreshCw className="h-3 w-3 mr-1" />
          Update
        </>
      )}
    </Button>
  )
}