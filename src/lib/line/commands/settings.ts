import { replyMessage } from '../client'

export const handleSettingsCommand = {
  async getProfile(userId: string, replyToken: string) {
    await replyMessage(replyToken, [{
      type: 'text',
      text: 'Fitur profil sedang dalam pengembangan.'
    }])
  },

  async updateNotification(userId: string, enabled: boolean, replyToken: string) {
    await replyMessage(replyToken, [{
      type: 'text',
      text: `Notifikasi ${enabled ? 'diaktifkan' : 'dinonaktifkan'}.`
    }])
  }
}