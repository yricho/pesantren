'use client'

import { SessionProvider } from 'next-auth/react'
import { OfflineProvider } from '@/components/offline-provider'
import { PWAProvider } from '@/components/pwa/pwa-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PWAProvider>
        <OfflineProvider>
          {children}
        </OfflineProvider>
      </PWAProvider>
    </SessionProvider>
  )
}