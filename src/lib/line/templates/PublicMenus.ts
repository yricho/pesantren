/**
 * Public Menu Templates for LINE Bot
 * Untuk orang tua dan umum
 */

export function getPublicMainMenu() {
  return {
    type: 'flex',
    altText: '🕌 Pondok Imam Syafii - Menu Informasi',
    contents: {
      type: 'bubble',
      size: 'giga',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
            size: 'xs',
            color: '#FFFFFF',
            align: 'center'
          },
          {
            type: 'text',
            text: '🕌 PONDOK IMAM SYAFII',
            weight: 'bold',
            size: 'lg',
            color: '#FFFFFF',
            align: 'center',
            margin: 'md'
          },
          {
            type: 'text',
            text: 'Portal Informasi',
            size: 'sm',
            color: '#FEF3C7',
            align: 'center'
          }
        ],
        backgroundColor: '#16A34A',
        paddingAll: '20px'
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'Assalamualaikum Warahmatullah',
                size: 'md',
                weight: 'bold',
                color: '#15803D',
                align: 'center'
              },
              {
                type: 'text',
                text: 'Selamat datang di Portal Informasi',
                size: 'sm',
                color: '#666666',
                align: 'center',
                margin: 'sm'
              }
            ],
            margin: 'lg'
          },
          // Menu Grid
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              // Row 1
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  createPublicMenuCard('🏫', 'PROFIL', 'Tentang Pondok', 'public_profile'),
                  createPublicMenuCard('🎓', 'PPDB', 'Info Pendaftaran', 'public_ppdb')
                ],
                spacing: 'md',
                margin: 'lg'
              },
              // Row 2
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  createPublicMenuCard('📅', 'KEGIATAN', 'Agenda & Event', 'public_activities'),
                  createPublicMenuCard('💰', 'DONASI', 'Infaq & Wakaf', 'public_donation')
                ],
                spacing: 'md',
                margin: 'md'
              },
              // Row 3
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  createPublicMenuCard('📰', 'BERITA', 'Info Terkini', 'public_news'),
                  createPublicMenuCard('💬', 'TANYA USTADZ', 'Konsultasi', 'public_tanya_ustadz')
                ],
                spacing: 'md',
                margin: 'md'
              },
              // Row 4
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  createPublicMenuCard('📞', 'KONTAK', 'Hubungi Kami', 'public_contact'),
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [],
                    flex: 1
                  }
                ],
                spacing: 'md',
                margin: 'md'
              }
            ]
          },
          // Info Section
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'separator',
                margin: 'xl'
              },
              {
                type: 'text',
                text: '💡 Info',
                size: 'sm',
                weight: 'bold',
                color: '#15803D',
                margin: 'lg'
              },
              {
                type: 'text',
                text: 'Untuk pendaftaran siswa baru (PPDB), silakan hubungi:',
                size: 'xs',
                color: '#666666',
                wrap: true,
                margin: 'sm'
              },
              {
                type: 'button',
                action: {
                  type: 'uri',
                  label: '📱 WhatsApp PPDB',
                  uri: 'https://wa.me/6281234567890?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20PPDB'
                },
                style: 'primary',
                color: '#25D366',
                height: 'sm',
                margin: 'md'
              }
            ]
          }
        ],
        paddingAll: '15px',
        backgroundColor: '#FAFAF9'
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '© 2024 Pondok Imam Syafii Blitar',
            size: 'xxs',
            color: '#999999',
            align: 'center'
          },
          {
            type: 'text',
            text: 'Ketik "menu" untuk kembali ke menu utama',
            size: 'xxs',
            color: '#999999',
            align: 'center',
            margin: 'xs'
          }
        ],
        backgroundColor: '#F5F5F4',
        paddingAll: '10px'
      }
    }
  }
}

function createPublicMenuCard(icon: string, title: string, subtitle: string, action: string) {
  return {
    type: 'box',
    layout: 'vertical',
    contents: [
      {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: icon,
            size: 'xxl',
            align: 'center'
          },
          {
            type: 'text',
            text: title,
            size: 'xs',
            weight: 'bold',
            align: 'center',
            margin: 'sm',
            color: '#15803D'
          },
          {
            type: 'text',
            text: subtitle,
            size: 'xxs',
            align: 'center',
            color: '#666666'
          }
        ],
        backgroundColor: '#ECFCCB',
        cornerRadius: '12px',
        paddingAll: '12px',
        action: {
          type: 'postback',
          data: `action=${action}`
        }
      }
    ],
    flex: 1
  }
}

