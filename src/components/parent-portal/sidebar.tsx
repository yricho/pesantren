'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  GraduationCap,
  CreditCard,
  MessageSquare,
  Bell,
  Settings,
  FileText,
  Calendar,
  BarChart3
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const navigationItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    href: '/parent-portal/dashboard',
    icon: Home,
  },
  {
    name: 'Anak Saya',
    href: '/parent-portal/children',
    icon: Users,
  },
  {
    name: 'Pembayaran',
    href: '/parent-portal/payments',
    icon: CreditCard,
  },
  {
    name: 'Pengumuman',
    href: '/parent-portal/announcements',
    icon: Bell,
  },
  {
    name: 'Pesan',
    href: '/parent-portal/messages',
    icon: MessageSquare,
  },
  {
    name: 'Pengaturan',
    href: '/parent-portal/settings',
    icon: Settings,
  },
];

export default function ParentPortalSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 w-64 h-full bg-white border-r border-gray-200 z-40">
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                  ${isActive
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="px-4 py-4 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Aksi Cepat
          </h3>
          <div className="space-y-2">
            <Link
              href="/parent-portal/messages/new"
              className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Kirim Pesan
            </Link>
            <Link
              href="/parent-portal/payments/pending"
              className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Bayar Tagihan
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Butuh Bantuan?
            </h4>
            <p className="text-xs text-gray-600 mb-3">
              Hubungi admin sekolah untuk bantuan teknis
            </p>
            <Link
              href="/parent-portal/help"
              className="text-xs text-green-600 hover:text-green-800 font-medium"
            >
              Pusat Bantuan →
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}