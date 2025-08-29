'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import {
  BookOpenIcon,
  AcademicCapIcon,
  UsersIcon,
  VideoCameraIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  SparklesIcon,
  ChartBarIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  HeartIcon,
  BuildingLibraryIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import {
  StarIcon,
  MoonIcon,
} from '@heroicons/react/24/solid';

export default function HomePage() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const features = [
    {
      icon: CurrencyDollarIcon,
      title: 'Manajemen Keuangan',
      description: 'Transparansi pengelolaan dana pondok, donasi, dan laporan keuangan real-time',
      color: 'from-emerald-400 to-green-600',
      href: '/keuangan',
    },
    {
      icon: CalendarIcon,
      title: 'Dokumentasi Kegiatan',
      description: 'Arsip digital seluruh kegiatan pondok, TK, dan SD dengan foto dan video',
      color: 'from-blue-400 to-indigo-600',
      href: '/kegiatan',
    },
    {
      icon: AcademicCapIcon,
      title: 'Kurikulum Terpadu',
      description: 'Integrasi kurikulum pesantren dengan pendidikan formal TK dan SD',
      color: 'from-purple-400 to-pink-600',
      href: '/kurikulum',
    },
    {
      icon: VideoCameraIcon,
      title: 'Video Kajian',
      description: 'Koleksi video kajian ustadz untuk pembelajaran online dan offline',
      color: 'from-orange-400 to-red-600',
      href: '/kajian',
    },
    {
      icon: BuildingLibraryIcon,
      title: 'Perpustakaan Digital',
      description: 'E-book dan kitab digital dengan fitur baca online dan download',
      color: 'from-yellow-400 to-amber-600',
      href: '/perpustakaan',
    },
    {
      icon: ChartBarIcon,
      title: 'Laporan & Analitik',
      description: 'Dashboard analitik untuk monitoring perkembangan pondok',
      color: 'from-teal-400 to-cyan-600',
      href: '/dashboard',
    },
  ];

  const stats = [
    { label: 'Santri Aktif', value: 350, icon: UsersIcon },
    { label: 'Pengajar', value: 45, icon: AcademicCapIcon },
    { label: 'Alumni', value: 1250, icon: StarIcon },
    { label: 'Program Studi', value: 12, icon: BookOpenIcon },
  ];

  const programs = [
    {
      title: 'Tahfidz Al-Quran',
      description: 'Program menghafal 30 juz dengan metode mutqin',
      image: '/images/tahfidz.jpg',
      students: 120,
    },
    {
      title: 'Kitab Kuning',
      description: 'Kajian kitab klasik dengan sanad bersambung',
      image: '/images/kitab.jpg',
      students: 200,
    },
    {
      title: 'Bahasa Arab',
      description: 'Pembelajaran bahasa Arab intensif',
      image: '/images/arabic.jpg',
      students: 150,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Decorative Islamic Pattern Background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23065f46' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700" />
        
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400 rounded-full opacity-10"
          />
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-10 -left-20 w-60 h-60 bg-white rounded-full opacity-10"
          />
        </div>

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeInUp}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white mb-6"
              >
                <SparklesIcon className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Platform Digital Pesantren Modern</span>
              </motion.div>
              
              <motion.h1
                variants={fadeInUp}
                className="text-5xl lg:text-7xl font-bold text-white mb-6"
              >
                Pondok Pesantren
                <span className="block text-yellow-300 mt-2">Imam Syafi'i</span>
                <span className="block text-3xl lg:text-4xl font-normal text-green-100 mt-4">
                  Blitar, Jawa Timur
                </span>
              </motion.h1>
              
              <motion.p
                variants={fadeInUp}
                className="text-xl text-green-50 mb-8 leading-relaxed"
              >
                Memadukan tradisi kepesantrenan dengan teknologi modern untuk 
                mencetak generasi Qurani yang berakhlak mulia dan berwawasan global.
              </motion.p>
              
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-4"
              >
                <Link href="/auth/signin">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white text-green-700 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center group"
                  >
                    Masuk Dashboard
                    <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                
                <Link href="#programs">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-green-800/30 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/30 hover:bg-green-800/50 transition-all duration-300"
                  >
                    Lihat Program
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="relative w-full h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <MoonIcon className="w-32 h-32 mx-auto mb-4 opacity-50" />
                    <p className="text-2xl font-bold mb-2">مَرْحَبًا بِكُمْ</p>
                    <p className="text-lg">Selamat Datang</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Cards */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4 flex items-center space-x-3"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpenIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Santri Tahfidz</p>
                  <p className="text-xl font-bold text-gray-900">120+</p>
                </div>
              </motion.div>
              
              <motion.div
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4 flex items-center space-x-3"
              >
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <StarIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="text-xl font-bold text-gray-900">4.9/5.0</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 -mt-8 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-xl p-6 text-center group hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {inView && <CountUp end={stat.value} duration={2} />}
                  <span className="text-green-600">+</span>
                </div>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Fitur <span className="text-green-600">Unggulan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sistem manajemen terintegrasi untuk mengelola seluruh aspek pendidikan dan operasional pondok pesantren
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Link href={feature.href}>
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`} />
                    
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    
                    <div className="flex items-center text-green-600 font-medium group-hover:translate-x-2 transition-transform">
                      <span>Selengkapnya</span>
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Program <span className="text-green-600">Unggulan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Berbagai program pendidikan Islam yang dirancang untuk membentuk generasi Qurani
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="h-48 bg-gradient-to-br from-green-400 to-emerald-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpenIcon className="w-24 h-24 text-white/30" />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {program.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-green-600">
                      <UsersIcon className="w-5 h-5 mr-2" />
                      <span className="font-medium">{program.students} Santri</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Detail
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Nilai-Nilai Kami
            </h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Berpegang teguh pada Al-Quran dan Sunnah dalam membentuk karakter santri
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: HeartIcon, title: 'Akhlakul Karimah', desc: 'Membentuk kepribadian mulia' },
              { icon: BookOpenIcon, title: 'Ilmu yang Bermanfaat', desc: 'Menuntut ilmu untuk diamalkan' },
              { icon: ShieldCheckIcon, title: 'Istiqomah', desc: 'Konsisten dalam kebaikan' },
              { icon: GlobeAltIcon, title: 'Rahmatan lil Alamin', desc: 'Menjadi rahmat bagi semesta' },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  <value.icon className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-green-100">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute -top-20 -right-20 w-80 h-80 bg-yellow-400 rounded-full"
              />
            </div>
            
            <div className="relative">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Bergabunglah Bersama Kami
              </h2>
              <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                Menjadi bagian dari keluarga besar Pondok Pesantren Imam Syafi'i Blitar dalam mencetak generasi Qurani
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-green-700 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Daftar Sekarang
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-green-800/30 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/30 hover:bg-green-800/50 transition-all duration-300"
                >
                  Hubungi Kami
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-400">Pondok Imam Syafi'i</h3>
              <p className="text-gray-400">
                Membentuk generasi Qurani yang berakhlak mulia dan berwawasan global
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-green-400 transition-colors">Tentang Kami</Link></li>
                <li><Link href="/programs" className="hover:text-green-400 transition-colors">Program</Link></li>
                <li><Link href="/admission" className="hover:text-green-400 transition-colors">Pendaftaran</Link></li>
                <li><Link href="/contact" className="hover:text-green-400 transition-colors">Kontak</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/dashboard" className="hover:text-green-400 transition-colors">Dashboard</Link></li>
                <li><Link href="/perpustakaan" className="hover:text-green-400 transition-colors">Perpustakaan</Link></li>
                <li><Link href="/kajian" className="hover:text-green-400 transition-colors">Video Kajian</Link></li>
                <li><Link href="/keuangan" className="hover:text-green-400 transition-colors">Laporan Keuangan</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Jl. Imam Syafi'i No. 123</li>
                <li>Blitar, Jawa Timur 66111</li>
                <li>Tel: (0342) 123456</li>
                <li>Email: info@ponpesimamsyafii.id</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Pondok Pesantren Imam Syafi'i Blitar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}