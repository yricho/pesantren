/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'

// Mock service worker registration
const mockServiceWorker = {
  register: jest.fn(),
  getRegistration: jest.fn(),
  ready: Promise.resolve({
    active: {
      postMessage: jest.fn(),
    },
    sync: {
      register: jest.fn(),
    },
  }),
}

// Mock navigator.serviceWorker
Object.defineProperty(navigator, 'serviceWorker', {
  value: mockServiceWorker,
  writable: true,
})

// Mock online/offline status
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true,
})

describe('Offline Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset online status
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    })
    // Clear localStorage
    localStorage.clear()
  })

  describe('Service Worker Registration', () => {
    it('should register service worker in production', async () => {
      process.env.NODE_ENV = 'production'
      mockServiceWorker.register.mockResolvedValue({})

      // Import the offline module (would need to create this)
      const { registerServiceWorker } = await import('@/lib/offline')
      
      await registerServiceWorker()

      expect(mockServiceWorker.register).toHaveBeenCalledWith('/sw.js')
    })

    it('should not register service worker in development', async () => {
      process.env.NODE_ENV = 'development'

      const { registerServiceWorker } = await import('@/lib/offline')
      
      await registerServiceWorker()

      expect(mockServiceWorker.register).not.toHaveBeenCalled()
    })

    it('should handle service worker registration errors', async () => {
      process.env.NODE_ENV = 'production'
      const error = new Error('Registration failed')
      mockServiceWorker.register.mockRejectedValue(error)

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      const { registerServiceWorker } = await import('@/lib/offline')
      
      await registerServiceWorker()

      expect(consoleSpy).toHaveBeenCalledWith(
        'Service Worker registration failed:',
        error
      )
      
      consoleSpy.mockRestore()
    })
  })

  describe('Offline Data Storage', () => {
    it('should store data for offline use', () => {
      const testData = {
        transactions: [
          { id: '1', amount: 1000, type: 'INCOME', description: 'Test' },
        ],
        lastSync: new Date().toISOString(),
      }

      // Import offline storage utilities
      const { storeOfflineData } = require('@/lib/offline-storage')
      
      storeOfflineData('transactions', testData)

      const stored = localStorage.getItem('offline_transactions')
      expect(JSON.parse(stored!)).toEqual(testData)
    })

    it('should retrieve offline data', () => {
      const testData = {
        transactions: [
          { id: '1', amount: 1000, type: 'INCOME', description: 'Test' },
        ],
        lastSync: new Date().toISOString(),
      }

      localStorage.setItem('offline_transactions', JSON.stringify(testData))

      const { getOfflineData } = require('@/lib/offline-storage')
      const retrieved = getOfflineData('transactions')

      expect(retrieved).toEqual(testData)
    })

    it('should return null for non-existent offline data', () => {
      const { getOfflineData } = require('@/lib/offline-storage')
      const retrieved = getOfflineData('nonexistent')

      expect(retrieved).toBeNull()
    })

    it('should clear offline data', () => {
      const testData = { test: 'data' }
      localStorage.setItem('offline_transactions', JSON.stringify(testData))

      const { clearOfflineData } = require('@/lib/offline-storage')
      clearOfflineData('transactions')

      expect(localStorage.getItem('offline_transactions')).toBeNull()
    })

    it('should handle storage quota exceeded', () => {
      const originalSetItem = localStorage.setItem
      localStorage.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError')
      })

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      const { storeOfflineData } = require('@/lib/offline-storage')
      
      storeOfflineData('transactions', { large: 'data'.repeat(10000) })

      expect(consoleSpy).toHaveBeenCalledWith(
        'Storage quota exceeded, clearing old data...'
      )

      localStorage.setItem = originalSetItem
      consoleSpy.mockRestore()
    })
  })

  describe('Network Status Detection', () => {
    it('should detect online status', () => {
      const { isOnline } = require('@/lib/network-status')
      expect(isOnline()).toBe(true)
    })

    it('should detect offline status', () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false,
      })

      const { isOnline } = require('@/lib/network-status')
      expect(isOnline()).toBe(false)
    })

    it('should handle online event', () => {
      const mockCallback = jest.fn()
      const { addNetworkListener } = require('@/lib/network-status')
      
      addNetworkListener(mockCallback)

      // Simulate online event
      window.dispatchEvent(new Event('online'))

      expect(mockCallback).toHaveBeenCalledWith(true)
    })

    it('should handle offline event', () => {
      const mockCallback = jest.fn()
      const { addNetworkListener } = require('@/lib/network-status')
      
      addNetworkListener(mockCallback)

      // Simulate offline event
      window.dispatchEvent(new Event('offline'))

      expect(mockCallback).toHaveBeenCalledWith(false)
    })

    it('should remove network listeners', () => {
      const mockCallback = jest.fn()
      const { addNetworkListener, removeNetworkListener } = require('@/lib/network-status')
      
      addNetworkListener(mockCallback)
      removeNetworkListener(mockCallback)

      // Simulate events after removal
      window.dispatchEvent(new Event('online'))
      window.dispatchEvent(new Event('offline'))

      expect(mockCallback).not.toHaveBeenCalled()
    })
  })

  describe('Offline Queue Management', () => {
    it('should queue actions when offline', () => {
      Object.defineProperty(navigator, 'onLine', { value: false })

      const { queueOfflineAction } = require('@/lib/offline-queue')
      
      const action = {
        type: 'CREATE_TRANSACTION',
        data: { amount: 1000, description: 'Test transaction' },
        timestamp: Date.now(),
      }

      queueOfflineAction(action)

      const queue = JSON.parse(localStorage.getItem('offline_queue') || '[]')
      expect(queue).toContain(action)
    })

    it('should process queue when back online', async () => {
      // Setup offline queue
      const actions = [
        {
          type: 'CREATE_TRANSACTION',
          data: { amount: 1000, description: 'Test 1' },
          timestamp: Date.now(),
        },
        {
          type: 'UPDATE_ACTIVITY',
          data: { id: '1', status: 'completed' },
          timestamp: Date.now(),
        },
      ]
      localStorage.setItem('offline_queue', JSON.stringify(actions))

      // Mock API calls
      global.fetch = jest.fn()
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) })

      const { processOfflineQueue } = require('@/lib/offline-queue')
      
      await processOfflineQueue()

      expect(fetch).toHaveBeenCalledTimes(2)
      expect(localStorage.getItem('offline_queue')).toBe('[]')
    })

    it('should handle failed queue processing gracefully', async () => {
      const actions = [
        {
          type: 'CREATE_TRANSACTION',
          data: { amount: 1000, description: 'Test' },
          timestamp: Date.now(),
        },
      ]
      localStorage.setItem('offline_queue', JSON.stringify(actions))

      // Mock failed API call
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      const { processOfflineQueue } = require('@/lib/offline-queue')
      
      await processOfflineQueue()

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to process offline action:',
        expect.any(Error)
      )

      // Action should remain in queue for retry
      const remainingQueue = JSON.parse(localStorage.getItem('offline_queue') || '[]')
      expect(remainingQueue).toHaveLength(1)

      consoleSpy.mockRestore()
    })

    it('should retry failed actions with exponential backoff', async () => {
      const action = {
        type: 'CREATE_TRANSACTION',
        data: { amount: 1000, description: 'Test' },
        timestamp: Date.now(),
        retryCount: 2,
        nextRetry: Date.now() - 1000, // Past retry time
      }
      localStorage.setItem('offline_queue', JSON.stringify([action]))

      global.fetch = jest.fn().mockRejectedValue(new Error('Still failing'))

      const { processOfflineQueue } = require('@/lib/offline-queue')
      
      await processOfflineQueue()

      const updatedQueue = JSON.parse(localStorage.getItem('offline_queue') || '[]')
      expect(updatedQueue[0].retryCount).toBe(3)
      expect(updatedQueue[0].nextRetry).toBeGreaterThan(Date.now())
    })

    it('should remove actions after max retries', async () => {
      const action = {
        type: 'CREATE_TRANSACTION',
        data: { amount: 1000, description: 'Test' },
        timestamp: Date.now(),
        retryCount: 5, // Max retries exceeded
        nextRetry: Date.now() - 1000,
      }
      localStorage.setItem('offline_queue', JSON.stringify([action]))

      global.fetch = jest.fn().mockRejectedValue(new Error('Still failing'))

      const { processOfflineQueue } = require('@/lib/offline-queue')
      
      await processOfflineQueue()

      const remainingQueue = JSON.parse(localStorage.getItem('offline_queue') || '[]')
      expect(remainingQueue).toHaveLength(0)
    })
  })

  describe('Data Synchronization', () => {
    it('should sync local changes with server', async () => {
      // Setup local changes
      const localChanges = [
        { type: 'transaction', action: 'create', data: { amount: 1000 } },
        { type: 'activity', action: 'update', data: { id: '1', status: 'completed' } },
      ]
      localStorage.setItem('pending_sync', JSON.stringify(localChanges))

      // Mock successful sync
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ synced: true }),
      })

      const { syncData } = require('@/lib/data-sync')
      
      const result = await syncData()

      expect(result.success).toBe(true)
      expect(localStorage.getItem('pending_sync')).toBe('[]')
    })

    it('should handle sync conflicts', async () => {
      const localChanges = [
        { type: 'transaction', action: 'update', data: { id: '1', amount: 1500 } },
      ]
      localStorage.setItem('pending_sync', JSON.stringify(localChanges))

      // Mock conflict response
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 409,
        json: () => Promise.resolve({ 
          error: 'Conflict',
          conflicts: [{ id: '1', serverData: { amount: 2000 } }]
        }),
      })

      const { syncData } = require('@/lib/data-sync')
      
      const result = await syncData()

      expect(result.success).toBe(false)
      expect(result.conflicts).toBeDefined()
      expect(result.conflicts).toHaveLength(1)
    })

    it('should update last sync timestamp', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ synced: true }),
      })

      const { syncData } = require('@/lib/data-sync')
      
      await syncData()

      const lastSync = localStorage.getItem('last_sync_timestamp')
      expect(lastSync).toBeTruthy()
      expect(new Date(lastSync!).getTime()).toBeCloseTo(Date.now(), -3)
    })
  })
})