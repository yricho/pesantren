// Offline storage utility using IndexedDB with enhanced PWA features

// Extend ServiceWorkerRegistration to include sync property
declare global {
  interface ServiceWorkerRegistration {
    sync?: {
      register(tag: string): Promise<void>;
    };
  }
}

// Define interfaces for type safety
interface SyncQueueItem {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: string;
  data: any;
  timestamp: number;
  priority: 'high' | 'medium' | 'low';
  retryCount: number;
  maxRetries: number;
}

export class OfflineStorage {
  private dbName = 'PondokImamSyafiiDB'
  private version = 2
  private db: IDBDatabase | null = null
  private syncInProgress = false
  private eventListeners: { [key: string]: Function[] } = {}

  constructor() {
    if (typeof window !== 'undefined') {
      this.initDB()
      this.initServiceWorkerListener()
    }
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => {
        reject(new Error('Failed to open database'))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores
        if (!db.objectStoreNames.contains('transactions')) {
          const transactionStore = db.createObjectStore('transactions', { keyPath: 'id' })
          transactionStore.createIndex('date', 'date', { unique: false })
          transactionStore.createIndex('type', 'type', { unique: false })
        }

        if (!db.objectStoreNames.contains('activities')) {
          const activityStore = db.createObjectStore('activities', { keyPath: 'id' })
          activityStore.createIndex('date', 'date', { unique: false })
          activityStore.createIndex('status', 'status', { unique: false })
        }

        if (!db.objectStoreNames.contains('courses')) {
          const courseStore = db.createObjectStore('courses', { keyPath: 'id' })
          courseStore.createIndex('status', 'status', { unique: false })
          courseStore.createIndex('level', 'level', { unique: false })
        }

        if (!db.objectStoreNames.contains('videos')) {
          const videoStore = db.createObjectStore('videos', { keyPath: 'id' })
          videoStore.createIndex('category', 'category', { unique: false })
          videoStore.createIndex('isPublic', 'isPublic', { unique: false })
        }

        if (!db.objectStoreNames.contains('sync_queue')) {
          const syncStore = db.createObjectStore('sync_queue', { keyPath: 'id' })
          syncStore.createIndex('timestamp', 'timestamp', { unique: false })
          syncStore.createIndex('priority', 'priority', { unique: false })
        }

        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta', { keyPath: 'key' })
        }

        if (!db.objectStoreNames.contains('hafalan')) {
          const hafalanStore = db.createObjectStore('hafalan', { keyPath: 'id' })
          hafalanStore.createIndex('studentId', 'studentId', { unique: false })
          hafalanStore.createIndex('surah', 'surah', { unique: false })
          hafalanStore.createIndex('date', 'date', { unique: false })
        }

        if (!db.objectStoreNames.contains('students')) {
          const studentsStore = db.createObjectStore('students', { keyPath: 'id' })
          studentsStore.createIndex('class', 'class', { unique: false })
          studentsStore.createIndex('status', 'status', { unique: false })
        }

        if (!db.objectStoreNames.contains('teachers')) {
          const teachersStore = db.createObjectStore('teachers', { keyPath: 'id' })
          teachersStore.createIndex('subject', 'subject', { unique: false })
          teachersStore.createIndex('status', 'status', { unique: false })
        }

        if (!db.objectStoreNames.contains('notifications')) {
          const notificationsStore = db.createObjectStore('notifications', { keyPath: 'id' })
          notificationsStore.createIndex('read', 'read', { unique: false })
          notificationsStore.createIndex('timestamp', 'timestamp', { unique: false })
          notificationsStore.createIndex('type', 'type', { unique: false })
        }

        if (!db.objectStoreNames.contains('academic')) {
          const academicStore = db.createObjectStore('academic', { keyPath: 'id' })
          academicStore.createIndex('studentId', 'studentId', { unique: false })
          academicStore.createIndex('subject', 'subject', { unique: false })
          academicStore.createIndex('semester', 'semester', { unique: false })
        }
      }
    })
  }

  // Service Worker communication
  private initServiceWorkerListener(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        const { type, data } = event.data
        
        switch (type) {
          case 'SYNC_COMPLETE':
            this.handleSyncComplete(data)
            break
          case 'CACHE_UPDATED':
            this.emit('cacheUpdated', data)
            break
          case 'OFFLINE_STATUS':
            this.emit('offlineStatusChanged', data)
            break
        }
      })
    }
  }

  // Event emitter methods
  on(event: string, callback: Function): void {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = []
    }
    this.eventListeners[event].push(callback)
  }

  off(event: string, callback: Function): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback)
    }
  }

  private emit(event: string, data?: any): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => callback(data))
    }
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.initDB()
    }
    return this.db!
  }

  // Generic methods for CRUD operations
  async save<T>(storeName: string, data: T): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)
    await store.put(data)
  }

  async get<T>(storeName: string, id: string): Promise<T | undefined> {
    const db = await this.ensureDB()
    const transaction = db.transaction([storeName], 'readonly')
    const store = transaction.objectStore(storeName)
    return new Promise((resolve, reject) => {
      const request = store.get(id)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.ensureDB()
    const transaction = db.transaction([storeName], 'readonly')
    const store = transaction.objectStore(storeName)
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async delete(storeName: string, id: string): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)
    await store.delete(id)
  }

  async clear(storeName: string): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)
    await store.clear()
  }

  // Enhanced sync queue methods
  async addToSyncQueue(action: {
    id: string
    type: 'create' | 'update' | 'delete'
    entity: string
    data: any
    timestamp: number
    priority?: 'high' | 'medium' | 'low'
    retryCount?: number
    maxRetries?: number
  }): Promise<void> {
    const syncAction: SyncQueueItem = {
      ...action,
      priority: action.priority || 'medium',
      retryCount: action.retryCount || 0,
      maxRetries: action.maxRetries || 3
    }
    await this.save('sync_queue', syncAction)
    
    // Emit sync queue updated event
    this.emit('syncQueueUpdated', { action: 'added', item: syncAction })
  }

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    const queue = await this.getAll<SyncQueueItem>('sync_queue')
    // Sort by priority and timestamp
    return queue.sort((a, b) => {
      const priorityOrder: { [key: string]: number } = { high: 0, medium: 1, low: 2 }
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff
      return a.timestamp - b.timestamp
    })
  }

  async clearSyncQueue(): Promise<void> {
    await this.clear('sync_queue')
    this.emit('syncQueueUpdated', { action: 'cleared' })
  }

  async removeSyncQueueItem(id: string): Promise<void> {
    await this.delete('sync_queue', id)
    this.emit('syncQueueUpdated', { action: 'removed', itemId: id })
  }

  async updateSyncQueueItem(id: string, updates: Partial<SyncQueueItem>): Promise<void> {
    const item = await this.get<SyncQueueItem>('sync_queue', id)
    if (item) {
      const updatedItem: SyncQueueItem = { ...item, ...updates }
      await this.save('sync_queue', updatedItem)
      this.emit('syncQueueUpdated', { action: 'updated', item: updatedItem })
    }
  }

  // Handle sync completion from service worker
  private async handleSyncComplete(data: { processed: number, failed: number }): Promise<void> {
    this.syncInProgress = false
    this.emit('syncComplete', data)
  }

  // Check if sync is needed
  async needsSync(): Promise<boolean> {
    const queue = await this.getSyncQueue()
    return queue.length > 0
  }

  // Start manual sync
  async startSync(): Promise<void> {
    if (this.syncInProgress) {
      return
    }

    this.syncInProgress = true
    this.emit('syncStarted')

    try {
      // Request background sync from service worker
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready
        if (registration.sync) {
          await registration.sync.register('offline-requests')
        }
      }
    } catch (error) {
      console.error('Failed to start sync:', error)
      this.syncInProgress = false
      this.emit('syncFailed', error)
    }
  }

  // Metadata methods
  async setLastSyncTime(timestamp: number): Promise<void> {
    await this.save('meta', { key: 'lastSync', value: timestamp })
  }

  async getLastSyncTime(): Promise<number> {
    const meta = await this.get('meta', 'lastSync')
    return meta ? (meta as any).value : 0
  }

  // Data-specific methods
  async saveTransactions(transactions: any[]): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction(['transactions'], 'readwrite')
    const store = transaction.objectStore('transactions')
    
    for (const t of transactions) {
      await store.put(t)
    }
  }

  async saveActivities(activities: any[]): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction(['activities'], 'readwrite')
    const store = transaction.objectStore('activities')
    
    for (const a of activities) {
      await store.put(a)
    }
  }

  async saveCourses(courses: any[]): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction(['courses'], 'readwrite')
    const store = transaction.objectStore('courses')
    
    for (const c of courses) {
      await store.put(c)
    }
  }

  async saveVideos(videos: any[]): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction(['videos'], 'readwrite')
    const store = transaction.objectStore('videos')
    
    for (const v of videos) {
      await store.put(v)
    }
  }

  // Get cached data
  async getCachedTransactions(): Promise<any[]> {
    return await this.getAll('transactions')
  }

  async getCachedActivities(): Promise<any[]> {
    return await this.getAll('activities')
  }

  async getCachedCourses(): Promise<any[]> {
    return await this.getAll('courses')
  }

  async getCachedVideos(): Promise<any[]> {
    return await this.getAll('videos')
  }

  // New enhanced data-specific methods
  async saveHafalan(hafalanData: any[]): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction(['hafalan'], 'readwrite')
    const store = transaction.objectStore('hafalan')
    
    for (const h of hafalanData) {
      await store.put(h)
    }
    this.emit('dataUpdated', { type: 'hafalan', count: hafalanData.length })
  }

  async getCachedHafalan(): Promise<any[]> {
    return await this.getAll('hafalan')
  }

  async getHafalanByStudent(studentId: string): Promise<any[]> {
    const db = await this.ensureDB()
    const transaction = db.transaction(['hafalan'], 'readonly')
    const store = transaction.objectStore('hafalan')
    const index = store.index('studentId')
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(studentId)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async saveStudents(students: any[]): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction(['students'], 'readwrite')
    const store = transaction.objectStore('students')
    
    for (const s of students) {
      await store.put(s)
    }
    this.emit('dataUpdated', { type: 'students', count: students.length })
  }

  async getCachedStudents(): Promise<any[]> {
    return await this.getAll('students')
  }

  async saveTeachers(teachers: any[]): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction(['teachers'], 'readwrite')
    const store = transaction.objectStore('teachers')
    
    for (const t of teachers) {
      await store.put(t)
    }
    this.emit('dataUpdated', { type: 'teachers', count: teachers.length })
  }

  async getCachedTeachers(): Promise<any[]> {
    return await this.getAll('teachers')
  }

  async saveNotifications(notifications: any[]): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction(['notifications'], 'readwrite')
    const store = transaction.objectStore('notifications')
    
    for (const n of notifications) {
      await store.put(n)
    }
    this.emit('dataUpdated', { type: 'notifications', count: notifications.length })
  }

  async getCachedNotifications(): Promise<any[]> {
    return await this.getAll('notifications')
  }

  async getUnreadNotifications(): Promise<any[]> {
    const db = await this.ensureDB()
    const transaction = db.transaction(['notifications'], 'readonly')
    const store = transaction.objectStore('notifications')
    const index = store.index('read')
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(IDBKeyRange.only(false))
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async saveAcademicData(academicData: any[]): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction(['academic'], 'readwrite')
    const store = transaction.objectStore('academic')
    
    for (const a of academicData) {
      await store.put(a)
    }
    this.emit('dataUpdated', { type: 'academic', count: academicData.length })
  }

  async getCachedAcademicData(): Promise<any[]> {
    return await this.getAll('academic')
  }

  async getAcademicDataByStudent(studentId: string): Promise<any[]> {
    const db = await this.ensureDB()
    const transaction = db.transaction(['academic'], 'readonly')
    const store = transaction.objectStore('academic')
    const index = store.index('studentId')
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(studentId)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Data freshness and cache management
  async isDataFresh(dataType: string, maxAge: number = 300000): Promise<boolean> { // 5 minutes default
    const meta = await this.get('meta', `${dataType}_lastUpdated`)
    if (!meta) return false
    
    const lastUpdated = (meta as any).value
    return (Date.now() - lastUpdated) < maxAge
  }

  async markDataFresh(dataType: string): Promise<void> {
    await this.save('meta', { key: `${dataType}_lastUpdated`, value: Date.now() })
  }

  // Cache size management
  async getCacheSize(): Promise<{ [storeName: string]: number }> {
    const stores = ['transactions', 'activities', 'courses', 'videos', 'hafalan', 'students', 'teachers', 'notifications', 'academic']
    const sizes: { [key: string]: number } = {}
    
    for (const storeName of stores) {
      const data = await this.getAll(storeName)
      sizes[storeName] = data.length
    }
    
    return sizes
  }

  async clearOldData(maxAge: number = 2592000000): Promise<void> { // 30 days default
    const cutoffTime = Date.now() - maxAge
    const stores = ['transactions', 'activities', 'courses', 'videos']
    
    for (const storeName of stores) {
      const db = await this.ensureDB()
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const dateIndex = store.index('date')
      
      const range = IDBKeyRange.upperBound(cutoffTime)
      const request = dateIndex.openCursor(range)
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          cursor.delete()
          cursor.continue()
        }
      }
    }
    
    this.emit('cacheCleanup', { maxAge, cutoffTime })
  }

  // Connection status
  isOnline(): boolean {
    return navigator.onLine
  }

  // Initialize online/offline event listeners
  initNetworkListeners(): void {
    window.addEventListener('online', () => {
      this.emit('online')
      this.startSync() // Auto-sync when back online
    })

    window.addEventListener('offline', () => {
      this.emit('offline')
    })
  }
}