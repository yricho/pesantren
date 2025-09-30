'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Play, Search, Calendar, Clock, User, Eye, ThumbsUp, 
  Share2, Download, Filter, Grid, List, Home, BookOpen,
  Heart, Bookmark, Volume2, X, ChevronLeft, ChevronRight,
  Menu, Briefcase, Phone, Users, GraduationCap, Book,
  DollarSign, PlayCircle, Image, Copy
} from 'lucide-react';
import { formatVideoForWhatsApp, copyToClipboard, showCopyNotification } from '@/lib/whatsapp-formatter';
import PublicLayout from '@/components/layout/PublicLayout';

interface Kajian {
  id: string;
  title: string;
  ustadz: string;
  date: string;
  duration: string;
  views: number;
  likes: number;
  category: string;
  thumbnail: string;
  videoUrl: string;
  description: string;
  tags: string[];
}

const categories = [
  'Semua', 'Akidah', 'Fiqih', 'Hadits', 'Sirah', 'Tafsir', 
  'Akhlak', 'Parenting', 'Muamalah', 'Tahsin'
];

const kajianData: Kajian[] = [
  {
    id: '1',
    title: 'Keutamaan Ilmu dan Ulama',
    ustadz: 'Ustadz Ahmad Zainuddin',
    date: '2024-01-15',
    duration: '45:30',
    views: 1250,
    likes: 89,
    category: 'Akidah',
    thumbnail: '/api/placeholder/400/225',
    videoUrl: '#',
    description: 'Pembahasan tentang keutamaan menuntut ilmu dan kedudukan ulama dalam Islam',
    tags: ['ilmu', 'ulama', 'keutamaan', 'adab']
  },
  {
    id: '2',
    title: 'Fiqih Shalat: Syarat dan Rukun',
    ustadz: 'Ustadz Muhammad Hasan',
    date: '2024-01-14',
    duration: '38:45',
    views: 980,
    likes: 76,
    category: 'Fiqih',
    thumbnail: '/api/placeholder/400/225',
    videoUrl: '#',
    description: 'Penjelasan lengkap tentang syarat sah dan rukun shalat',
    tags: ['shalat', 'fiqih', 'ibadah', 'rukun']
  },
  {
    id: '3',
    title: 'Mendidik Anak di Era Digital',
    ustadz: 'Ustadz Ibrahim Al-Makky',
    date: '2024-01-13',
    duration: '52:15',
    views: 2100,
    likes: 156,
    category: 'Parenting',
    thumbnail: '/api/placeholder/400/225',
    videoUrl: '#',
    description: 'Tips dan strategi mendidik anak di tengah perkembangan teknologi',
    tags: ['parenting', 'anak', 'digital', 'pendidikan']
  },
  {
    id: '4',
    title: 'Tafsir Surah Al-Fatihah',
    ustadz: 'Ustadz Abdul Rahman',
    date: '2024-01-12',
    duration: '60:00',
    views: 1560,
    likes: 124,
    category: 'Tafsir',
    thumbnail: '/api/placeholder/400/225',
    videoUrl: '#',
    description: 'Tafsir lengkap Surah Al-Fatihah dan hikmahnya',
    tags: ['tafsir', 'quran', 'alfatihah', 'tadabbur']
  },
  {
    id: '5',
    title: 'Kisah Nabi Ibrahim AS',
    ustadz: 'Ustadz Yusuf Mansur',
    date: '2024-01-11',
    duration: '48:20',
    views: 1890,
    likes: 145,
    category: 'Sirah',
    thumbnail: '/api/placeholder/400/225',
    videoUrl: '#',
    description: 'Kisah perjalanan dan perjuangan Nabi Ibrahim AS',
    tags: ['sirah', 'nabi', 'ibrahim', 'kisah']
  },
  {
    id: '6',
    title: 'Hadits Arbain: Hadits ke-1',
    ustadz: 'Ustadz Khalid Basalamah',
    date: '2024-01-10',
    duration: '35:45',
    views: 1450,
    likes: 98,
    category: 'Hadits',
    thumbnail: '/api/placeholder/400/225',
    videoUrl: '#',
    description: 'Penjelasan Hadits Arbain Nawawi: Hadits pertama tentang niat',
    tags: ['hadits', 'arbain', 'niat', 'amal']
  }
];

