'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Eye, Calendar, User } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Video } from '@/types'

interface VideoPlayerProps {
  video: Video
  onClose: () => void
  onUpdateViews: (videoId: string) => void
}

export function VideoPlayer({ video, onClose, onUpdateViews }: VideoPlayerProps) {
  const hasIncrementedViews = useRef(false)

  useEffect(() => {
    // Increment view count when video is opened
    if (!hasIncrementedViews.current) {
      onUpdateViews(video.id)
      hasIncrementedViews.current = true
    }
  }, [video.id, onUpdateViews])

  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be')
  }

  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = ''
    
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('watch?v=')[1].split('&')[0]
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0]
    }
    
    return `https://www.youtube.com/embed/${videoId}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div className="flex-1">
              <CardTitle className="text-xl">{video.title}</CardTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {video.teacher}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {video.views + 1} views
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(video.uploadDate)}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500">
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="aspect-video bg-black">
              {isYouTubeUrl(video.url) ? (
                <iframe
                  src={getYouTubeEmbedUrl(video.url)}
                  title={video.title}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <video
                  src={video.url}
                  poster={video.thumbnail}
                  controls
                  className="w-full h-full"
                  onError={(e) => {
                    console.error('Video load error:', e)
                    // Fallback to thumbnail or error message
                  }}
                >
                  <source src={video.url} type="video/mp4" />
                  Browser Anda tidak mendukung pemutar video.
                </video>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  {video.category}
                </span>
                {video.duration && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {video.duration}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  video.isPublic 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {video.isPublic ? 'Publik' : 'Private'}
                </span>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Deskripsi</h3>
                <p className="text-gray-700 leading-relaxed">
                  {video.description}
                </p>
              </div>

              <div className="border-t pt-4">
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Upload: {formatDate(video.createdAt)}</p>
                  <p>Terakhir diupdate: {formatDate(video.updatedAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}