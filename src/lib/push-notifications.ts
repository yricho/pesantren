// Push notification service for PWA
import { useState, useEffect } from 'react'
interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export class PushNotificationService {
  private vapidPublicKey: string = ''
  private subscription: PushSubscription | null = null
  private registration: ServiceWorkerRegistration | null = null

  constructor() {
    // Initialize with your VAPID public key
    this.vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
  }

  // Initialize push notifications
  async initialize(): Promise<void> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      throw new Error('Push notifications are not supported in this browser')
    }

    try {
      this.registration = await navigator.serviceWorker.ready
      console.log('Push notifications service initialized')
    } catch (error) {
      console.error('Failed to initialize push notifications:', error)
      throw error
    }
  }

  // Check if notifications are supported
  isSupported(): boolean {
    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    )
  }

  // Check notification permission status
  getPermissionStatus(): NotificationPermission {
    if (!('Notification' in window)) {
      return 'denied'
    }
    return Notification.permission
  }

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error('Notifications are not supported')
    }

    let permission = this.getPermissionStatus()
    
    if (permission === 'default') {
      permission = await Notification.requestPermission()
    }

    return permission
  }

  // Subscribe to push notifications
  async subscribe(): Promise<PushSubscription | null> {
    if (!this.registration) {
      await this.initialize()
    }

    if (!this.registration) {
      throw new Error('Service worker not registered')
    }

    try {
      // Check if already subscribed
      let subscription = await this.registration.pushManager.getSubscription()
      
      if (subscription) {
        this.subscription = this.serializeSubscription(subscription)
        return this.subscription
      }

      // Request permission first
      const permission = await this.requestPermission()
      if (permission !== 'granted') {
        throw new Error('Notification permission denied')
      }

      // Create new subscription
      subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlB64ToUint8Array(this.vapidPublicKey) as BufferSource
      })

      this.subscription = this.serializeSubscription(subscription)

      // Send subscription to server
      await this.sendSubscriptionToServer(this.subscription)

      console.log('Push notification subscription created')
      return this.subscription

    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      throw error
    }
  }

  // Unsubscribe from push notifications
  async unsubscribe(): Promise<void> {
    if (!this.registration) {
      return
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription()
      
      if (subscription) {
        await subscription.unsubscribe()
        
        // Remove subscription from server
        if (this.subscription) {
          await this.removeSubscriptionFromServer(this.subscription)
        }
        
        this.subscription = null
        console.log('Unsubscribed from push notifications')
      }
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error)
      throw error
    }
  }

  // Check if user is subscribed
  async isSubscribed(): Promise<boolean> {
    if (!this.registration) {
      return false
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription()
      return subscription !== null
    } catch (error) {
      console.error('Failed to check subscription status:', error)
      return false
    }
  }

  // Get current subscription
  async getSubscription(): Promise<PushSubscription | null> {
    if (!this.registration) {
      await this.initialize()
    }

    if (!this.registration) {
      return null
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription()
      if (subscription) {
        this.subscription = this.serializeSubscription(subscription)
      }
      return this.subscription
    } catch (error) {
      console.error('Failed to get subscription:', error)
      return null
    }
  }

  // Send subscription to server
  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscription,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send subscription to server')
      }

      console.log('Subscription sent to server successfully')
    } catch (error) {
      console.error('Failed to send subscription to server:', error)
      // Don't throw here, subscription is still valid locally
    }
  }

  // Remove subscription from server
  private async removeSubscriptionFromServer(subscription: PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subscription })
      })

      if (!response.ok) {
        throw new Error('Failed to remove subscription from server')
      }

      console.log('Subscription removed from server successfully')
    } catch (error) {
      console.error('Failed to remove subscription from server:', error)
    }
  }

  // Helper to convert VAPID key
  private urlB64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // Serialize browser subscription to our format
  private serializeSubscription(subscription: globalThis.PushSubscription): PushSubscription {
    const keys = subscription.getKey('p256dh')
    const auth = subscription.getKey('auth')

    return {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: keys ? btoa(String.fromCharCode(...new Uint8Array(keys))) : '',
        auth: auth ? btoa(String.fromCharCode(...new Uint8Array(auth))) : ''
      }
    }
  }

  // Test notification
  async testNotification(title: string = 'Test Notification', body: string = 'This is a test notification from Pondok Imam Syafi\'i'): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('Notifications are not supported')
    }

    const permission = await this.requestPermission()
    if (permission !== 'granted') {
      throw new Error('Notification permission not granted')
    }

    // Create local notification for testing
    const notification = new Notification(title, {
      body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: 'test-notification',
      requireInteraction: false,
      // vibrate: [200, 100, 200] // Not supported in all browsers
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }

    setTimeout(() => {
      notification.close()
    }, 5000)
  }
}

