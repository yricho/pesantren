'use client'

import { useState } from 'react'
import { ShareData } from '@/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  ShareIcon,
  ClipboardIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

interface SocialShareProps {
  shareData: ShareData
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function SocialShare({ shareData, size = 'md', showLabel = true, className = '' }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6'
  }

  const buttonSizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const shareViaWebAPI = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: shareData.url,
        })
      } catch (error) {
        console.log('Share cancelled or failed')
      }
    } else {
      copyToClipboard()
    }
  }

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`${shareData.text}\n\n${shareData.url}`)
    const hashtags = shareData.hashtags ? encodeURIComponent(shareData.hashtags.join(' ')) : ''
    const whatsappUrl = `https://wa.me/?text=${text}${hashtags ? `%20${hashtags}` : ''}`
    window.open(whatsappUrl, '_blank')
  }

  const shareViaFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}&quote=${encodeURIComponent(shareData.text)}`
    window.open(facebookUrl, '_blank', 'width=600,height=400')
  }

  const shareViaTwitter = () => {
    const text = encodeURIComponent(shareData.text)
    const url = encodeURIComponent(shareData.url)
    const hashtags = shareData.hashtags ? encodeURIComponent(shareData.hashtags.join(',')) : ''
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}${hashtags ? `&hashtags=${hashtags}` : ''}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
  }

  const shareViaTelegram = () => {
    const text = encodeURIComponent(`${shareData.text}\n${shareData.url}`)
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareData.url)}&text=${text}`
    window.open(telegramUrl, '_blank')
  }

  const shareViaInstagram = () => {
    // Instagram doesn't support direct URL sharing, so we'll copy the text
    const instagramText = `${shareData.text}\n\n${shareData.url}${shareData.hashtags ? `\n\n${shareData.hashtags.map(tag => `#${tag}`).join(' ')}` : ''}`
    navigator.clipboard.writeText(instagramText)
    alert('Teks berhasil disalin! Buka Instagram dan paste di story atau post Anda.')
  }

  const shareButtons = [
    {
      name: 'WhatsApp',
      icon: '📱',
      color: 'bg-green-500 hover:bg-green-600',
      action: shareViaWhatsApp
    },
    {
      name: 'Facebook',
      icon: '📘',
      color: 'bg-blue-600 hover:bg-blue-700',
      action: shareViaFacebook
    },
    {
      name: 'Twitter',
      icon: '🐦',
      color: 'bg-sky-500 hover:bg-sky-600',
      action: shareViaTwitter
    },
    {
      name: 'Telegram',
      icon: '✈️',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: shareViaTelegram
    },
    {
      name: 'Instagram',
      icon: '📷',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      action: shareViaInstagram
    }
  ]

  return (
    <div className={className}>
      {/* Native Share Button */}
      <div className="flex items-center space-x-3 mb-4">
        <Button
          onClick={shareViaWebAPI}
          className={`${buttonSizes[size]} bg-green-600 hover:bg-green-700`}
        >
          <ShareIcon className={`${iconSizes[size]} ${showLabel ? 'mr-2' : ''}`} />
          {showLabel && 'Bagikan'}
        </Button>

        <Button
          onClick={copyToClipboard}
          variant="outline"
          className={buttonSizes[size]}
        >
          {copied ? (
            <CheckIcon className={`${iconSizes[size]} ${showLabel ? 'mr-2' : ''} text-green-600`} />
          ) : (
            <ClipboardIcon className={`${iconSizes[size]} ${showLabel ? 'mr-2' : ''}`} />
          )}
          {showLabel && (copied ? 'Tersalin!' : 'Salin Link')}
        </Button>
      </div>

      {/* Social Media Buttons */}
      <div className="grid grid-cols-5 gap-2">
        {shareButtons.map((button) => (
          <button
            key={button.name}
            onClick={button.action}
            className={`${button.color} text-white ${buttonSizes[size]} rounded-lg text-center transition-colors flex flex-col items-center justify-center aspect-square`}
            title={`Bagikan ke ${button.name}`}
          >
            <span className="text-lg mb-1">{button.icon}</span>
            {size === 'lg' && (
              <span className="text-xs">{button.name}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// Quick share button for inline use
export function QuickShareButton({ shareData, variant = 'default', size = 'sm' }: {
  shareData: ShareData
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'lg'
}) {
  const shareViaWebAPI = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: shareData.url,
        })
      } catch (error) {
        console.log('Share cancelled or failed')
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url)
        alert('Link berhasil disalin!')
      } catch (error) {
        console.error('Failed to copy:', error)
      }
    }
  }

  return (
    <Button
      onClick={shareViaWebAPI}
      variant={variant}
      size={size}
    >
      <ShareIcon className="w-4 h-4 mr-2" />
      Bagikan
    </Button>
  )
}

// Share modal/dropdown component
export function ShareModal({ shareData, isOpen, onClose }: {
  shareData: ShareData
  isOpen: boolean
  onClose: () => void
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Bagikan Campaign</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">"{shareData.title}"</p>
          <p className="text-xs text-gray-500 bg-gray-100 p-2 rounded break-all">
            {shareData.url}
          </p>
        </div>

        <SocialShare shareData={shareData} size="md" />

        {shareData.hashtags && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Hashtag yang disarankan:</p>
            <div className="flex flex-wrap gap-2">
              {shareData.hashtags.map((tag) => (
                <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

// Social sharing stats component
export function ShareStats({ shareCount, className = '' }: {
  shareCount: number
  className?: string
}) {
  return (
    <div className={`flex items-center text-sm text-gray-500 ${className}`}>
      <ShareIcon className="w-4 h-4 mr-1" />
      <span>Dibagikan {shareCount.toLocaleString('id-ID')} kali</span>
    </div>
  )
}