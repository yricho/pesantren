'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Plus, Play, Eye, Clock, Filter, Search } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Video } from '@/types'
import { VideoForm } from '@/components/kajian/video-form'
import { VideoPlayer } from '@/components/kajian/video-player'

export default function Kajian() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [filter, setFilter] = useState<'all' | string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Simulate loading videos
    setTimeout(() => {
      setVideos([
        {
          id: '1',
          title: 'Adab Bermuamalah dalam Islam',
          description: 'Kajian mendalam tentang etika dan adab dalam bermuamalah sesuai syariat Islam',
          url: 'https://example.com/video1.mp4',
          thumbnail: '/thumbnails/video1.jpg',
          duration: '45:32',
          category: 'Fiqih',
          teacher: 'Ustadz Muhammad Yusuf, M.A',
          uploadDate: new Date('2024-03-15'),
          views: 245,
          isPublic: true,
          createdBy: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          title: 'Tahfidz Al-Quran: Tips dan Teknik Menghafal',
          description: 'Metode efektif untuk menghafal Al-Quran dengan mudah dan lancar',
          url: 'https://example.com/video2.mp4',
          thumbnail: '/thumbnails/video2.jpg',
          duration: '32:15',
          category: 'Tahfidz',
          teacher: 'Ustadz Hafiz Rahman, S.Pd',
          uploadDate: new Date('2024-03-12'),
          views: 189,
          isPublic: true,
          createdBy: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '3',
          title: 'Sejarah Peradaban Islam',
          description: 'Perjalanan sejarah peradaban Islam dari masa Rasulullah hingga masa modern',
          url: 'https://example.com/video3.mp4',
          thumbnail: '/thumbnails/video3.jpg',
          duration: '58:47',
          category: 'Sejarah',
          teacher: 'Ustadz Dr. Abdullah Mansur',
          uploadDate: new Date('2024-03-10'),
          views: 156,
          isPublic: true,
          createdBy: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '4',
          title: 'Bahasa Arab untuk Pemula',
          description: 'Pembelajaran dasar bahasa Arab untuk memahami Al-Quran dan Hadits',
          url: 'https://example.com/video4.mp4',
          thumbnail: '/thumbnails/video4.jpg',
          duration: '28:12',
          category: 'Bahasa Arab',
          teacher: 'Ustadzah Fatimah, Lc',
          uploadDate: new Date('2024-03-08'),
          views: 203,
          isPublic: true,
          createdBy: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '5',
          title: 'Kajian Hadits: Adab Menuntut Ilmu',
          description: 'Penjelasan hadits-hadits tentang keutamaan dan adab dalam menuntut ilmu',
          url: 'https://example.com/video5.mp4',
          thumbnail: '/thumbnails/video5.jpg',
          duration: '41:23',
          category: 'Hadits',
          teacher: 'Ustadz Ahmad Fauzi, S.Pd.I',
          uploadDate: new Date('2024-03-05'),
          views: 134,
          isPublic: false,
          createdBy: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const categories = Array.from(new Set(videos.map(v => v.category)))

  const filteredVideos = videos.filter(video => {
    const matchesCategory = filter === 'all' || video.category === filter
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.teacher.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const totalViews = videos.reduce((sum, video) => sum + video.views, 0)
  const totalDuration = videos.reduce((sum, video) => {
    const [minutes, seconds] = video.duration?.split(':').map(Number) || [0, 0]
    return sum + minutes + (seconds / 60)
  }, 0)

  const formatDuration = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = Math.round(totalMinutes % 60)
    return `${hours}j ${minutes}m`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Video Kajian" />
      
      <main className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-center">
                {videos.length}
              </div>
              <p className="text-sm text-gray-600 text-center">
                Total Video
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-center text-blue-600">
                {videos.filter(v => v.isPublic).length}
              </div>
              <p className="text-sm text-gray-600 text-center">
                Video Publik
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-center text-green-600">
                {totalViews.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600 text-center">
                Total Views
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-center text-purple-600">
                {formatDuration(totalDuration)}
              </div>
              <p className="text-sm text-gray-600 text-center">
                Total Durasi
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari video..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Upload Video
          </Button>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              {searchTerm ? 'Tidak ada video yang cocok dengan pencarian' : 'Tidak ada video ditemukan'}
            </div>
          ) : (
            filteredVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-video bg-gray-200">
                  {video.thumbnail ? (
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <Button
                      size="icon"
                      className="opacity-0 hover:opacity-100 transition-opacity"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <Play className="w-6 h-6" />
                    </Button>
                  </div>
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                      {video.duration}
                    </div>
                  )}
                  {!video.isPublic && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs">
                      Private
                    </div>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between mb-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {video.category}
                    </span>
                  </div>
                  <CardTitle className="text-base line-clamp-2">{video.title}</CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {video.description}
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{video.teacher}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>{video.views} views</span>
                      </div>
                      <span>{formatDate(video.uploadDate)}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedVideo(video)}
                    className="w-full mt-4"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Putar Video
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Video Form Modal */}
      {showForm && (
        <VideoForm
          onClose={() => setShowForm(false)}
          onSubmit={(data) => {
            const newVideo: Video = {
              id: Math.random().toString(),
              ...data,
              views: 0,
              uploadDate: new Date(),
              createdBy: 'current-user',
              createdAt: new Date(),
              updatedAt: new Date()
            }
            setVideos([newVideo, ...videos])
            setShowForm(false)
          }}
        />
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          onUpdateViews={(videoId) => {
            setVideos(videos.map(v => 
              v.id === videoId ? { ...v, views: v.views + 1 } : v
            ))
          }}
        />
      )}
    </div>
  )
}