'use client'

import Link from 'next/link'
import Image from 'next/image'
import { DonationCampaign } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  HeartIcon,
  ClockIcon,
  UserGroupIcon,
  ShareIcon
} from '@heroicons/react/24/outline'
import { 
  HeartIcon as HeartSolidIcon,
  FireIcon 
} from '@heroicons/react/24/solid'

interface CampaignCardProps {
  campaign: DonationCampaign
  showActions?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function CampaignCard({ campaign, showActions = true, size = 'md' }: CampaignCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const formatTimeRemaining = (endDate: Date) => {
    const now = new Date()
    const end = new Date(endDate)
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return 'Berakhir'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days > 0) return `${days} hari lagi`
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    return `${hours} jam lagi`
  }

  const progress = calculateProgress(campaign.currentAmount, campaign.targetAmount)
  const donorCount = campaign._count?.donations || 0

  const imageHeight = {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-64'
  }[size]

  const titleSize = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  }[size]

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        {campaign.mainImage ? (
          <Image
            src={campaign.mainImage}
            alt={campaign.title}
            width={400}
            height={200}
            className={`w-full ${imageHeight} object-cover`}
          />
        ) : (
          <div className={`w-full ${imageHeight} bg-gray-200 flex items-center justify-center`}>
            <HeartIcon className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 space-y-2">
          {campaign.isUrgent && (
            <Badge className="bg-red-500 text-white block">
              <FireIcon className="w-3 h-3 mr-1" />
              Mendesak
            </Badge>
          )}
          {campaign.isFeatured && (
            <Badge className="bg-yellow-500 text-white block">
              ⭐ Pilihan
            </Badge>
          )}
        </div>

        {/* Time Remaining */}
        {campaign.endDate && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary">
              <ClockIcon className="w-3 h-3 mr-1" />
              {formatTimeRemaining(campaign.endDate)}
            </Badge>
          </div>
        )}

        {/* Share Button */}
        <div className="absolute bottom-3 right-3">
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 hover:bg-white"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (navigator.share) {
                navigator.share({
                  title: campaign.title,
                  text: campaign.description,
                  url: `${window.location.origin}/donasi/campaign/${campaign.slug}`,
                })
              } else {
                navigator.clipboard.writeText(`${window.location.origin}/donasi/campaign/${campaign.slug}`)
                alert('Link berhasil disalin!')
              }
            }}
          >
            <ShareIcon className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      <div className="p-4 lg:p-6">
        <h3 className={`font-semibold ${titleSize} mb-3 line-clamp-2`}>
          {campaign.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {campaign.description}
        </p>
        
        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {formatCurrency(campaign.currentAmount)}
            </span>
            <span className="text-sm text-gray-500">
              Target: {formatCurrency(campaign.targetAmount)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                campaign.isUrgent ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              {Math.round(progress)}%
            </span>
            <div className="flex items-center text-xs text-gray-500">
              <UserGroupIcon className="w-3 h-3 mr-1" />
              {donorCount} donatur
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <Badge variant="outline" className="text-xs">
            {campaign.category?.name}
          </Badge>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex justify-between items-center">
            <Link href={`/donasi/campaign/${campaign.slug}`}>
              <Button variant="outline" size="sm">
                Lihat Detail
              </Button>
            </Link>
            <Link href={`/donasi/donate?campaign=${campaign.id}`}>
              <Button 
                size="sm" 
                className={campaign.isUrgent ? 'bg-red-500 hover:bg-red-600' : ''}
              >
                <HeartSolidIcon className="w-4 h-4 mr-1" />
                Donasi
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  )
}