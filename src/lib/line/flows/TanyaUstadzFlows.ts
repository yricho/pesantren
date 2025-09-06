import { FlowDefinition } from '../core/FlowManager'
import { QUESTION_CATEGORIES } from '@/types'

/**
 * Flow untuk mengajukan pertanyaan kepada ustadz
 */
export const askUstadzFlow: FlowDefinition = {
  id: 'ask_ustadz',
  name: 'Tanya Ustadz',
  description: 'Mengajukan pertanyaan kepada ustadz tentang agama Islam',
  requiredPermission: null, // Public flow
  steps: [
    {
      id: 'category',
      prompt: '📚 Silakan pilih kategori pertanyaan Anda:\n\n' +
              '1️⃣ Fiqih Ibadah (sholat, puasa, zakat, haji)\n' +
              '2️⃣ Muamalah (jual-beli, ekonomi)\n' +
              '3️⃣ Akhlaq (perilaku, adab)\n' +
              '4️⃣ Aqidah (keimanan, tauhid)\n' +
              '5️⃣ Tafsir (pemahaman Al-Quran)\n' +
              '6️⃣ Tahsin (bacaan Al-Quran, tajwid)\n\n' +
              '💡 Ketik nomor atau nama kategori:',
      inputType: 'text',
      validation: (input: string) => {
        const normalizedInput = input.toLowerCase().trim()
        
        // Check by number
        if (['1', '2', '3', '4', '5', '6'].includes(normalizedInput)) {
          return true
        }
        
        // Check by category name (partial match)
        const categoryNames = [
          'fiqih', 'ibadah', 'muamalah', 'akhlaq', 'aqidah', 'tafsir', 'tahsin'
        ]
        
        if (categoryNames.some(name => normalizedInput.includes(name))) {
          return true
        }
        
        return '❌ Pilih kategori yang valid (1-6 atau nama kategori)'
      },
      transform: (input: string) => {
        const normalizedInput = input.toLowerCase().trim()
        
        // Map number to category
        const numberMap: { [key: string]: string } = {
          '1': 'fiqih_ibadah',
          '2': 'muamalah',
          '3': 'akhlaq',
          '4': 'aqidah',
          '5': 'tafsir',
          '6': 'tahsin'
        }
        
        if (numberMap[normalizedInput]) {
          return numberMap[normalizedInput]
        }
        
        // Map by category name
        if (normalizedInput.includes('fiqih') || normalizedInput.includes('ibadah')) {
          return 'fiqih_ibadah'
        }
        if (normalizedInput.includes('muamalah')) {
          return 'muamalah'
        }
        if (normalizedInput.includes('akhlaq')) {
          return 'akhlaq'
        }
        if (normalizedInput.includes('aqidah')) {
          return 'aqidah'
        }
        if (normalizedInput.includes('tafsir')) {
          return 'tafsir'
        }
        if (normalizedInput.includes('tahsin')) {
          return 'tahsin'
        }
        
        return 'fiqih_ibadah' // default
      }
    },
    {
      id: 'isAnonymous',
      prompt: '👤 Apakah Anda ingin bertanya secara anonim?\n\n' +
              '1️⃣ Ya, anonim (nama tidak ditampilkan)\n' +
              '2️⃣ Tidak, dengan nama\n\n' +
              '💡 Ketik 1 atau 2:',
      inputType: 'text',
      validation: (input: string) => {
        const normalizedInput = input.toLowerCase().trim()
        if (['1', '2', 'ya', 'tidak', 'anonim', 'nama'].includes(normalizedInput)) {
          return true
        }
        return '❌ Pilih 1 (anonim) atau 2 (dengan nama)'
      },
      transform: (input: string) => {
        const normalizedInput = input.toLowerCase().trim()
        return ['1', 'ya', 'anonim'].includes(normalizedInput) ? 'true' : 'false'
      }
    },
    {
      id: 'askerName',
      prompt: '📝 Masukkan nama Anda:',
      inputType: 'text',
      condition: (data: any) => data.isAnonymous === 'false', // Only ask if not anonymous
      validation: (input: string) => {
        if (!input || input.trim().length < 2) {
          return '❌ Nama harus minimal 2 karakter'
        }
        if (input.length > 50) {
          return '❌ Nama terlalu panjang (maksimal 50 karakter)'
        }
        return true
      },
      transform: (input: string) => input.trim()
    },
    {
      id: 'question',
      prompt: '❓ Silakan tulis pertanyaan Anda:\n\n' +
              '💡 Tips untuk pertanyaan yang baik:\n' +
              '• Jelaskan konteks dengan jelas\n' +
              '• Gunakan bahasa yang sopan\n' +
              '• Sertakan detail yang diperlukan\n' +
              '• Minimal 10 karakter\n\n' +
              'Tulis pertanyaan Anda:',
      inputType: 'text',
      validation: (input: string) => {
        if (!input || input.trim().length < 10) {
          return '❌ Pertanyaan harus minimal 10 karakter'
        }
        if (input.length > 2000) {
          return '❌ Pertanyaan terlalu panjang (maksimal 2000 karakter)'
        }
        return true
      },
      transform: (input: string) => input.trim()
    }
  ],
  onComplete: async (data: any, userId: string, replyToken: string) => {
    try {
      console.log('Submitting Tanya Ustadz question:', data)
      
      // Submit question to API
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/questions/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: data.question,
          category: data.category,
          askerName: data.isAnonymous === 'true' ? null : data.askerName,
          isAnonymous: data.isAnonymous === 'true'
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Get category label for display
        const categoryInfo = QUESTION_CATEGORIES.find(cat => cat.value === data.category)
        const categoryLabel = categoryInfo?.label || data.category
        
        return [
          {
            type: 'text',
            text: '✅ Pertanyaan berhasil dikirim!\n\n' +
                  `📚 Kategori: ${categoryLabel}\n` +
                  `👤 Penanya: ${data.isAnonymous === 'true' ? 'Anonim' : data.askerName}\n` +
                  `❓ Pertanyaan: ${data.question.substring(0, 100)}${data.question.length > 100 ? '...' : ''}\n\n` +
                  '⏰ Pertanyaan Anda akan dijawab oleh ustadz dalam 1-3 hari kerja.\n' +
                  '📱 Anda akan mendapat notifikasi jika pertanyaan sudah dijawab.\n\n' +
                  '🔍 Untuk melihat jawaban, kunjungi: ' + process.env.NEXTAUTH_URL + '/tanya-ustadz'
          }
        ]
      } else {
        console.error('Failed to submit question:', result)
        return [
          {
            type: 'text',
            text: '❌ Maaf, terjadi kesalahan saat mengirim pertanyaan.\n\n' +
                  '🔄 Silakan coba lagi atau kunjungi website kami:\n' +
                  process.env.NEXTAUTH_URL + '/tanya-ustadz\n\n' +
                  'Jika masalah berlanjut, hubungi admin.'
          }
        ]
      }
    } catch (error) {
      console.error('Error in askUstadzFlow completion:', error)
      return [
        {
          type: 'text',
          text: '❌ Terjadi kesalahan sistem.\n\n' +
                '🌐 Silakan ajukan pertanyaan melalui website:\n' +
                process.env.NEXTAUTH_URL + '/tanya-ustadz\n\n' +
                'Mohon maaf atas ketidaknyamanan ini.'
        }
      ]
    }
  }
}