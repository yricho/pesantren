// Visual flex message templates for LINE bot

export function getMainFlexMenu() {
  return {
    type: 'flex',
    altText: 'Menu Utama',
    contents: {
      type: 'bubble',
      hero: {
        type: 'image',
        url: 'https://placehold.co/700x400/27AE60/FFFFFF/png?text=Pondok+Imam+Syafii',
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
            text: 'Menu Utama',
            weight: 'bold',
            size: 'xl',
            margin: 'md'
          },
          {
            type: 'text',
            text: 'Pilih menu yang ingin Anda akses:',
            size: 'xs',
            color: '#999999',
            margin: 'md'
          },
          {
            type: 'separator',
            margin: 'lg'
          }
        ]
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            height: 'sm',
            action: {
              type: 'message',
              label: '👥 Data Siswa',
              text: 'siswa'
            },
            color: '#27AE60'
          },
          {
            type: 'button',
            style: 'primary',
            height: 'sm',
            action: {
              type: 'message',
              label: '👨‍🏫 Data Pengajar',
              text: 'pengajar'
            },
            color: '#3498DB'
          },
          {
            type: 'button',
            style: 'primary',
            height: 'sm',
            action: {
              type: 'message',
              label: '💰 Keuangan',
              text: 'keuangan'
            },
            color: '#E74C3C'
          },
          {
            type: 'button',
            style: 'primary',
            height: 'sm',
            action: {
              type: 'message',
              label: '📚 Akademik',
              text: 'akademik'
            },
            color: '#9B59B6'
          },
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'message',
              label: '⚙️ Pengaturan',
              text: 'settings'
            }
          }
        ]
      }
    }
  }
}

export function getSiswaMenu() {
  return {
    type: 'flex',
    altText: 'Menu Data Siswa',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'Data Siswa',
            weight: 'bold',
            size: 'xl'
          },
          {
            type: 'text',
            text: 'Kelola data siswa/santri',
            size: 'sm',
            color: '#999999',
            margin: 'md'
          },
          {
            type: 'separator',
            margin: 'lg'
          }
        ]
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            action: {
              type: 'message',
              label: '➕ Tambah Siswa',
              text: 'tambah siswa'
            }
          },
          {
            type: 'button',
            style: 'secondary',
            action: {
              type: 'message',
              label: '🔍 Cari Siswa',
              text: 'cari siswa'
            }
          },
          {
            type: 'button',
            style: 'secondary',
            action: {
              type: 'message',
              label: '📋 List Siswa',
              text: 'list siswa'
            }
          },
          {
            type: 'button',
            action: {
              type: 'message',
              label: '↩️ Menu Utama',
              text: 'menu'
            }
          }
        ]
      }
    }
  }
}

export function getSiswaCarousel(students: any[]) {
  return {
    type: 'flex',
    altText: 'Daftar Siswa',
    contents: {
      type: 'carousel',
      contents: students.map(student => ({
        type: 'bubble',
        size: 'micro',
        header: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: student.name,
              weight: 'bold',
              size: 'sm'
            }
          ],
          backgroundColor: '#27AE60',
          paddingAll: '10px'
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'box',
              layout: 'baseline',
              contents: [
                {
                  type: 'text',
                  text: 'NIS:',
                  size: 'xs',
                  flex: 2
                },
                {
                  type: 'text',
                  text: student.nis,
                  size: 'xs',
                  flex: 3
                }
              ]
            },
            {
              type: 'box',
              layout: 'baseline',
              contents: [
                {
                  type: 'text',
                  text: 'Kelas:',
                  size: 'xs',
                  flex: 2
                },
                {
                  type: 'text',
                  text: student.class || '-',
                  size: 'xs',
                  flex: 3
                }
              ]
            },
            {
              type: 'box',
              layout: 'baseline',
              contents: [
                {
                  type: 'text',
                  text: 'Status:',
                  size: 'xs',
                  flex: 2
                },
                {
                  type: 'text',
                  text: student.status,
                  size: 'xs',
                  flex: 3,
                  color: student.status === 'ACTIVE' ? '#27AE60' : '#E74C3C'
                }
              ]
            }
          ],
          spacing: 'sm',
          paddingAll: '10px'
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'button',
              style: 'primary',
              height: 'sm',
              action: {
                type: 'postback',
                label: 'Detail',
                data: `action=siswa_detail&id=${student.id}`
              }
            },
            {
              type: 'button',
              height: 'sm',
              action: {
                type: 'postback',
                label: 'Edit',
                data: `action=siswa_edit&id=${student.id}`
              }
            }
          ],
          spacing: 'xs'
        }
      }))
    }
  }
}

