/**
 * Admin Menu Templates for LINE Bot
 * Untuk admin yayasan - Full CRUD access
 */

export function getAdminMainMenu() {
  return {
    type: 'flex',
    altText: '🔐 Admin Panel - Pondok Imam Syafii',
    contents: {
      type: 'bubble',
      size: 'giga',
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
                url: 'https://placehold.co/800x200/DC2626/FFFFFF/png?text=🔐+ADMIN+PANEL',
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
                text: '⚡ ADMINISTRATOR',
                size: 'xs',
                color: '#FEE2E2',
                align: 'center'
              },
              {
                type: 'text',
                text: 'SISTEM MANAJEMEN',
                weight: 'bold',
                size: 'xl',
                color: '#FFFFFF',
                align: 'center',
                margin: 'md'
              },
              {
                type: 'text',
                text: '🛡️ Full Access Control',
                size: 'sm',
                color: '#FECACA',
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
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '👋 Admin Mode Active',
                size: 'md',
                weight: 'bold',
                color: '#DC2626',
                align: 'center'
              },
              {
                type: 'text',
                text: 'Pilih modul yang ingin dikelola:',
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
              // Row 1 - Data Management
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  createAdminMenuCard('👥', 'SISWA', 'CRUD Santri', 'admin_students', '#FEE2E2'),
                  createAdminMenuCard('👨‍🏫', 'PENGAJAR', 'CRUD Ustadz', 'admin_teachers', '#FEF3C7')
                ],
                spacing: 'md',
                margin: 'lg'
              },
              // Row 2 - Financial
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  createAdminMenuCard('💰', 'KEUANGAN', 'SPP & Payment', 'admin_finance', '#E0F2FE'),
                  createAdminMenuCard('📊', 'LAPORAN', 'Reports', 'admin_reports', '#F3E8FF')
                ],
                spacing: 'md',
                margin: 'md'
              },
              // Row 3 - Academic
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  createAdminMenuCard('📚', 'AKADEMIK', 'Nilai & Absen', 'admin_academic', '#ECFCCB'),
                  createAdminMenuCard('🏫', 'KELAS', 'Manage Kelas', 'admin_classes', '#FED7AA')
                ],
                spacing: 'md',
                margin: 'md'
              },
              // Row 4 - System
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  createAdminMenuCard('📢', 'BROADCAST', 'Kirim Pesan', 'admin_broadcast', '#DBEAFE'),
                  createAdminMenuCard('⚙️', 'SYSTEM', 'Settings', 'admin_settings', '#F3F4F6')
                ],
                spacing: 'md',
                margin: 'md'
              }
            ]
          },
          // Quick Stats
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
                text: '📈 Quick Stats',
                size: 'sm',
                weight: 'bold',
                color: '#DC2626',
                margin: 'lg'
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    text: 'Total Siswa:',
                    size: 'xs',
                    flex: 1
                  },
                  {
                    type: 'text',
                    text: '524',
                    size: 'xs',
                    weight: 'bold',
                    flex: 1,
                    align: 'end'
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
                    text: 'Pending SPP:',
                    size: 'xs',
                    flex: 1
                  },
                  {
                    type: 'text',
                    text: '47',
                    size: 'xs',
                    weight: 'bold',
                    color: '#DC2626',
                    flex: 1,
                    align: 'end'
                  }
                ],
                margin: 'xs'
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
            type: 'button',
            action: {
              type: 'postback',
              label: '🚪 Logout Admin',
              data: 'action=admin_logout'
            },
            style: 'secondary',
            color: '#DC2626',
            height: 'sm'
          },
          {
            type: 'text',
            text: 'Admin Session Active',
            size: 'xxs',
            color: '#DC2626',
            align: 'center',
            margin: 'md'
          }
        ],
        backgroundColor: '#FEF2F2',
        paddingAll: '10px'
      }
    }
  }
}

