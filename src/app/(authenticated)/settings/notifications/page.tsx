'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BellIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { useToast } from '@/components/ui/use-toast';

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  whatsapp: boolean;
  categories: {
    academic: boolean;
    financial: boolean;
    general: boolean;
    achievement: boolean;
    activity: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  frequency: 'IMMEDIATE' | 'DAILY_DIGEST' | 'WEEKLY_DIGEST';
}

const defaultPreferences: NotificationPreferences = {
  email: true,
  push: true,
  sms: false,
  whatsapp: false,
  categories: {
    academic: true,
    financial: true,
    general: true,
    achievement: true,
    activity: true,
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '07:00',
  },
  frequency: 'IMMEDIATE',
};

export default function NotificationSettingsPage() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/notifications/preferences');
      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat pengaturan notifikasi',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences }),
      });

      if (response.ok) {
        toast({
          title: 'Berhasil',
          description: 'Pengaturan notifikasi telah disimpan',
        });
      } else {
        throw new Error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast({
        title: 'Error',
        description: 'Gagal menyimpan pengaturan notifikasi',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (key: string, value: any, nested?: string) => {
    setPreferences(prev => {
      if (nested) {
        const nestedKey = nested as keyof NotificationPreferences;
        const currentNested = prev[nestedKey];
        if (typeof currentNested === 'object' && currentNested !== null) {
          return {
            ...prev,
            [nested]: {
              ...(currentNested as Record<string, any>),
              [key]: value,
            },
          };
        }
      }
      return { ...prev, [key]: value };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-600">Memuat pengaturan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pengaturan Notifikasi</h1>
          <p className="text-gray-600 mt-2">
            Atur cara Anda menerima notifikasi dari sistem pondok pesantren
          </p>
        </div>

        <div className="space-y-6">
          {/* Delivery Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BellIcon className="w-5 h-5" />
              Metode Pengiriman
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <BellIcon className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Notifikasi Dalam Aplikasi</p>
                    <p className="text-sm text-gray-600">Notifikasi muncul di dalam aplikasi</p>
                  </div>
                </div>
                <div className="text-green-600 font-medium">Selalu Aktif</div>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">Kirim notifikasi via email</p>
                  </div>
                </div>
                <button
                  onClick={() => updatePreference('email', !preferences.email)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.email ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.email ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <DevicePhoneMobileIcon className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Push Notification</p>
                    <p className="text-sm text-gray-600">Notifikasi push di perangkat</p>
                  </div>
                </div>
                <button
                  onClick={() => updatePreference('push', !preferences.push)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.push ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.push ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900">SMS</p>
                    <p className="text-sm text-gray-600">Kirim notifikasi via SMS</p>
                  </div>
                </div>
                <button
                  onClick={() => updatePreference('sms', !preferences.sms)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.sms ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.sms ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">WhatsApp</p>
                    <p className="text-sm text-gray-600">Kirim notifikasi via WhatsApp</p>
                  </div>
                </div>
                <button
                  onClick={() => updatePreference('whatsapp', !preferences.whatsapp)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.whatsapp ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.whatsapp ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Notification Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Kategori Notifikasi
            </h2>

            <div className="space-y-4">
              {Object.entries(preferences.categories).map(([key, value]) => {
                const categoryInfo = {
                  academic: { name: 'Akademik', desc: 'Nilai, kehadiran, jadwal pelajaran', icon: '📚' },
                  financial: { name: 'Keuangan', desc: 'Tagihan SPP, pembayaran, tunggakan', icon: '💳' },
                  general: { name: 'Umum', desc: 'Pengumuman, pesan, informasi umum', icon: '📢' },
                  achievement: { name: 'Prestasi', desc: 'Pencapaian hafalan, penghargaan', icon: '🏆' },
                  activity: { name: 'Kegiatan', desc: 'Acara, kegiatan ekstrakurikuler', icon: '🎯' },
                }[key];

                return (
                  <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{categoryInfo?.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{categoryInfo?.name}</p>
                        <p className="text-sm text-gray-600">{categoryInfo?.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updatePreference(key, !value, 'categories')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Quiet Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ClockIcon className="w-5 h-5" />
              Jam Tenang
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Aktifkan Jam Tenang</p>
                  <p className="text-sm text-gray-600">
                    Tidak ada notifikasi yang akan dikirim selama jam ini
                  </p>
                </div>
                <button
                  onClick={() => updatePreference('enabled', !preferences.quietHours.enabled, 'quietHours')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.quietHours.enabled ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.quietHours.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {preferences.quietHours.enabled && (
                <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mulai
                    </label>
                    <input
                      type="time"
                      value={preferences.quietHours.start}
                      onChange={(e) => updatePreference('start', e.target.value, 'quietHours')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selesai
                    </label>
                    <input
                      type="time"
                      value={preferences.quietHours.end}
                      onChange={(e) => updatePreference('end', e.target.value, 'quietHours')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Frequency Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Frekuensi Notifikasi
            </h2>

            <div className="space-y-3">
              {[
                { key: 'IMMEDIATE', name: 'Segera', desc: 'Kirim notifikasi segera setelah ada kejadian' },
                { key: 'DAILY_DIGEST', name: 'Ringkasan Harian', desc: 'Kirim ringkasan notifikasi sekali sehari' },
                { key: 'WEEKLY_DIGEST', name: 'Ringkasan Mingguan', desc: 'Kirim ringkasan notifikasi sekali seminggu' },
              ].map((option) => (
                <div
                  key={option.key}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    preferences.frequency === option.key
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => updatePreference('frequency', option.key)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      preferences.frequency === option.key
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {preferences.frequency === option.key && (
                        <CheckIcon className="w-2.5 h-2.5 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{option.name}</p>
                      <p className="text-sm text-gray-600">{option.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end"
          >
            <button
              onClick={savePreferences}
              disabled={saving}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckIcon className="w-4 h-4" />
              )}
              {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}