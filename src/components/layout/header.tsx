'use client'

import { useSession } from 'next-auth/react'
import { useOffline } from '@/components/offline-provider'
import { NotificationBell } from '@/components/notifications/notification-bell'
import { Wifi, WifiOff, RefreshCw } from 'lucide-react'

export function Header({ title }: { title: string }) {
  const { data: session } = useSession()
  const { isOnline, syncStatus } = useOffline()

  return (
    <header className="bg-white border-b px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        
        <div className="flex items-center space-x-6">
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

          {/* Notification Bell */}
          {session?.user && (
            <NotificationBell />
          )}

          {/* Current time */}
          <div className="text-sm text-gray-600 hidden md:block">
            {new Date().toLocaleString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>

          {/* User info */}
          {session?.user && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">
                  {session.user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                <p className="text-xs text-gray-500">{session.user.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}