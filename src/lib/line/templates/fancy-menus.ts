// Fancy flex message templates with green-yellow Islamic branding

export function getMainFlexMenu() {
  return {
    type: 'flex',
    altText: '🕌 Menu Utama Pondok Imam Syafii',
    contents: {
      type: 'bubble',
      size: 'giga',
      styles: {
        header: {
          separator: false
        }
      },
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'image',
                url: 'https://placehold.co/800x200/16A34A/FFFFFF/png?text=🕌',
                size: 'full',
                aspectMode: 'cover',
                aspectRatio: '4:1'
              }
            ],
            position: 'absolute',
            width: '100%',
            height: '100%'
          },
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
                size: 'xs',
                color: '#FDE047',
                align: 'center'
              },
              {
                type: 'text',
                text: 'PONDOK IMAM SYAFII',
                weight: 'bold',
                size: 'xl',
                color: '#FFFFFF',
                align: 'center',
                margin: 'md'
              },
              {
                type: 'text',
                text: '✨ Sistem Manajemen Terpadu ✨',
                size: 'sm',
                color: '#FEF3C7',
                align: 'center'
              }
            ],
            paddingAll: '20px',
            paddingTop: '30px'
          }
        ],
        height: '140px'
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          // Welcome text
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
                text: 'Pilih menu untuk melanjutkan:',
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
                  createMenuCard('👥', 'DATA SISWA', 'Kelola Santri', 'menu_siswa', '#ECFCCB'),
                  createMenuCard('👨‍🏫', 'PENGAJAR', 'Data Ustadz', 'menu_pengajar', '#FEF3C7')
                ],
                spacing: 'md',
                margin: 'lg'
              },
              // Row 2
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  createMenuCard('💰', 'KEUANGAN', 'SPP & Tagihan', 'menu_keuangan', '#FEE2E2'),
                  createMenuCard('📚', 'AKADEMIK', 'Nilai & Absen', 'menu_akademik', '#E0F2FE')
                ],
                spacing: 'md',
                margin: 'md'
              },
              // Row 3
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  createMenuCard('📖', 'HAFALAN', "Tahfidz Qur'an", 'menu_hafalan', '#F3E8FF'),
                  createMenuCard('⚙️', 'SETTINGS', 'Pengaturan', 'menu_settings', '#F3F4F6')
                ],
                spacing: 'md',
                margin: 'md'
              }
            ]
          },
          // Quick Actions
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
                text: '⚡ Aksi Cepat',
                size: 'sm',
                weight: 'bold',
                color: '#15803D',
                margin: 'lg'
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'button',
                    action: {
                      type: 'postback',
                      label: '🔍 Cari NIS',
                      data: 'action=quick_search'
                    },
                    style: 'primary',
                    color: '#16A34A',
                    height: 'sm'
                  },
                  {
                    type: 'button',
                    action: {
                      type: 'postback',
                      label: '💳 Cek SPP',
                      data: 'action=spp_check'
                    },
                    style: 'primary',
                    color: '#EAB308',
                    height: 'sm',
                    margin: 'sm'
                  }
                ],
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
            text: 'Ketik "batal" untuk membatalkan proses',
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

function createMenuCard(icon: string, title: string, subtitle: string, action: string, bgColor: string) {
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
        backgroundColor: bgColor,
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

export function getSiswaFlexMenu() {
  return {
    type: 'flex',
    altText: '📚 Menu Data Siswa',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'image',
                    url: 'https://placehold.co/50x50/FDE047/16A34A/png?text=👥',
                    size: 'xxs',
                    aspectMode: 'cover'
                  }
                ],
                width: '40px'
              },
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: 'DATA SISWA',
                    weight: 'bold',
                    size: 'lg',
                    color: '#FFFFFF'
                  },
                  {
                    type: 'text',
                    text: 'Manajemen Data Santri',
                    size: 'xs',
                    color: '#FEF3C7'
                  }
                ],
                margin: 'md'
              }
            ]
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
              createActionButton('➕ TAMBAH SISWA BARU', 'siswa_add', '#16A34A', 'primary'),
              createActionButton('🔍 CARI DATA SISWA', 'siswa_search', '#EAB308', 'primary'),
              createActionButton('📋 LIHAT SEMUA SISWA', 'siswa_list', '#3B82F6', 'primary'),
              createActionButton('📊 EXPORT DATA', 'siswa_export', '#8B5CF6', 'secondary'),
              createActionButton('📥 IMPORT DATA', 'siswa_import', '#EC4899', 'secondary')
            ],
            spacing: 'sm'
          },
          {
            type: 'separator',
            margin: 'xl'
          },
          {
            type: 'button',
            action: {
              type: 'postback',
              label: '↩️ Kembali ke Menu Utama',
              data: 'action=back_to_menu'
            },
            style: 'link',
            height: 'sm'
          }
        ],
        paddingAll: '20px',
        backgroundColor: '#FAFAF9'
      }
    }
  }
}

