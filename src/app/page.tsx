'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Video, 
  MapPin, 
  Clock,
  Phone,
  Mail,
  Star,
  ArrowRight,
  Play,
  Eye
} from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: BookOpen,
      title: 'Program Tahfidz',
      description: 'Program menghafal Al-Quran dengan metode yang efektif dan pembimbingan intensif'
    },
    {
      icon: Users,
      title: 'Kajian Rutin',
      description: 'Kajian mingguan dengan berbagai tema keislaman untuk memperdalam ilmu agama'
    },
    {
      icon: Video,
      title: 'Video Pembelajaran',
      description: 'Koleksi video kajian dari berbagai ustadz untuk pembelajaran mandiri'
    },
    {
      icon: Calendar,
      title: 'Kegiatan Berkala',
      description: 'Berbagai kegiatan dan acara yang menunjang pengembangan karakter islami'
    }
  ]

  const recentVideos = [
    {
      id: '1',
      title: 'Adab Bermuamalah dalam Islam',
      teacher: 'Ustadz Muhammad Yusuf, M.A',
      views: 245,
      thumbnail: '/thumbnails/video1.jpg'
    },
    {
      id: '2', 
      title: 'Tahfidz Al-Quran: Tips dan Teknik Menghafal',
      teacher: 'Ustadz Hafiz Rahman, S.Pd',
      views: 189,
      thumbnail: '/thumbnails/video2.jpg'
    },
    {
      id: '3',
      title: 'Sejarah Peradaban Islam',
      teacher: 'Ustadz Dr. Abdullah Mansur',
      views: 156,
      thumbnail: '/thumbnails/video3.jpg'
    }
  ]

  const upcomingEvents = [
    {
      id: '1',
      title: 'Kajian Rutin Mingguan',
      date: 'Jumat, 22 Maret 2024',
      time: '19:30 - 21:00',
      location: 'Masjid Pondok'
    },
    {
      id: '2',
      title: 'Seminar Kewirausahaan',
      date: 'Senin, 25 Maret 2024', 
      time: '09:00 - 12:00',
      location: 'Aula Pondok'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900">Pondok Imam Syafi'i Blitar</h1>
                <p className="text-xs text-gray-600">Lembaga Pendidikan Islam</p>
              </div>
            </div>
            <Link href="/auth/signin">
              <Button>
                Masuk Sistem
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 islamic-gradient text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Pondok Imam Syafi'i Blitar
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Lembaga Pendidikan Islam yang berfokus pada pembentukan karakter islami
              melalui pembelajaran Al-Quran, Hadits, dan ilmu-ilmu keislaman
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                Pelajari Lebih Lanjut
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                Lihat Video Kajian
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Program & Fasilitas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kami menyediakan berbagai program pendidikan dan fasilitas untuk mendukung
              pembelajaran yang optimal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Videos Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Video Kajian Terbaru
              </h2>
              <p className="text-lg text-gray-600">
                Tonton kajian-kajian terbaru dari ustadz-ustadz terbaik kami
              </p>
            </div>
            <Button variant="outline">
              Lihat Semua
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-video bg-gray-200">
                  <div className="w-full h-full flex items-center justify-center bg-primary-100">
                    <Play className="w-12 h-12 text-primary-600" />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <Button size="icon" className="opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{video.teacher}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Eye className="w-4 h-4 mr-1" />
                    {video.views} views
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kegiatan Mendatang
            </h2>
            <p className="text-lg text-gray-600">
              Ikuti berbagai kegiatan dan kajian yang kami selenggarakan
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="border-l-4 border-l-primary-500">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="mb-4 md:mb-0">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {event.title}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {event.date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {event.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline">
                        Detail Kegiatan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hubungi Kami
            </h2>
            <p className="text-lg text-gray-600">
              Untuk informasi lebih lanjut, jangan ragu untuk menghubungi kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Alamat</h3>
                <p className="text-gray-600">
                  Jl. Raya Pendidikan No. 123<br />
                  Blitar, Jawa Timur 66137
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Telepon</h3>
                <p className="text-gray-600">
                  (0342) 123-456<br />
                  +62 812-3456-7890
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Email</h3>
                <p className="text-gray-600">
                  info@ponimsy-blitar.id<br />
                  admin@ponimsy-blitar.id
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Pondok Imam Syafi'i</h3>
                  <p className="text-sm text-gray-400">Blitar</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Lembaga pendidikan Islam yang berkomitmen dalam pembentukan 
                generasi muslim yang berakhlak mulia.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Program</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Tahfidz Al-Quran</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Kajian Rutin</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pelatihan</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Bakti Sosial</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Layanan</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Video Kajian</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Konsultasi</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Kegiatan</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pendaftaran</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Kontak</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">Blitar, Jawa Timur</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">(0342) 123-456</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">info@ponimsy-blitar.id</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Pondok Imam Syafi'i Blitar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}