export default function KajianPage() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedKajian, setSelectedKajian] = useState<Kajian | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [savedVideos, setSavedVideos] = useState<string[]>([]);

  const filteredKajian = kajianData.filter(kajian => {
    const matchesCategory = selectedCategory === 'Semua' || kajian.category === selectedCategory;
    const matchesSearch = kajian.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          kajian.ustadz.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          kajian.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleSaveVideo = (id: string) => {
    setSavedVideos(prev => 
      prev.includes(id) 
        ? prev.filter(vid => vid !== id)
        : [...prev, id]
    );
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleCopyToWhatsApp = async (kajian: Kajian) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://pondokimamsyafii.sch.id'
    const whatsappText = formatVideoForWhatsApp({
      title: kajian.title,
      description: kajian.description,
      speaker: kajian.ustadz,
      duration: kajian.duration,
      date: kajian.date,
      link: `${baseUrl}/kajian`
    })
    
    const success = await copyToClipboard(whatsappText)
    showCopyNotification(success)
  };

  return (
    <PublicLayout>
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span className="font-bold text-gray-800 hidden md:block">Pondok Imam Syafi'i</span>
              </Link>
              
              <div className="hidden lg:flex items-center space-x-6">
                <Link href="/" className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600 transition-colors">
                  <Home className="w-4 h-4" />
                  <span>Beranda</span>
                </Link>
                <Link href="/about/yayasan" className="text-gray-600 hover:text-emerald-600 transition-colors">Yayasan</Link>
                <Link href="/about/pondok" className="text-gray-600 hover:text-emerald-600 transition-colors">Pondok</Link>
                <Link href="/about/tk" className="text-gray-600 hover:text-emerald-600 transition-colors">TK Islam</Link>
                <Link href="/about/sd" className="text-gray-600 hover:text-emerald-600 transition-colors">SD Islam</Link>
                <Link href="/donasi" className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600 transition-colors">
                  <Heart className="w-4 h-4" />
                  <span>Donasi</span>
                </Link>
                <Link href="/gallery" className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600 transition-colors">
                  <Image className="w-4 h-4" />
                  <span>Galeri</span>
                </Link>
                <Link href="/kajian" className="flex items-center space-x-1 text-emerald-600 font-semibold">
                  <PlayCircle className="w-4 h-4" />
                  <span>Kajian</span>
                </Link>
                <Link href="/library" className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600 transition-colors">
                  <Book className="w-4 h-4" />
                  <span>Perpustakaan</span>
                </Link>
              </div>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden bg-white border-t"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              <Link href="/" className="block py-2 text-gray-600 hover:text-emerald-600">Beranda</Link>
              <Link href="/about/yayasan" className="block py-2 text-gray-600 hover:text-emerald-600">Yayasan</Link>
              <Link href="/about/pondok" className="block py-2 text-gray-600 hover:text-emerald-600">Pondok</Link>
              <Link href="/about/tk" className="block py-2 text-gray-600 hover:text-emerald-600">TK Islam</Link>
              <Link href="/about/sd" className="block py-2 text-gray-600 hover:text-emerald-600">SD Islam</Link>
              <Link href="/donasi" className="block py-2 text-gray-600 hover:text-emerald-600">Donasi</Link>
              <Link href="/gallery" className="block py-2 text-gray-600 hover:text-emerald-600">Galeri Kegiatan</Link>
              <Link href="/kajian" className="block py-2 text-emerald-600 font-semibold">Kajian</Link>
              <Link href="/library" className="block py-2 text-gray-600 hover:text-emerald-600">Perpustakaan</Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-700"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Kajian Islam</h1>
            <p className="text-xl mb-8 text-emerald-100">
              Kumpulan Video Kajian dan Pembelajaran Islam
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <input
                type="text"
                placeholder="Cari kajian, ustadz, atau topik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pr-14 rounded-full bg-white/95 backdrop-blur text-gray-800 
                         placeholder:text-gray-500 shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30"
              />
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">{kajianData.length}</div>
                <div className="text-emerald-100">Video Kajian</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">15</div>
                <div className="text-emerald-100">Ustadz</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-emerald-100">Penonton</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Filters and Controls */}
      <section className="sticky top-16 z-30 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-emerald-100 text-emerald-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-emerald-100 text-emerald-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Kajian Grid/List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredKajian.map((kajian, index) => (
                <motion.div
                  key={kajian.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all"
                >
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <img 
                      src={kajian.thumbnail} 
                      alt={kajian.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSelectedKajian(kajian)}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Play className="w-16 h-16 text-white drop-shadow-lg" />
                      </button>
                    </div>
                    <span className="absolute top-4 right-4 bg-black/60 text-white px-2 py-1 rounded text-sm">
                      {kajian.duration}
                    </span>
                    <span className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1 rounded-full text-sm">
                      {kajian.category}
                    </span>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {kajian.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                      <User className="w-4 h-4" />
                      <span>{kajian.ustadz}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-500 text-sm">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {formatViews(kajian.views)}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {kajian.likes}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleCopyToWhatsApp(kajian)}
                          className="p-1.5 rounded-lg transition-colors text-[#25D366] hover:bg-[#25D366]/10"
                          title="Salin untuk WhatsApp"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => toggleSaveVideo(kajian.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            savedVideos.includes(kajian.id)
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredKajian.map((kajian, index) => (
                <motion.div
                  key={kajian.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative w-full md:w-64 aspect-video rounded-lg overflow-hidden bg-gray-100 group">
                      <img 
                        src={kajian.thumbnail} 
                        alt={kajian.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={() => setSelectedKajian(kajian)}>
                          <Play className="w-12 h-12 text-white drop-shadow-lg" />
                        </button>
                      </div>
                      <span className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-sm">
                        {kajian.duration}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-xl mb-1 hover:text-emerald-600 transition-colors">
                            {kajian.title}
                          </h3>
                          <div className="flex items-center gap-4 text-gray-600 text-sm mb-2">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {kajian.ustadz}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(kajian.date)}
                            </span>
                          </div>
                        </div>
                        <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1 rounded-full text-sm">
                          {kajian.category}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {kajian.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-gray-500 text-sm">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {formatViews(kajian.views)} ditonton
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            {kajian.likes} suka
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleCopyToWhatsApp(kajian)}
                            className="p-2 rounded-lg transition-colors text-[#25D366] hover:bg-[#25D366]/10"
                            title="Salin untuk WhatsApp"
                          >
                            <Copy className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => toggleSaveVideo(kajian.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              savedVideos.includes(kajian.id)
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            <Bookmark className="w-5 h-5" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <Share2 className="w-5 h-5" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {kajian.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Video Modal */}
      {selectedKajian && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedKajian(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div className="aspect-video bg-black">
                <img 
                  src={selectedKajian.thumbnail} 
                  alt={selectedKajian.title}
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-20 h-20 text-white/80 drop-shadow-lg" />
                </div>
              </div>
              <button
                onClick={() => setSelectedKajian(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-lg hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{selectedKajian.title}</h2>
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {selectedKajian.ustadz}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(selectedKajian.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedKajian.duration}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{selectedKajian.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleCopyToWhatsApp(selectedKajian)}
                    className="flex items-center gap-2 px-4 py-2 text-[#25D366] border border-[#25D366] rounded-lg hover:bg-[#25D366]/10 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Salin untuk WhatsApp</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Suka</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>Bagikan</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Unduh</span>
                  </button>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {formatViews(selectedKajian.views)}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {selectedKajian.likes}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-br from-emerald-900 to-teal-800 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Pondok Imam Syafi'i</h3>
              <p className="text-emerald-100">
                Membentuk generasi Qurani yang berakhlak mulia dan berwawasan luas
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Lembaga</h4>
              <ul className="space-y-2 text-emerald-100">
                <li><Link href="/about/yayasan" className="hover:text-white transition-colors">Yayasan</Link></li>
                <li><Link href="/about/pondok" className="hover:text-white transition-colors">Pondok Pesantren</Link></li>
                <li><Link href="/about/tk" className="hover:text-white transition-colors">TK Islam</Link></li>
                <li><Link href="/about/sd" className="hover:text-white transition-colors">SD Islam</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Program</h4>
              <ul className="space-y-2 text-emerald-100">
                <li><Link href="/donasi" className="hover:text-white transition-colors">Donasi</Link></li>
                <li><Link href="/gallery" className="hover:text-white transition-colors">Galeri Kegiatan</Link></li>
                <li><Link href="/kajian" className="hover:text-white transition-colors">Kajian Islam</Link></li>
                <li><Link href="/library" className="hover:text-white transition-colors">Perpustakaan Digital</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Kontak</h4>
              <ul className="space-y-2 text-emerald-100">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>(0342) 123456</span>
                </li>
                <li>Jl. Pendidikan No. 123</li>
                <li>Kota Blitar, Jawa Timur</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-emerald-700 mt-8 pt-8 text-center text-emerald-100">
            <p>&copy; 2024 Pondok Pesantren Imam Syafi'i. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </PublicLayout>
  );
}