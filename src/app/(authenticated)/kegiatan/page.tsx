'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Plus, Calendar, MapPin, Camera, Eye, Edit } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Activity } from '@/types'
import { ActivityForm } from '@/components/kegiatan/activity-form'
import { ActivityDetail } from '@/components/kegiatan/activity-detail'

export default function Kegiatan() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [filter, setFilter] = useState<'all' | 'planned' | 'ongoing' | 'completed'>('all')
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)

  useEffect(() => {
    // Simulate loading activities
    setTimeout(() => {
      setActivities([
        {
          id: '1',
          title: 'Kajian Rutin Mingguan',
          description: 'Kajian rutin setiap hari Jumat dengan tema Fiqih Muamalah',
          type: 'kajian',
          date: new Date('2024-03-22'),
          location: 'Masjid Pondok',
          photos: ['/photos/kajian1.jpg', '/photos/kajian2.jpg'],
          status: 'planned',
          createdBy: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          title: 'Pelatihan Komputer',
          description: 'Pelatihan komputer dasar untuk santri tingkat menengah',
          type: 'pelatihan',
          date: new Date('2024-03-20'),
          location: 'Lab Komputer',
          photos: ['/photos/pelatihan1.jpg'],
          status: 'completed',
          createdBy: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '3',
          title: 'Bakti Sosial',
          description: 'Kegiatan bakti sosial di desa sekitar pondok',
          type: 'sosial',
          date: new Date('2024-03-18'),
          location: 'Desa Sumberejo',
          photos: ['/photos/baksos1.jpg', '/photos/baksos2.jpg', '/photos/baksos3.jpg'],
          status: 'completed',
          createdBy: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '4',
          title: 'Seminar Kewirausahaan',
          description: 'Seminar motivasi kewirausahaan untuk alumni dan santri senior',
          type: 'seminar',
          date: new Date('2024-03-25'),
          location: 'Aula Pondok',
          photos: [],
          status: 'planned',
          createdBy: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredActivities = activities.filter(activity => 
    filter === 'all' || activity.status === filter
  )

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'kajian': return 'bg-purple-100 text-purple-800'
      case 'pelatihan': return 'bg-blue-100 text-blue-800'
      case 'sosial': return 'bg-green-100 text-green-800'
      case 'seminar': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
      <Header title="Manajemen Kegiatan" />
      
      <main className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-center">
                {activities.length}
              </div>
              <p className="text-sm text-gray-600 text-center">
                Total Kegiatan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-center text-yellow-600">
                {activities.filter(a => a.status === 'planned').length}
              </div>
              <p className="text-sm text-gray-600 text-center">
                Direncanakan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-center text-blue-600">
                {activities.filter(a => a.status === 'ongoing').length}
              </div>
              <p className="text-sm text-gray-600 text-center">
                Berlangsung
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-center text-green-600">
                {activities.filter(a => a.status === 'completed').length}
              </div>
              <p className="text-sm text-gray-600 text-center">
                Selesai
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">Semua Status</option>
            <option value="planned">Direncanakan</option>
            <option value="ongoing">Berlangsung</option>
            <option value="completed">Selesai</option>
          </select>

          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Kegiatan
          </Button>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              Tidak ada kegiatan ditemukan
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <Card key={activity.id} className="overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  {activity.photos.length > 0 ? (
                    <img 
                      src={activity.photos[0]} 
                      alt={activity.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  {activity.photos.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                      +{activity.photos.length - 1} foto
                    </div>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(activity.type)}`}>
                          {activity.type}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                          {getStatusLabel(activity.status)}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{activity.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {activity.description}
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(activity.date)}
                    </div>
                    {activity.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {activity.location}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingActivity(activity)
                        setShowEditForm(true)
                      }}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedActivity(activity)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Detail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Activity Form Modal */}
      {showForm && (
        <ActivityForm
          onClose={() => setShowForm(false)}
          onSubmit={async (data) => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            const newActivity: Activity = {
              id: Math.random().toString(),
              ...data,
              photos: data.photos || [],
              createdBy: 'current-user',
              createdAt: new Date(),
              updatedAt: new Date()
            }
            setActivities([newActivity, ...activities])
            setShowForm(false)
          }}
        />
      )}

      {/* Edit Activity Form Modal */}
      {showEditForm && editingActivity && (
        <ActivityForm
          activity={editingActivity}
          onClose={() => {
            setShowEditForm(false)
            setEditingActivity(null)
          }}
          onSubmit={async (data) => {
            const response = await fetch(`/api/activities/${editingActivity.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            })

            if (!response.ok) {
              const errorData = await response.json()
              throw new Error(errorData.error || 'Gagal memperbarui kegiatan')
            }

            const updatedActivity = await response.json()
            setActivities(activities.map(a => a.id === editingActivity.id ? updatedActivity : a))
            setShowEditForm(false)
            setEditingActivity(null)
          }}
        />
      )}

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <ActivityDetail
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
          onUpdate={(updatedActivity) => {
            setActivities(activities.map(a => 
              a.id === updatedActivity.id ? updatedActivity : a
            ))
            setSelectedActivity(null)
          }}
        />
      )}
    </div>
  )
}