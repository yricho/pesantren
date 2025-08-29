'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { 
  Home, 
  DollarSign, 
  Calendar, 
  BookOpen, 
  Video, 
  Users, 
  Settings,
  Menu,
  X,
  LogOut,
  Library,
  UserCheck,
  GraduationCap,
  ClipboardCheck,
  Store,
  Package,
  ShoppingCart,
  Warehouse,
  TruckIcon,
  BarChart3,
  Receipt,
  Truck,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MenuItem {
  title: string
  href: string
  icon: any
  adminOnly?: boolean
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home
  },
  {
    title: 'Data Siswa',
    href: '/siswa',
    icon: UserCheck
  },
  {
    title: 'Data Alumni',
    href: '/alumni',
    icon: GraduationCap
  },
  {
    title: 'Admin PPDB',
    href: '/ppdb-admin',
    icon: ClipboardCheck,
    adminOnly: true
  },
  {
    title: 'Keuangan',
    href: '/keuangan',
    icon: DollarSign
  },
  {
    title: 'Kegiatan',
    href: '/kegiatan',
    icon: Calendar
  },
  {
    title: 'Kurikulum',
    href: '/kurikulum',
    icon: BookOpen
  },
  {
    title: 'Video Kajian',
    href: '/kajian',
    icon: Video
  },
  {
    title: 'Perpustakaan',
    href: '/perpustakaan',
    icon: Library
  },
  {
    title: 'Unit Usaha',
    href: '/unit-usaha',
    icon: Store,
    children: [
      {
        title: 'Dashboard',
        href: '/unit-usaha',
        icon: BarChart3
      },
      {
        title: 'POS Kasir',
        href: '/unit-usaha/pos',
        icon: Receipt
      },
      {
        title: 'Produk',
        href: '/unit-usaha/products',
        icon: Package
      },
      {
        title: 'Inventory',
        href: '/unit-usaha/inventory',
        icon: Warehouse
      },
      {
        title: 'Suppliers',
        href: '/unit-usaha/suppliers',
        icon: Truck
      },
      {
        title: 'Purchase Orders',
        href: '/unit-usaha/purchases',
        icon: ShoppingCart
      },
      {
        title: 'Laporan',
        href: '/unit-usaha/reports',
        icon: BarChart3
      }
    ]
  },
  {
    title: 'Pengguna',
    href: '/users',
    icon: Users,
    adminOnly: true
  },
  {
    title: 'Pengaturan',
    href: '/settings',
    icon: Settings
  }
]

export function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const pathname = usePathname()
  const { data: session } = useSession()

  const filteredMenuItems = menuItems.filter(item => 
    !item.adminOnly || session?.user?.role === 'ADMIN'
  )

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    )
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">Pondok Imam</h1>
            <p className="text-xs text-gray-600">Syafi'i Blitar</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 pb-4 space-y-2">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          const hasChildren = item.children && item.children.length > 0
          const isExpanded = expandedItems.includes(item.href)
          const isChildActive = hasChildren && item.children.some(child => pathname === child.href)
          
          return (
            <div key={item.href}>
              {hasChildren ? (
                <button
                  onClick={() => toggleExpanded(item.href)}
                  className={cn(
                    'flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isChildActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-100 text-primary-800'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              )}
              
              {hasChildren && isExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child) => {
                    const ChildIcon = child.icon
                    const isChildActiveItem = pathname === child.href
                    
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors',
                          isChildActiveItem
                            ? 'bg-primary-100 text-primary-800'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                        )}
                      >
                        <ChildIcon className="w-4 h-4" />
                        <span>{child.title}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-primary-600">
              {session?.user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {session?.user?.name}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {session?.user?.role?.toLowerCase()}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut()}
          className="w-full"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Keluar
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r">
        <SidebarContent />
      </div>

      {/* Mobile sidebar */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-white border-r">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  )
}