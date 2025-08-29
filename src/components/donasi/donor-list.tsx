'use client'

import { useState } from 'react'
import { Donation } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  UserIcon,
  HeartIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'

interface DonorListProps {
  donations: Donation[]
  showAmount?: boolean
  showMessage?: boolean
  limit?: number
}

export function DonorList({ donations, showAmount = true, showMessage = true, limit }: DonorListProps) {
  const [showAll, setShowAll] = useState(false)
  const [hideAmounts, setHideAmounts] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} menit yang lalu`
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours} jam yang lalu`
    }
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
      return `${diffInDays} hari yang lalu`
    }
    
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Filter verified donations
  const verifiedDonations = donations.filter(d => d.paymentStatus === 'VERIFIED')
  
  // Apply limit if specified
  let displayedDonations = verifiedDonations
  if (limit && !showAll) {
    displayedDonations = verifiedDonations.slice(0, limit)
  }

  if (verifiedDonations.length === 0) {
    return (
      <Card className="p-8 text-center">
        <HeartIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Donatur</h3>
        <p className="text-gray-500">Jadilah donatur pertama untuk campaign ini!</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Donatur ({verifiedDonations.length})
        </h3>
        {showAmount && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHideAmounts(!hideAmounts)}
          >
            {hideAmounts ? (
              <>
                <EyeIcon className="w-4 h-4 mr-2" />
                Tampilkan Jumlah
              </>
            ) : (
              <>
                <EyeSlashIcon className="w-4 h-4 mr-2" />
                Sembunyikan Jumlah
              </>
            )}
          </Button>
        )}
      </div>

      {/* Donations list */}
      <div className="space-y-3">
        {displayedDonations.map((donation, index) => (
          <Card key={donation.id} className="p-4">
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                {donation.isAnonymous ? (
                  '?'
                ) : (
                  donation.donorName?.[0]?.toUpperCase() || '?'
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Name and badge */}
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">
                        {donation.isAnonymous ? 'Hamba Allah' : donation.donorName || 'Donatur'}
                      </h4>
                      {index < 3 && verifiedDonations.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          Top {index + 1}
                        </Badge>
                      )}
                    </div>

                    {/* Amount */}
                    {showAmount && !hideAmounts && (
                      <div className="text-green-600 font-semibold mb-1">
                        {formatCurrency(donation.amount)}
                      </div>
                    )}

                    {/* Campaign info */}
                    {donation.campaign && (
                      <div className="text-sm text-gray-600 mb-1">
                        untuk {donation.campaign.title}
                      </div>
                    )}

                    {/* Message */}
                    {showMessage && donation.message && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 italic">
                          "{donation.message}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Time */}
                  <div className="text-xs text-gray-500 ml-4">
                    {formatTimeAgo(donation.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Show more button */}
      {limit && verifiedDonations.length > limit && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll 
              ? `Tampilkan Lebih Sedikit` 
              : `Tampilkan ${verifiedDonations.length - limit} Donatur Lainnya`
            }
          </Button>
        </div>
      )}

      {/* Statistics */}
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-700">
              {verifiedDonations.length}
            </div>
            <div className="text-sm text-green-600">Total Donatur</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-700">
              {formatCurrency(
                verifiedDonations.reduce((sum, d) => sum + d.amount, 0)
              )}
            </div>
            <div className="text-sm text-green-600">Total Donasi</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-700">
              {verifiedDonations.length > 0 
                ? formatCurrency(
                    verifiedDonations.reduce((sum, d) => sum + d.amount, 0) / verifiedDonations.length
                  )
                : 'Rp 0'
              }
            </div>
            <div className="text-sm text-green-600">Rata-rata</div>
          </div>
        </div>
      </Card>
    </div>
  )
}