// Notification types and templates
export interface NotificationTemplate {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  data?: any
  actions?: Array<{action: string; title: string; icon?: string}>
  requireInteraction?: boolean
}

// Define NotificationAction type
interface NotificationAction {
  action: string
  title: string
  icon?: string
}

export const NotificationTemplates = {
  // Academic notifications
  newGrade: (studentName: string, subject: string, grade: string): NotificationTemplate => ({
    title: 'Nilai Baru Tersedia',
    body: `${studentName} mendapat nilai ${grade} untuk mata pelajaran ${subject}`,
    icon: '/icon-192x192.png',
    tag: 'new-grade',
    data: { type: 'grade', studentName, subject, grade },
    actions: [
      { action: 'view', title: 'Lihat Detail', icon: '/icon-192x192.png' }
    ]
  }),

  // Hafalan notifications
  hafalanApproved: (studentName: string, surah: string): NotificationTemplate => ({
    title: 'Hafalan Disetujui',
    body: `Hafalan ${surah} ${studentName} telah disetujui`,
    icon: '/icon-192x192.png',
    tag: 'hafalan-approved',
    data: { type: 'hafalan', studentName, surah },
    actions: [
      { action: 'view', title: 'Lihat Progress', icon: '/icon-192x192.png' }
    ]
  }),

  // Payment notifications
  paymentReminder: (studentName: string, amount: number, dueDate: string): NotificationTemplate => ({
    title: 'Pengingat Pembayaran',
    body: `Pembayaran ${studentName} sebesar Rp ${amount.toLocaleString()} jatuh tempo ${dueDate}`,
    icon: '/icon-192x192.png',
    tag: 'payment-reminder',
    data: { type: 'payment', studentName, amount, dueDate },
    actions: [
      { action: 'pay', title: 'Bayar Sekarang', icon: '/icon-192x192.png' },
      { action: 'view', title: 'Lihat Detail', icon: '/icon-192x192.png' }
    ],
    requireInteraction: true
  }),

  // General announcements
  announcement: (title: string, message: string): NotificationTemplate => ({
    title,
    body: message,
    icon: '/icon-192x192.png',
    tag: 'announcement',
    data: { type: 'announcement', title, message },
    actions: [
      { action: 'view', title: 'Lihat', icon: '/icon-192x192.png' }
    ]
  }),

  // Activity notifications
  newActivity: (activityName: string, date: string): NotificationTemplate => ({
    title: 'Kegiatan Baru',
    body: `Kegiatan "${activityName}" dijadwalkan pada ${date}`,
    icon: '/icon-192x192.png',
    tag: 'new-activity',
    data: { type: 'activity', activityName, date },
    actions: [
      { action: 'view', title: 'Lihat Detail', icon: '/icon-192x192.png' }
    ]
  }),

  // Attendance notifications
  attendanceAlert: (studentName: string, status: string): NotificationTemplate => ({
    title: 'Pemberitahuan Kehadiran',
    body: `${studentName} ${status === 'absent' ? 'tidak hadir' : 'hadir'} hari ini`,
    icon: '/icon-192x192.png',
    tag: 'attendance-alert',
    data: { type: 'attendance', studentName, status }
  })
}

// React hook for using push notifications
export function usePushNotifications() {
  const [service] = useState(() => new PushNotificationService())
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkSupport = () => {
      const supported = service.isSupported()
      setIsSupported(supported)
      
      if (supported) {
        setPermission(service.getPermissionStatus())
        service.isSubscribed().then(setIsSubscribed)
      }
    }

    checkSupport()
  }, [service])

  const requestPermission = async () => {
    setIsLoading(true)
    try {
      const newPermission = await service.requestPermission()
      setPermission(newPermission)
      return newPermission
    } catch (error) {
      console.error('Failed to request permission:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const subscribe = async () => {
    setIsLoading(true)
    try {
      await service.subscribe()
      setIsSubscribed(true)
    } catch (error) {
      console.error('Failed to subscribe:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const unsubscribe = async () => {
    setIsLoading(true)
    try {
      await service.unsubscribe()
      setIsSubscribed(false)
    } catch (error) {
      console.error('Failed to unsubscribe:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const testNotification = async (title?: string, body?: string) => {
    try {
      await service.testNotification(title, body)
    } catch (error) {
      console.error('Failed to send test notification:', error)
      throw error
    }
  }

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    requestPermission,
    subscribe,
    unsubscribe,
    testNotification
  }
}

// Export singleton instance
export const pushNotificationService = new PushNotificationService()