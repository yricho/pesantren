'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Heart,
  Users,
  Building,
  BookOpen,
  GraduationCap,
  Home,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  ArrowRight,
  CreditCard,
  Smartphone,
  Building2,
  Share2,
  Copy,
  Check,
  Menu,
  X
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/use-toast'

interface Campaign {
  id: string
  title: string
  description: string
  target: number
  collected: number
  percentage: number
  daysLeft: number
  category: string
  image?: string
  urgency: 'high' | 'medium' | 'low'
  donors: number
}

export default function DonasiPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      // Simulated data - replace with actual API call
      setCampaigns([
        {
          id: '1',
          title: 'Pembangunan Masjid Tahap 2',
          description: 'Melanjutkan pembangunan masjid untuk menampung 1000 jamaah',
          target: 500000000,
          collected: 325000000,
          percentage: 65,
          daysLeft: 45,
          category: 'Infrastruktur',
          urgency: 'high',
          donors: 234
        },
        {
          id: '2',
          title: 'Beasiswa Santri Dhuafa',
          description: 'Program beasiswa untuk 50 santri kurang mampu',
          target: 120000000,
          collected: 78000000,
          percentage: 65,
          daysLeft: 30,
          category: 'Pendidikan',
          urgency: 'high',
          donors: 156
        },
        {
          id: '3',
          title: 'Wakaf Al-Quran & Kitab',
          description: 'Pengadaan 500 mushaf Al-Quran dan kitab pembelajaran',
          target: 75000000,
          collected: 45000000,
          percentage: 60,
          daysLeft: 60,
          category: 'Pendidikan',
          urgency: 'medium',
          donors: 89
        },
        {
          id: '4',
          title: 'Renovasi Asrama Santri',
          description: 'Perbaikan dan pengembangan asrama santri putra',
          target: 200000000,
          collected: 50000000,
          percentage: 25,
          daysLeft: 90,
          category: 'Infrastruktur',
          urgency: 'medium',
          donors: 67
        }
      ])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedAccount(type)
    toast({
      title: 'Berhasil disalin!',
      description: `Nomor rekening ${type} berhasil disalin`,
    })
    setTimeout(() => setCopiedAccount(null), 2000)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
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

  const bankAccounts = [
    { bank: 'BCA', number: '1234567890', name: 'Yayasan Imam Syafii', logo: '🏦' },
    { bank: 'Mandiri', number: '0987654321', name: 'Yayasan Imam Syafii', logo: '🏦' },
    { bank: 'BNI', number: '1122334455', name: 'Yayasan Imam Syafii', logo: '🏦' },
    { bank: 'BSI', number: '9988776655', name: 'Yayasan Imam Syafii', logo: '🏦' },
  ]

  const donationTypes = [
    { 
      icon: Heart, 
      title: 'Infaq & Sedekah', 
      desc: 'Donasi umum untuk operasional pondok',
      color: 'from-red-400 to-pink-600'
    },
    { 
      icon: GraduationCap, 
      title: 'Beasiswa', 
      desc: 'Bantuan pendidikan santri dhuafa',
      color: 'from-blue-400 to-indigo-600'
    },
    { 
      icon: Building, 
      title: 'Pembangunan', 
      desc: 'Pengembangan sarana prasarana',
      color: 'from-green-400 to-emerald-600'
    },
    { 
      icon: BookOpen, 
      title: 'Wakaf Quran', 
      desc: 'Pengadaan mushaf dan kitab',
      color: 'from-purple-400 to-pink-600'
    },
  ]

  const urgencyColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  }

  const urgencyLabels = {
    high: 'Mendesak',
    medium: 'Prioritas',
    low: 'Jangka Panjang'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
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
                    item.id === 'donasi'
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
      <section className="relative bg-gradient-to-r from-green-600 to-emerald-700 text-white pt-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial="initial"
            animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
            className="text-center"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                <Heart className="w-3 h-3 mr-1" />
                Platform Donasi Amanah
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Berbagi Kebaikan
                <span className="block text-green-200 mt-2">Raih Keberkahan</span>
              </h1>
              <p className="text-xl text-green-50 max-w-3xl mx-auto mb-8">
                Jadilah bagian dari pengembangan Pondok Pesantren Imam Syafi'i. 
                Setiap donasi Anda adalah investasi untuk generasi Qurani masa depan.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  <Heart className="mr-2 w-5 h-5" />
                  Donasi Sekarang
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  <Share2 className="mr-2 w-5 h-5" />
                  Bagikan
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Wave Shape */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-20">
            <path
              fill="rgb(249 250 251)"
              d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Donasi', value: 'Rp 2.5 M', icon: TrendingUp, color: 'text-green-600' },
              { label: 'Donatur', value: '1,234', icon: Users, color: 'text-blue-600' },
              { label: 'Campaign Aktif', value: '12', icon: Target, color: 'text-purple-600' },
              { label: 'Penerima Manfaat', value: '850+', icon: Heart, color: 'text-red-600' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <stat.icon className={`w-10 h-10 ${stat.color} mx-auto mb-3`} />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Campaign Types */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Program Donasi
            </h2>
            <p className="text-xl text-gray-600">
              Pilih program donasi sesuai dengan minat Anda
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {donationTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="h-full hover:shadow-xl transition-all cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className={`w-20 h-20 bg-gradient-to-br ${type.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <type.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                    <p className="text-gray-600 text-sm">{type.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Campaigns */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Campaign Aktif
            </h2>
            <p className="text-xl text-gray-600">
              Program donasi yang sedang berjalan dan membutuhkan dukungan Anda
            </p>
          </motion.div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto mb-8">
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="urgent">Mendesak</TabsTrigger>
              <TabsTrigger value="education">Pendidikan</TabsTrigger>
              <TabsTrigger value="infrastructure">Infrastruktur</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid md:grid-cols-2 gap-8">
                {campaigns.map((campaign, index) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-shadow">
                      <div className="h-48 bg-gradient-to-br from-green-400 to-emerald-600 relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Building className="w-24 h-24 text-white/30" />
                        </div>
                        <div className="absolute top-4 left-4">
                          <Badge className={urgencyColors[campaign.urgency]}>
                            {urgencyLabels[campaign.urgency]}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2">{campaign.title}</h3>
                        <p className="text-gray-600 mb-4">{campaign.description}</p>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600">Terkumpul</span>
                              <span className="font-semibold">{campaign.percentage}%</span>
                            </div>
                            <Progress value={campaign.percentage} className="h-2 mb-2" />
                            <div className="flex justify-between">
                              <span className="text-lg font-bold text-green-600">
                                {formatCurrency(campaign.collected)}
                              </span>
                              <span className="text-sm text-gray-600">
                                dari {formatCurrency(campaign.target)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{campaign.donors} Donatur</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{campaign.daysLeft} hari lagi</span>
                            </div>
                          </div>

                          <Button className="w-full bg-green-600 hover:bg-green-700">
                            Donasi Sekarang
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Bank Accounts */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Rekening Donasi
            </h2>
            <p className="text-xl text-gray-600">
              Pilih metode pembayaran yang paling mudah untuk Anda
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {bankAccounts.map((account, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-3xl mb-3">{account.logo}</div>
                    <h3 className="font-bold text-lg mb-2">{account.bank}</h3>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {account.number}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">{account.name}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => copyToClipboard(account.number, account.bank)}
                    >
                      {copiedAccount === account.bank ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Tersalin
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Salin
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* E-Wallet & QRIS */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Pembayaran Digital</h3>
                    <p className="text-gray-600 mb-6">
                      Donasi lebih mudah dengan QRIS atau e-wallet pilihan Anda
                    </p>
                    <div className="flex gap-4 mb-4">
                      <Badge variant="outline">GoPay</Badge>
                      <Badge variant="outline">OVO</Badge>
                      <Badge variant="outline">Dana</Badge>
                      <Badge variant="outline">LinkAja</Badge>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Smartphone className="mr-2 w-4 h-4" />
                      Scan QRIS
                    </Button>
                  </div>
                  <div className="bg-white p-8 rounded-xl shadow-lg">
                    <div className="w-48 h-48 bg-gray-200 mx-auto rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">QR Code</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Donate */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Mengapa Berdonasi di Pondok Imam Syafi'i?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: CheckCircle, 
                title: 'Amanah & Transparan', 
                desc: 'Laporan keuangan terbuka dan dapat diakses donatur' 
              },
              { 
                icon: Users, 
                title: 'Dampak Nyata', 
                desc: 'Langsung dirasakan oleh 850+ santri dan masyarakat' 
              },
              { 
                icon: Heart, 
                title: 'Pahala Jariyah', 
                desc: 'Investasi akhirat yang terus mengalir pahalanya' 
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-green-100">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Mulai Berbagi Kebaikan Hari Ini
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Setiap rupiah yang Anda donasikan akan kami kelola dengan amanah
              untuk kemajuan pendidikan Islam
            </p>
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              <Heart className="mr-2 w-5 h-5" />
              Donasi Sekarang
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
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