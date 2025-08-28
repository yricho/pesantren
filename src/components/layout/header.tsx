'use client'

import { useSession } from 'next-auth/react'
import { useOffline } from '@/components/offline-provider'
import { Wifi, WifiOff, RefreshCw } from 'lucide-react'

export function Header({ title }: { title: string }) {
  const { data: session } = useSession()
  const { isOnline, syncStatus } = useOffline()

  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        
        <div className="flex items-center space-x-4">
          {/* Connection status */}
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm text-gray-600">
              {syncStatus === 'syncing' ? (
                <RefreshCw className="w-4 h-4 animate-spin inline mr-1" />
              ) : null}
              {syncStatus === 'synced' && 'Tersinkron'}
              {syncStatus === 'syncing' && 'Sinkronisasi...'}
              {syncStatus === 'offline' && 'Mode Offline'}
            </span>
          </div>

          {/* Current time */}
          <div className="text-sm text-gray-600">
            {new Date().toLocaleString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </header>
  )
}