function createActionButton(label: string, action: string, color: string, style: string) {
  return {
    type: 'button',
    action: {
      type: 'postback',
      label: label,
      data: `action=${action}`
    },
    style: style,
    color: color,
    height: 'md',
    margin: 'sm'
  }
}

export function getStudentCarousel(students: any[]) {
  return {
    type: 'flex',
    altText: 'Daftar Siswa',
    contents: {
      type: 'carousel',
      contents: students.map(student => ({
        type: 'bubble',
        size: 'kilo',
        styles: {
          header: {
            backgroundColor: student.status === 'ACTIVE' ? '#16A34A' : '#DC2626'
          }
        },
        header: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'image',
                      url: `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=FDE047&color=16A34A&bold=true`,
                      size: 'sm',
                      aspectMode: 'cover'
                    }
                  ],
                  width: '60px'
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: student.name,
                      weight: 'bold',
                      size: 'sm',
                      color: '#FFFFFF',
                      wrap: true
                    },
                    {
                      type: 'text',
                      text: `NIS: ${student.nis}`,
                      size: 'xxs',
                      color: '#FEF3C7'
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: student.status === 'ACTIVE' ? '✅ Aktif' : '❌ Non-Aktif',
                          size: 'xxs',
                          color: '#FFFFFF',
                          weight: 'bold'
                        }
                      ],
                      backgroundColor: student.status === 'ACTIVE' ? '#059669' : '#B91C1C',
                      cornerRadius: '4px',
                      paddingAll: '2px',
                      paddingStart: '4px',
                      paddingEnd: '4px',
                      margin: 'sm'
                    }
                  ],
                  margin: 'md'
                }
              ]
            }
          ],
          paddingAll: '12px'
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            createInfoRow('📚 Kelas', student.class || '-'),
            createInfoRow('👤 Wali', student.parentName || '-'),
            createInfoRow('📱 HP', student.parentPhone || '-'),
            createInfoRow('🏠 Alamat', student.address || '-', true)
          ],
          spacing: 'sm',
          paddingAll: '12px'
        },
        footer: {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'button',
              action: {
                type: 'postback',
                label: 'Detail',
                data: `action=siswa_detail&id=${student.id}`
              },
              style: 'primary',
              color: '#16A34A',
              height: 'sm',
              flex: 2
            },
            {
              type: 'separator',
              margin: 'sm'
            },
            {
              type: 'button',
              action: {
                type: 'postback',
                label: 'Edit',
                data: `action=siswa_edit&id=${student.id}`
              },
              style: 'secondary',
              height: 'sm',
              flex: 2
            },
            {
              type: 'separator',
              margin: 'sm'
            },
            {
              type: 'button',
              action: {
                type: 'postback',
                label: '🗑️',
                data: `action=siswa_delete&id=${student.id}`
              },
              style: 'secondary',
              height: 'sm',
              flex: 1
            }
          ],
          spacing: 'xs',
          margin: 'sm'
        }
      }))
    }
  }
}

function createInfoRow(label: string, value: string, wrap: boolean = false) {
  return {
    type: 'box',
    layout: 'horizontal',
    contents: [
      {
        type: 'text',
        text: label,
        size: 'xs',
        color: '#666666',
        flex: 2
      },
      {
        type: 'text',
        text: value,
        size: 'xs',
        flex: 3,
        wrap: wrap
      }
    ]
  }
}

export function getInputPrompt(title: string, hint: string) {
  return {
    type: 'flex',
    altText: title,
    contents: {
      type: 'bubble',
      size: 'kilo',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '📝 INPUT DATA',
            weight: 'bold',
            size: 'md',
            color: '#FFFFFF'
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
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: title,
                weight: 'bold',
                size: 'lg',
                wrap: true,
                color: '#15803D'
              },
              {
                type: 'text',
                text: hint,
                size: 'sm',
                color: '#666666',
                margin: 'md',
                wrap: true
              }
            ],
            backgroundColor: '#FEF3C7',
            cornerRadius: '8px',
            paddingAll: '12px'
          },
          {
            type: 'separator',
            margin: 'xl'
          },
          {
            type: 'text',
            text: '💬 Ketik jawaban Anda di bawah',
            size: 'sm',
            color: '#16A34A',
            weight: 'bold',
            margin: 'md'
          },
          {
            type: 'text',
            text: 'atau ketik "batal" untuk membatalkan',
            size: 'xs',
            color: '#999999',
            margin: 'sm'
          }
        ],
        paddingAll: '20px'
      }
    }
  }
}

// Export functions for other menus
export function getKeuanganFlexMenu() {
  return getSiswaFlexMenu() // Will customize later
}

export function getPengajarFlexMenu() {
  return getSiswaFlexMenu() // Will customize later
}

export function getAkademikFlexMenu() {
  return getSiswaFlexMenu() // Will customize later
}

export function getSettingsFlexMenu() {
  return getSiswaFlexMenu() // Will customize later
}