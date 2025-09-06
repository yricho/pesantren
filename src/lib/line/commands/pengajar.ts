import { prisma } from '@/lib/prisma'
import { replyMessage } from '../client'

export const handlePengajarCommand = {
  async create(data: any, userId: string, replyToken: string) {
    // Implementation for creating teacher
    await replyMessage(replyToken, [{
      type: 'text',
      text: 'Fitur tambah pengajar sedang dalam pengembangan.'
    }])
  },

  async list(userId: string, replyToken: string) {
    try {
      const teachers = await prisma.teacher.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          nip: true,
          subject: true,
          status: true
        }
      })

      if (teachers.length === 0) {
        await replyMessage(replyToken, [{
          type: 'text',
          text: 'Belum ada data pengajar.'
        }])
        return
      }

      const message = teachers.map((t, i) => 
        `${i + 1}. ${t.name}\n   NIP: ${t.nip}\n   Mapel: ${t.subject || '-'}`
      ).join('\n\n')

      await replyMessage(replyToken, [{
        type: 'text',
        text: `📋 Daftar Pengajar:\n\n${message}`
      }])
    } catch (error: any) {
      await replyMessage(replyToken, [{
        type: 'text',
        text: `❌ Error: ${error.message}`
      }])
    }
  }
}