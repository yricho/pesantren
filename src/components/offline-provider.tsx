'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface OfflineContextType {
  isOnline: boolean
  syncStatus: 'synced' | 'syncing' | 'offline'
}

const OfflineContext = createContext<OfflineContextType>({
  isOnline: true,
  syncStatus: 'synced'
})

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced')

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setSyncStatus('syncing')
      // Trigger data sync
      setTimeout(() => setSyncStatus('synced'), 2000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setSyncStatus('offline')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check initial status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <OfflineContext.Provider value={{ isOnline, syncStatus }}>
      {children}
      {!isOnline && (
        <div className="offline-indicator show">
          Mode Offline - Beberapa fitur mungkin tidak tersedia
        </div>
      )}
    </OfflineContext.Provider>
  )
}

export const useOffline = () => useContext(OfflineContext)