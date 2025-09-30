'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Upload, Trash2, Save, Loader2 } from 'lucide-react'

interface ActivityFormProps {
  activity?: {
    id: string
    title: string
    description: string
    type: string
    date: Date
    location?: string
    status: string
    photos?: string[]
  }
  onClose: () => void
  onSubmit: (data: {
    title: string
    description: string
    type: string
    date: Date
    location?: string
    status: string
    photos?: string[]
  }) => Promise<void>
}

export function ActivityForm({ activity, onClose, onSubmit }: ActivityFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: activity?.title || '',
    description: activity?.description || '',
    type: activity?.type || 'kajian',
    date: activity ? new Date(activity.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    location: activity?.location || '',
    status: activity?.status || 'planned'
  })
  const [photos, setPhotos] = useState<string[]>(activity?.photos || [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description) {
      setError('Mohon lengkapi semua field yang wajib')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await onSubmit({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        date: new Date(formData.date),
        location: formData.location || undefined,
        status: formData.status,
        photos
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan data')
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      // Simulate photo upload
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setPhotos(prev => [...prev, e.target!.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  const activityTypes = [
    { value: 'kajian', label: 'Kajian' },
    { value: 'pelatihan', label: 'Pelatihan' },
    { value: 'sosial', label: 'Sosial' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'kompetisi', label: 'Kompetisi' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'lainnya', label: 'Lainnya' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl my-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{activity ? 'Edit Kegiatan' : 'Tambah Kegiatan'}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={loading}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Judul Kegiatan *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Masukkan judul kegiatan"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Jenis Kegiatan
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {activityTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Deskripsi *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                rows={4}
                placeholder="Deskripsi kegiatan..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tanggal
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="planned">Direncanakan</option>
                  <option value="ongoing">Berlangsung</option>
                  <option value="completed">Selesai</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Lokasi
              </label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Lokasi kegiatan"
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Foto Kegiatan
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Klik untuk upload foto atau drag & drop
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer text-blue-600 hover:text-blue-800"
                >
                  Pilih Foto
                </label>
              </div>
              
              {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 w-6 h-6"
                        onClick={() => removePhoto(index)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
                Batal
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {activity ? 'Menyimpan...' : 'Menyimpan...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {activity ? 'Simpan Perubahan' : 'Simpan'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}