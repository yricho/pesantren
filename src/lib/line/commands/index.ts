export { handleSiswaCommand } from './siswa'
// export { handlePengajarCommand } from './pengajar' // TODO: Fix model mapping
// export { handleKeuanganCommand } from './keuangan' // TODO: Fix model mapping
export { handleAkademikCommand } from './akademik'
export { handleSettingsCommand } from './settings'

// Temporary placeholders
export const handlePengajarCommand = {
  list: async (userId: string, replyToken: string) => {},
  create: async (data: any, userId: string, replyToken: string) => {}
}

export const handleKeuanganCommand = {
  checkSPP: async (nis: string, userId: string, replyToken: string) => {},
  getPaymentDetail: async (id: string, userId: string, replyToken: string) => {},
  markAsPaid: async (id: string, userId: string, replyToken: string) => {}
}