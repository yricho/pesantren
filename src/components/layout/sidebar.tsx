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
  GraduationCap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const menuItems = [
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
  const pathname = usePathname()
  const { data: session } = useSession()

  const filteredMenuItems = menuItems.filter(item => 
    !item.adminOnly || session?.user?.role === 'ADMIN'
  )

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
          
          return (
            <Link
              key={item.href}
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