export interface LineEvent {
  type: 'message' | 'follow' | 'unfollow' | 'postback' | 'join' | 'leave'
  replyToken?: string
  source?: {
    type: 'user' | 'group' | 'room'
    userId?: string
    groupId?: string
    roomId?: string
  }
  timestamp?: number
  message?: {
    id: string
    type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'location' | 'sticker'
    text?: string
    fileName?: string
    fileSize?: number
    title?: string
    address?: string
    latitude?: number
    longitude?: number
  }
  postback?: {
    data: string
    params?: {
      date?: string
      time?: string
      datetime?: string
    }
  }
}

export interface LineProfile {
  displayName: string
  userId: string
  pictureUrl?: string
  statusMessage?: string
  language?: string
}

export interface FlexMessage {
  type: 'flex'
  altText: string
  contents: FlexBubble | FlexCarousel
}

export interface FlexBubble {
  type: 'bubble'
  size?: 'nano' | 'micro' | 'kilo' | 'mega' | 'giga'
  header?: FlexBox
  hero?: FlexImage | FlexBox
  body?: FlexBox
  footer?: FlexBox
  styles?: any
}

export interface FlexCarousel {
  type: 'carousel'
  contents: FlexBubble[]
}

export interface FlexBox {
  type: 'box'
  layout: 'horizontal' | 'vertical' | 'baseline'
  contents: FlexComponent[]
  flex?: number
  spacing?: string
  margin?: string
  paddingAll?: string
  paddingTop?: string
  paddingBottom?: string
  paddingStart?: string
  paddingEnd?: string
  backgroundColor?: string
  borderWidth?: string
  borderColor?: string
  cornerRadius?: string
}

export interface FlexComponent {
  type: 'text' | 'button' | 'image' | 'icon' | 'separator' | 'spacer' | 'filler'
  [key: string]: any
}

export interface FlexImage {
  type: 'image'
  url: string
  size?: string
  aspectRatio?: string
  aspectMode?: 'cover' | 'fit'
}

export interface QuickReply {
  items: QuickReplyItem[]
}

export interface QuickReplyItem {
  type: 'action'
  action: {
    type: 'message' | 'postback' | 'uri' | 'datetimepicker' | 'camera' | 'cameraRoll' | 'location'
    label: string
    text?: string
    data?: string
    uri?: string
    mode?: 'date' | 'time' | 'datetime'
    initial?: string
    max?: string
    min?: string
  }
}