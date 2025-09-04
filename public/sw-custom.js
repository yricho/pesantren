// Custom Service Worker for Pondok Imam Syafi'i PWA
const CACHE_NAME = 'pondok-imam-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';
const API_CACHE = 'api-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Define files to cache for offline use
const STATIC_FILES = [
  '/',
  '/offline.html',
  '/dashboard',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/_next/static/css/',
  '/_next/static/chunks/'
];

// Background sync queue name
const SYNC_QUEUE = 'offline-requests';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache static files
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES);
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return !cacheName.includes('v1.0.0');
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      // Claim all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle different types of requests with appropriate strategies
  if (request.method === 'GET') {
    // API requests - Network First with background sync fallback
    if (url.pathname.startsWith('/api/')) {
      event.respondWith(handleApiRequest(request));
    }
    // Static assets - Cache First
    else if (isStaticAsset(url)) {
      event.respondWith(handleStaticAsset(request));
    }
    // Navigation requests - Network First with offline fallback
    else if (request.mode === 'navigate') {
      event.respondWith(handleNavigation(request));
    }
    // Other resources - Stale While Revalidate
    else {
      event.respondWith(handleOtherResources(request));
    }
  }
  // Non-GET requests - handle offline with background sync
  else {
    event.respondWith(handleMutationRequest(request));
  }
});

// Background sync for offline requests
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === SYNC_QUEUE) {
    event.waitUntil(processOfflineQueue());
  }
});

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: 'Ada notifikasi baru dari Pondok Imam Syafi\'i',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: event.data ? event.data.json() : {},
    actions: [
      {
        action: 'view',
        title: 'Lihat',
        icon: '/icon-192x192.png'
      },
      {
        action: 'dismiss',
        title: 'Tutup'
      }
    ],
    requireInteraction: true,
    tag: 'pondok-notification'
  };
  
  if (event.data) {
    const payload = event.data.json();
    options.title = payload.title || 'Pondok Imam Syafi\'i';
    options.body = payload.body || options.body;
    options.data = payload.data || {};
  }
  
  event.waitUntil(
    self.registration.showNotification(
      options.title || 'Pondok Imam Syafi\'i',
      options
    )
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  if (action === 'dismiss') {
    return;
  }
  
  // Default action or 'view' action
  let url = '/dashboard';
  if (data && data.url) {
    url = data.url;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window if app is not open
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Helper functions

async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request.clone());
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] API request failed, checking cache:', request.url);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If it's a mutation request and we're offline, queue it
    if (request.method !== 'GET') {
      await queueOfflineRequest(request);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Request queued for when online',
          queued: true
        }),
        { 
          status: 202,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Return error for GET requests
    return new Response(
      JSON.stringify({ error: 'Network unavailable and no cache found' }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

async function handleStaticAsset(request) {
  // Try cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Fallback to network
    const networkResponse = await fetch(request);
    
    // Cache the response
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Failed to fetch static asset:', request.url);
    return new Response('Asset not available offline', { status: 503 });
  }
}

async function handleNavigation(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful navigation responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Navigation request failed, checking cache:', request.url);
    
    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to offline page
    return caches.match(OFFLINE_URL);
  }
}

async function handleOtherResources(request) {
  // Try cache first
  const cachedResponse = await caches.match(request);
  
  // Return cache immediately if available
  if (cachedResponse) {
    // Update cache in background
    fetch(request).then((networkResponse) => {
      if (networkResponse.ok) {
        const cache = caches.open(DYNAMIC_CACHE);
        cache.then(c => c.put(request, networkResponse));
      }
    }).catch(() => {
      // Ignore network errors for background updates
    });
    
    return cachedResponse;
  }
  
  try {
    // Fallback to network
    const networkResponse = await fetch(request);
    
    // Cache the response
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    return new Response('Resource not available offline', { status: 503 });
  }
}

async function handleMutationRequest(request) {
  try {
    // Try network first for mutations
    return await fetch(request);
  } catch (error) {
    // Queue request for background sync
    await queueOfflineRequest(request);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Request queued for sync when online',
        queued: true
      }),
      { 
        status: 202,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

function isStaticAsset(url) {
  return (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/static/') ||
    url.pathname.includes('.png') ||
    url.pathname.includes('.jpg') ||
    url.pathname.includes('.jpeg') ||
    url.pathname.includes('.svg') ||
    url.pathname.includes('.ico') ||
    url.pathname.includes('.css') ||
    url.pathname.includes('.js') ||
    url.pathname === '/manifest.json'
  );
}

async function queueOfflineRequest(request) {
  try {
    // Convert request to serializable format
    const requestData = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: request.method !== 'GET' ? await request.text() : null,
      timestamp: Date.now()
    };
    
    // Get existing queue
    const db = await openDB();
    const queue = await getOfflineQueue(db) || [];
    
    // Add new request to queue
    queue.push(requestData);
    
    // Store updated queue
    await setOfflineQueue(db, queue);
    
    // Register for background sync
    if ('serviceWorker' in self && 'sync' in self.registration) {
      await self.registration.sync.register(SYNC_QUEUE);
    }
    
    console.log('[SW] Request queued for offline sync:', request.url);
  } catch (error) {
    console.error('[SW] Failed to queue offline request:', error);
  }
}

async function processOfflineQueue() {
  try {
    const db = await openDB();
    const queue = await getOfflineQueue(db) || [];
    
    if (queue.length === 0) {
      console.log('[SW] No offline requests to process');
      return;
    }
    
    console.log('[SW] Processing', queue.length, 'offline requests');
    
    const processedRequests = [];
    const failedRequests = [];
    
    for (const requestData of queue) {
      try {
        // Reconstruct request
        const request = new Request(requestData.url, {
          method: requestData.method,
          headers: requestData.headers,
          body: requestData.body
        });
        
        // Attempt to send request
        const response = await fetch(request);
        
        if (response.ok) {
          processedRequests.push(requestData);
          console.log('[SW] Successfully processed offline request:', requestData.url);
        } else {
          // Keep failed requests for retry
          failedRequests.push(requestData);
        }
      } catch (error) {
        // Keep failed requests for retry
        failedRequests.push(requestData);
        console.log('[SW] Failed to process offline request:', requestData.url, error);
      }
    }
    
    // Update queue with failed requests only
    await setOfflineQueue(db, failedRequests);
    
    // Notify clients about sync completion
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        processed: processedRequests.length,
        failed: failedRequests.length
      });
    });
    
  } catch (error) {
    console.error('[SW] Failed to process offline queue:', error);
  }
}

// IndexedDB helpers for offline queue
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PondokImamSW', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('offlineQueue')) {
        db.createObjectStore('offlineQueue', { keyPath: 'id' });
      }
    };
  });
}

async function getOfflineQueue(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['offlineQueue'], 'readonly');
    const store = transaction.objectStore('offlineQueue');
    const request = store.get('queue');
    
    request.onsuccess = () => {
      resolve(request.result ? request.result.data : []);
    };
    request.onerror = () => reject(request.error);
  });
}

async function setOfflineQueue(db, queue) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['offlineQueue'], 'readwrite');
    const store = transaction.objectStore('offlineQueue');
    const request = store.put({ id: 'queue', data: queue });
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

console.log('[SW] Custom service worker loaded');