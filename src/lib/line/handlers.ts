import { LineEvent } from '@/types/line'
import { replyMessage } from './client'
import { 
  getMainMenu,
  getSiswaMenu,
  getPengajarMenu,
  getKeuanganMenu,
  getAkademikMenu,
  getSettingsMenu
} from './templates/menus'
import {
  handleSiswaCommand,
  handlePengajarCommand,
  handleKeuanganCommand,
  handleAkademikCommand,
  handleSettingsCommand
} from './commands'
import { getUserSession, setUserSession } from './session'

// Keywords mapping
const KEYWORDS = {
  // Main menu
  'menu': 'MAIN_MENU',
  'help': 'MAIN_MENU',
  'bantuan': 'MAIN_MENU',
  
  // Siswa management
  'siswa': 'SISWA_MENU',
  'murid': 'SISWA_MENU',
  'santri': 'SISWA_MENU',
  'tambah siswa': 'SISWA_ADD',
  'cari siswa': 'SISWA_SEARCH',
  'list siswa': 'SISWA_LIST',
  'edit siswa': 'SISWA_EDIT',
  'hapus siswa': 'SISWA_DELETE',
  
  // Pengajar management
  'pengajar': 'PENGAJAR_MENU',
  'guru': 'PENGAJAR_MENU',
  'ustadz': 'PENGAJAR_MENU',
  'tambah pengajar': 'PENGAJAR_ADD',
  'list pengajar': 'PENGAJAR_LIST',
  
  // Keuangan
  'keuangan': 'KEUANGAN_MENU',
  'spp': 'SPP_CHECK',
  'bayar': 'PAYMENT_MENU',
  'tagihan': 'BILL_CHECK',
  'laporan keuangan': 'FINANCE_REPORT',
  
  // Akademik
  'akademik': 'AKADEMIK_MENU',
  'nilai': 'GRADE_MENU',
  'absensi': 'ATTENDANCE_MENU',
  'jadwal': 'SCHEDULE_MENU',
  'raport': 'REPORT_CARD',
  
  // Settings
  'settings': 'SETTINGS_MENU',
  'pengaturan': 'SETTINGS_MENU',
  'profile': 'PROFILE_MENU',
  
  // Quick actions
  'hadir': 'QUICK_ATTENDANCE',
  'izin': 'QUICK_PERMISSION',
  'sakit': 'QUICK_SICK',
  
  // Cancel/Reset
  'batal': 'CANCEL',
  'cancel': 'CANCEL',
  'reset': 'RESET'
}

export async function handleTextMessage(event: LineEvent) {
  const text = event.message?.text?.toLowerCase() || ''
  const userId = event.source?.userId || ''
  const replyToken = event.replyToken || ''
  
  // Get user session
  const session = await getUserSession(userId)
  
  // Check if user is in the middle of a flow
  if (session?.currentFlow) {
    return await handleFlowInput(userId, text, replyToken, session)
  }
  
  // Check for keywords
  const command = KEYWORDS[text as keyof typeof KEYWORDS]
  
  if (command) {
    return await handleCommand(command, userId, replyToken)
  }
  
  // Check for NIS input (8 digits)
  if (/^\d{8}$/.test(text)) {
    return await handleNISInput(text, userId, replyToken)
  }
  
  // Default response
  await replyMessage(replyToken, [{
    type: 'text',
    text: 'Maaf, perintah tidak dikenali. Ketik "menu" untuk melihat menu utama.'
  }])
}

async function handleCommand(command: string, userId: string, replyToken: string) {
  switch (command) {
    case 'MAIN_MENU':
      await replyMessage(replyToken, [getMainMenu()])
      break
      
    case 'SISWA_MENU':
      await replyMessage(replyToken, [getSiswaMenu()])
      break
      
    case 'SISWA_ADD':
      await setUserSession(userId, { currentFlow: 'SISWA_ADD', step: 1, data: {} })
      await replyMessage(replyToken, [{
        type: 'text',
        text: 'Silakan masukkan data siswa:\n\n1. Nama Lengkap:'
      }])
      break
      
    case 'SISWA_SEARCH':
      await setUserSession(userId, { currentFlow: 'SISWA_SEARCH', step: 1, data: {} })
      await replyMessage(replyToken, [{
        type: 'text',
        text: 'Masukkan NIS atau nama siswa yang ingin dicari:'
      }])
      break
      
    case 'SISWA_LIST':
      await handleSiswaCommand.list(userId, replyToken)
      break
      
    case 'PENGAJAR_MENU':
      await replyMessage(replyToken, [getPengajarMenu()])
      break
      
    case 'KEUANGAN_MENU':
      await replyMessage(replyToken, [getKeuanganMenu()])
      break
      
    case 'SPP_CHECK':
      await setUserSession(userId, { currentFlow: 'SPP_CHECK', step: 1, data: {} })
      await replyMessage(replyToken, [{
        type: 'text',
        text: 'Masukkan NIS siswa untuk cek tagihan SPP:'
      }])
      break
      
    case 'AKADEMIK_MENU':
      await replyMessage(replyToken, [getAkademikMenu()])
      break
      
    case 'SETTINGS_MENU':
      await replyMessage(replyToken, [getSettingsMenu()])
      break
      
    case 'CANCEL':
    case 'RESET':
      await setUserSession(userId, null)
      await replyMessage(replyToken, [{
        type: 'text',
        text: 'Proses dibatalkan. Ketik "menu" untuk kembali ke menu utama.'
      }])
      break
      
    default:
      await replyMessage(replyToken, [{
        type: 'text',
        text: 'Fitur sedang dalam pengembangan.'
      }])
  }
}

