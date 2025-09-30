'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Users, 
  Building2, 
  BookOpen, 
  Heart, 
  Briefcase,
  Home,
  ArrowLeft,
  UserCircle,
  Shield,
  Award,
  Landmark,
  Store,
  Megaphone,
  GraduationCap,
  MessageCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import PublicLayout from '@/components/layout/PublicLayout'

export default function StrukturOrganisasiPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  // Organizational structure data
  const dewanSyuro = [
    'Bpk. Syamsul',
    'Bpk. Syaiful',
    'Bpk. Bowo',
    'Ust. Fuad'
  ]

  const dewanPembina = [
    'Bpk. Hadi',
    'Bpk. Syamsul',
    'Ust. Anwar Zen',
    'Ust. Fuad'
  ]

  const dewanPengawas = [
    'Bu Umi',
    'Bpk. Fadhli'
  ]

  const pengurusInti = {
    ketua: 'Ust. Abu Haitsami Iqbal',
    sekretaris: 'Bpk. Bowo',
    bendahara: 'Bpk. Syaiful',
    adminKeuangan: 'Ummu Rafa'
  }

  const divisi = [
    {
      name: 'BMT & Unit Usaha',
      icon: Store,
      color: 'from-blue-500 to-blue-600',
      head: 'Bpk. Bowo',
      units: [
        { name: 'Gunung Gamping', pic: 'Bpk. Syaiful' },
        { name: 'Koperasi', pic: 'Ummu Rafa' },
        { name: 'Barang Bekas & Rosok', pic: 'Bpk. Warno' },
        { name: 'Donasi', pic: 'Bpk. Hamzah' },
        { name: 'Sarpras & Logistik', pic: 'Bpk. Irfan' }
      ]
    },
    {
      name: 'Divisi Dakwah',
      icon: Megaphone,
      color: 'from-green-500 to-green-600',
      head: 'Ust. Abu Haitsami',
      units: [
        { name: 'Masjid', pic: 'Bpk. Budi' },
        { name: 'Kajian Rutin', pic: 'Akh Sofwan' },
        { name: 'Medsos', pic: 'Ust. Ahmad' },
        { name: 'MTU', pic: 'Ummu Dzakiyah' }
      ]
    },
    {
      name: 'Divisi Pendidikan',
      icon: GraduationCap,
      color: 'from-purple-500 to-purple-600',
      head: 'Bpk. Syamsul',
      units: [
        { name: 'RA & TK', pic: 'Ummu Dzakiyah' },
        { name: 'MTQ', pic: 'Ust. Syamsul' },
        { name: 'MSW Ikhwan', pic: 'Ust. Imam' },
        { name: 'MSW Akhwat', pic: 'Ummu Dzakiyah' }
      ]
    },
    {
      name: 'Divisi Lain-lain',
      icon: MessageCircle,
      color: 'from-orange-500 to-orange-600',
      head: 'Ust. Fuad',
      units: [
        { name: 'Humas', pic: 'Ust. Fuad' },
        { name: 'Komunikasi', pic: 'Ust. Fuad' },
        { name: 'Baksos', pic: 'Bpk. Syamsul' }
      ]
    }
  ]

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 to-emerald-700 text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
              <Building2 className="w-5 h-5" />
              <span className="text-sm font-medium">Periode 2023 - 2024</span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4">
              Struktur Organisasi
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl text-green-100 max-w-3xl mx-auto">
              Yayasan Imam Syafi'i Blitar
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Organizational Chart */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Dewan Syuro, Pembina, Pengawas */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Dewan Syuro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                  <CardTitle className="flex items-center gap-3">
                    <Shield className="w-6 h-6" />
                    Dewan Syuro
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {dewanSyuro.map((name, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <UserCircle className="w-5 h-5 text-amber-600" />
                        <span className="font-medium text-gray-700">{name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Dewan Pembina */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardTitle className="flex items-center gap-3">
                    <Award className="w-6 h-6" />
                    Dewan Pembina
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {dewanPembina.map((name, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <UserCircle className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-gray-700">{name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Dewan Pengawas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <CardTitle className="flex items-center gap-3">
                    <Landmark className="w-6 h-6" />
                    Dewan Pengawas
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {dewanPengawas.map((name, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <UserCircle className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-gray-700">{name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Connection Lines */}
          <div className="flex justify-center mb-8">
            <div className="w-px h-16 bg-gradient-to-b from-gray-300 to-green-500"></div>
          </div>

          {/* Pengurus Inti */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-12"
          >
            <Card className="border-2 border-green-300 shadow-xl bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
                <CardTitle className="text-center text-2xl">Pengurus Inti Yayasan</CardTitle>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Ketua */}
                  <div className="md:col-span-2 text-center mb-6">
                    <div className="inline-flex flex-col items-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-3">
                        <Users className="w-10 h-10 text-white" />
                      </div>
                      <Badge className="bg-green-600 text-white mb-2">Ketua Yayasan</Badge>
                      <h3 className="text-xl font-bold text-gray-800">{pengurusInti.ketua}</h3>
                    </div>
                  </div>

                  {/* Sekretaris & Bendahara */}
                  <div className="text-center">
                    <div className="inline-flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-3">
                        <Briefcase className="w-8 h-8 text-white" />
                      </div>
                      <Badge variant="secondary" className="mb-2">Sekretaris</Badge>
                      <h3 className="text-lg font-bold text-gray-800">{pengurusInti.sekretaris}</h3>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mb-3">
                        <Landmark className="w-8 h-8 text-white" />
                      </div>
                      <Badge variant="secondary" className="mb-2">Bendahara</Badge>
                      <h3 className="text-lg font-bold text-gray-800">{pengurusInti.bendahara}</h3>
                    </div>
                  </div>

                  {/* Admin Keuangan */}
                  <div className="md:col-span-2 text-center mt-4">
                    <div className="inline-flex flex-col items-center">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-3">
                        <Building2 className="w-7 h-7 text-white" />
                      </div>
                      <Badge variant="outline" className="mb-2">Admin Keuangan</Badge>
                      <h3 className="text-lg font-semibold text-gray-700">{pengurusInti.adminKeuangan}</h3>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Connection Lines */}
          <div className="flex justify-center mb-8">
            <div className="w-px h-16 bg-gradient-to-b from-green-500 to-gray-300"></div>
          </div>

          {/* Divisi-divisi */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {divisi.map((div, index) => {
              const Icon = div.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow">
                    <CardHeader className={`bg-gradient-to-r ${div.color} text-white`}>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Icon className="w-5 h-5" />
                        {div.name}
                      </CardTitle>
                      <p className="text-sm text-white/90 mt-2">
                        Koordinator: <span className="font-semibold">{div.head}</span>
                      </p>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        {div.units.map((unit, uIndex) => (
                          <div key={uIndex} className="border-l-2 border-gray-200 pl-3 py-1">
                            <p className="font-medium text-gray-800 text-sm">{unit.name}</p>
                            <p className="text-xs text-gray-600">{unit.pic}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Notes */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Card className="max-w-3xl mx-auto bg-gradient-to-br from-gray-50 to-white">
              <CardContent className="pt-6">
                <p className="text-gray-600">
                  Struktur organisasi ini berlaku untuk periode 2023-2024 dan dapat mengalami perubahan sesuai dengan kebijakan yayasan.
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  Untuk informasi lebih lanjut, silakan hubungi sekretariat yayasan.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  )
}