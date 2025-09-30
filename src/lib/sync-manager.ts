import { OfflineStorage } from './offline-storage'

export class SyncManager {
  private storage: OfflineStorage
  private syncInProgress = false
  private syncInterval: NodeJS.Timeout | null = null

  constructor() {
    this.storage = new OfflineStorage()
    this.startPeriodicSync()
  }

  // Start periodic synchronization
  private startPeriodicSync(): void {
    if (typeof window === 'undefined') return

    // Sync every 5 minutes when online
    this.syncInterval = setInterval(() => {
      if (navigator.onLine && !this.syncInProgress) {
        this.performSync()
      }
    }, 5 * 60 * 1000)

    // Sync when coming back online
    window.addEventListener('online', () => {
      this.performSync()
    })
  }

  // Main sync method
  async performSync(): Promise<void> {
    if (this.syncInProgress || !navigator.onLine) return

    this.syncInProgress = true
    
    try {
      console.log('Starting data synchronization...')
      
      // Get pending changes from sync queue
      const pendingChanges = await this.storage.getSyncQueue()
      
      // Upload pending changes
      if (pendingChanges.length > 0) {
        await this.uploadPendingChanges(pendingChanges)
        await this.storage.clearSyncQueue()
      }

      // Download latest data from server
      await this.downloadLatestData()

      // Update last sync timestamp
      await this.storage.setLastSyncTime(Date.now())
      
      console.log('Data synchronization completed')
      
      // Dispatch sync completion event
      window.dispatchEvent(new CustomEvent('syncCompleted'))
      
    } catch (error) {
      console.error('Sync error:', error)
      
      // Dispatch sync error event
      window.dispatchEvent(new CustomEvent('syncError', { 
        detail: { error } 
      }))
    } finally {
      this.syncInProgress = false
    }
  }

  // Upload pending changes to server
  private async uploadPendingChanges(changes: any[]): Promise<void> {
    for (const change of changes) {
      try {
        await this.uploadChange(change)
      } catch (error) {
        console.error('Failed to upload change:', change, error)
        // Keep the change in queue for retry
      }
    }
  }

  // Upload individual change
  private async uploadChange(change: any): Promise<void> {
    const { type, entity, data } = change
    
    // Simulate API calls - replace with actual API endpoints
    const baseUrl = '/api'
    
    switch (type) {
      case 'create':
        await fetch(`${baseUrl}/${entity}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        break
        
      case 'update':
        await fetch(`${baseUrl}/${entity}/${data.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        break
        
      case 'delete':
        await fetch(`${baseUrl}/${entity}/${data.id}`, {
          method: 'DELETE'
        })
        break
    }
  }

  // Download latest data from server
  private async downloadLatestData(): Promise<void> {
    const lastSync = await this.storage.getLastSyncTime()
    
    try {
      // Download transactions
      const transactionsResponse = await fetch(`/api/transactions?since=${lastSync}`)
      if (transactionsResponse.ok) {
        const transactions = await transactionsResponse.json()
        await this.storage.saveTransactions(transactions)
      }

      // Download activities
      const activitiesResponse = await fetch(`/api/activities?since=${lastSync}`)
      if (activitiesResponse.ok) {
        const activities = await activitiesResponse.json()
        await this.storage.saveActivities(activities)
      }

      // Download courses
      const coursesResponse = await fetch(`/api/courses?since=${lastSync}`)
      if (coursesResponse.ok) {
        const courses = await coursesResponse.json()
        await this.storage.saveCourses(courses)
      }

      // Download videos
      const videosResponse = await fetch(`/api/videos?since=${lastSync}`)
      if (videosResponse.ok) {
        const videos = await videosResponse.json()
        await this.storage.saveVideos(videos)
      }
      
    } catch (error) {
      console.error('Failed to download data:', error)
      // Continue with cached data
    }
  }

  // Add change to sync queue
  async queueChange(type: 'create' | 'update' | 'delete', entity: string, data: any): Promise<void> {
    const change = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      entity,
      data,
      timestamp: Date.now()
    }
    
    await this.storage.addToSyncQueue(change)
    
    // Try immediate sync if online
    if (navigator.onLine) {
      this.performSync()
    }
  }

  // Get cached data methods
  async getCachedData(): Promise<{
    transactions: any[]
    activities: any[]
    courses: any[]
    videos: any[]
  }> {
    const [transactions, activities, courses, videos] = await Promise.all([
      this.storage.getCachedTransactions(),
      this.storage.getCachedActivities(),
      this.storage.getCachedCourses(),
      this.storage.getCachedVideos()
    ])

    return { transactions, activities, courses, videos }
  }

  // Force sync
  async forceSync(): Promise<void> {
    if (!this.syncInProgress) {
      await this.performSync()
    }
  }

  // Get sync status
  isSyncing(): boolean {
    return this.syncInProgress
  }

  // Clean up
  destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }
}