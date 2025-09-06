import { LineEvent } from '@/types/line'
import { replyMessage } from './client'
import { 
  getMainFlexMenu,
  getSiswaFlexMenu,
  getPengajarFlexMenu,
  getKeuanganFlexMenu,
  getAkademikFlexMenu,
  getSettingsFlexMenu,
  getInputPrompt,
  getStudentCarousel
} from './templates/fancy-menus'
import {
  handleSiswaCommand,
  handlePengajarCommand,
  handleKeuanganCommand,
  handleAkademikCommand,
  handleSettingsCommand
} from './commands'
import { getUserSession, setUserSession } from './session'

// Simple keywords - hanya untuk start dan basic navigation
const KEYWORDS = {
  'start': 'SHOW_MENU',
  'menu': 'SHOW_MENU',
  'help': 'SHOW_MENU',
  '/start': 'SHOW_MENU',
  'batal': 'CANCEL',
  'cancel': 'CANCEL'
}

export async function handleTextMessage(event: LineEvent) {
  const text = event.message?.text?.toLowerCase().trim() || ''
  const userId = event.source?.userId || ''
  const replyToken = event.replyToken || ''
  
  console.log('handleTextMessage:', { text, userId, replyToken })
  
  // Get user session
  const session = await getUserSession(userId)
  
  // If user is in input mode, handle the input
  if (session?.waitingFor) {
    console.log('User in input mode:', session.waitingFor)
    return await handleUserInput(userId, text, replyToken, session)
  }
  
  // Check for basic keywords
  const command = KEYWORDS[text as keyof typeof KEYWORDS]
  console.log('Command detected:', command)
  
  if (command === 'SHOW_MENU') {
    console.log('Showing main menu')
    // Always show main flex menu
    const menu = getMainFlexMenu()
    console.log('Menu created, sending reply...')
    const result = await replyMessage(replyToken, [menu])
    console.log('Reply result:', result)
    return
  }
  
  if (command === 'CANCEL') {
    await setUserSession(userId, null)
    await replyMessage(replyToken, [
      {
        type: 'text',
        text: '❌ Proses dibatalkan'
      },
      getMainFlexMenu()
    ])
    return
  }
  
  // For any other text, show menu with hint
  await replyMessage(replyToken, [
    {
      type: 'text',
      text: '💡 Gunakan menu di bawah untuk navigasi'
    },
    getMainFlexMenu()
  ])
}