export function getSiswaDetail(student: any) {
  return {
    type: 'flex',
    altText: `Detail Siswa: ${student.fullName || student.name}`,
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'Detail Siswa',
            weight: 'bold',
            size: 'lg',
            color: '#FFFFFF'
          }
        ],
        backgroundColor: '#27AE60',
        paddingAll: '15px'
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: 'Nama:',
                weight: 'bold',
                size: 'sm',
                flex: 3
              },
              {
                type: 'text',
                text: student.name,
                size: 'sm',
                flex: 5
              }
            ]
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: 'NIS:',
                weight: 'bold',
                size: 'sm',
                flex: 3
              },
              {
                type: 'text',
                text: student.nis,
                size: 'sm',
                flex: 5
              }
            ]
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: 'TTL:',
                weight: 'bold',
                size: 'sm',
                flex: 3
              },
              {
                type: 'text',
                text: `${student.birthPlace}, ${student.birthDate}`,
                size: 'sm',
                flex: 5,
                wrap: true
              }
            ]
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: 'Kelas:',
                weight: 'bold',
                size: 'sm',
                flex: 3
              },
              {
                type: 'text',
                text: student.class || '-',
                size: 'sm',
                flex: 5
              }
            ]
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: 'Alamat:',
                weight: 'bold',
                size: 'sm',
                flex: 3
              },
              {
                type: 'text',
                text: student.address || '-',
                size: 'sm',
                flex: 5,
                wrap: true
              }
            ]
          },
          {
            type: 'separator',
            margin: 'md'
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: 'Wali:',
                weight: 'bold',
                size: 'sm',
                flex: 3
              },
              {
                type: 'text',
                text: student.parentName || '-',
                size: 'sm',
                flex: 5
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
                text: 'HP Wali:',
                weight: 'bold',
                size: 'sm',
                flex: 3
              },
              {
                type: 'text',
                text: student.parentPhone || '-',
                size: 'sm',
                flex: 5
              }
            ]
          }
        ],
        spacing: 'sm'
      },
      footer: {
        type: 'box',
        layout: 'horizontal',
        contents: [
          {
            type: 'button',
            style: 'primary',
            action: {
              type: 'postback',
              label: '✏️ Edit',
              data: `action=siswa_edit&id=${student.id}`
            }
          },
          {
            type: 'button',
            style: 'secondary',
            action: {
              type: 'postback',
              label: '🗑️ Hapus',
              data: `action=siswa_delete&id=${student.id}`
            },
            color: '#E74C3C'
          }
        ],
        spacing: 'sm'
      }
    }
  }
}

export function getPengajarMenu() {
  return {
    type: 'flex',
    altText: 'Menu Data Pengajar',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'Data Pengajar',
            weight: 'bold',
            size: 'xl'
          },
          {
            type: 'text',
            text: 'Kelola data guru/ustadz',
            size: 'sm',
            color: '#999999',
            margin: 'md'
          }
        ]
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            action: {
              type: 'message',
              label: '➕ Tambah Pengajar',
              text: 'tambah pengajar'
            }
          },
          {
            type: 'button',
            style: 'secondary',
            action: {
              type: 'message',
              label: '📋 List Pengajar',
              text: 'list pengajar'
            }
          },
          {
            type: 'button',
            action: {
              type: 'message',
              label: '↩️ Kembali',
              text: 'menu'
            }
          }
        ]
      }
    }
  }
}

export function getKeuanganMenu() {
  return {
    type: 'flex',
    altText: 'Menu Keuangan',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'Menu Keuangan',
            weight: 'bold',
            size: 'xl'
          },
          {
            type: 'text',
            text: 'Kelola pembayaran dan keuangan',
            size: 'sm',
            color: '#999999',
            margin: 'md'
          }
        ]
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            action: {
              type: 'message',
              label: '💳 Cek Tagihan SPP',
              text: 'spp'
            },
            color: '#E74C3C'
          },
          {
            type: 'button',
            style: 'secondary',
            action: {
              type: 'message',
              label: '💰 Input Pembayaran',
              text: 'bayar'
            }
          },
          {
            type: 'button',
            style: 'secondary',
            action: {
              type: 'message',
              label: '📊 Laporan Keuangan',
              text: 'laporan keuangan'
            }
          },
          {
            type: 'button',
            action: {
              type: 'message',
              label: '↩️ Kembali',
              text: 'menu'
            }
          }
        ]
      }
    }
  }
}

export function getAkademikMenu() {
  return {
    type: 'flex',
    altText: 'Menu Akademik',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'Menu Akademik',
            weight: 'bold',
            size: 'xl'
          },
          {
            type: 'text',
            text: 'Kelola nilai, absensi, jadwal',
            size: 'sm',
            color: '#999999',
            margin: 'md'
          }
        ]
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            action: {
              type: 'message',
              label: '📝 Input Nilai',
              text: 'nilai'
            },
            color: '#9B59B6'
          },
          {
            type: 'button',
            style: 'secondary',
            action: {
              type: 'message',
              label: '✅ Absensi',
              text: 'absensi'
            }
          },
          {
            type: 'button',
            style: 'secondary',
            action: {
              type: 'message',
              label: '📅 Jadwal Pelajaran',
              text: 'jadwal'
            }
          },
          {
            type: 'button',
            style: 'secondary',
            action: {
              type: 'message',
              label: '📋 Raport',
              text: 'raport'
            }
          },
          {
            type: 'button',
            action: {
              type: 'message',
              label: '↩️ Kembali',
              text: 'menu'
            }
          }
        ]
      }
    }
  }
}

export function getSettingsMenu() {
  return {
    type: 'flex',
    altText: 'Menu Pengaturan',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'Pengaturan',
            weight: 'bold',
            size: 'xl'
          },
          {
            type: 'text',
            text: 'Kelola profil dan preferensi',
            size: 'sm',
            color: '#999999',
            margin: 'md'
          }
        ]
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'secondary',
            action: {
              type: 'message',
              label: '👤 Profil Saya',
              text: 'profile'
            }
          },
          {
            type: 'button',
            style: 'secondary',
            action: {
              type: 'message',
              label: '🔔 Notifikasi',
              text: 'notifikasi'
            }
          },
          {
            type: 'button',
            action: {
              type: 'message',
              label: '↩️ Kembali',
              text: 'menu'
            }
          }
        ]
      }
    }
  }
}