'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    profil: [
      { label: 'Yayasan', href: '/about/yayasan' },
      { label: 'Struktur Organisasi', href: '/about/struktur' },
      { label: 'Ustadz & Ustadzah', href: '/about/pengajar' },
      { label: 'Visi & Misi', href: '/about/yayasan#visi-misi' },
    ],
    pendidikan: [
      { label: 'Pondok Pesantren', href: '/about/pondok' },
      { label: 'TK Islam', href: '/about/tk' },
      { label: 'SD Islam', href: '/about/sd' },
      { label: 'PPDB Online', href: '/ppdb' },
    ],
    layanan: [
      { label: 'Portal Wali', href: '/parent-portal/dashboard' },
      { label: 'Perpustakaan Digital', href: '/library' },
      { label: 'Video Kajian', href: '/kajian' },
      { label: 'Galeri Kegiatan', href: '/gallery' },
    ],
    donasi: [
      { label: 'Donasi Umum', href: '/donasi' },
      { label: 'Program OTA', href: '/donasi/ota' },
      { label: 'Kalkulator Zakat', href: '/donasi/zakat-calculator' },
      { label: 'Laporan Keuangan', href: '/donasi#laporan' },
    ],
  };

  const socialMedia = [
    { name: 'Facebook', icon: 'facebook', url: '#' },
    { name: 'Instagram', icon: 'instagram', url: '#' },
    { name: 'YouTube', icon: 'youtube', url: '#' },
    { name: 'WhatsApp', icon: 'whatsapp', url: 'https://wa.me/628123456789' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
          {/* About Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">P</span>
              </div>
              <div>
                <h3 className="font-bold text-xl">Pondok Pesantren</h3>
                <p className="text-sm text-gray-300">Imam Syafi'i Blitar</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              Lembaga pendidikan Islam terpadu yang menggabungkan pendidikan formal dan pesantren,
              membentuk generasi yang berilmu, berakhlak mulia, dan berwawasan global.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <MapPinIcon className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-300">
                  Jl. Raya Imam Syafi'i No. 123, Kel. Sananwetan,<br />
                  Kec. Sananwetan, Kota Blitar, Jawa Timur 66137
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-sm text-gray-300">(0342) 123456 / 0812-3456-7890</p>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-sm text-gray-300">info@pondok-imam-syafii.sch.id</p>
              </div>
              <div className="flex items-center space-x-3">
                <GlobeAltIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-sm text-gray-300">www.pondok-imam-syafii.sch.id</p>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 lg:col-span-3">
            {/* Profil */}
            <div>
              <h4 className="font-semibold text-green-400 mb-3">Profil</h4>
              <ul className="space-y-2">
                {footerLinks.profil.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-gray-300 hover:text-green-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pendidikan */}
            <div>
              <h4 className="font-semibold text-green-400 mb-3">Pendidikan</h4>
              <ul className="space-y-2">
                {footerLinks.pendidikan.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-gray-300 hover:text-green-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Layanan */}
            <div>
              <h4 className="font-semibold text-green-400 mb-3">Layanan</h4>
              <ul className="space-y-2">
                {footerLinks.layanan.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-gray-300 hover:text-green-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Donasi */}
            <div>
              <h4 className="font-semibold text-green-400 mb-3">Donasi</h4>
              <ul className="space-y-2">
                {footerLinks.donasi.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-gray-300 hover:text-green-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Social Media */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Ikuti Kami:</span>
              {socialMedia.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-gray-700 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors"
                  aria-label={social.name}
                >
                  <span className="text-sm font-bold">{social.icon[0].toUpperCase()}</span>
                </motion.a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <span className="text-sm text-gray-400">Berlangganan Info:</span>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="px-4 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:bg-gray-600 text-sm w-48"
                />
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-r-lg transition-colors text-sm">
                  Daftar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {currentYear} Pondok Pesantren Imam Syafi'i Blitar. Hak Cipta Dilindungi.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-green-400 transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="/terms" className="hover:text-green-400 transition-colors">
                Syarat & Ketentuan
              </Link>
              <Link href="/sitemap" className="hover:text-green-400 transition-colors">
                Peta Situs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}