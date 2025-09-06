// Visual flex message templates with green-yellow branding

export function getMainFlexMenu() {
  return {
    type: 'flex',
    altText: 'Menu Utama Pondok Imam Syafii',
    contents: {
      type: 'bubble',
      size: 'mega',
      hero: {
        type: 'image',
        url: 'https://placehold.co/700x280/16A34A/FDE047/png?text=🕌+PONDOK+IMAM+SYAFII',
        size: 'full',
        aspectRatio: '20:8',
        aspectMode: 'cover'
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
                    type: 'filler'
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [],
                    cornerRadius: '30px',
                    height: '12px',
                    width: '12px',
                    borderColor: '#FDE047',
                    borderWidth: '2px'
                  },
                  {
                    type: 'filler'
                  }
                ],
                flex: 0
              },
              {
                type: 'text',
                text: 'MENU UTAMA',
                gravity: 'center',
                flex: 4,
                size: 'lg',
                weight: 'bold',
                color: '#FFFFFF'
              }
            ],
            spacing: 'lg'
          },
          {
            type: 'text',
            text: 'Pilih menu untuk mengelola data',
            size: 'xs',
            color: '#F0FDF4',
            margin: 'sm'
          }
        ],
        backgroundColor: '#16A34A',
        paddingAll: '20px',
        paddingTop: '22px'
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          // Row 1
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              // Siswa Card
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'text',
                        text: '👥',
                        size: 'xxl',
                        align: 'center'
                      },
                      {
                        type: 'text',
                        text: 'Data Siswa',
                        size: 'sm',
                        weight: 'bold',
                        align: 'center',
                        margin: 'sm',
                        color: '#15803D'
                      },
                      {
                        type: 'text',
                        text: 'Kelola data santri',
                        size: 'xxs',
                        align: 'center',
                        color: '#666666'
                      }
                    ],
                    backgroundColor: '#FEF3C7',
                    cornerRadius: '12px',
                    paddingAll: '15px',
                    action: {
                      type: 'postback',
                      data: 'action=menu_siswa'
                    }
                  }
                ],
                flex: 1
              },
              // Pengajar Button
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'button',
                    action: {
                      type: 'postback',
                      label: '👨‍🏫',
                      data: 'action=menu_pengajar'
                    },
                    height: 'sm',
                    style: 'primary',
                    color: '#9B59B6'
                  },
                  {
                    type: 'text',
                    text: 'Pengajar',
                    size: 'xs',
                    align: 'center',
                    margin: 'sm'
                  }
                ],
                flex: 1,
                margin: 'md'
              },
              // Keuangan Button
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'button',
                    action: {
                      type: 'postback',
                      label: '💰',
                      data: 'action=menu_keuangan'
                    },
                    height: 'sm',
                    style: 'primary',
                    color: '#E74C3C'
                  },
                  {
                    type: 'text',
                    text: 'Keuangan',
                    size: 'xs',
                    align: 'center',
                    margin: 'sm'
                  }
                ],
                flex: 1
              }
            ],
            margin: 'lg'
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              // Akademik Button
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'button',
                    action: {
                      type: 'postback',
                      label: '📚',
                      data: 'action=menu_akademik'
                    },
                    height: 'sm',
                    style: 'primary',
                    color: '#F39C12'
                  },
                  {
                    type: 'text',
                    text: 'Akademik',
                    size: 'xs',
                    align: 'center',
                    margin: 'sm'
                  }
                ],
                flex: 1
              },
              // Hafalan Button
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'button',
                    action: {
                      type: 'postback',
                      label: '📖',
                      data: 'action=menu_hafalan'
                    },
                    height: 'sm',
                    style: 'primary',
                    color: '#1ABC9C'
                  },
                  {
                    type: 'text',
                    text: 'Hafalan',
                    size: 'xs',
                    align: 'center',
                    margin: 'sm'
                  }
                ],
                flex: 1,
                margin: 'md'
              },
              // Settings Button
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'button',
                    action: {
                      type: 'postback',
                      label: '⚙️',
                      data: 'action=menu_settings'
                    },
                    height: 'sm',
                    style: 'secondary'
                  },
                  {
                    type: 'text',
                    text: 'Settings',
                    size: 'xs',
                    align: 'center',
                    margin: 'sm'
                  }
                ],
                flex: 1
              }
            ],
            margin: 'lg'
          }
        ],
        paddingAll: '10px'
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'Ketik "batal" untuk membatalkan proses',
            size: 'xxs',
            color: '#999999',
            align: 'center'
          }
        ],
        backgroundColor: '#F5F5F5',
        paddingAll: '10px'
      }
    }
  }
}

