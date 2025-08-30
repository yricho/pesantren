'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Calendar,
  MapPin,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  Play,
  X,
  Menu,
  Filter,
  Search,
  Eye,
  Heart,
  Share2
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Activity {
  id: string
  title: string
  description: string
  date: string
  location: string
  category: string
  images: string[]
  participants: number
  likes: number
  views: number
}

export default function GalleryPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    // Simulated data
    setActivities([
      {
        id: '1',
        title: 'Wisuda Tahfidz 30 Juz',
        description: 'Acara wisuda untuk 25 santri yang telah menyelesaikan hafalan 30 juz Al-Quran',
        date: '2024-01-15',
        location: 'Aula Utama Pondok',
        category: 'Akademik',
        images: ['/gallery/wisuda1.jpg', '/gallery/wisuda2.jpg', '/gallery/wisuda3.jpg'],
        participants: 250,
        likes: 128,
        views: 1024
      },
      {
        id: '2',
        title: 'Peringatan Maulid Nabi Muhammad SAW',
        description: 'Peringatan Maulid Nabi dengan berbagai kegiatan dan perlombaan',
        date: '2024-01-10',
        location: 'Masjid Pondok',
        category: 'Keagamaan',
        images: ['/gallery/maulid1.jpg', '/gallery/maulid2.jpg'],
        participants: 500,
        likes: 245,
        views: 2048
      },
      {
        id: '3',
        title: 'Lomba Kreativitas Santri',
        description: 'Kompetisi tahunan kreativitas santri dalam berbagai bidang',
        date: '2024-01-05',
        location: 'Lapangan Pondok',
        category: 'Kompetisi',
        images: ['/gallery/lomba1.jpg', '/gallery/lomba2.jpg', '/gallery/lomba3.jpg'],
        participants: 150,
        likes: 89,
        views: 756
      },
      {
        id: '4',
        title: 'Kunjungan Studi Banding',
        description: 'Kunjungan dari Pondok Pesantren se-Jawa Timur',
        date: '2023-12-20',
        location: 'Pondok Imam Syafi\'i',
        category: 'Kunjungan',
        images: ['/gallery/kunjungan1.jpg', '/gallery/kunjungan2.jpg'],
        participants: 75,
        likes: 67,
        views: 543
      },
      {
        id: '5',
        title: 'Bakti Sosial Ramadhan',
        description: 'Program bakti sosial dan pembagian sembako untuk masyarakat sekitar',
        date: '2023-12-15',
        location: 'Desa Sekitar',
        category: 'Sosial',
        images: ['/gallery/baksos1.jpg', '/gallery/baksos2.jpg', '/gallery/baksos3.jpg'],
        participants: 100,
        likes: 156,
        views: 892
      },
      {
        id: '6',
        title: 'Festival Seni Islam',
        description: 'Festival seni Islam dengan penampilan nasyid, kaligrafi, dan seni budaya Islam',
        date: '2023-12-10',
        location: 'Aula Utama',
        category: 'Seni Budaya',
        images: ['/gallery/festival1.jpg', '/gallery/festival2.jpg'],
        participants: 300,
        likes: 198,
        views: 1567
      }
    ])
  }

  const navigationItems = [
    { id: 'home', label: 'Beranda', href: '/' },
    { id: 'about', label: 'Tentang', href: '/about/yayasan' },
    { id: 'pondok', label: 'Pondok', href: '/about/pondok' },
    { id: 'tk', label: 'TK', href: '/about/tk' },
    { id: 'sd', label: 'SD', href: '/about/sd' },
    { id: 'donasi', label: 'Donasi', href: '/donasi' },
    { id: 'kegiatan', label: 'Kegiatan', href: '/gallery' },
    { id: 'kajian', label: 'Kajian', href: '/kajian' },
    { id: 'perpustakaan', label: 'Perpustakaan', href: '/library' },
  ]

  const categories = [
    { value: 'all', label: 'Semua', color: 'bg-gray-100 text-gray-800' },
    { value: 'Akademik', label: 'Akademik', color: 'bg-blue-100 text-blue-800' },
    { value: 'Keagamaan', label: 'Keagamaan', color: 'bg-green-100 text-green-800' },
    { value: 'Kompetisi', label: 'Kompetisi', color: 'bg-purple-100 text-purple-800' },
    { value: 'Sosial', label: 'Sosial', color: 'bg-red-100 text-red-800' },
    { value: 'Seni Budaya', label: 'Seni Budaya', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Kunjungan', label: 'Kunjungan', color: 'bg-indigo-100 text-indigo-800' },
  ]

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          activity.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <h1 className="text-xl font-bold text-green-800 cursor-pointer">
                  Pondok Imam Syafi'i
                </h1>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    item.id === 'kegiatan'
                      ? 'text-green-600' 
                      : 'text-gray-700 hover:text-green-600'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/auth/signin">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Login
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/auth/signin" className="block px-3 py-2">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white pt-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Calendar className="w-3 h-3 mr-1" />
              Dokumentasi Kegiatan
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Galeri Kegiatan
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Dokumentasi berbagai kegiatan dan momen berharga di 
              Pondok Pesantren Imam Syafi'i Blitar
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Cari kegiatan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                <Grid3x3 className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.value)}
                  className="whitespace-nowrap"
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={viewMode === 'grid' 
            ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" 
            : "space-y-6"
          }>
            {filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <div className="relative h-64 bg-gradient-to-br from-blue-400 to-indigo-600">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Calendar className="w-24 h-24 text-white/30" />
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className={categories.find(c => c.value === activity.category)?.color}>
                        {activity.category}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <Badge variant="secondary" className="bg-white/90">
                        {activity.images.length} Foto
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{activity.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(activity.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{activity.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{activity.participants} Peserta</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-gray-400" />
                          <span>{activity.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-red-400" />
                          <span>{activity.likes}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Activity Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedActivity(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">{selectedActivity.title}</h2>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setSelectedActivity(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6">
                {/* Image Gallery */}
                <div className="mb-6">
                  <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-500">Image {selectedImageIndex + 1}</span>
                    </div>
                    {selectedActivity.images.length > 1 && (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80"
                          onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80"
                          onClick={() => setSelectedImageIndex(Math.min(selectedActivity.images.length - 1, selectedImageIndex + 1))}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {selectedActivity.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {selectedActivity.images.map((_, index) => (
                        <button
                          key={index}
                          className={`w-20 h-20 bg-gray-200 rounded flex-shrink-0 ${
                            index === selectedImageIndex ? 'ring-2 ring-blue-600' : ''
                          }`}
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          <span className="text-xs text-gray-500">{index + 1}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <Badge className={categories.find(c => c.value === selectedActivity.category)?.color}>
                      {selectedActivity.category}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600">{selectedActivity.description}</p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-5 h-5" />
                      <span>{formatDate(selectedActivity.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <span>{selectedActivity.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-5 h-5" />
                      <span>{selectedActivity.participants} Peserta</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t">
                    <Button variant="outline">
                      <Heart className="w-4 h-4 mr-2" />
                      {selectedActivity.likes} Suka
                    </Button>
                    <Button variant="outline">
                      <Share2 className="w-4 h-4 mr-2" />
                      Bagikan
                    </Button>
                    <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
                      <Eye className="w-4 h-4" />
                      <span>{selectedActivity.views} views</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Pondok Imam Syafi'i</h3>
              <p className="text-gray-400 text-sm">
                Membentuk generasi Qurani dan berakhlak mulia sejak 1985
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/" className="hover:text-white">Beranda</Link></li>
                <li><Link href="/about/yayasan" className="hover:text-white">Tentang Kami</Link></li>
                <li><Link href="/donasi" className="hover:text-white">Donasi</Link></li>
                <li><Link href="/ppdb" className="hover:text-white">PPDB Online</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Unit Pendidikan</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about/pondok" className="hover:text-white">Pondok Pesantren</Link></li>
                <li><Link href="/about/tk" className="hover:text-white">TK Islam</Link></li>
                <li><Link href="/about/sd" className="hover:text-white">SD Islam</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Kontak</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Jl. Imam Syafi'i No. 123</li>
                <li>Blitar, Jawa Timur 66111</li>
                <li>Tel: (0342) 123456</li>
                <li>info@imamsyafii-blitar.sch.id</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Pondok Pesantren Imam Syafi'i Blitar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}