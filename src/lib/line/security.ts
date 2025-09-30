import crypto from 'crypto'

export function validateSignature(body: string, channelSecret: string, signature: string): boolean {
  const hash = crypto
    .createHmac('SHA256', channelSecret)
    .update(body)
    .digest('base64')
  
  return hash === signature
}