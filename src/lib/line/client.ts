// LINE Messaging API Client

const LINE_API_URL = 'https://api.line.me/v2/bot'

export async function replyMessage(replyToken: string, messages: any[]) {
  try {
    const token = process.env.LINE_CHANNEL_ACCESS_TOKEN
    console.log('Replying with token:', token ? `${token.substring(0, 10)}...` : 'NO TOKEN')
    console.log('Reply token:', replyToken)
    console.log('Messages:', JSON.stringify(messages, null, 2))
    
    const response = await fetch(`${LINE_API_URL}/message/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        replyToken,
        messages: messages.slice(0, 5) // LINE allows max 5 messages
      })
    })

    const responseText = await response.text()
    console.log('LINE API Response:', response.status, responseText)

    if (!response.ok) {
      throw new Error(`LINE API error: ${response.status} - ${responseText}`)
    }

    return true
  } catch (error) {
    console.error('Failed to reply message:', error)
    return false
  }
}

export async function pushMessage(to: string, messages: any[]) {
  try {
    const response = await fetch(`${LINE_API_URL}/message/push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        to,
        messages: messages.slice(0, 5)
      })
    })

    if (!response.ok) {
      throw new Error(`LINE API error: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error('Failed to push message:', error)
    return false
  }
}

export async function multicastMessage(to: string[], messages: any[]) {
  try {
    const response = await fetch(`${LINE_API_URL}/message/multicast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        to: to.slice(0, 500), // LINE allows max 500 recipients
        messages: messages.slice(0, 5)
      })
    })

    if (!response.ok) {
      throw new Error(`LINE API error: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error('Failed to multicast message:', error)
    return false
  }
}

export async function broadcastMessage(messages: any[]) {
  try {
    const response = await fetch(`${LINE_API_URL}/message/broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        messages: messages.slice(0, 5)
      })
    })

    if (!response.ok) {
      throw new Error(`LINE API error: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error('Failed to broadcast message:', error)
    return false
  }
}

export async function getUserProfile(userId: string) {
  try {
    const response = await fetch(`${LINE_API_URL}/profile/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
      }
    })

    if (!response.ok) {
      throw new Error(`LINE API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to get user profile:', error)
    return null
  }
}

export async function setRichMenu(userId: string, richMenuId: string) {
  try {
    const response = await fetch(`${LINE_API_URL}/user/${userId}/richmenu/${richMenuId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
      }
    })

    if (!response.ok) {
      throw new Error(`LINE API error: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error('Failed to set rich menu:', error)
    return false
  }
}