function createAdminMenuCard(icon: string, title: string, subtitle: string, action: string, bgColor: string) {
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
            color: '#DC2626'
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

export function getStudentManagementMenu() {
  return {
    type: 'flex',
    altText: '👥 Manajemen Siswa',
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '👥 MANAJEMEN SISWA',
            weight: 'bold',
            size: 'lg',
            color: '#FFFFFF'
          },
          {
            type: 'text',
            text: 'Full CRUD Access',
            size: 'xs',
            color: '#FEE2E2'
          }
        ],
        backgroundColor: '#DC2626',
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
              data: 'action=flow_add_student'
            },
            style: 'primary',
            color: '#16A34A',
            height: 'md'
          },
          {
            type: 'button',
            action: {
              type: 'postback',
              label: '🔍 Cari Siswa',
              data: 'action=flow_search_student'
            },
            style: 'primary',
            color: '#3B82F6',
            height: 'md',
            margin: 'sm'
          },
          {
            type: 'button',
            action: {
              type: 'postback',
              label: '📋 List Semua Siswa',
              data: 'action=admin_list_students'
            },
            style: 'primary',
            color: '#8B5CF6',
            height: 'md',
            margin: 'sm'
          },
          {
            type: 'button',
            action: {
              type: 'postback',
              label: '✏️ Edit Data Siswa',
              data: 'action=flow_edit_student'
            },
            style: 'primary',
            color: '#EAB308',
            height: 'md',
            margin: 'sm'
          },
          {
            type: 'button',
            action: {
              type: 'postback',
              label: '🗑️ Hapus Siswa',
              data: 'action=flow_delete_student'
            },
            style: 'secondary',
            color: '#DC2626',
            height: 'md',
            margin: 'sm'
          },
          {
            type: 'separator',
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
                  label: '📥 Import',
                  data: 'action=admin_import_students'
                },
                style: 'secondary',
                height: 'sm'
              },
              {
                type: 'button',
                action: {
                  type: 'postback',
                  label: '📤 Export',
                  data: 'action=admin_export_students'
                },
                style: 'secondary',
                height: 'sm',
                margin: 'sm'
              }
            ],
            margin: 'md'
          },
          {
            type: 'button',
            action: {
              type: 'postback',
              label: '↩️ Kembali ke Admin Menu',
              data: 'action=back_to_admin_menu'
            },
            style: 'link',
            height: 'sm',
            margin: 'lg'
          }
        ],
        paddingAll: '15px'
      }
    }
  }
}

export function getFinanceManagementMenu() {
  return {
    type: 'flex',
    altText: '💰 Manajemen Keuangan',
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '💰 MANAJEMEN KEUANGAN',
            weight: 'bold',
            size: 'lg',
            color: '#FFFFFF'
          },
          {
            type: 'text',
            text: 'SPP & Pembayaran',
            size: 'xs',
            color: '#FEE2E2'
          }
        ],
        backgroundColor: '#DC2626',
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
              label: '📝 Buat Tagihan Baru',
              data: 'action=admin_create_bill'
            },
            style: 'primary',
            color: '#16A34A',
            height: 'md'
          },
          {
            type: 'button',
            action: {
              type: 'postback',
              label: '💳 Cek Status SPP',
              data: 'action=admin_check_spp'
            },
            style: 'primary',
            color: '#3B82F6',
            height: 'md',
            margin: 'sm'
          },
          {
            type: 'button',
            action: {
              type: 'postback',
              label: '✅ Konfirmasi Pembayaran',
              data: 'action=admin_confirm_payment'
            },
            style: 'primary',
            color: '#10B981',
            height: 'md',
            margin: 'sm'
          },
          {
            type: 'button',
            action: {
              type: 'postback',
              label: '📊 Laporan Keuangan',
              data: 'action=admin_finance_report'
            },
            style: 'primary',
            color: '#8B5CF6',
            height: 'md',
            margin: 'sm'
          },
          {
            type: 'button',
            action: {
              type: 'postback',
              label: '⚠️ List Tunggakan',
              data: 'action=admin_list_arrears'
            },
            style: 'secondary',
            color: '#EF4444',
            height: 'md',
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
              label: '↩️ Kembali ke Admin Menu',
              data: 'action=back_to_admin_menu'
            },
            style: 'link',
            height: 'sm',
            margin: 'md'
          }
        ],
        paddingAll: '15px'
      }
    }
  }
}

export function getAdminConfirmation(message: string, confirmAction: string) {
  return {
    type: 'flex',
    altText: 'Konfirmasi Admin',
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '⚠️ KONFIRMASI ADMIN',
            weight: 'bold',
            color: '#FFFFFF'
          }
        ],
        backgroundColor: '#DC2626',
        paddingAll: '15px'
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: message,
            wrap: true,
            size: 'sm'
          }
        ],
        paddingAll: '15px'
      },
      footer: {
        type: 'box',
        layout: 'horizontal',
        contents: [
          {
            type: 'button',
            action: {
              type: 'postback',
              label: '✅ Ya, Lanjutkan',
              data: confirmAction
            },
            style: 'primary',
            color: '#16A34A'
          },
          {
            type: 'button',
            action: {
              type: 'postback',
              label: '❌ Batal',
              data: 'action=cancel'
            },
            style: 'secondary',
            margin: 'sm'
          }
        ],
        paddingAll: '10px'
      }
    }
  }
}