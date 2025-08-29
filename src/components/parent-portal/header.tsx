'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Bell, User, Settings, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export default function ParentPortalHeader() {
  const { data: session } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/parent/notifications?limit=10&isRead=false');
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications);
          setUnreadCount(data.stats.unread);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchNotifications();
    }
  }, [session]);

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/parent/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'markAsRead',
          notificationId,
        }),
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'GRADE_UPDATE':
        return '📊';
      case 'ATTENDANCE_ALERT':
        return '⚠️';
      case 'PAYMENT_DUE':
        return '💳';
      case 'ANNOUNCEMENT':
        return '📢';
      case 'MESSAGE':
        return '💬';
      default:
        return '🔔';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Baru saja';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-16">
      <div className="flex items-center justify-between px-6 h-full">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PI</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Portal Orang Tua</h1>
              <p className="text-xs text-gray-600">Pondok Imam Syafi'i</p>
            </div>
          </div>
        </div>

        {/* Right Side - Notifications and Profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-900">Notifikasi</h3>
                      <Link 
                        href="/parent-portal/notifications"
                        className="text-sm text-blue-600 hover:text-blue-800"
                        onClick={() => setShowNotifications(false)}
                      >
                        Lihat Semua
                      </Link>
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {isLoading ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        Tidak ada notifikasi baru
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            !notification.isRead ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => {
                            markAsRead(notification.id);
                            if (notification.actionUrl) {
                              window.location.href = notification.actionUrl;
                            }
                            setShowNotifications(false);
                          }}
                        >
                          <div className="flex space-x-3">
                            <span className="text-lg">
                              {getNotificationIcon(notification.type)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 truncate">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {getTimeAgo(notification.createdAt)}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium hidden md:block">
                {session?.user?.name || 'Orang Tua'}
              </span>
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowProfile(false)}
                />
                <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="p-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {session?.user?.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {session?.user?.email}
                    </p>
                  </div>
                  
                  <div className="py-2">
                    <Link
                      href="/parent-portal/settings"
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfile(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Pengaturan
                    </Link>
                    
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        signOut({ callbackUrl: '/auth/signin' });
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Keluar
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}