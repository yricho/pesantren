import { prisma } from '@/lib/prisma'
import { replyMessage } from '../client'
import { getSiswaCarousel, getSiswaDetail } from '../templates/menus'

export const handleSiswaCommand = {
  async create(data: any, userId: string, replyToken: string) {
    try {
      const student = await prisma.student.create({
        data: {
          name: data.name,
          nis: data.nis,
          birthDate: new Date(data.birthDate),
          gender: data.gender.toUpperCase() === 'L' ? 'MALE' : 'FEMALE',
          parentPhone: data.parentPhone,
          status: 'ACTIVE'
        }
      })

      await replyMessage(replyToken, [
        {
          type: 'text',
          text: `✅ Siswa berhasil ditambahkan!\n\nNama: ${student.name}\nNIS: ${student.nis}\n\nData telah tersimpan dalam sistem.`
        }
      ])
    } catch (error: any) {
      await replyMessage(replyToken, [
        {
          type: 'text',
          text: `❌ Gagal menambah siswa: ${error.message}`
        }
      ])
    }
  },

  async list(userId: string, replyToken: string) {
    try {
      const students = await prisma.student.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          nis: true,
          status: true,
          class: {
            select: { name: true }
          }
        }
      })

      if (students.length === 0) {
        await replyMessage(replyToken, [
          {
            type: 'text',
            text: 'Belum ada data siswa.'
          }
        ])
        return
      }

      const formattedStudents = students.map(s => ({
        id: s.id,
        name: s.name,
        nis: s.nis,
        status: s.status,
        class: s.class?.name
      }))

      await replyMessage(replyToken, [
        {
          type: 'text',
          text: `Menampilkan ${students.length} siswa terbaru:`
        },
        getSiswaCarousel(formattedStudents)
      ])
    } catch (error: any) {
      await replyMessage(replyToken, [
        {
          type: 'text',
          text: `❌ Gagal mengambil data: ${error.message}`
        }
      ])
    }
  },

  async search(query: string, userId: string, replyToken: string) {
    try {
      const students = await prisma.student.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { nis: { contains: query } }
          ]
        },
        take: 5,
        select: {
          id: true,
          name: true,
          nis: true,
          status: true,
          class: {
            select: { name: true }
          }
        }
      })

      if (students.length === 0) {
        await replyMessage(replyToken, [
          {
            type: 'text',
            text: `Tidak ditemukan siswa dengan kata kunci "${query}"`
          }
        ])
        return
      }

      const formattedStudents = students.map(s => ({
        id: s.id,
        name: s.name,
        nis: s.nis,
        status: s.status,
        class: s.class?.name
      }))

      await replyMessage(replyToken, [
        {
          type: 'text',
          text: `Ditemukan ${students.length} siswa:`
        },
        getSiswaCarousel(formattedStudents)
      ])
    } catch (error: any) {
      await replyMessage(replyToken, [
        {
          type: 'text',
          text: `❌ Gagal mencari: ${error.message}`
        }
      ])
    }
  },

  async getByNIS(nis: string, userId: string, replyToken: string) {
    try {
      const student = await prisma.student.findUnique({
        where: { nis },
        include: {
          class: true,
          payments: {
            where: { status: 'PENDING' },
            take: 3
          }
        }
      })

      if (!student) {
        await replyMessage(replyToken, [
          {
            type: 'text',
            text: `Siswa dengan NIS ${nis} tidak ditemukan.`
          }
        ])
        return
      }

      await replyMessage(replyToken, [
        getSiswaDetail(student),
        ...(student.payments.length > 0 ? [{
          type: 'text' as const,
          text: `⚠️ Ada ${student.payments.length} tagihan pending`
        }] : [])
      ])
    } catch (error: any) {
      await replyMessage(replyToken, [
        {
          type: 'text',
          text: `❌ Error: ${error.message}`
        }
      ])
    }
  },

  async getDetail(id: string, userId: string, replyToken: string) {
    try {
      const student = await prisma.student.findUnique({
        where: { id },
        include: {
          class: true,
          payments: {
            where: { status: 'PENDING' }
          }
        }
      })

      if (!student) {
        await replyMessage(replyToken, [
          {
            type: 'text',
            text: 'Siswa tidak ditemukan.'
          }
        ])
        return
      }

      await replyMessage(replyToken, [getSiswaDetail(student)])
    } catch (error: any) {
      await replyMessage(replyToken, [
        {
          type: 'text',
          text: `❌ Error: ${error.message}`
        }
      ])
    }
  },

  async confirmDelete(id: string, userId: string, replyToken: string) {
    try {
      const student = await prisma.student.findUnique({
        where: { id },
        select: { name: true, nis: true }
      })

      if (!student) {
        await replyMessage(replyToken, [
          {
            type: 'text',
            text: 'Siswa tidak ditemukan.'
          }
        ])
        return
      }

      await replyMessage(replyToken, [
        {
          type: 'flex',
          altText: 'Konfirmasi Hapus',
          contents: {
            type: 'bubble',
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: '⚠️ Konfirmasi Hapus',
                  weight: 'bold',
                  size: 'lg',
                  color: '#E74C3C'
                },
                {
                  type: 'text',
                  text: `Apakah Anda yakin ingin menghapus:`,
                  margin: 'md',
                  wrap: true
                },
                {
                  type: 'text',
                  text: `${student.name} (${student.nis})`,
                  weight: 'bold',
                  margin: 'sm'
                },
                {
                  type: 'text',
                  text: 'Data yang dihapus tidak dapat dikembalikan!',
                  size: 'xs',
                  color: '#999999',
                  margin: 'md',
                  wrap: true
                }
              ]
            },
            footer: {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'button',
                  style: 'secondary',
                  action: {
                    type: 'message',
                    label: 'Batal',
                    text: 'batal'
                  }
                },
                {
                  type: 'button',
                  style: 'primary',
                  action: {
                    type: 'postback',
                    label: 'Ya, Hapus',
                    data: `action=confirm_delete&id=${id}`
                  },
                  color: '#E74C3C'
                }
              ],
              spacing: 'sm'
            }
          }
        }
      ])
    } catch (error: any) {
      await replyMessage(replyToken, [
        {
          type: 'text',
          text: `❌ Error: ${error.message}`
        }
      ])
    }
  },

  async delete(id: string, userId: string, replyToken: string) {
    try {
      const student = await prisma.student.delete({
        where: { id }
      })

      await replyMessage(replyToken, [
        {
          type: 'text',
          text: `✅ Siswa ${student.name} (${student.nis}) berhasil dihapus.`
        }
      ])
    } catch (error: any) {
      await replyMessage(replyToken, [
        {
          type: 'text',
          text: `❌ Gagal menghapus: ${error.message}`
        }
      ])
    }
  }
}