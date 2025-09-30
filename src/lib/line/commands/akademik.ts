import { replyMessage } from '../client'

export const handleAkademikCommand = {
  async inputNilai(data: any, userId: string, replyToken: string) {
    await replyMessage(replyToken, [{
      type: 'text',
      text: 'Fitur input nilai sedang dalam pengembangan.'
    }])
  },

  async checkAbsensi(nis: string, userId: string, replyToken: string) {
    await replyMessage(replyToken, [{
      type: 'text',
      text: 'Fitur cek absensi sedang dalam pengembangan.'
    }])
  },

  async getJadwal(kelasId: string, userId: string, replyToken: string) {
    await replyMessage(replyToken, [{
      type: 'text',
      text: 'Fitur jadwal pelajaran sedang dalam pengembangan.'
    }])
  }
}