async function handleUserInput(userId: string, input: string, replyToken: string, session: any) {
  const { waitingFor, data } = session
  
  // Handle different input types based on what we're waiting for
  switch (waitingFor) {
    case 'SISWA_NAME':
      data.name = input
      await setUserSession(userId, { waitingFor: 'SISWA_NIS', data })
      await replyMessage(replyToken, [getInputPrompt('NIS Siswa (8 digit):', 'Contoh: 20240001')])
      break
      
    case 'SISWA_NIS':
      if (!/^\d{8}$/.test(input)) {
        await replyMessage(replyToken, [{
          type: 'text',
          text: '❌ NIS harus 8 digit angka. Silakan coba lagi:'
        }])
        return
      }
      data.nis = input
      await setUserSession(userId, { waitingFor: 'SISWA_BIRTHDATE', data })
      await replyMessage(replyToken, [getInputPrompt('Tanggal Lahir:', 'Format: DD/MM/YYYY')])
      break
      
    case 'SISWA_BIRTHDATE':
      data.birthDate = input
      await setUserSession(userId, { waitingFor: 'SISWA_PARENT_PHONE', data })
      await replyMessage(replyToken, [getInputPrompt('No. HP Orang Tua:', 'Contoh: 081234567890')])
      break
      
    case 'SISWA_PARENT_PHONE':
      data.parentPhone = input
      // Save to database
      await handleSiswaCommand.create(data, userId, replyToken)
      await setUserSession(userId, null)
      // Show menu again
      setTimeout(() => replyMessage(replyToken, [getMainFlexMenu()]), 1000)
      break
      
    case 'SEARCH_QUERY':
      await handleSiswaCommand.search(input, userId, replyToken)
      await setUserSession(userId, null)
      break
      
    case 'SPP_NIS':
      await handleKeuanganCommand.checkSPP(input, userId, replyToken)
      await setUserSession(userId, null)
      break
      
    default:
      await setUserSession(userId, null)
      await replyMessage(replyToken, [getMainFlexMenu()])
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
  
  // Parse postback data
  const params = new URLSearchParams(data)
  const action = params.get('action')
  
  switch (action) {
    // Main menu actions
    case 'menu_siswa':
      await replyMessage(replyToken, [getSiswaFlexMenu()])
      break
      
    case 'menu_pengajar':
      await replyMessage(replyToken, [getPengajarFlexMenu()])
      break
      
    case 'menu_keuangan':
      await replyMessage(replyToken, [getKeuanganFlexMenu()])
      break
      
    case 'menu_akademik':
      await replyMessage(replyToken, [getAkademikFlexMenu()])
      break
      
    case 'menu_settings':
      await replyMessage(replyToken, [getSettingsFlexMenu()])
      break
      
    // Siswa actions
    case 'siswa_add':
      await setUserSession(userId, { waitingFor: 'SISWA_NAME', data: {} })
      await replyMessage(replyToken, [getInputPrompt('Nama Lengkap Siswa:', 'Masukkan nama lengkap siswa')])
      break
      
    case 'siswa_search':
      await setUserSession(userId, { waitingFor: 'SEARCH_QUERY', data: {} })
      await replyMessage(replyToken, [getInputPrompt('Cari Siswa:', 'Masukkan NIS atau nama siswa')])
      break
      
    case 'siswa_list':
      await handleSiswaCommand.list(userId, replyToken)
      break
      
    case 'siswa_detail':
      const siswaId = params.get('id')
      await handleSiswaCommand.getDetail(siswaId!, userId, replyToken)
      break
      
    case 'siswa_edit':
      const editId = params.get('id')
      await handleSiswaCommand.startEdit(editId!, userId, replyToken)
      break
      
    case 'siswa_delete':
      const deleteId = params.get('id')
      await handleSiswaCommand.confirmDelete(deleteId!, userId, replyToken)
      break
      
    case 'confirm_delete':
      const confirmId = params.get('id')
      await handleSiswaCommand.delete(confirmId!, userId, replyToken)
      break
      
    // Keuangan actions
    case 'spp_check':
      await setUserSession(userId, { waitingFor: 'SPP_NIS', data: {} })
      await replyMessage(replyToken, [getInputPrompt('Cek Tagihan SPP:', 'Masukkan NIS siswa')])
      break
      
    case 'payment_detail':
      const paymentId = params.get('id')
      await handleKeuanganCommand.getPaymentDetail(paymentId!, userId, replyToken)
      break
      
    case 'mark_paid':
      const billId = params.get('id')
      await handleKeuanganCommand.markAsPaid(billId!, userId, replyToken)
      break
      
    // Navigation
    case 'back_to_menu':
      await replyMessage(replyToken, [getMainFlexMenu()])
      break
      
    default:
      await replyMessage(replyToken, [getMainFlexMenu()])
  }
}

export async function handleFollowEvent(event: LineEvent) {
  const userId = event.source?.userId || ''
  const replyToken = event.replyToken || ''
  
  await replyMessage(replyToken, [
    {
      type: 'text',
      text: '🎓 Selamat datang di Pondok Imam Syafii Bot!\n\nSilakan pilih menu di bawah untuk memulai:'
    },
    getMainFlexMenu()
  ])
}

export async function handleUnfollowEvent(event: LineEvent) {
  const userId = event.source?.userId || ''
  // Clean up user session
  await setUserSession(userId, null)
}