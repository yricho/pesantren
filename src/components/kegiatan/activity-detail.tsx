'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Calendar, MapPin, Edit, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Activity } from '@/types'

interface ActivityDetailProps {
  activity: Activity
  onClose: () => void
  onUpdate: (activity: Activity) => void
}

export function ActivityDetail({ activity, onClose, onUpdate }: ActivityDetailProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planned': return 'Direncanakan'
      case 'ongoing': return 'Berlangsung'
      case 'completed': return 'Selesai'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-yellow-100 text-yellow-800'
      case 'ongoing': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const nextPhoto = () => {
    if (activity.photos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev + 1) % activity.photos.length)
    }
  }

  const prevPhoto = () => {
    if (activity.photos.length > 0) {
      setCurrentPhotoIndex((prev) => prev === 0 ? activity.photos.length - 1 : prev - 1)
    }
  }

  const updateStatus = (newStatus: string) => {
    const updatedActivity = { ...activity, status: newStatus }
    onUpdate(updatedActivity)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl my-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(activity.status)}`}>
                {getStatusLabel(activity.status)}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 capitalize">
                {activity.type}
              </span>
            </div>
            <CardTitle className="text-2xl">{activity.title}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Photo Gallery */}
          {activity.photos.length > 0 && (
            <div className="relative">
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={activity.photos[currentPhotoIndex]}
                  alt={`${activity.title} - Photo ${currentPhotoIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {activity.photos.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm"
                    onClick={prevPhoto}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm"
                    onClick={nextPhoto}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {currentPhotoIndex + 1} / {activity.photos.length}
                  </div>
                </>
              )}
              
              {activity.photos.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto">
                  {activity.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        index === currentPhotoIndex ? 'border-primary-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Deskripsi</h3>
                <p className="text-gray-700 leading-relaxed">{activity.description}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">Tanggal:</span>
                  <span>{formatDate(activity.date)}</span>
                </div>
                
                {activity.location && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">Lokasi:</span>
                    <span>{activity.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Update Status</h3>
                <div className="flex flex-col gap-2">
                  <Button
                    variant={activity.status === 'planned' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateStatus('planned')}
                    className="justify-start"
                  >
                    Direncanakan
                  </Button>
                  <Button
                    variant={activity.status === 'ongoing' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateStatus('ongoing')}
                    className="justify-start"
                  >
                    Berlangsung
                  </Button>
                  <Button
                    variant={activity.status === 'completed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateStatus('completed')}
                    className="justify-start"
                  >
                    Selesai
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Dibuat: {formatDate(activity.createdAt)}</p>
                  <p>Terakhir diupdate: {formatDate(activity.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" className="flex-1">
              <Edit className="w-4 h-4 mr-2" />
              Edit Kegiatan
            </Button>
            <Button onClick={onClose} className="flex-1">
              Tutup
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}