export function getProfileMenu() {
  return {
    type: 'flex',
    altText: 'Profil Pondok Imam Syafii',
    contents: {
      type: 'bubble',
      hero: {
        type: 'image',
        url: 'https://placehold.co/700x400/16A34A/FFFFFF/png?text=Pondok+Imam+Syafii',
        size: 'full',
        aspectRatio: '20:13',
        aspectMode: 'cover'
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '🕌 PROFIL PONDOK',
            weight: 'bold',
            size: 'xl',
            color: '#16A34A'
          },
          {
            type: 'separator',
            margin: 'md'
          },
          {
            type: 'text',
            text: 'Pondok Imam Syafii adalah lembaga pendidikan Islam yang berdiri sejak 1995 di Blitar, Jawa Timur.',
            wrap: true,
            margin: 'md',
            size: 'sm'
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            contents: [
              {
                type: 'text',
                text: '📍 Lokasi:',
                weight: 'bold',
                size: 'sm'
              },
              {
                type: 'text',
                text: 'Jl. Pendidikan No. 123, Blitar',
                size: 'xs',
                color: '#666666',
                margin: 'sm'
              }
            ]
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'md',
            contents: [
              {
                type: 'text',
                text: '👥 Jumlah Santri:',
                weight: 'bold',
                size: 'sm'
              },
              {
                type: 'text',
                text: '500+ santri aktif',
                size: 'xs',
                color: '#666666',
                margin: 'sm'
              }
            ]
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'md',
            contents: [
              {
                type: 'text',
                text: '🎯 Visi:',
                weight: 'bold',
                size: 'sm'
              },
              {
                type: 'text',
                text: 'Mencetak generasi Qurani yang berakhlak mulia',
                size: 'xs',
                color: '#666666',
                margin: 'sm',
                wrap: true
              }
            ]
          }
        ]
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'button',
            action: {
              type: 'uri',
              label: '🌐 Website',
              uri: 'https://pesantren-coconut.vercel.app'
            },
            style: 'primary',
            color: '#16A34A'
          },
          {
            type: 'button',
            action: {
              type: 'postback',
              label: '↩️ Kembali',
              data: 'action=back_to_public_menu'
            },
            style: 'link',
            margin: 'sm'
          }
        ]
      }
    }
  }
}

export function getPPDBInfo() {
  return {
    type: 'flex',
    altText: 'Informasi PPDB',
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '🎓 PPDB 2024/2025',
            weight: 'bold',
            size: 'lg',
            color: '#FFFFFF'
          },
          {
            type: 'text',
            text: 'Penerimaan Peserta Didik Baru',
            size: 'xs',
            color: '#FEF3C7'
          }
        ],
        backgroundColor: '#16A34A',
        paddingAll: '15px'
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '📅 Jadwal Pendaftaran',
            weight: 'bold',
            size: 'md',
            color: '#16A34A'
          },
          {
            type: 'separator',
            margin: 'sm'
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: 'Gelombang 1:',
                size: 'sm',
                flex: 2
              },
              {
                type: 'text',
                text: '1 Jan - 28 Feb 2024',
                size: 'sm',
                flex: 3,
                color: '#666666'
              }
            ],
            margin: 'md'
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: 'Gelombang 2:',
                size: 'sm',
                flex: 2
              },
              {
                type: 'text',
                text: '1 Mar - 30 Apr 2024',
                size: 'sm',
                flex: 3,
                color: '#666666'
              }
            ],
            margin: 'sm'
          },
          {
            type: 'text',
            text: '📋 Syarat Pendaftaran',
            weight: 'bold',
            size: 'md',
            color: '#16A34A',
            margin: 'lg'
          },
          {
            type: 'separator',
            margin: 'sm'
          },
          {
            type: 'text',
            text: '• Usia minimal 6 tahun\n• Fotocopy Akta Kelahiran\n• Fotocopy KK\n• Pas foto 3x4 (2 lembar)\n• Surat keterangan sehat',
            size: 'xs',
            color: '#666666',
            wrap: true,
            margin: 'md'
          },
          {
            type: 'text',
            text: '💰 Biaya Pendaftaran',
            weight: 'bold',
            size: 'md',
            color: '#16A34A',
            margin: 'lg'
          },
          {
            type: 'separator',
            margin: 'sm'
          },
          {
            type: 'text',
            text: 'Rp 200.000 (Formulir & Tes)',
            size: 'sm',
            color: '#666666',
            margin: 'md'
          }
        ],
        paddingAll: '15px'
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'button',
            action: {
              type: 'uri',
              label: '📱 Hubungi Panitia PPDB',
              uri: 'https://wa.me/6281234567890?text=Assalamualaikum,%20saya%20ingin%20mendaftar%20PPDB'
            },
            style: 'primary',
            color: '#25D366'
          },
          {
            type: 'button',
            action: {
              type: 'postback',
              label: '↩️ Kembali',
              data: 'action=back_to_public_menu'
            },
            style: 'link',
            margin: 'sm'
          }
        ]
      }
    }
  }
}