async function handleFlowInput(userId: string, input: string, replyToken: string, session: any) {
  const { currentFlow, step, data } = session
  
  switch (currentFlow) {
    case 'SISWA_ADD':
      await handleSiswaAddFlow(userId, input, replyToken, step, data)
      break
      
    case 'SISWA_SEARCH':
      await handleSiswaSearchFlow(userId, input, replyToken, step, data)
      break
      
    case 'SPP_CHECK':
      await handleSPPCheckFlow(userId, input, replyToken, step, data)
      break
      
    default:
      await setUserSession(userId, null)
      await replyMessage(replyToken, [{
        type: 'text',
        text: 'Terjadi kesalahan. Silakan coba lagi.'
      }])
  }
}

async function handleSiswaAddFlow(userId: string, input: string, replyToken: string, step: number, data: any) {
  const fields = ['name', 'nis', 'birthDate', 'gender', 'parentPhone']
  const prompts = [
    '2. NIS (8 digit):',
    '3. Tanggal Lahir (DD/MM/YYYY):',
    '4. Jenis Kelamin (L/P):',
    '5. No. HP Orang Tua:',
    'Data siswa berhasil ditambahkan!'
  ]
  
  // Store input
  data[fields[step - 1]] = input
  
  if (step < fields.length) {
    // Continue to next field
    await setUserSession(userId, { currentFlow: 'SISWA_ADD', step: step + 1, data })
    await replyMessage(replyToken, [{
      type: 'text',
      text: prompts[step - 1]
    }])
  } else {
    // Complete flow - save to database
    await handleSiswaCommand.create(data, userId, replyToken)
    await setUserSession(userId, null)
  }
}

async function handleSiswaSearchFlow(userId: string, input: string, replyToken: string, step: number, data: any) {
  await handleSiswaCommand.search(input, userId, replyToken)
  await setUserSession(userId, null)
}

async function handleSPPCheckFlow(userId: string, input: string, replyToken: string, step: number, data: any) {
  await handleKeuanganCommand.checkSPP(input, userId, replyToken)
  await setUserSession(userId, null)
}

async function handleNISInput(nis: string, userId: string, replyToken: string) {
  // Auto search student by NIS
  await handleSiswaCommand.getByNIS(nis, userId, replyToken)
}

export async function handlePostbackEvent(event: LineEvent) {
  const data = event.postback?.data || ''
  const userId = event.source?.userId || ''
  const replyToken = event.replyToken || ''
  
  // Parse postback data (format: action=value&param=value)
  const params = new URLSearchParams(data)
  const action = params.get('action')
  
  switch (action) {
    case 'siswa_detail':
      const siswaId = params.get('id')
      await handleSiswaCommand.getDetail(siswaId!, userId, replyToken)
      break
      
    case 'siswa_edit':
      const editId = params.get('id')
      await setUserSession(userId, { currentFlow: 'SISWA_EDIT', step: 1, data: { id: editId } })
      await replyMessage(replyToken, [{
        type: 'text',
        text: 'Pilih field yang ingin diedit:\n1. Nama\n2. Tanggal Lahir\n3. No. HP Orang Tua\n\nKetik nomor pilihan:'
      }])
      break
      
    case 'siswa_delete':
      const deleteId = params.get('id')
      await handleSiswaCommand.confirmDelete(deleteId!, userId, replyToken)
      break
      
    case 'confirm_delete':
      const confirmId = params.get('id')
      await handleSiswaCommand.delete(confirmId!, userId, replyToken)
      break
      
    case 'payment_detail':
      const paymentId = params.get('id')
      await handleKeuanganCommand.getPaymentDetail(paymentId!, userId, replyToken)
      break
      
    case 'mark_paid':
      const billId = params.get('id')
      await handleKeuanganCommand.markAsPaid(billId!, userId, replyToken)
      break
      
    default:
      await replyMessage(replyToken, [{
        type: 'text',
        text: 'Action tidak dikenali.'
      }])
  }
}

export async function handleFollowEvent(event: LineEvent) {
  const userId = event.source?.userId || ''
  const replyToken = event.replyToken || ''
  
  await replyMessage(replyToken, [
    {
      type: 'text',
      text: 'Selamat datang di Pondok Imam Syafii Bot! 🎓\n\nSaya akan membantu Anda mengelola data sekolah dengan mudah.'
    },
    getMainMenu()
  ])
}

export async function handleUnfollowEvent(event: LineEvent) {
  const userId = event.source?.userId || ''
  // Clean up user session
  await setUserSession(userId, null)
}