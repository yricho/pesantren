'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Upload } from 'lucide-react'

interface VideoFormProps {
  onClose: () => void
  onSubmit: (data: {
    title: string
    description: string
    url: string
    thumbnail?: string
    duration?: string
    category: string
    teacher: string
    isPublic: boolean
  }) => void
}

export function VideoForm({ onClose, onSubmit }: VideoFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    duration: '',
    category: 'Fiqih',
    teacher: '',
    isPublic: true
  })
  const [thumbnail, setThumbnail] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.url || !formData.teacher) {
      alert('Mohon lengkapi semua field yang wajib')
      return
    }

    onSubmit({
      title: formData.title,
      description: formData.description,
      url: formData.url,
      thumbnail: thumbnail || undefined,
      duration: formData.duration || undefined,
      category: formData.category,
      teacher: formData.teacher,
      isPublic: formData.isPublic
    })
  }

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setThumbnail(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const categories = [
    'Fiqih',
    'Tahfidz',
    'Sejarah',
    'Bahasa Arab',
    'Hadits',
    'Tafsir',
    'Aqidah',
    'Akhlaq',
    'Dakwah',
    'Lainnya'
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl my-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upload Video Kajian</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Judul Video *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Masukkan judul video kajian"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Deskripsi *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                rows={3}
                placeholder="Deskripsi singkat tentang isi video..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Durasi
                </label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="Contoh: 45:30"
                  pattern="[0-9]{1,2}:[0-9]{2}"
                />
                <p className="text-xs text-gray-500 mt-1">Format: MM:SS atau HH:MM:SS</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Pengajar/Ustadz *
              </label>
              <Input
                value={formData.teacher}
                onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                placeholder="Contoh: Ustadz Ahmad Fauzi, S.Pd.I"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                URL Video *
              </label>
              <Input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com/video.mp4"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                URL langsung ke file video atau embed dari platform video
              </p>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Thumbnail Video
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {thumbnail ? (
                  <div className="space-y-4">
                    <img
                      src={thumbnail}
                      alt="Preview thumbnail"
                      className="w-full max-w-xs mx-auto rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setThumbnail('')}
                    >
                      Hapus Thumbnail
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload thumbnail video
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="cursor-pointer text-blue-600 hover:text-blue-800"
                    >
                      Pilih Gambar
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Visibility Setting */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Visibilitas
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="true"
                    checked={formData.isPublic === true}
                    onChange={() => setFormData({ ...formData, isPublic: true })}
                    className="mr-2"
                  />
                  Publik
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="false"
                    checked={formData.isPublic === false}
                    onChange={() => setFormData({ ...formData, isPublic: false })}
                    className="mr-2"
                  />
                  Private
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Video publik dapat diakses oleh semua pengunjung
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Batal
              </Button>
              <Button type="submit" className="flex-1">
                Upload Video
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}