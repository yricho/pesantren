// Offline storage utility using IndexedDB
export class OfflineStorage {
  private dbName = 'PondokImamSyafiiDB'
  private version = 1
  private db: IDBDatabase | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.initDB()
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
          db.createObjectStore('sync_queue', { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta', { keyPath: 'key' })
        }
      }
    })
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

  // Sync queue methods
  async addToSyncQueue(action: {
    id: string
    type: 'create' | 'update' | 'delete'
    entity: string
    data: any
    timestamp: number
  }): Promise<void> {
    await this.save('sync_queue', action)
  }

  async getSyncQueue(): Promise<any[]> {
    return await this.getAll('sync_queue')
  }

  async clearSyncQueue(): Promise<void> {
    await this.clear('sync_queue')
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
}