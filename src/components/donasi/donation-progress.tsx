'use client'

import { DonationCampaign } from '@/types'
import { Card } from '@/components/ui/card'
import { UserGroupIcon } from '@heroicons/react/24/outline'

interface DonationProgressProps {
  campaign: DonationCampaign
  donorCount?: number
  showDetails?: boolean
}

export function DonationProgress({ campaign, donorCount = 0, showDetails = true }: DonationProgressProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatCompactCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}M`
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}Jt`
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`
    }
    return formatCurrency(amount)
  }

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const progress = calculateProgress(campaign.currentAmount, campaign.targetAmount)
  const remaining = Math.max(campaign.targetAmount - campaign.currentAmount, 0)

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Amount Raised */}
        <div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {formatCurrency(campaign.currentAmount)}
          </div>
          <div className="text-sm text-gray-600">
            terkumpul dari target {formatCurrency(campaign.targetAmount)}
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                campaign.isUrgent ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}% tercapai
            </span>
            <span className="text-sm text-gray-500">
              {formatCompactCurrency(remaining)} lagi
            </span>
          </div>
        </div>

        {showDetails && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{donorCount}</div>
                <div className="text-sm text-gray-600 flex items-center justify-center">
                  <UserGroupIcon className="w-4 h-4 mr-1" />
                  Donatur
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {donorCount > 0 ? formatCompactCurrency(campaign.currentAmount / donorCount) : '0'}
                </div>
                <div className="text-sm text-gray-600">Rata-rata</div>
              </div>
            </div>

            {/* Time Remaining */}
            {campaign.endDate && (
              <div className="pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {(() => {
                      const now = new Date()
                      const end = new Date(campaign.endDate)
                      const diff = end.getTime() - now.getTime()
                      
                      if (diff <= 0) return '0'
                      
                      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
                      return days.toString()
                    })()}
                  </div>
                  <div className="text-sm text-gray-600">Hari tersisa</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  )
}