export function getSiswaFlexMenu() {
  return {
    type: 'flex',
    altText: 'Menu Data Siswa',
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '👥 DATA SISWA',
            weight: 'bold',
            size: 'md',
            color: '#FFFFFF'
          }
        ],
        backgroundColor: '#3498DB',
        paddingAll: '15px'
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'button',
            action: {
              type: 'postback',
              label: '➕ Tambah Siswa Baru',
              data: 'action=siswa_add'
            },
            style: 'primary',
            color: '#27AE60',
            margin: 'sm'
          },
          {
            type: 'button',
            action: {
              type: 'postback',
              label: '🔍 Cari Siswa',
              data: 'action=siswa_search'
            },
            style: 'secondary',
            margin: 'sm'
          },
          {
            type: 'button',
            action: {
              type: 'postback',
              label: '📋 Lihat Semua Siswa',
              data: 'action=siswa_list'
            },
            style: 'secondary',
            margin: 'sm'
          },
          {
            type: 'separator',
            margin: 'lg'
          },
          {
            type: 'button',
            action: {
              type: 'postback',
              label: '↩️ Kembali ke Menu',
              data: 'action=back_to_menu'
            },
            style: 'link'
          }
        ]
      }
    }
  }
}

export function getKeuanganFlexMenu() {
  return {
    type: 'flex',
    altText: 'Menu Keuangan',
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '💰 MENU KEUANGAN',
            weight: 'bold',
            size: 'md',
            color: '#FFFFFF'
          }
        ],
        backgroundColor: '#E74C3C',
        paddingAll: '15px'
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'button',
            action: {
              type: 'postback',
              label: '💳 Cek Tagihan SPP',
              data: 'action=spp_check'
            },
            style: 'primary',
            color: '#C0392B',
            margin: 'sm'
          },
          {
            type: 'button',
            action: {
              type: 'postback',
              label: '✅ Input Pembayaran',
              data: 'action=payment_input'
            },
            style: 'secondary',
            margin: 'sm'
          },
          {
            type: 'button',
            action: {
              type: 'postback',
              label: '📊 Laporan Keuangan',
              data: 'action=finance_report'
            },
            style: 'secondary',
            margin: 'sm'
          },
          {
            type: 'button',
            action: {
              type: 'postback',
              label: '📱 Kirim Tagihan WA',
              data: 'action=send_bill_wa'
            },
            style: 'secondary',
            margin: 'sm'
          },
          {
            type: 'separator',
            margin: 'lg'
          },
          {
            type: 'button',
            action: {
              type: 'postback',
              label: '↩️ Kembali',
              data: 'action=back_to_menu'
            },
            style: 'link'
          }
        ]
      }
    }
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
            size: 'sm',
            color: '#FFFFFF'
          }
        ],
        backgroundColor: '#34495E',
        paddingAll: '10px'
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: title,
            weight: 'bold',
            size: 'md',
            wrap: true
          },
          {
            type: 'text',
            text: hint,
            size: 'sm',
            color: '#666666',
            margin: 'sm',
            wrap: true
          },
          {
            type: 'separator',
            margin: 'lg'
          },
          {
            type: 'text',
            text: '💬 Silakan ketik jawaban Anda',
            size: 'xs',
            color: '#999999',
            margin: 'md'
          }
        ]
      },
      footer: {
        type: 'box',
        layout: 'horizontal',
        contents: [
          {
            type: 'button',
            action: {
              type: 'message',
              label: 'Batal',
              text: 'batal'
            },
            style: 'secondary',
            height: 'sm'
          }
        ]
      }
    }
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
        header: {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: student.name,
                  weight: 'bold',
                  size: 'sm',
                  color: '#FFFFFF'
                },
                {
                  type: 'text',
                  text: `NIS: ${student.nis}`,
                  size: 'xxs',
                  color: '#FFFFFF',
                  margin: 'xs'
                }
              ],
              flex: 1
            },
            {
              type: 'text',
              text: student.status === 'ACTIVE' ? '✅' : '❌',
              size: 'lg',
              align: 'end'
            }
          ],
          backgroundColor: student.status === 'ACTIVE' ? '#27AE60' : '#E74C3C',
          paddingAll: '10px'
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
                  text: 'Kelas:',
                  size: 'xs',
                  color: '#666666',
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
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  text: 'Wali:',
                  size: 'xs',
                  color: '#666666',
                  flex: 2
                },
                {
                  type: 'text',
                  text: student.parentName || '-',
                  size: 'xs',
                  flex: 3,
                  wrap: true
                }
              ],
              margin: 'sm'
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  text: 'HP:',
                  size: 'xs',
                  color: '#666666',
                  flex: 2
                },
                {
                  type: 'text',
                  text: student.parentPhone || '-',
                  size: 'xs',
                  flex: 3
                }
              ],
              margin: 'sm'
            }
          ],
          paddingAll: '10px'
        },
        footer: {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'button',
              action: {
                type: 'postback',
                label: '👁️',
                data: `action=siswa_detail&id=${student.id}`
              },
              style: 'primary',
              height: 'sm',
              flex: 1
            },
            {
              type: 'button',
              action: {
                type: 'postback',
                label: '✏️',
                data: `action=siswa_edit&id=${student.id}`
              },
              style: 'secondary',
              height: 'sm',
              flex: 1,
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
              flex: 1,
              color: '#E74C3C'
            }
          ],
          spacing: 'xs'
        }
      }))
    }
  }
}

export function getPengajarFlexMenu() {
  return getSiswaFlexMenu() // Similar structure, different actions
}

export function getAkademikFlexMenu() {
  return getSiswaFlexMenu() // Similar structure, different actions  
}

export function getSettingsFlexMenu() {
  return getSiswaFlexMenu() // Similar structure, different actions
}