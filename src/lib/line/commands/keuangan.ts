import { prisma } from '@/lib/prisma'
import { replyMessage } from '../client'

export const handleKeuanganCommand = {
  async checkSPP(nis: string, userId: string, replyToken: string) {
    try {
      const student = await prisma.student.findUnique({
        where: { nis },
        include: {
          payments: {
            where: { 
              status: 'PENDING',
              type: 'SPP'
            },
            orderBy: { dueDate: 'asc' }
          }
        }
      })

      if (!student) {
        await replyMessage(replyToken, [{
          type: 'text',
          text: `Siswa dengan NIS ${nis} tidak ditemukan.`
        }])
        return
      }

      if (student.payments.length === 0) {
        await replyMessage(replyToken, [{
          type: 'text',
          text: `✅ ${student.name} tidak memiliki tagihan SPP yang pending.`
        }])
        return
      }

      const total = student.payments.reduce((sum, p) => sum + p.amount, 0)

      await replyMessage(replyToken, [{
        type: 'flex',
        altText: `Tagihan SPP ${student.name}`,
        contents: {
          type: 'bubble',
          header: {
            type: 'box',
            layout: 'vertical',
            contents: [{
              type: 'text',
              text: 'Tagihan SPP',
              weight: 'bold',
              size: 'lg',
              color: '#FFFFFF'
            }],
            backgroundColor: '#E74C3C',
            paddingAll: '15px'
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: student.name,
                weight: 'bold',
                size: 'md'
              },
              {
                type: 'text',
                text: `NIS: ${student.nis}`,
                size: 'sm',
                color: '#999999'
              },
              {
                type: 'separator',
                margin: 'md'
              },
              ...student.payments.map(payment => ({
                type: 'box' as const,
                layout: 'horizontal' as const,
                contents: [
                  {
                    type: 'text',
                    text: new Date(payment.dueDate).toLocaleDateString('id-ID', { 
                      month: 'long', 
                      year: 'numeric' 
                    }),
                    size: 'sm',
                    flex: 3
                  },
                  {
                    type: 'text',
                    text: `Rp ${payment.amount.toLocaleString('id-ID')}`,
                    size: 'sm',
                    align: 'end',
                    flex: 2
                  }
                ],
                margin: 'sm'
              })),
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
                    text: 'TOTAL',
                    weight: 'bold',
                    size: 'sm'
                  },
                  {
                    type: 'text',
                    text: `Rp ${total.toLocaleString('id-ID')}`,
                    weight: 'bold',
                    size: 'sm',
                    align: 'end'
                  }
                ],
                margin: 'md'
              }
            ],
            spacing: 'sm'
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            contents: [{
              type: 'button',
              style: 'primary',
              action: {
                type: 'uri',
                label: '💳 Bayar Sekarang',
                uri: `${process.env.NEXT_PUBLIC_APP_URL}/payment?nis=${nis}`
              },
              color: '#27AE60'
            }],
            spacing: 'sm'
          }
        }
      }])
    } catch (error: any) {
      await replyMessage(replyToken, [{
        type: 'text',
        text: `❌ Error: ${error.message}`
      }])
    }
  },

  async getPaymentDetail(paymentId: string, userId: string, replyToken: string) {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          student: true
        }
      })

      if (!payment) {
        await replyMessage(replyToken, [{
          type: 'text',
          text: 'Data pembayaran tidak ditemukan.'
        }])
        return
      }

      await replyMessage(replyToken, [{
        type: 'flex',
        altText: 'Detail Pembayaran',
        contents: {
          type: 'bubble',
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'Detail Pembayaran',
                weight: 'bold',
                size: 'lg'
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
                    text: 'Siswa:',
                    size: 'sm',
                    flex: 2
                  },
                  {
                    type: 'text',
                    text: payment.student.name,
                    size: 'sm',
                    flex: 3
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
                    text: 'Jenis:',
                    size: 'sm',
                    flex: 2
                  },
                  {
                    type: 'text',
                    text: payment.type,
                    size: 'sm',
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
                    text: 'Jumlah:',
                    size: 'sm',
                    flex: 2
                  },
                  {
                    type: 'text',
                    text: `Rp ${payment.amount.toLocaleString('id-ID')}`,
                    size: 'sm',
                    flex: 3,
                    weight: 'bold'
                  }
                ]
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    text: 'Status:',
                    size: 'sm',
                    flex: 2
                  },
                  {
                    type: 'text',
                    text: payment.status,
                    size: 'sm',
                    flex: 3,
                    color: payment.status === 'PAID' ? '#27AE60' : '#E74C3C'
                  }
                ]
              }
            ]
          },
          footer: payment.status === 'PENDING' ? {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'button',
                style: 'primary',
                action: {
                  type: 'postback',
                  label: '✅ Tandai Lunas',
                  data: `action=mark_paid&id=${paymentId}`
                },
                color: '#27AE60'
              }
            ]
          } : undefined
        }
      }])
    } catch (error: any) {
      await replyMessage(replyToken, [{
        type: 'text',
        text: `❌ Error: ${error.message}`
      }])
    }
  },

  async markAsPaid(paymentId: string, userId: string, replyToken: string) {
    try {
      const payment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'PAID',
          paidAt: new Date(),
          paymentMethod: 'CASH'
        },
        include: {
          student: true
        }
      })

      await replyMessage(replyToken, [{
        type: 'text',
        text: `✅ Pembayaran ${payment.type} untuk ${payment.student.name} berhasil ditandai LUNAS.\n\nJumlah: Rp ${payment.amount.toLocaleString('id-ID')}`
      }])
    } catch (error: any) {
      await replyMessage(replyToken, [{
        type: 'text',
        text: `❌ Gagal update: ${error.message}`
      }])
    }
  }
}