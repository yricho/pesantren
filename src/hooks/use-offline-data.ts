'use client'

import { useState, useEffect, useCallback } from 'react'
import { SyncManager } from '@/lib/sync-manager'

// Global sync manager instance
let syncManager: SyncManager | null = null

export function useOfflineData<T>(
  endpoint: string,
  initialData: T[] = []
) {
  const [data, setData] = useState<T[]>(initialData)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Initialize sync manager
  useEffect(() => {
    if (typeof window !== 'undefined' && !syncManager) {
      syncManager = new SyncManager()
    }
  }, [])

  // Load cached data on component mount
  useEffect(() => {
    loadCachedData()
  }, [endpoint])

  // Listen for sync events
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleSyncStart = () => setSyncing(true)
    const handleSyncComplete = () => {
      setSyncing(false)
      loadCachedData() // Reload data after sync
    }
    const handleSyncError = (event: CustomEvent) => {
      setSyncing(false)
      setError(event.detail.error)
    }

    window.addEventListener('syncStarted', handleSyncStart)
    window.addEventListener('syncCompleted', handleSyncComplete)
    window.addEventListener('syncError', handleSyncError as EventListener)

    return () => {
      window.removeEventListener('syncStarted', handleSyncStart)
      window.removeEventListener('syncCompleted', handleSyncComplete)
      window.removeEventListener('syncError', handleSyncError as EventListener)
    }
  }, [])

  const loadCachedData = useCallback(async () => {
    if (!syncManager) return

    try {
      setLoading(true)
      const cachedData = await syncManager.getCachedData()
      
      // Map endpoint to cached data
      let entityData: T[] = []
      switch (endpoint) {
        case 'transactions':
          entityData = cachedData.transactions as T[]
          break
        case 'activities':
          entityData = cachedData.activities as T[]
          break
        case 'courses':
          entityData = cachedData.courses as T[]
          break
        case 'videos':
          entityData = cachedData.videos as T[]
          break
        default:
          entityData = initialData
      }

      setData(entityData)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [endpoint, initialData])

  const create = useCallback(async (newItem: Omit<T, 'id'>) => {
    if (!syncManager) return

    const itemWithId = {
      ...newItem,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    } as T

    // Update local state immediately
    setData(prev => [itemWithId, ...prev])

    // Queue for sync
    await syncManager.queueChange('create', endpoint, itemWithId)

    return itemWithId
  }, [endpoint])

  const update = useCallback(async (id: string, updates: Partial<T>) => {
    if (!syncManager) return

    // Find existing item
    const existingItem = data.find((item: any) => item.id === id)
    if (!existingItem) return

    const updatedItem = {
      ...existingItem,
      ...updates,
      updatedAt: new Date()
    }

    // Update local state
    setData(prev => prev.map((item: any) => 
      item.id === id ? updatedItem : item
    ))

    // Queue for sync
    await syncManager.queueChange('update', endpoint, updatedItem)

    return updatedItem
  }, [data, endpoint])

  const remove = useCallback(async (id: string) => {
    if (!syncManager) return

    // Update local state
    setData(prev => prev.filter((item: any) => item.id !== id))

    // Queue for sync
    await syncManager.queueChange('delete', endpoint, { id })
  }, [endpoint])

  const refresh = useCallback(async () => {
    if (!syncManager) return

    setSyncing(true)
    try {
      await syncManager.forceSync()
    } catch (err) {
      setError(err as Error)
    } finally {
      setSyncing(false)
    }
  }, [])

  return {
    data,
    loading,
    syncing,
    error,
    create,
    update,
    remove,
    refresh
  }
}