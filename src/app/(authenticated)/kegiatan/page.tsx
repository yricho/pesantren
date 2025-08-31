'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Plus, Calendar, MapPin, Camera, Eye, Edit, Trash2 } from 'lucide-react'
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
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch activities from API
  const fetchActivities = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/activities')
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data kegiatan')
      }
      
      const data = await response.json()
      // Handle the API response structure which includes pagination
      const activitiesData = data.activities || data
      
      // Convert date strings back to Date objects
      const formattedActivities = activitiesData.map((activity: any) => ({
        ...activity,
        date: new Date(activity.date),
        createdAt: new Date(activity.createdAt),
        updatedAt: new Date(activity.updatedAt)
      }))
      
      setActivities(formattedActivities)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil data')
      console.error('Error fetching activities:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  const filteredActivities = (activities || []).filter(activity => 
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

  // Delete activity function
  const handleDeleteActivity = async (activityId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) {
      return
    }
    
    try {
      setError(null)
      const response = await fetch(`/api/activities?id=${activityId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Gagal menghapus kegiatan')
      }
      
      // Remove activity from local state
      setActivities((activities || []).filter(a => a.id !== activityId))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus kegiatan'
      setError(errorMessage)
      console.error('Error deleting activity:', err)
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
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-center">
                {(activities || []).length}
              </div>
              <p className="text-sm text-gray-600 text-center">
                Total Kegiatan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-center text-yellow-600">
                {(activities || []).filter(a => a.status === 'planned').length}
              </div>
              <p className="text-sm text-gray-600 text-center">
                Direncanakan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-center text-blue-600">
                {(activities || []).filter(a => a.status === 'ongoing').length}
              </div>
              <p className="text-sm text-gray-600 text-center">
                Berlangsung
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-center text-green-600">
                {(activities || []).filter(a => a.status === 'completed').length}
              </div>
              <p className="text-sm text-gray-600 text-center">
                Selesai
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex gap-2">
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
            
            <Button
              variant="outline"
              onClick={fetchActivities}
              disabled={loading || isSubmitting}
            >
              {loading ? 'Memuat...' : 'Refresh'}
            </Button>
          </div>

          <Button onClick={() => setShowForm(true)} disabled={isSubmitting}>
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
            (filteredActivities || []).map((activity) => (
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
                      disabled={isSubmitting}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedActivity(activity)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Detail
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteActivity(activity.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={isSubmitting}
                    >
                      <Trash2 className="w-4 h-4" />
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
            try {
              setIsSubmitting(true)
              setError(null)
              
              const response = await fetch('/api/activities', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  ...data,
                  photos: data.photos || [],
                }),
              })
              
              if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Gagal membuat kegiatan')
              }
              
              const newActivity = await response.json()
              // Convert date strings back to Date objects
              const formattedActivity = {
                ...newActivity,
                date: new Date(newActivity.date),
                createdAt: new Date(newActivity.createdAt),
                updatedAt: new Date(newActivity.updatedAt)
              }
              
              setActivities([formattedActivity, ...(activities || [])])
              setShowForm(false)
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat membuat kegiatan'
              setError(errorMessage)
              console.error('Error creating activity:', err)
              throw err // Let the form handle the error display
            } finally {
              setIsSubmitting(false)
            }
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
            try {
              setIsSubmitting(true)
              setError(null)
              
              const response = await fetch('/api/activities', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  ...data,
                  id: editingActivity.id,
                  photos: data.photos || [],
                }),
              })
              
              if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Gagal memperbarui kegiatan')
              }
              
              const updatedActivity = await response.json()
              // Convert date strings back to Date objects
              const formattedActivity = {
                ...updatedActivity,
                date: new Date(updatedActivity.date),
                createdAt: new Date(updatedActivity.createdAt),
                updatedAt: new Date(updatedActivity.updatedAt)
              }
              
              setActivities((activities || []).map(a => 
                a.id === editingActivity.id ? formattedActivity : a
              ))
              setShowEditForm(false)
              setEditingActivity(null)
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memperbarui kegiatan'
              setError(errorMessage)
              console.error('Error updating activity:', err)
              throw err // Let the form handle the error display
            } finally {
              setIsSubmitting(false)
            }
          }}
        />
      )}

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <ActivityDetail
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
          onUpdate={(updatedActivity) => {
            // Convert date strings back to Date objects
            const formattedActivity = {
              ...updatedActivity,
              date: new Date(updatedActivity.date),
              createdAt: new Date(updatedActivity.createdAt),
              updatedAt: new Date(updatedActivity.updatedAt)
            }
            setActivities((activities || []).map(a => 
              a.id === updatedActivity.id ? formattedActivity : a
            ))
            setSelectedActivity(null)
          }}
          onDelete={handleDeleteActivity}
        />
      )}
      
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            <span>Memproses...</span>
          </div>
        </div>
      )}
    </div>
  )
}